import { Save } from "lucide-react";
import { requireAdmin } from "@/lib/admin-auth";
import { getActiveLocations } from "@/lib/app-data";
import { addReviewAction } from "@/lib/review-actions";

export default async function GeneratePage() {
  const admin = await requireAdmin();
  const locations = await getActiveLocations(admin);

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <section className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <p className="text-sm font-semibold text-blue-700">
          Manual review entry is active now
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-950">
          Add Review manually
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Google Business Profile integration coming soon. Add a pilot review
          here, save it to the inbox, then generate three reply options from the
          selected location&apos;s brand voice.
        </p>

        <form action={addReviewAction} className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold text-slate-700 sm:col-span-2">
            Business/location
            <select
              name="locationId"
              required
              className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2"
            >
              {locations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.businessName} — {location.city}
                </option>
              ))}
            </select>
          </label>
          <Field label="Customer name" name="customerName" defaultValue="Sarah M" />
          <label className="text-sm font-semibold text-slate-700">
            Star rating
            <input
              name="starRating"
              type="number"
              min={1}
              max={5}
              defaultValue={5}
              required
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2"
            />
          </label>
          <label className="text-sm font-semibold text-slate-700 sm:col-span-2">
            Source
            <select
              name="source"
              defaultValue="Manual"
              className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2"
            >
              <option>Manual</option>
              <option>Google</option>
              <option>Facebook</option>
              <option>Tripadvisor</option>
            </select>
          </label>
          <label className="text-sm font-semibold text-slate-700 sm:col-span-2">
            Review text
            <textarea
              name="reviewText"
              defaultValue="Brilliant service from start to finish. The team were friendly, professional, and I'm really pleased with the result. I'll definitely be coming back."
              rows={7}
              required
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-3 leading-6"
            />
          </label>
          <div className="sm:col-span-2">
            <button className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
              <Save className="size-4" />
              Save review to inbox
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-xl font-semibold text-slate-950">
          Pilot workflow
        </h2>
        <div className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
          <p>1. Add a review manually while Google Business Profile is pending.</p>
          <p>2. Generate three OpenAI-backed reply options.</p>
          <p>3. Edit, save, copy, mark as posted, or archive.</p>
          <p>4. Return later and the full history is retained in the database.</p>
        </div>
      </section>
    </div>
  );
}

function Field({
  label,
  name,
  defaultValue,
}: {
  label: string;
  name: string;
  defaultValue: string;
}) {
  return (
    <label className="text-sm font-semibold text-slate-700">
      {label}
      <input
        name={name}
        defaultValue={defaultValue}
        required
        className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2"
      />
    </label>
  );
}
