import Stripe from "stripe";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import { handleCheckoutCompleted, handleCheckoutFailed } from "./payment.utils";
import { PaymentStatus } from "../../../generated/prisma/enums";
import { Prisma } from "../../../generated/prisma/client";

const createCheckoutSession = async (
  userId: string,
  rentalRequestId: string,
) => {
  const transactionResult = await prisma.$transaction(async (tx) => {
    const rentalRequest = await tx.rentalRequest.findUniqueOrThrow({
      where: { id: rentalRequestId },
      include: {
        property: true,
        tenant: true,
      },
    });

    if (rentalRequest.tenantId !== userId) {
      throw new Error("You are not authorized to pay for this request");
    }

    if (rentalRequest.status !== "APPROVED") {
      throw new Error("Payment can only be made for approved rental requests");
    }

    const user = await tx.user.findUniqueOrThrow({ where: { id: userId } });

    let stripeCustomerId = user.stripeCustomerId;
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: { userId: user.id },
      });
      stripeCustomerId = customer.id;

      await tx.user.update({
        where: { id: userId },
        data: { stripeCustomerId },
      });
    }

    const amountInCents = Math.round(
      Number(rentalRequest.property.price) * 100,
    );
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Rent payment - ${rentalRequest.property.title}`,
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      customer: stripeCustomerId,
      payment_method_types: ["card"],
      success_url: `${config.appUrl}/rentals/${rentalRequestId}?success=true`,
      cancel_url: `${config.appUrl}/rentals/${rentalRequestId}?success=false`,
      metadata: {
        userId: user.id,
        rentalRequestId: rentalRequest.id,
      },
    });

    await tx.payment.create({
      data: {
        rentalRequestId: rentalRequest.id,
        landlordId: rentalRequest.property.landlordId,
        amount: rentalRequest.property.price.toNumber(),
        provider: "STRIPE",
        method: "CARD",
        status: "PENDING",
        transactionId: session.id,
      },
    });

    return session.url;
  });

  return {
    paymentUrl: transactionResult,
  };
};

const handleWebhookInDB = async (payload: Buffer, signature: string) => {
  const endpointSecret = config.stripeWebhookSecret;
  const event = stripe.webhooks.constructEvent(
    payload,
    signature,
    endpointSecret,
  );

  switch (event.type) {
    case "checkout.session.completed":
      // Occurs when a Checkout Session has been successfully completed
      await handleCheckoutCompleted(
        event.data.object as Stripe.Checkout.Session,
      );
      break;

    case "checkout.session.expired":
      // Occurs when a session is abandoned or times out — release the row from PENDING
      await handleCheckoutFailed(event.data.object as Stripe.Checkout.Session);
      break;

    default:
      // Unexpected event type
      console.log(`No events matched. Unhandled event type ${event.type}.`);
      break;
  }
};

const getMyPayments = async (userId: string, status?: PaymentStatus) => {
  const where: Prisma.PaymentWhereInput = {
    rentalRequest: { tenantId: userId },
    ...(status && { status }),
  };

  const payments = await prisma.payment.findMany({
    where,
  });

  return payments;
};

const getMyPaymentsById = async (
  userId: string,
  paymentId: string,
  status?: PaymentStatus
) => {
  const where: Prisma.PaymentWhereInput = {
    id: paymentId,
    rentalRequest: { tenantId: userId },
    ...(status && { status }),
  };

  const payment = await prisma.payment.findFirst({
    where,
    include: {
      rentalRequest: {
        include: {
          property: {
            select: { id: true, title: true, price: true, images: true },
          },
        },
      },
    },
  });

  return payment;
};

export const paymentService = {
  createCheckoutSession,
  handleWebhookInDB,
  getMyPayments,
  getMyPaymentsById
};
