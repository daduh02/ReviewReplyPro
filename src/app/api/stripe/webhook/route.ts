import { NextResponse } from "next/server";

export async function POST() {
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({
      received: true,
      mode: "mock",
      message:
        "Stripe webhook placeholder received the request without requiring local keys.",
    });
  }

  return NextResponse.json({
    received: true,
    mode: "placeholder",
    message:
      "Webhook verification is scaffolded. Add Stripe signature validation before production use.",
  });
}
