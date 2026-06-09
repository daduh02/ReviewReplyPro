import {
  BookOpen,
  CreditCard,
  FileText,
  Inbox,
  Link2,
  MapPin,
  MessageSquareText,
  SlidersHorizontal,
  UserRoundCheck,
  Users,
} from "lucide-react";
import Link from "next/link";
import { ensurePilotCustomerAccounts } from "@/lib/account-admin";
import { requireAdmin } from "@/lib/admin-auth";
import { workspaceScopeForAdmin } from "@/lib/app-data";
import { getDb } from "@/lib/db";

const controlCards = [
  {
    href: "/app/reviews",
    title: "Reviews",
    description: "View, filter, draft, edit, copy, post and archive reviews.",
    icon: Inbox,
  },
  {
    href: "/app/saved-replies",
    title: "Saved replies",
    description: "Review reusable replies saved from pilot workflows.",
    icon: FileText,
  },
  {
    href: "/app/brand-voice",
    title: "Brand voice",
    description: "Manage tone rules per pilot business and location.",
    icon: SlidersHorizontal,
  },
  {
    href: "/app/integrations",
    title: "Connections",
    description: "Check Google Business Profile connection status.",
    icon: Link2,
  },
  {
    href: "/app/billing",
    title: "Billing",
    description: "See Free for Life and pilot billing controls.",
    icon: CreditCard,
  },
  {
    href: "/admin/leads",
    title: "Leads",
    description: "Review pilot interest forms and manage lead status.",
    icon: UserRoundCheck,
    superAdminOnly: true,
  },
  {
    href: "/admin/documentation",
    title: "Documentation",
    description: "Read current product, admin, pilot and technical docs.",
    icon: BookOpen,
    superAdminOnly: true,
  },
];

export default async function AdminOverviewPage() {
  const admin = await requireAdmin();
  await ensurePilotCustomerAccounts();

  const db = getDb();
  const workspaceWhere = workspaceScopeForAdmin(admin);
  const isSuperAdmin = admin.role === "super_admin";
  const [
    businessCount,
    locationCount,
    reviewCount,
    savedReplyCount,
    customerAccounts,
    pilotLocations,
    totalLeads,
    newLeads,
    demoBooked,
    pilotCustomerLeads,
  ] = await Promise.all([
    db.workspace.count({ where: workspaceWhere }),
    db.location.count({ where: { workspace: workspaceWhere } }),
    db.review.count({ where: { location: { workspace: workspaceWhere } } }),
    db.savedReply.count({ where: { workspace: workspaceWhere } }),
    db.workspace.findMany({
      where: {
        ...workspaceWhere,
        accountType: { in: ["pilot", "customer"] },
      },
      include: {
        locations: {
          include: { _count: { select: { reviews: true } } },
          orderBy: { city: "asc" },
        },
        _count: { select: { savedReplies: true } },
      },
      orderBy: [{ accountType: "desc" }, { name: "asc" }],
    }),
    db.location.findMany({
      where: {
        workspace: {
          ...workspaceWhere,
          accountType: "pilot",
          active: true,
        },
      },
      include: { workspace: true },
      orderBy: [{ workspace: { name: "asc" } }, { city: "asc" }],
    }),
    isSuperAdmin ? db.lead.count() : Promise.resolve(0),
    isSuperAdmin ? db.lead.count({ where: { status: "new" } }) : Promise.resolve(0),
    isSuperAdmin
      ? db.lead.count({ where: { status: "demo_booked" } })
      : Promise.resolve(0),
    isSuperAdmin
      ? db.lead.count({ where: { status: "pilot_customer" } })
      : Promise.resolve(0),
  ]);

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-4">
        <Metric label="Businesses" value={businessCount} />
        <Metric label="Locations" value={locationCount} />
        <Metric label="Reviews" value={reviewCount} />
        <Metric label="Saved replies" value={savedReplyCount} />
      </section>

      {isSuperAdmin ? (
        <section className="grid gap-4 md:grid-cols-4">
          <Metric label="Total Leads" value={totalLeads} />
          <Metric label="New Leads" value={newLeads} />
          <Metric label="Demo Booked" value={demoBooked} />
          <Metric label="Pilot Customers" value={pilotCustomerLeads} />
        </section>
      ) : null}

      <section className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold text-slate-950">
              Admin overview
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {isSuperAdmin
                ? "Super Admin can access database-backed pilot, customer, lead, review, reply and billing controls."
                : "Your Google account is authorised for assigned ReviewReply Pro workspaces."}
            </p>
          </div>
          {isSuperAdmin ? (
            <Link
              href="/admin/users"
              className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white"
            >
              <Users className="size-4" />
              Manage admin users
            </Link>
          ) : null}
        </div>
        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          {controlCards
            .filter((card) => !card.superAdminOnly || isSuperAdmin)
            .map((card) => {
              const Icon = card.icon;
              return (
                <Link
                  key={card.href}
                  href={card.href}
                  className="rounded-lg border border-slate-200 p-4 hover:border-blue-200 hover:bg-blue-50/40"
                >
                  <Icon className="size-5 text-blue-700" />
                  <h3 className="mt-3 font-semibold text-slate-950">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {card.description}
                  </p>
                </Link>
              );
            })}
        </div>
      </section>

      <section className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <div className="flex items-center gap-3">
          <MapPin className="size-5 text-blue-700" />
          <h2 className="text-2xl font-semibold text-slate-950">
            Real pilot/customer accounts
          </h2>
        </div>
        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          {customerAccounts.map((account) => {
            const reviewTotal = account.locations.reduce(
              (sum, location) => sum + location._count.reviews,
              0,
            );

            return (
              <article
                key={account.id}
                className="rounded-lg border border-slate-200 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-slate-950">
                      {account.name}
                    </h3>
                    <p className="mt-1 text-sm capitalize text-slate-600">
                      {account.accountType === "customer"
                        ? "Paid Customer"
                        : "Pilot Customer"}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-100">
                      {account.accountType === "customer"
                        ? "Paid Customer"
                        : "Pilot Customer"}
                    </span>
                    {account.plan === "Free for Life" ? (
                      <span className="rounded-full bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white">
                        Free for Life
                      </span>
                    ) : null}
                  </div>
                </div>
                <dl className="mt-4 grid gap-2 text-sm">
                  <Info label="Plan" value={account.plan} />
                  <Info label="Billing" value={account.billingStatus} />
                  <Info label="Locations" value={String(account.locations.length)} />
                  <Info label="Reviews" value={String(reviewTotal)} />
                  <Info
                    label="Saved replies"
                    value={String(account._count.savedReplies)}
                  />
                  <Info label="Resettable" value="No" />
                </dl>
              </article>
            );
          })}
          {!customerAccounts.length ? (
            <p className="rounded-lg border border-dashed border-slate-200 p-4 text-sm text-slate-600">
              No pilot or customer accounts are available for this admin.
            </p>
          ) : null}
        </div>
      </section>

      <section className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <div className="flex items-center gap-3">
          <MapPin className="size-5 text-emerald-600" />
          <h2 className="text-2xl font-semibold text-slate-950">
            Active pilot locations
          </h2>
        </div>
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {pilotLocations.map((location) => (
            <article
              key={location.id}
              className="rounded-lg border border-emerald-200 bg-emerald-50/40 p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-slate-950">
                    {location.businessName}
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">{location.city}</p>
                </div>
                {location.workspace.plan === "Free for Life" ? (
                  <span className="rounded-full bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white">
                    Free for Life
                  </span>
                ) : null}
                <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-100">
                  Pilot Customer
                </span>
              </div>
              <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
                <Info
                  label="Pilot status"
                  value={location.workspace.active ? "active" : "inactive"}
                />
                <Info label="GBP status" value={location.googleBusinessStatus} />
                <Info
                  label="Google rating"
                  value={
                    location.googleRating
                      ? `${location.googleRating} from ${location.googleReviewCount ?? 0} reviews`
                      : "Not set"
                  }
                />
                <Info label="Type" value={location.businessType} />
              </dl>
            </article>
          ))}
          {!pilotLocations.length ? (
            <p className="rounded-lg border border-dashed border-slate-200 p-4 text-sm text-slate-600">
              No active pilot locations are available for this admin.
            </p>
          ) : null}
        </div>
      </section>

      <section className="rounded-lg border border-blue-100 bg-blue-50 p-5">
        <div className="flex items-center gap-3">
          <MessageSquareText className="size-5 text-blue-700" />
          <p className="text-sm leading-6 text-blue-950">
            Public demo content is separate from real pilot/customer content.
            Admin metrics above use database records only.
          </p>
        </div>
      </section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-slate-950">{value}</p>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="font-semibold text-slate-950">{label}</dt>
      <dd className="text-right text-slate-600">{value}</dd>
    </div>
  );
}
