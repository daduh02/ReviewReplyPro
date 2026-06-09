import { ensurePilotCustomerAccounts } from "@/lib/account-admin";
import type { BrandVoiceSettings, ReplyLength, Tone } from "@/lib/types";
import { getDb } from "@/lib/db";

export const reviewStatuses = ["new", "draft_ready", "posted", "archived"] as const;

export const reviewStatusLabels: Record<string, string> = {
  new: "New",
  draft_ready: "Drafted",
  edited: "Edited",
  copied: "Copied",
  posted: "Posted",
  archived: "Archived",
};

export type ReviewWithContext = Awaited<ReturnType<typeof getReviewsForApp>>[number];

export async function getActiveLocations() {
  await ensurePilotCustomerAccounts();
  const db = getDb();

  return db.location.findMany({
    where: { workspace: { active: true } },
    include: {
      workspace: true,
      brandVoiceSetting: true,
    },
    orderBy: [{ workspace: { name: "asc" } }, { city: "asc" }],
  });
}

export async function getReviewsForApp({
  locationId,
  status,
  rating,
  query,
  sort = "newest",
}: {
  locationId?: string;
  status?: string;
  rating?: string;
  query?: string;
  sort?: "newest" | "oldest";
} = {}) {
  await ensurePilotCustomerAccounts();
  const db = getDb();

  return db.review.findMany({
    where: {
      locationId: locationId && locationId !== "all" ? locationId : undefined,
      status: status && status !== "all" ? status : undefined,
      starRating:
        rating && rating !== "all" && Number.isFinite(Number(rating))
          ? Number(rating)
          : undefined,
      OR: query
        ? [
            { customerName: { contains: query } },
            { reviewText: { contains: query } },
            { location: { businessName: { contains: query } } },
            { location: { city: { contains: query } } },
          ]
        : undefined,
    },
    include: {
      generatedReplies: { orderBy: { variant: "asc" } },
      savedReplies: true,
      location: {
        include: {
          workspace: true,
          brandVoiceSetting: true,
        },
      },
    },
    orderBy: { receivedAt: sort === "oldest" ? "asc" : "desc" },
  });
}

export async function getReviewForApp(id: string) {
  await ensurePilotCustomerAccounts();
  const db = getDb();

  return db.review.findUnique({
    where: { id },
    include: {
      generatedReplies: { orderBy: { variant: "asc" } },
      savedReplies: true,
      location: {
        include: {
          workspace: true,
          brandVoiceSetting: true,
        },
      },
    },
  });
}

export async function getDashboardStats() {
  await ensurePilotCustomerAccounts();
  const db = getDb();
  const [reviews, recentReviews, recentGeneratedReplies] = await Promise.all([
    db.review.findMany({
      include: { location: { include: { workspace: true } } },
    }),
    db.review.findMany({
      include: { location: { include: { workspace: true } } },
      orderBy: { receivedAt: "desc" },
      take: 5,
    }),
    db.generatedReply.findMany({
      include: {
        review: {
          include: { location: { include: { workspace: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);
  const totalReviews = reviews.length;
  const ratingTotal = reviews.reduce((sum, review) => sum + review.starRating, 0);

  return {
    totalReviews,
    awaitingResponse: reviews.filter((review) =>
      ["new", "draft_ready", "edited", "copied"].includes(review.status),
    ).length,
    respondedTo: reviews.filter((review) => review.status === "posted").length,
    averageRating: totalReviews ? ratingTotal / totalReviews : 0,
    recentReviews,
    recentGeneratedReplies,
  };
}

export function toBrandVoiceInput(
  location: Awaited<ReturnType<typeof getActiveLocations>>[number],
): BrandVoiceSettings {
  const settings = location.brandVoiceSetting;

  return {
    businessName: location.businessName,
    businessType: location.businessType as BrandVoiceSettings["businessType"],
    location: location.city,
    preferredTone: (settings?.preferredTone ?? "Professional") as Tone,
    defaultLength: (settings?.defaultLength ?? "Standard") as ReplyLength,
    greetingStyle: settings?.greetingStyle ?? "Use a polite greeting",
    signOffStyle:
      settings?.signOffStyle ?? `Thanks, the ${location.businessName} team`,
    wordsToUse: settings?.wordsToUse ?? "",
    wordsToAvoid: settings?.wordsToAvoid ?? "",
    complaintHandlingStyle:
      settings?.complaintHandlingStyle ??
      "Acknowledge feedback, avoid arguing, and invite direct contact.",
    useEmojis: settings?.useEmojis ?? false,
    mentionBusinessName: settings?.mentionBusinessName ?? true,
    apologiseForPoorExperiences: settings?.apologiseForPoorExperiences ?? true,
    inviteUnhappyCustomersToContact:
      settings?.inviteUnhappyCustomersToContact ?? true,
    keepRepliesShortByDefault: settings?.keepRepliesShortByDefault ?? false,
  };
}

export function inferSentiment(starRating: number) {
  if (starRating <= 2) {
    return "Complaint";
  }

  if (starRating === 3) {
    return "Negative";
  }

  return "Positive";
}
