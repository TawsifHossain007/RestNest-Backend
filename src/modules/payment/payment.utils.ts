import config from "../../config";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import Stripe from "stripe";

const handleWebhookInDB = async (payload: Buffer, signature: string) => {
  const endpointSecret = config.stripeWebhookSecret;

  const event = stripe.webhooks.constructEvent(payload, signature, endpointSecret);

  switch (event.type) {
    case "checkout.session.completed":
      // Fired when checkout succeeds (card payments confirm immediately)
      await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
      break;

    case "checkout.session.async_payment_failed":
      // Async payment method failed after session was created
      await handleCheckoutFailed(event.data.object as Stripe.Checkout.Session);
      break;

    case "checkout.session.expired":
      // Customer abandoned checkout / session timed out
      await handleCheckoutFailed(event.data.object as Stripe.Checkout.Session);
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
      break;
  }
};

export const handleCheckoutCompleted = async (session: Stripe.Checkout.Session) => {
  const rentalRequestId = session.metadata?.rentalRequestId;

  if (!rentalRequestId) {
    console.log("Webhook: Missing rentalRequestId in session metadata");
    return;
  }

  // Guard against duplicate webhook deliveries (Stripe retries on timeout)
  const existingPayment = await prisma.payment.findUnique({
    where: { transactionId: session.id },
  });

  if (!existingPayment) {
    console.log(`Webhook: No matching Payment row for session ${session.id}`);
    return;
  }

  if (existingPayment.status === "COMPLETED") {
    console.log(`Webhook: Payment ${session.id} already marked COMPLETED, skipping`);
    return;
  }

  await prisma.$transaction([
    prisma.payment.update({
      where: { transactionId: session.id },
      data: {
        status: "COMPLETED",
        paidAt: new Date(),
      },
    }),
    prisma.rentalRequest.update({
      where: { id: rentalRequestId },
      data: { status: "ACTIVE" },
    }),
  ]);

  console.log(`Webhook: Payment ${session.id} marked COMPLETED, rental ${rentalRequestId} set ACTIVE`);
};

export const handleCheckoutFailed = async (session: Stripe.Checkout.Session) => {
  const existingPayment = await prisma.payment.findUnique({
    where: { transactionId: session.id },
  });

  if (!existingPayment) {
    console.log(`Webhook: No matching Payment row for session ${session.id}`);
    return;
  }

  if (existingPayment.status !== "PENDING") {
    console.log(`Webhook: Payment ${session.id} not PENDING, skipping failure update`);
    return;
  }

  await prisma.payment.update({
    where: { transactionId: session.id },
    data: { status: "FAILED" },
  });

  console.log(`Webhook: Payment ${session.id} marked FAILED`);
  // Note: rentalRequest.status stays APPROVED here, so the tenant can retry payment
};

export const webhookService = {
  handleWebhookInDB,
};