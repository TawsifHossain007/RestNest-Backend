import config from "../../config";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";

const createCheckoutSession = async (userId: string, rentalRequestId: string) => {
  const transactionResult = await prisma.$transaction(async (tx) => {

    // 1. Fetch the rental request and validate ownership + status
    const rentalRequest = await tx.rentalRequest.findUniqueOrThrow({
      where: { id: rentalRequestId },
      include: {
        property: true,
        tenant: true,
      },
      
    });

    if (rentalRequest.tenantId !== userId) {
      throw new   Error("You are not authorized to pay for this request");
    }

    if (rentalRequest.status !== "APPROVED") {
      throw new   Error("Payment can only be made for approved rental requests");
    }

    // 2. Get or create Stripe customer (same pattern as your reference)
    const user = await tx.user.findUniqueOrThrow({ where: { id: userId } });

    let stripeCustomerId = user.stripeCustomerId; // adjust field name to your schema
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

    // 3. Build a dynamic line item from the property's rent amount
const amountInCents = Math.round(Number(rentalRequest.property.price) * 100);
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
      mode: "payment", // one-time, not subscription
      customer: stripeCustomerId,
      payment_method_types: ["card"],
      success_url: `${config.appUrl}/rentals/${rentalRequestId}?success=true`,
      cancel_url: `${config.appUrl}/rentals/${rentalRequestId}?success=false`,
      metadata: {
        userId: user.id,
        rentalRequestId: rentalRequest.id,
      },
    });

    // 4. Create a pending Payment record tied to this session
    await tx.payment.create({
      data: {
        rentalRequestId: rentalRequest.id,
        landlordId : rentalRequest.property.landlordId,
        amount: rentalRequest.property.price.toNumber(),
        provider: "STRIPE",
        method : "CARD",
        status: "PENDING",
        transactionId: session.id, // Stripe session id, updated to payment_intent later if you prefer
      },
    });

    return session.url;
  });

  return {
    paymentUrl: transactionResult,
  };
};

export const paymentService = {
  createCheckoutSession,
};