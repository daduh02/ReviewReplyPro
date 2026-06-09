"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";
import {
  ensureLocationAccess,
  ensureReviewAccess,
  getReviewForApp,
  inferSentiment,
  toBrandVoiceInput,
} from "@/lib/app-data";
import { getDb } from "@/lib/db";
import { getAIReplyProvider } from "@/lib/providers/ai";
import type { ReplyLength, Tone } from "@/lib/types";

function requiredString(formData: FormData, key: string) {
  const value = formData.get(key)?.toString().trim();

  if (!value) {
    throw new Error(`${key} is required`);
  }

  return value;
}

function optionalString(formData: FormData, key: string) {
  return formData.get(key)?.toString().trim() || undefined;
}

async function logActivity({
  adminId,
  workspaceId,
  locationId,
  reviewId,
  eventType,
  summary,
  metadata,
}: {
  adminId?: string;
  workspaceId: string;
  locationId?: string;
  reviewId?: string;
  eventType: string;
  summary: string;
  metadata?: Record<string, string | number | boolean | null>;
}) {
  await getDb().activityEvent.create({
    data: {
      workspaceId,
      locationId,
      reviewId,
      adminUserId: adminId,
      eventType,
      summary,
      metadata,
    },
  });
}

export async function addReviewAction(formData: FormData) {
  const admin = await requireAdmin();
  const db = getDb();
  const locationId = requiredString(formData, "locationId");
  const starRating = Number(requiredString(formData, "starRating"));
  const location = await ensureLocationAccess(locationId, admin);

  if (!location || !location.workspace.active) {
    throw new Error("Location is not available");
  }

  const review = await db.review.create({
    data: {
      locationId,
      customerName: requiredString(formData, "customerName"),
      starRating: Math.min(5, Math.max(1, starRating)),
      reviewText: requiredString(formData, "reviewText"),
      source: optionalString(formData, "source") ?? "Manual",
      status: "new",
      sentiment: inferSentiment(starRating),
      receivedAt: new Date(),
    },
  });
  await logActivity({
    adminId: admin.id,
    workspaceId: location.workspaceId,
    locationId,
    reviewId: review.id,
    eventType: "review.created",
    summary: `Review added manually by ${admin.email}`,
    metadata: { starRating: review.starRating, source: review.source },
  });

  revalidatePath("/app");
  redirect(`/app/reviews/${review.id}`);
}

export async function generateRepliesAction(formData: FormData) {
  const admin = await requireAdmin();
  const db = getDb();
  const reviewId = requiredString(formData, "reviewId");
  await ensureReviewAccess(reviewId, admin);
  const review = await getReviewForApp(reviewId, admin);

  if (!review) {
    throw new Error("Review not found");
  }

  const brandVoiceSettings = toBrandVoiceInput(review.location);
  const tone = (optionalString(formData, "tone") ??
    brandVoiceSettings.preferredTone) as Tone;
  const replyLength = (optionalString(formData, "replyLength") ??
    brandVoiceSettings.defaultLength) as ReplyLength;
  const provider = getAIReplyProvider();
  const replies = await provider.generateReplies({
    reviewText: review.reviewText,
    starRating: review.starRating,
    customerName: review.customerName ?? undefined,
    businessName: review.location.businessName,
    businessType: review.location.businessType,
    location: review.location.city,
    tone,
    replyLength,
    brandVoiceSettings,
  });

  await db.generatedReply.deleteMany({ where: { reviewId } });

  const created = await Promise.all(
    replies.slice(0, 3).map((body, index) =>
      db.generatedReply.create({
        data: {
          reviewId,
          variant: index + 1,
          tone,
          length: replyLength,
          body,
          selected: index === 0,
        },
      }),
    ),
  );

  await db.review.update({
    where: { id: reviewId },
    data: {
      status: "draft_ready",
      selectedReplyId: created[0]?.id,
      editedReply: created[0]?.body,
      lastEditedAt: new Date(),
      actionedByEmail: admin.email,
    },
  });
  await logActivity({
    adminId: admin.id,
    workspaceId: review.location.workspaceId,
    locationId: review.locationId,
    reviewId,
    eventType: "reply.generated",
    summary: `Generated ${created.length} reply options`,
    metadata: { tone, replyLength },
  });

  revalidatePath("/app");
  revalidatePath(`/app/reviews/${reviewId}`);
}

export async function selectReplyAction(formData: FormData) {
  const admin = await requireAdmin();
  const db = getDb();
  const reviewId = requiredString(formData, "reviewId");
  const replyId = requiredString(formData, "replyId");
  const review = await ensureReviewAccess(reviewId, admin);
  const reply = await db.generatedReply.findFirst({
    where: { id: replyId, reviewId },
  });

  if (!reply) {
    throw new Error("Reply option not found");
  }

  await db.generatedReply.updateMany({
    where: { reviewId },
    data: { selected: false },
  });
  await db.generatedReply.update({ where: { id: replyId }, data: { selected: true } });
  await db.review.update({
    where: { id: reviewId },
    data: {
      status: "draft_ready",
      selectedReplyId: replyId,
      editedReply: reply.body,
      lastEditedAt: new Date(),
      actionedByEmail: admin.email,
    },
  });
  await logActivity({
    adminId: admin.id,
    workspaceId: review.location.workspaceId,
    locationId: review.locationId,
    reviewId,
    eventType: "reply.selected",
    summary: `Selected reply option ${reply.variant}`,
    metadata: { variant: reply.variant },
  });

  revalidatePath("/app");
  revalidatePath(`/app/reviews/${reviewId}`);
}

export async function editReplyAction(formData: FormData) {
  const admin = await requireAdmin();
  const reviewId = requiredString(formData, "reviewId");
  const editedReply = requiredString(formData, "editedReply");
  const review = await ensureReviewAccess(reviewId, admin);

  await getDb().review.update({
    where: { id: reviewId },
    data: {
      editedReply,
      status: "edited",
      lastEditedAt: new Date(),
      actionedByEmail: admin.email,
    },
  });
  await logActivity({
    adminId: admin.id,
    workspaceId: review.location.workspaceId,
    locationId: review.locationId,
    reviewId,
    eventType: "reply.edited",
    summary: "Edited selected reply",
    metadata: { characterCount: editedReply.length },
  });

  revalidatePath("/app");
  revalidatePath(`/app/reviews/${reviewId}`);
}

export async function markCopiedAction(formData: FormData) {
  const admin = await requireAdmin();
  const reviewId = requiredString(formData, "reviewId");
  const review = await ensureReviewAccess(reviewId, admin);

  await getDb().review.update({
    where: { id: reviewId },
    data: {
      status: "copied",
      copiedAt: new Date(),
      actionedByEmail: admin.email,
    },
  });
  await logActivity({
    adminId: admin.id,
    workspaceId: review.location.workspaceId,
    locationId: review.locationId,
    reviewId,
    eventType: "reply.copied",
    summary: "Copied reply for posting in Google",
  });

  revalidatePath("/app");
  revalidatePath(`/app/reviews/${reviewId}`);
}

export async function markPostedAction(formData: FormData) {
  const admin = await requireAdmin();
  const reviewId = requiredString(formData, "reviewId");
  const review = await ensureReviewAccess(reviewId, admin);

  await getDb().review.update({
    where: { id: reviewId },
    data: {
      status: "posted",
      postedAt: new Date(),
      actionedByEmail: admin.email,
    },
  });
  await logActivity({
    adminId: admin.id,
    workspaceId: review.location.workspaceId,
    locationId: review.locationId,
    reviewId,
    eventType: "reply.posted",
    summary: "Marked reply as posted",
  });

  revalidatePath("/app");
  revalidatePath(`/app/reviews/${reviewId}`);
}

export async function archiveReviewAction(formData: FormData) {
  const admin = await requireAdmin();
  const reviewId = requiredString(formData, "reviewId");
  const review = await ensureReviewAccess(reviewId, admin);

  await getDb().review.update({
    where: { id: reviewId },
    data: {
      status: "archived",
      archivedAt: new Date(),
      actionedByEmail: admin.email,
    },
  });
  await logActivity({
    adminId: admin.id,
    workspaceId: review.location.workspaceId,
    locationId: review.locationId,
    reviewId,
    eventType: "review.archived",
    summary: "Archived review",
  });

  revalidatePath("/app");
  revalidatePath(`/app/reviews/${reviewId}`);
}

export async function saveReplyAction(formData: FormData) {
  const admin = await requireAdmin();
  const db = getDb();
  const reviewId = requiredString(formData, "reviewId");
  const body = requiredString(formData, "body");
  await ensureReviewAccess(reviewId, admin);
  const review = await db.review.findUnique({
    where: { id: reviewId },
    include: { location: true },
  });

  if (!review) {
    throw new Error("Review not found");
  }

  await db.savedReply.create({
    data: {
      workspaceId: review.location.workspaceId,
      reviewId,
      body,
      tone: optionalString(formData, "tone") ?? "Professional",
      category: review.sentiment,
      usageCount: 1,
    },
  });

  await db.review.update({
    where: { id: reviewId },
    data: {
      editedReply: body,
      status: "edited",
      lastEditedAt: new Date(),
      actionedByEmail: admin.email,
    },
  });
  await logActivity({
    adminId: admin.id,
    workspaceId: review.location.workspaceId,
    locationId: review.locationId,
    reviewId,
    eventType: "reply.saved",
    summary: "Saved reply to library",
    metadata: { characterCount: body.length },
  });

  revalidatePath("/app");
  revalidatePath("/app/saved-replies");
  revalidatePath(`/app/reviews/${reviewId}`);
}

export async function updateBrandVoiceAction(formData: FormData) {
  const admin = await requireAdmin();
  const db = getDb();
  const locationId = requiredString(formData, "locationId");
  const location = await ensureLocationAccess(locationId, admin);

  if (!location) {
    throw new Error("Location not found");
  }

  await db.brandVoiceSetting.upsert({
    where: { locationId },
    update: {
      preferredTone: requiredString(formData, "preferredTone"),
      defaultLength: requiredString(formData, "defaultLength"),
      greetingStyle: optionalString(formData, "greetingStyle"),
      signOffStyle: optionalString(formData, "signOffStyle"),
      wordsToUse: optionalString(formData, "wordsToUse"),
      wordsToAvoid: optionalString(formData, "wordsToAvoid"),
      complaintHandlingStyle: optionalString(formData, "complaintHandlingStyle"),
      useEmojis: formData.get("useEmojis") === "on",
      mentionBusinessName: formData.get("mentionBusinessName") === "on",
      apologiseForPoorExperiences:
        formData.get("apologiseForPoorExperiences") === "on",
      inviteUnhappyCustomersToContact:
        formData.get("inviteUnhappyCustomersToContact") === "on",
      keepRepliesShortByDefault:
        formData.get("keepRepliesShortByDefault") === "on",
    },
    create: {
      workspaceId: location.workspaceId,
      locationId,
      preferredTone: requiredString(formData, "preferredTone"),
      defaultLength: requiredString(formData, "defaultLength"),
      greetingStyle: optionalString(formData, "greetingStyle"),
      signOffStyle: optionalString(formData, "signOffStyle"),
      wordsToUse: optionalString(formData, "wordsToUse"),
      wordsToAvoid: optionalString(formData, "wordsToAvoid"),
      complaintHandlingStyle: optionalString(formData, "complaintHandlingStyle"),
      useEmojis: formData.get("useEmojis") === "on",
      mentionBusinessName: formData.get("mentionBusinessName") === "on",
      apologiseForPoorExperiences:
        formData.get("apologiseForPoorExperiences") === "on",
      inviteUnhappyCustomersToContact:
        formData.get("inviteUnhappyCustomersToContact") === "on",
      keepRepliesShortByDefault:
        formData.get("keepRepliesShortByDefault") === "on",
    },
  });
  await logActivity({
    adminId: admin.id,
    workspaceId: location.workspaceId,
    locationId,
    eventType: "brand_voice.updated",
    summary: "Updated brand voice settings",
  });

  revalidatePath("/app/brand-voice");
}
