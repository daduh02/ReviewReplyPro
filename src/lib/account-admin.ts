import { customerAccounts } from "@/lib/customer-data";
import { getDb } from "@/lib/db";

export const accountTypeOptions = [
  { value: "demo", label: "Demo" },
  { value: "pilot", label: "Pilot" },
  { value: "customer", label: "Paid Customer" },
];

export const planOptions = [
  { value: "Demo Free", label: "Demo Free" },
  { value: "Pilot", label: "Pilot" },
  { value: "Free for Life", label: "Free for Life" },
  { value: "Paid", label: "Paid" },
];

export const billingStatusOptions = [
  { value: "mock_billing", label: "Mock billing" },
  { value: "exempt", label: "Exempt" },
  { value: "active", label: "Active" },
  { value: "past_due", label: "Past due" },
];

export const billingIntervalOptions = [
  { value: "monthly", label: "Monthly" },
  { value: "free_for_life", label: "Free for Life" },
  { value: "none", label: "No billing" },
];

export const activeOptions = [
  { value: "true", label: "Active" },
  { value: "false", label: "Inactive" },
];

export function canDeleteAccount(accountType: string) {
  return accountType === "demo";
}

export function displayAccountType(accountType: string) {
  if (accountType === "customer") {
    return "Paid Customer";
  }

  if (accountType === "pilot") {
    return "Pilot Customer";
  }

  return "Demo";
}

export function displayBillingStatus(status: string) {
  return status.replace("_", " ");
}

export async function ensureSystemOwner() {
  const db = getDb();

  return db.user.upsert({
    where: { email: "system@reviewreply.pro" },
    update: { name: "ReviewReply Pro" },
    create: {
      email: "system@reviewreply.pro",
      name: "ReviewReply Pro",
    },
  });
}

export async function ensurePilotCustomerAccounts() {
  const db = getDb();
  const owner = await ensureSystemOwner();

  for (const account of customerAccounts) {
    const workspace = await db.workspace.upsert({
      where: { id: account.id },
      update: {
        name: account.name,
        accountType: account.accountType,
        plan: account.plan,
        billingStatus: account.billingStatus,
        billingInterval: account.plan === "Free for Life" ? "free_for_life" : "monthly",
        monthlyPricePence: 0,
        active: account.active,
      },
      create: {
        id: account.id,
        name: account.name,
        ownerId: owner.id,
        accountType: account.accountType,
        plan: account.plan,
        billingStatus: account.billingStatus,
        billingInterval: account.plan === "Free for Life" ? "free_for_life" : "monthly",
        monthlyPricePence: 0,
        active: account.active,
      },
    });

    for (const location of account.locations) {
      await db.location.upsert({
        where: { id: location.id },
        update: {
          workspaceId: workspace.id,
          businessName: location.businessName,
          businessType: location.businessType,
          address: location.address,
          city: location.location,
          phone: location.phone,
          website: location.website,
          googleRating: location.googleRating,
          googleReviewCount: location.googleReviewCount,
          priceRange: location.priceRange,
          googleBusinessStatus: location.status,
        },
        create: {
          id: location.id,
          workspaceId: workspace.id,
          businessName: location.businessName,
          businessType: location.businessType,
          address: location.address,
          city: location.location,
          phone: location.phone,
          website: location.website,
          googleRating: location.googleRating,
          googleReviewCount: location.googleReviewCount,
          priceRange: location.priceRange,
          googleBusinessStatus: location.status,
        },
      });

      await db.brandVoiceSetting.upsert({
        where: { locationId: location.id },
        update: {
          workspaceId: workspace.id,
          preferredTone: location.brandVoice.preferredTone,
          defaultLength: location.brandVoice.defaultLength,
          greetingStyle: location.brandVoice.greetingStyle,
          signOffStyle: location.brandVoice.signOffStyle,
          wordsToUse: location.brandVoice.wordsToUse,
          wordsToAvoid: location.brandVoice.wordsToAvoid,
          complaintHandlingStyle: location.brandVoice.complaintHandlingStyle,
          useEmojis: location.brandVoice.useEmojis,
          mentionBusinessName: location.brandVoice.mentionBusinessName,
          apologiseForPoorExperiences:
            location.brandVoice.apologiseForPoorExperiences,
          inviteUnhappyCustomersToContact:
            location.brandVoice.inviteUnhappyCustomersToContact,
          keepRepliesShortByDefault:
            location.brandVoice.keepRepliesShortByDefault,
        },
        create: {
          workspaceId: workspace.id,
          locationId: location.id,
          preferredTone: location.brandVoice.preferredTone,
          defaultLength: location.brandVoice.defaultLength,
          greetingStyle: location.brandVoice.greetingStyle,
          signOffStyle: location.brandVoice.signOffStyle,
          wordsToUse: location.brandVoice.wordsToUse,
          wordsToAvoid: location.brandVoice.wordsToAvoid,
          complaintHandlingStyle: location.brandVoice.complaintHandlingStyle,
          useEmojis: location.brandVoice.useEmojis,
          mentionBusinessName: location.brandVoice.mentionBusinessName,
          apologiseForPoorExperiences:
            location.brandVoice.apologiseForPoorExperiences,
          inviteUnhappyCustomersToContact:
            location.brandVoice.inviteUnhappyCustomersToContact,
          keepRepliesShortByDefault:
            location.brandVoice.keepRepliesShortByDefault,
        },
      });
    }

    for (const review of account.reviews) {
      const location = account.locations.find(
        (item) =>
          item.businessName === review.businessName &&
          item.location === review.location,
      );

      if (!location) {
        continue;
      }

      await db.review.upsert({
        where: { id: review.id },
        update: {
          locationId: location.id,
          customerName: review.customerName,
          starRating: review.rating,
          reviewText: review.reviewText,
          source: review.source,
          status: review.status,
          sentiment: review.sentiment,
          receivedAt: new Date(review.dateReceived),
        },
        create: {
          id: review.id,
          locationId: location.id,
          customerName: review.customerName,
          starRating: review.rating,
          reviewText: review.reviewText,
          source: review.source,
          status: review.status,
          sentiment: review.sentiment,
          receivedAt: new Date(review.dateReceived),
        },
      });

      for (const [index, reply] of review.draftReplies.entries()) {
        const id = `${review.id}_reply_${index + 1}`;
        await db.generatedReply.upsert({
          where: { id },
          update: {
            reviewId: review.id,
            variant: index + 1,
            tone: review.sentiment === "Complaint" ? "Empathetic" : "Friendly",
            length: "Standard",
            body: reply,
            selected: index === 0,
          },
          create: {
            id,
            reviewId: review.id,
            variant: index + 1,
            tone: review.sentiment === "Complaint" ? "Empathetic" : "Friendly",
            length: "Standard",
            body: reply,
            selected: index === 0,
          },
        });
      }

      if (review.draftReplies[0]) {
        await db.review.update({
          where: { id: review.id },
          data: {
            selectedReplyId: `${review.id}_reply_1`,
            editedReply: review.draftReplies[0],
          },
        });
      }
    }
  }
}
