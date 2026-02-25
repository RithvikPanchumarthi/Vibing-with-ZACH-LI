"use server";

import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { redirect } from "next/navigation";

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing ${name}`);
  return v;
}

export async function createCheckoutSession(formData: FormData) {
  const userId = formData.get("userId");
  if (typeof userId !== "string" || userId.trim().length === 0) {
    throw new Error("Missing userId");
  }

  const priceId = requireEnv("STRIPE_PRICE_ID");

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, isPremium: true },
  });
  if (!user) throw new Error("User not found");
  if (user.isPremium) redirect("/dashboard?payment=already_premium");

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.APP_URL ??
    "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: priceId, quantity: 1 }],
    customer_email: user.email,
    client_reference_id: user.id,
    success_url: `${baseUrl}/dashboard?payment=success`,
    cancel_url: `${baseUrl}/dashboard?payment=cancelled`,
  });

  if (!session.url) throw new Error("Stripe session URL missing");
  redirect(session.url);
}

