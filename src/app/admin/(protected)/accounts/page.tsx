import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Building2, MapPin, Plus, ShieldCheck, Trash2 } from "lucide-react";
import {
  accountTypeOptions,
  activeOptions,
  billingIntervalOptions,
  billingStatusOptions,
  canDeleteAccount,
  displayAccountType,
  displayBillingStatus,
  ensurePilotCustomerAccounts,
  ensureSystemOwner,
  planOptions,
} from "@/lib/account-admin";
import { requireSuperAdmin } from "@/lib/admin-auth";
import { getDb } from "@/lib/db";

function value(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

function optionalValue(formData: FormData, key: string) {
  const item = value(formData, key);
  return item.length ? item : null;
}

function normaliseAccountType(input: string) {
  return ["demo", "pilot", "customer"].includes(input) ? input : "pilot";
}

function normalisePlan(input: string) {
  return ["Demo Free", "Pilot", "Free for Life", "Paid"].includes(input)
    ? input
    : "Pilot";
}

function normaliseBillingStatus(input: string) {
  return ["mock_billing", "exempt", "active", "past_due"].includes(input)
    ? input
    : "exempt";
}

function normaliseBillingInterval(input: string) {
  return ["monthly", "free_for_life", "none"].includes(input)
    ? input
    : "monthly";
}

function poundsToPence(input: string) {
  const pounds = Number(input || "0");
  if (!Number.isFinite(pounds) || pounds < 0) {
    return 0;
  }

  return Math.round(pounds * 100);
}

function penceToPounds(pence: number) {
  return (pence / 100).toFixed(2);
}

function optionalNumber(formData: FormData, key: string) {
  const item = value(formData, key);
  if (!item) {
    return null;
  }

  const parsed = Number(item);
  return Number.isFinite(parsed) ? parsed : null;
}

async function addAccount(formData: FormData) {
  "use server";

  await requireSuperAdmin();

  const name = value(formData, "name");
  if (!name) {
    redirect("/admin/accounts");
  }

  const owner = await ensureSystemOwner();
  const accountType = normaliseAccountType(value(formData, "accountType"));
  const plan = normalisePlan(value(formData, "plan"));
  const billingStatus = normaliseBillingStatus(value(formData, "billingStatus"));
  const billingInterval =
    plan === "Free for Life"
      ? "free_for_life"
      : normaliseBillingInterval(value(formData, "billingInterval"));
  const monthlyPricePence =
    billingStatus === "exempt" || billingInterval !== "monthly"
      ? 0
      : poundsToPence(value(formData, "monthlyPrice"));

  await getDb().workspace.create({
    data: {
      name,
      ownerId: owner.id,
      accountType,
      plan,
      billingStatus,
      billingInterval,
      monthlyPricePence,
      active: value(formData, "active") !== "false",
    },
  });

  revalidatePath("/admin/accounts");
  redirect("/admin/accounts");
}

async function updateAccount(formData: FormData) {
  "use server";

  await requireSuperAdmin();

  const id = value(formData, "id");
  const name = value(formData, "name");

  if (!id || !name) {
    redirect("/admin/accounts");
  }

  const accountType = normaliseAccountType(value(formData, "accountType"));
  const plan = normalisePlan(value(formData, "plan"));
  const billingStatus = normaliseBillingStatus(value(formData, "billingStatus"));
  const billingInterval =
    plan === "Free for Life"
      ? "free_for_life"
      : normaliseBillingInterval(value(formData, "billingInterval"));
  const monthlyPricePence =
    billingStatus === "exempt" || billingInterval !== "monthly"
      ? 0
      : poundsToPence(value(formData, "monthlyPrice"));

  await getDb().workspace.update({
    where: { id },
    data: {
      name,
      accountType,
      plan,
      billingStatus,
      billingInterval,
      monthlyPricePence,
      active: value(formData, "active") !== "false",
    },
  });

  revalidatePath("/admin/accounts");
  redirect("/admin/accounts");
}

async function removeAccount(formData: FormData) {
  "use server";

  await requireSuperAdmin();

  const id = value(formData, "id");
  const db = getDb();
  const account = await db.workspace.findUnique({
    where: { id },
    include: {
      locations: true,
      brandVoiceSettings: true,
      integrations: true,
      googleConnection: true,
      subscription: true,
      usageEvents: true,
      savedReplies: true,
    },
  });

  if (!account || !canDeleteAccount(account.accountType)) {
    redirect("/admin/accounts");
  }

  const locationIds = account.locations.map((location) => location.id);
  const reviews = await db.review.findMany({
    where: { locationId: { in: locationIds } },
    select: { id: true },
  });
  const reviewIds = reviews.map((review) => review.id);

  await db.savedReply.deleteMany({ where: { workspaceId: id } });
  await db.generatedReply.deleteMany({ where: { reviewId: { in: reviewIds } } });
  await db.review.deleteMany({ where: { id: { in: reviewIds } } });
  await db.usageEvent.deleteMany({ where: { workspaceId: id } });
  await db.integration.deleteMany({ where: { workspaceId: id } });
  await db.googleBusinessConnection.deleteMany({ where: { workspaceId: id } });
  await db.subscription.deleteMany({ where: { workspaceId: id } });
  await db.brandVoiceSetting.deleteMany({ where: { workspaceId: id } });
  await db.location.deleteMany({ where: { workspaceId: id } });
  await db.workspace.delete({ where: { id } });

  revalidatePath("/admin/accounts");
  redirect("/admin/accounts");
}

async function addLocation(formData: FormData) {
  "use server";

  await requireSuperAdmin();

  const workspaceId = value(formData, "workspaceId");
  const businessName = value(formData, "businessName");
  const city = value(formData, "city");

  if (!workspaceId || !businessName || !city) {
    redirect("/admin/accounts");
  }

  await getDb().location.create({
    data: {
      workspaceId,
      businessName,
      businessType: value(formData, "businessType") || "Local service",
      city,
      address: optionalValue(formData, "address"),
      phone: optionalValue(formData, "phone"),
      website: optionalValue(formData, "website"),
      googleRating: optionalNumber(formData, "googleRating"),
      googleReviewCount: optionalNumber(formData, "googleReviewCount"),
      priceRange: optionalValue(formData, "priceRange"),
      googleBusinessStatus:
        value(formData, "googleBusinessStatus") ||
        "Google Business Profile integration coming soon",
      googlePlaceId: optionalValue(formData, "googlePlaceId"),
      googleAccountId: optionalValue(formData, "googleAccountId"),
      googleLocationId: optionalValue(formData, "googleLocationId"),
      gbpSyncEnabled: value(formData, "gbpSyncEnabled") === "true",
    },
  });

  revalidatePath("/admin/accounts");
  redirect("/admin/accounts");
}

async function updateLocation(formData: FormData) {
  "use server";

  await requireSuperAdmin();

  const id = value(formData, "id");
  const businessName = value(formData, "businessName");
  const city = value(formData, "city");

  if (!id || !businessName || !city) {
    redirect("/admin/accounts");
  }

  await getDb().location.update({
    where: { id },
    data: {
      businessName,
      businessType: value(formData, "businessType") || "Local service",
      city,
      address: optionalValue(formData, "address"),
      phone: optionalValue(formData, "phone"),
      website: optionalValue(formData, "website"),
      googleRating: optionalNumber(formData, "googleRating"),
      googleReviewCount: optionalNumber(formData, "googleReviewCount"),
      priceRange: optionalValue(formData, "priceRange"),
      googleBusinessStatus:
        value(formData, "googleBusinessStatus") ||
        "Google Business Profile integration coming soon",
      googlePlaceId: optionalValue(formData, "googlePlaceId"),
      googleAccountId: optionalValue(formData, "googleAccountId"),
      googleLocationId: optionalValue(formData, "googleLocationId"),
      gbpSyncEnabled: value(formData, "gbpSyncEnabled") === "true",
    },
  });

  revalidatePath("/admin/accounts");
  redirect("/admin/accounts");
}

async function removeLocation(formData: FormData) {
  "use server";

  await requireSuperAdmin();

  const id = value(formData, "id");
  const db = getDb();
  const location = await db.location.findUnique({
    where: { id },
    include: { workspace: true, reviews: true },
  });

  if (!location || !canDeleteAccount(location.workspace.accountType)) {
    redirect("/admin/accounts");
  }

  const reviewIds = location.reviews.map((review) => review.id);

  await db.savedReply.deleteMany({ where: { reviewId: { in: reviewIds } } });
  await db.generatedReply.deleteMany({ where: { reviewId: { in: reviewIds } } });
  await db.review.deleteMany({ where: { id: { in: reviewIds } } });
  await db.brandVoiceSetting.deleteMany({ where: { locationId: id } });
  await db.location.delete({ where: { id } });

  revalidatePath("/admin/accounts");
  redirect("/admin/accounts");
}

export default async function AdminAccountsPage() {
  await requireSuperAdmin();
  await ensurePilotCustomerAccounts();

  const accounts = await getDb().workspace.findMany({
    include: {
      locations: { orderBy: { city: "asc" } },
      _count: {
        select: {
          locations: true,
          savedReplies: true,
          usageEvents: true,
        },
      },
    },
    orderBy: [{ accountType: "desc" }, { name: "asc" }],
  });

  return (
    <div className="space-y-6">
      <section className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <div className="flex items-center gap-3">
          <Building2 className="size-5 text-blue-700" />
          <div>
            <h2 className="text-2xl font-semibold text-slate-950">Accounts</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Add and update Demo, Pilot and Paid Customer accounts. Only Demo
              accounts can be removed.
            </p>
          </div>
        </div>

        <form
          action={addAccount}
          className="mt-6 grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 lg:grid-cols-4"
        >
          <TextInput name="name" label="Account name" required />
          <SelectInput
            name="accountType"
            label="Account type"
            options={accountTypeOptions}
            defaultValue="pilot"
          />
          <SelectInput
            name="plan"
            label="Plan"
            options={planOptions}
            defaultValue="Pilot"
          />
          <SelectInput
            name="billingStatus"
            label="Billing status"
            options={billingStatusOptions}
            defaultValue="exempt"
          />
          <SelectInput
            name="billingInterval"
            label="Billing interval"
            options={billingIntervalOptions}
            defaultValue="monthly"
          />
          <TextInput
            name="monthlyPrice"
            label="Monthly price (£)"
            type="number"
            step="0.01"
            min="0"
            defaultValue="0.00"
          />
          <SelectInput
            name="active"
            label="Status"
            options={activeOptions}
            defaultValue="true"
          />
          <button className="self-end rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
            <span className="inline-flex items-center gap-2">
              <Plus className="size-4" />
              Add account
            </span>
          </button>
        </form>
      </section>

      <section className="space-y-4">
        {accounts.map((account) => {
          const removable = canDeleteAccount(account.accountType);

          return (
            <article
              key={account.id}
              className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-xl font-semibold text-slate-950">
                      {account.name}
                    </h3>
                    <AccountBadge accountType={account.accountType} />
                    {account.plan === "Free for Life" ? <FreeForLifeBadge /> : null}
                    {!removable ? <ProtectedBadge /> : null}
                  </div>
                  <p className="mt-2 text-sm text-slate-600">
                    {account._count.locations} locations ·{" "}
                    {displayBillingStatus(account.billingStatus)} ·{" "}
                    {account.billingInterval === "monthly"
                      ? `£${penceToPounds(account.monthlyPricePence)} / month`
                      : account.billingInterval.replaceAll("_", " ")}
                  </p>
                </div>
                <form action={removeAccount}>
                  <input type="hidden" name="id" value={account.id} />
                  <button
                    disabled={!removable}
                    className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Trash2 className="size-4" />
                    Remove
                  </button>
                </form>
              </div>

              <form
                action={updateAccount}
                className="mt-5 grid gap-3 rounded-lg border border-slate-200 p-4 lg:grid-cols-4"
              >
                <input type="hidden" name="id" value={account.id} />
                <TextInput name="name" label="Account name" defaultValue={account.name} required />
                <SelectInput
                  name="accountType"
                  label="Account type"
                  options={accountTypeOptions}
                  defaultValue={account.accountType}
                />
                <SelectInput
                  name="plan"
                  label="Plan"
                  options={planOptions}
                  defaultValue={account.plan}
                />
                <SelectInput
                  name="billingStatus"
                  label="Billing status"
                  options={billingStatusOptions}
                  defaultValue={account.billingStatus}
                />
                <SelectInput
                  name="billingInterval"
                  label="Billing interval"
                  options={billingIntervalOptions}
                  defaultValue={account.billingInterval}
                />
                <TextInput
                  name="monthlyPrice"
                  label="Monthly price (£)"
                  type="number"
                  step="0.01"
                  min="0"
                  defaultValue={penceToPounds(account.monthlyPricePence)}
                />
                <SelectInput
                  name="active"
                  label="Status"
                  options={activeOptions}
                  defaultValue={String(account.active)}
                />
                <button className="self-end rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-blue-200 hover:text-blue-700">
                  Update account
                </button>
              </form>

              <div className="mt-5 space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin className="size-4 text-blue-700" />
                  <h4 className="font-semibold text-slate-950">Locations</h4>
                </div>
                {account.locations.map((location) => (
                  <form
                    key={location.id}
                    action={updateLocation}
                    className="grid gap-3 rounded-lg border border-slate-200 p-4 lg:grid-cols-4"
                  >
                    <input type="hidden" name="id" value={location.id} />
                    <TextInput
                      name="businessName"
                      label="Business name"
                      defaultValue={location.businessName}
                      required
                    />
                    <TextInput
                      name="businessType"
                      label="Business type"
                      defaultValue={location.businessType}
                      required
                    />
                    <TextInput
                      name="city"
                      label="Location name"
                      defaultValue={location.city}
                      required
                    />
                    <TextInput
                      name="address"
                      label="Address"
                      defaultValue={location.address ?? ""}
                    />
                    <TextInput name="phone" label="Phone" defaultValue={location.phone ?? ""} />
                    <TextInput
                      name="website"
                      label="Website"
                      defaultValue={location.website ?? ""}
                    />
                    <TextInput
                      name="googleRating"
                      label="Google rating"
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      defaultValue={location.googleRating?.toString() ?? ""}
                    />
                    <TextInput
                      name="googleReviewCount"
                      label="Google reviews"
                      type="number"
                      min="0"
                      defaultValue={location.googleReviewCount?.toString() ?? ""}
                    />
                    <TextInput
                      name="priceRange"
                      label="Price range"
                      defaultValue={location.priceRange ?? ""}
                    />
                    <TextInput
                      name="googleBusinessStatus"
                      label="GBP status"
                      defaultValue={location.googleBusinessStatus}
                    />
                    <TextInput
                      name="googlePlaceId"
                      label="Google Place ID"
                      defaultValue={location.googlePlaceId ?? ""}
                    />
                    <TextInput
                      name="googleAccountId"
                      label="Google account ID"
                      defaultValue={location.googleAccountId ?? ""}
                    />
                    <TextInput
                      name="googleLocationId"
                      label="Google location ID"
                      defaultValue={location.googleLocationId ?? ""}
                    />
                    <SelectInput
                      name="gbpSyncEnabled"
                      label="GBP sync enabled"
                      options={[
                        { value: "false", label: "No" },
                        { value: "true", label: "Yes" },
                      ]}
                      defaultValue={location.gbpSyncEnabled ? "true" : "false"}
                    />
                    <div className="flex items-end gap-2 lg:col-span-2">
                      <button className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-blue-200 hover:text-blue-700">
                        Update location
                      </button>
                      <button
                        formAction={removeLocation}
                        disabled={!removable}
                        className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Remove location
                      </button>
                    </div>
                  </form>
                ))}

                <form
                  action={addLocation}
                  className="grid gap-3 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 lg:grid-cols-4"
                >
                  <input type="hidden" name="workspaceId" value={account.id} />
                  <TextInput
                    name="businessName"
                    label="Business name"
                    defaultValue={account.name}
                    required
                  />
                  <TextInput name="businessType" label="Business type" required />
                  <TextInput name="city" label="Location name" required />
                  <TextInput name="address" label="Address" />
                  <TextInput name="phone" label="Phone" />
                  <TextInput name="website" label="Website" />
                  <TextInput
                    name="googleRating"
                    label="Google rating"
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                  />
                  <TextInput
                    name="googleReviewCount"
                    label="Google reviews"
                    type="number"
                    min="0"
                  />
                  <TextInput name="priceRange" label="Price range" />
                  <TextInput
                    name="googleBusinessStatus"
                    label="GBP status"
                    defaultValue="Google Business Profile integration coming soon"
                  />
                  <TextInput name="googlePlaceId" label="Google Place ID" />
                  <TextInput name="googleAccountId" label="Google account ID" />
                  <TextInput name="googleLocationId" label="Google location ID" />
                  <SelectInput
                    name="gbpSyncEnabled"
                    label="GBP sync enabled"
                    options={[
                      { value: "false", label: "No" },
                      { value: "true", label: "Yes" },
                    ]}
                    defaultValue="false"
                  />
                  <button className="self-end rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white lg:col-span-2">
                    Add location
                  </button>
                </form>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}

function TextInput({
  label,
  name,
  defaultValue,
  required,
  type = "text",
  step,
  min,
  max,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
  type?: string;
  step?: string;
  min?: string;
  max?: string;
}) {
  return (
    <label className="text-sm font-semibold text-slate-700">
      {label}
      <input
        name={name}
        type={type}
        step={step}
        min={min}
        max={max}
        required={required}
        defaultValue={defaultValue}
        className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
      />
    </label>
  );
}

function SelectInput({
  label,
  name,
  options,
  defaultValue,
}: {
  label: string;
  name: string;
  options: Array<{ value: string; label: string }>;
  defaultValue?: string;
}) {
  return (
    <label className="text-sm font-semibold text-slate-700">
      {label}
      <select
        name={name}
        defaultValue={defaultValue}
        className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function AccountBadge({ accountType }: { accountType: string }) {
  return (
    <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-100">
      {displayAccountType(accountType)}
    </span>
  );
}

function FreeForLifeBadge() {
  return (
    <span className="rounded-full bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white">
      Free for Life
    </span>
  );
}

function ProtectedBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
      <ShieldCheck className="size-3" />
      Protected
    </span>
  );
}
