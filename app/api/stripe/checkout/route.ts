import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(req: Request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return jsonError("Stripe is not configured.", 500);
  }
  const priceId = process.env.STRIPE_PRICE_ID;
  if (!priceId) return jsonError("Missing STRIPE_PRICE_ID.", 500);

  const body: unknown = await req.json().catch(() => null);
  if (!body || typeof body !== "object") return jsonError("Invalid JSON body.");

  const userId = (body as Record<string, unknown>).userId;
  if (typeof userId !== "string" || userId.trim().length === 0) {
    return jsonError("userId is required.");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, isPremium: true },
  });
  if (!user) return jsonError("User not found.", 404);
  if (user.isPremium) return jsonError("User is already premium.", 409);

  const origin = req.headers.get("origin") ?? "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: priceId, quantity: 1 }],
    customer_email: user.email,
    success_url: `${origin}/signup/success?userId=${encodeURIComponent(user.id)}&upgraded=1`,
    cancel_url: `${origin}/signup/success?userId=${encodeURIComponent(user.id)}&canceled=1`,
    client_reference_id: user.id,
    metadata: { userId: user.id },
  });

  return NextResponse.json({ url: session.url });
}

