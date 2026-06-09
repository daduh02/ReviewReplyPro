"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireSuperAdmin } from "@/lib/admin-auth";
import { getDb } from "@/lib/db";
import { leadStatuses } from "@/lib/lead-data";

function requiredValue(formData: FormData, key: string) {
  const value = formData.get(key)?.toString().trim();

  if (!value) {
    throw new Error(`${key} is required`);
  }

  return value;
}

function optionalValue(formData: FormData, key: string) {
  return formData.get(key)?.toString().trim() || null;
}

export async function submitLeadAction(formData: FormData) {
  const numberOfLocations = Number(requiredValue(formData, "numberOfLocations"));

  await getDb().lead.create({
    data: {
      name: requiredValue(formData, "name"),
      businessName: requiredValue(formData, "businessName"),
      businessType: requiredValue(formData, "businessType"),
      numberOfLocations: Math.max(1, Number.isFinite(numberOfLocations) ? numberOfLocations : 1),
      email: requiredValue(formData, "email").toLowerCase(),
      mobileNumber: optionalValue(formData, "mobileNumber"),
      currentReviewPlatform: requiredValue(formData, "currentReviewPlatform"),
      averageReviewsPerMonth: requiredValue(formData, "averageReviewsPerMonth"),
      biggestChallenge: requiredValue(formData, "biggestChallenge"),
      status: "new",
    },
  });

  redirect("/pilot/thank-you");
}

export async function updateLeadStatusAction(formData: FormData) {
  await requireSuperAdmin();
  const id = requiredValue(formData, "id");
  const status = requiredValue(formData, "status");
  const allowedStatuses = new Set(leadStatuses.map((item) => item.value));

  if (!allowedStatuses.has(status)) {
    redirect("/admin/leads");
  }

  await getDb().lead.update({
    where: { id },
    data: { status },
  });

  revalidatePath("/admin/leads");
  revalidatePath("/admin");
  redirect("/admin/leads");
}
