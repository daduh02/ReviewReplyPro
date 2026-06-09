import { Search, UserRoundCheck } from "lucide-react";
import Link from "next/link";
import { requireSuperAdmin } from "@/lib/admin-auth";
import { getDb } from "@/lib/db";
import {
  leadStatusLabels,
  leadStatuses,
} from "@/lib/lead-data";
import { updateLeadStatusAction } from "@/lib/lead-actions";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function paramValue(params: Record<string, string | string[] | undefined>, key: string) {
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  await requireSuperAdmin();
  const params = await searchParams;
  const query = paramValue(params, "q") ?? "";
  const status = paramValue(params, "status") ?? "all";
  const db = getDb();
  const [leads, totalLeads, newLeads, demoBooked, pilotCustomers] =
    await Promise.all([
      db.lead.findMany({
        where: {
          status: status !== "all" ? status : undefined,
          OR: query
            ? [
                { businessName: { contains: query } },
                { name: { contains: query } },
                { email: { contains: query } },
                { businessType: { contains: query } },
              ]
            : undefined,
        },
        orderBy: { createdAt: "desc" },
      }),
      db.lead.count(),
      db.lead.count({ where: { status: "new" } }),
      db.lead.count({ where: { status: "demo_booked" } }),
      db.lead.count({ where: { status: "pilot_customer" } }),
    ]);

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-4">
        <Metric label="Total Leads" value={totalLeads} />
        <Metric label="New Leads" value={newLeads} />
        <Metric label="Demo Booked" value={demoBooked} />
        <Metric label="Pilot Customers" value={pilotCustomers} />
      </section>

      <section className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <div className="flex items-center gap-3">
          <UserRoundCheck className="size-5 text-blue-700" />
          <div>
            <h2 className="text-2xl font-semibold text-slate-950">Leads</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Lightweight pilot lead management for UK businesses interested in
              ReviewReply Pro.
            </p>
          </div>
        </div>

        <form className="mt-5 grid gap-3 lg:grid-cols-[1fr_260px_auto_auto]">
          <label className="text-sm font-semibold text-slate-700">
            Search
            <span className="relative mt-2 block">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input
                name="q"
                defaultValue={query}
                placeholder="Business, contact, email or type"
                className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm"
              />
            </span>
          </label>
          <label className="text-sm font-semibold text-slate-700">
            Status
            <select
              name="status"
              defaultValue={status}
              className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
            >
              <option value="all">All statuses</option>
              {leadStatuses.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <div className="flex items-end">
            <button className="w-full rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
              Filter
            </button>
          </div>
          <div className="flex items-end">
            <Link
              href="/admin/leads"
              className="w-full rounded-lg border border-slate-200 px-4 py-2 text-center text-sm font-semibold text-slate-700 hover:border-blue-200 hover:text-blue-700"
            >
              Clear
            </Link>
          </div>
        </form>
      </section>

      <section className="overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-slate-200">
        <div className="hidden grid-cols-[1fr_0.85fr_1fr_0.8fr_0.75fr_0.8fr] gap-4 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 lg:grid">
          <span>Business Name</span>
          <span>Contact Name</span>
          <span>Email</span>
          <span>Business Type</span>
          <span>Date Submitted</span>
          <span>Status</span>
        </div>
        <div className="divide-y divide-slate-200">
          {leads.map((lead) => (
            <article
              key={lead.id}
              className="grid gap-4 p-4 lg:grid-cols-[1fr_0.85fr_1fr_0.8fr_0.75fr_0.8fr] lg:items-start"
            >
              <div>
                <p className="font-semibold text-slate-950">{lead.businessName}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {lead.numberOfLocations} location
                  {lead.numberOfLocations === 1 ? "" : "s"} · {lead.currentReviewPlatform}
                </p>
              </div>
              <p className="text-sm text-slate-700">{lead.name}</p>
              <div>
                <p className="text-sm text-slate-700">{lead.email}</p>
                {lead.mobileNumber ? (
                  <p className="mt-1 text-xs text-slate-500">{lead.mobileNumber}</p>
                ) : null}
              </div>
              <p className="text-sm text-slate-700">{lead.businessType}</p>
              <p className="text-sm text-slate-600">
                {lead.createdAt.toLocaleDateString("en-GB")}
              </p>
              <form action={updateLeadStatusAction}>
                <input type="hidden" name="id" value={lead.id} />
                <select
                  name="status"
                  defaultValue={lead.status}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                >
                  {leadStatuses.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
                <button className="mt-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:border-blue-200 hover:text-blue-700">
                  Update
                </button>
                <p className="mt-2 text-xs font-semibold text-blue-700">
                  {leadStatusLabels[lead.status] ?? lead.status}
                </p>
              </form>
              <div className="lg:col-span-6">
                <p className="rounded-lg bg-slate-50 p-3 text-sm leading-6 text-slate-600">
                  <span className="font-semibold text-slate-800">Challenge:</span>{" "}
                  {lead.biggestChallenge}
                </p>
              </div>
            </article>
          ))}
          {!leads.length ? (
            <div className="p-8 text-center text-sm text-slate-600">
              No leads match those filters.
            </div>
          ) : null}
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
