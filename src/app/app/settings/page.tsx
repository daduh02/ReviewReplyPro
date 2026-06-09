import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { workspaceScopeForAdmin } from "@/lib/app-data";
import { getDb } from "@/lib/db";

export default async function SettingsPage() {
  const admin = await requireAdmin();
  const workspaces = await getDb().workspace.findMany({
    where: {
      active: true,
      ...workspaceScopeForAdmin(admin),
    },
    include: { locations: true },
    orderBy: { name: "asc" },
  });

  return (
    <section className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-slate-950">Settings</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Active businesses and notification settings available to your admin
            account.
          </p>
        </div>
        <Link
          href="/app/setup"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Add business
        </Link>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {workspaces.map((workspace) => (
          <article key={workspace.id} className="rounded-lg border border-slate-200 p-4">
            <h3 className="font-semibold text-slate-950">{workspace.name}</h3>
            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              <Info label="Account type" value={workspace.accountType} />
              <Info label="Plan" value={workspace.plan} />
              <Info label="Billing status" value={workspace.billingStatus} />
              <Info
                label="Reply notification email"
                value={workspace.replyNotificationEmail ?? "Not set"}
              />
              <Info label="Locations" value={String(workspace.locations.length)} />
              <Info
                label="Setup"
                value={workspace.setupCompletedAt ? "Complete" : "Incomplete"}
              />
            </dl>
          </article>
        ))}
      </div>
    </section>
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
