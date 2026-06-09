import { Clock3, MessageSquarePlus } from "lucide-react";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { getActiveLocations } from "@/lib/app-data";

export default async function IntegrationsPage() {
  const admin = await requireAdmin();
  const locations = await getActiveLocations(admin);

  return (
    <div className="space-y-6">
      <section className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-blue-700">
              Google Business Profile
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950">
              Google Business Profile integration coming soon
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Manual review entry is active now. Each location stores Google
              readiness fields so the future sync can attach without a database
              redesign.
            </p>
          </div>
          <Link
            href="/app/generate"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <MessageSquarePlus className="size-4" />
            Add review manually
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {locations.map((location) => (
          <article
            key={location.id}
            className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-semibold text-slate-950">
                  {location.businessName}
                </h3>
                <p className="mt-1 text-sm text-slate-600">{location.city}</p>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-200">
                <Clock3 className="size-3" />
                Coming soon
              </span>
            </div>
            <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
              <Info label="Status" value={location.googleBusinessStatus} />
              <Info
                label="Sync enabled"
                value={location.gbpSyncEnabled ? "Yes" : "No"}
              />
              <Info label="Google Place ID" value={location.googlePlaceId ?? "Not set"} />
              <Info label="Google account ID" value={location.googleAccountId ?? "Not set"} />
              <Info label="Google location ID" value={location.googleLocationId ?? "Not set"} />
              <Info
                label="Last import attempt"
                value={
                  location.lastGbpImportAttemptAt
                    ? location.lastGbpImportAttemptAt.toLocaleString("en-GB")
                    : "Not attempted"
                }
              />
            </dl>
          </article>
        ))}
      </section>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-semibold text-slate-950">{label}</dt>
      <dd className="mt-1 text-slate-600">{value}</dd>
    </div>
  );
}
