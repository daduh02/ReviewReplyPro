import type { Plan } from "@/lib/types";

export const plans: Plan[] = [
  {
    id: "free",
    name: "Free",
    price: "£0/month",
    description: "Manual review replies and limited usage.",
    monthlyReplies: 10,
    features: [
      "Manual add-review fallback",
      "Limited AI draft replies",
      "Copy replies to clipboard",
    ],
  },
  {
    id: "starter",
    name: "Starter",
    price: "£9/month",
    description: "Review inbox, saved replies, brand voice, and more replies.",
    monthlyReplies: 100,
    features: [
      "Review Inbox workflow",
      "Saved replies history",
      "Brand voice settings",
      "More monthly replies",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "£29/month",
    description:
      "Google Business Profile sync, auto-drafted replies, and higher usage.",
    monthlyReplies: 500,
    features: [
      "Google Business Profile integration coming soon",
      "Auto-drafted replies for imported reviews",
      "Higher monthly usage",
      "Multi-location-ready foundation",
    ],
  },
];

export async function createCheckoutSession(planId: string) {
  const plan = plans.find((item) => item.id === planId) ?? plans[1];

  if (!process.env.STRIPE_SECRET_KEY) {
    return {
      mode: "mock",
      url: `/app/billing?checkout=mock&plan=${plan.id}`,
      message:
        "Stripe is not configured locally, so this checkout session is mocked.",
    };
  }

  return {
    mode: "placeholder",
    url: `/app/billing?checkout=scaffolded&plan=${plan.id}`,
    message:
      "Stripe checkout is scaffolded. Add price IDs and the Stripe SDK call for production.",
  };
}
