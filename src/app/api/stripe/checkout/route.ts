import { NextResponse } from "next/server";
import { createCheckoutSession } from "@/lib/billing";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { planId?: string };
  const session = await createCheckoutSession(body.planId ?? "starter");

  return NextResponse.json(session);
}
