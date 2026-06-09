import {
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
import { demoLocations, demoReviews, savedReplies } from "@/lib/demo-data";
import {
  customerAccounts,
  customerLocations,
  customerReviews,
  customerSavedReplies,
} from "@/lib/customer-data";
import { requireAdmin } from "@/lib/admin-auth";
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
];

export default async function AdminOverviewPage() {
  const admin = await requireAdmin();
  const [totalLeads, newLeads, demoBooked, pilotCustomerLeads] =
    admin.role === "super_admin"
      ? await Promise.all([
          getDb().lead.count(),
          getDb().lead.count({ where: { status: "new" } }),
          getDb().lead.count({ where: { status: "demo_booked" } }),
          getDb().lead.count({ where: { status: "pilot_customer" } }),
        ])
      : [0, 0, 0, 0];
  const reportingLocations = [...demoLocations, ...customerLocations];
  const reportingReviews = [...demoReviews, ...customerReviews];
  const reportingSavedReplies = [...savedReplies, ...customerSavedReplies];
  const pilotLocations = customerLocations.filter(
    (location) => location.accountType === "pilot" && location.active,
  );

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm font-medium text-slate-500">Businesses</p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">
            {
              new Set(
                reportingLocations.map((location) => location.businessName),
              ).size
            }
          </p>
        </div>
        <div className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm font-medium text-slate-500">Locations</p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">
            {reportingLocations.length}
          </p>
        </div>
        <div className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm font-medium text-slate-500">Reviews</p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">
            {reportingReviews.length}
          </p>
        </div>
        <div className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm font-medium text-slate-500">Saved replies</p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">
            {reportingSavedReplies.length}
          </p>
        </div>
      </section>

      {admin.role === "super_admin" ? (
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
              {admin.role === "super_admin"
                ? "Super Admin can access every pilot business, location, review, reply, saved reply, brand voice setting and billing control."
                : "Your Google account is authorised for ReviewReply Pro admin access."}
            </p>
          </div>
          {admin.role === "super_admin" ? (
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
            .filter((card) => !card.superAdminOnly || admin.role === "super_admin")
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
            Customer accounts
          </h2>
        </div>
        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          {customerAccounts.map((account) => (
            <article
              key={account.id}
              className="rounded-lg border border-slate-200 p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-slate-950">{account.name}</h3>
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
                <div className="flex justify-between gap-3">
                  <dt className="font-semibold text-slate-950">Plan</dt>
                  <dd className="text-slate-600">{account.plan}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="font-semibold text-slate-950">Billing</dt>
                  <dd className="text-slate-600">{account.billingStatus}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="font-semibold text-slate-950">Locations</dt>
                  <dd className="text-slate-600">{account.locations.length}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="font-semibold text-slate-950">Reviews</dt>
                  <dd className="text-slate-600">{account.reviews.length}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="font-semibold text-slate-950">Resettable</dt>
                  <dd className="text-slate-600">No</dd>
                </div>
              </dl>
            </article>
          ))}
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
                  <p className="mt-1 text-sm text-slate-600">
                    {location.location}
                  </p>
                </div>
                {location.plan === "Free for Life" ? (
                  <span className="rounded-full bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white">
                    Free for Life
                  </span>
                ) : null}
                <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-100">
                  Pilot Customer
                </span>
              </div>
              <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
                <div>
                  <dt className="font-semibold text-slate-950">Pilot status</dt>
                  <dd className="text-slate-600">{location.pilotStatus}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-950">GBP status</dt>
                  <dd className="text-slate-600">
                    {location.gbpConnectionStatus}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-950">Google rating</dt>
                  <dd className="text-slate-600">
                    {location.googleRating} from {location.googleReviewCount} reviews
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-950">Type</dt>
                  <dd className="text-slate-600">{location.businessType}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-blue-100 bg-blue-50 p-5">
        <div className="flex items-center gap-3">
          <MessageSquareText className="size-5 text-blue-700" />
          <p className="text-sm leading-6 text-blue-950">
            Google Business Profile OAuth for review sync is still coming next.
            Admin login uses Google OAuth now, while review data remains the
            current pilot workflow.
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
