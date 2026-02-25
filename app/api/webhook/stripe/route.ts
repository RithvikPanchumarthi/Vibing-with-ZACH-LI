import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET ?? "";

export async function POST(req: Request) {
  if (!process.env.STRIPE_SECRET_KEY || !webhookSecret) {
    return new NextResponse("Stripe webhook not configured", { status: 500 });
  }

  const body = await req.text();
  const signature = (await headers()).get("stripe-signature");

  if (!signature) {
    return new NextResponse("Missing stripe-signature header", { status: 400 });
  }

  const stripe = getStripe();
  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Invalid signature";
    return new NextResponse(`Webhook Error: ${message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as { client_reference_id?: string | null };
    const userId = session.client_reference_id ?? null;

    if (!userId) {
      return new NextResponse("User ID missing in session", { status: 400 });
    }

    await prisma.user.update({
      where: { id: userId },
      data: { isPremium: true },
    });
  }

  return new NextResponse("Success", { status: 200 });
}

