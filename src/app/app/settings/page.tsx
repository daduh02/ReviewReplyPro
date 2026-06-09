export default function SettingsPage() {
  return (
    <section className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <h2 className="text-2xl font-semibold text-slate-950">Settings</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        Mock workspace settings for a future authenticated account.
      </p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-semibold text-slate-700">
          Workspace name
          <input
            defaultValue="Glow Salon Leeds"
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2"
          />
        </label>
        <label className="text-sm font-semibold text-slate-700">
          Reply notification email
          <input
            defaultValue="owner@glowsalonleeds.co.uk"
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2"
          />
        </label>
        <label className="text-sm font-semibold text-slate-700">
          Default source
          <select className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2">
            <option>Google</option>
            <option>Manual</option>
            <option>Tripadvisor</option>
          </select>
        </label>
        <label className="text-sm font-semibold text-slate-700">
          Region
          <select className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2">
            <option>United Kingdom</option>
          </select>
        </label>
      </div>
    </section>
  );
}
