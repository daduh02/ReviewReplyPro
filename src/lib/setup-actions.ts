"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";
import { ensureSystemOwner } from "@/lib/account-admin";
import { getDb } from "@/lib/db";

function value(formData: FormData, key: string) {
  return formData.get(key)?.toString().trim() ?? "";
}

function optionalValue(formData: FormData, key: string) {
  const next = value(formData, key);
  return next.length ? next : null;
}

export async function completeBusinessSetupAction(formData: FormData) {
  const admin = await requireAdmin();
  const owner = await ensureSystemOwner();
  const db = getDb();
  const businessName = value(formData, "businessName");
  const businessType = value(formData, "businessType");
  const locationName = value(formData, "locationName");

  if (!businessName || !businessType || !locationName) {
    redirect("/app/setup");
  }

  const workspace = await db.workspace.create({
    data: {
      name: businessName,
      ownerId: owner.id,
      accountType: "pilot",
      plan: "Pilot",
      billingStatus: "exempt",
      billingInterval: "monthly",
      monthlyPricePence: 0,
      active: true,
      setupCompletedAt: new Date(),
      replyNotificationEmail: optionalValue(formData, "replyNotificationEmail"),
    },
  });

  if (admin.role === "business_admin") {
    await db.adminWorkspaceAccess.create({
      data: {
        adminUserId: admin.id,
        workspaceId: workspace.id,
      },
    });
  }

  const location = await db.location.create({
    data: {
      workspaceId: workspace.id,
      businessName,
      businessType,
      city: locationName,
      address: optionalValue(formData, "address"),
      phone: optionalValue(formData, "phone"),
      website: optionalValue(formData, "website"),
      googleBusinessStatus: "Google Business Profile integration coming soon",
      googlePlaceId: optionalValue(formData, "googlePlaceId"),
      googleAccountId: optionalValue(formData, "googleAccountId"),
      googleLocationId: optionalValue(formData, "googleLocationId"),
      gbpSyncEnabled: false,
    },
  });

  await db.brandVoiceSetting.create({
    data: {
      workspaceId: workspace.id,
      locationId: location.id,
      preferredTone: value(formData, "preferredTone") || "Professional",
      defaultLength: value(formData, "defaultLength") || "Standard",
      greetingStyle: optionalValue(formData, "greetingStyle"),
      signOffStyle:
        optionalValue(formData, "signOffStyle") ??
        `Thanks, the ${businessName} team`,
      wordsToUse: optionalValue(formData, "wordsToUse"),
      wordsToAvoid: optionalValue(formData, "wordsToAvoid"),
      complaintHandlingStyle:
        optionalValue(formData, "complaintHandlingStyle") ??
        "Acknowledge feedback, avoid arguing, and invite direct contact.",
      useEmojis: formData.get("useEmojis") === "on",
      mentionBusinessName: true,
      apologiseForPoorExperiences: true,
      inviteUnhappyCustomersToContact: true,
      keepRepliesShortByDefault: formData.get("keepRepliesShortByDefault") === "on",
    },
  });

  await db.activityEvent.create({
    data: {
      workspaceId: workspace.id,
      locationId: location.id,
      adminUserId: admin.id,
      eventType: "business.setup_completed",
      summary: `Business setup completed by ${admin.email}`,
      metadata: {
        businessType,
        hasGooglePlaceId: Boolean(value(formData, "googlePlaceId")),
      },
    },
  });

  revalidatePath("/app");
  revalidatePath("/app/reviews");
  revalidatePath("/admin/accounts");
  redirect("/app");
}
