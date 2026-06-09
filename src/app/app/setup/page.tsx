import { Building2, MapPin, SlidersHorizontal } from "lucide-react";
import { completeBusinessSetupAction } from "@/lib/setup-actions";

export default function BusinessSetupPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-2xl font-semibold text-slate-950">
          First-time business setup
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Add the real business, first location, brand voice and Google Business
          Profile readiness fields before adding reviews.
        </p>
      </section>

      <form action={completeBusinessSetupAction} className="space-y-6">
        <section className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center gap-3">
            <Building2 className="size-5 text-blue-700" />
            <h3 className="text-xl font-semibold text-slate-950">Business</h3>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field name="businessName" label="Business name" required />
            <Field name="businessType" label="Business type" required />
            <Field
              name="replyNotificationEmail"
              label="Reply notification email"
              type="email"
            />
          </div>
        </section>

        <section className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center gap-3">
            <MapPin className="size-5 text-blue-700" />
            <h3 className="text-xl font-semibold text-slate-950">Location</h3>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field name="locationName" label="Location name" required />
            <Field name="address" label="Address" />
            <Field name="phone" label="Phone" />
            <Field name="website" label="Website" />
            <Field name="googlePlaceId" label="Google Place ID" />
            <Field name="googleAccountId" label="Google account ID" />
            <Field name="googleLocationId" label="Google location ID" />
          </div>
          <p className="mt-4 text-sm text-slate-600">
            Google Business Profile integration coming soon. These IDs are stored
            now so sync can be added without redesigning the database.
          </p>
        </section>

        <section className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center gap-3">
            <SlidersHorizontal className="size-5 text-blue-700" />
            <h3 className="text-xl font-semibold text-slate-950">Brand voice</h3>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Select
              name="preferredTone"
              label="Preferred tone"
              options={["Friendly", "Professional", "Empathetic", "Short & Simple"]}
            />
            <Select
              name="defaultLength"
              label="Maximum reply length"
              options={["Short", "Standard", "Detailed"]}
            />
            <Field name="greetingStyle" label="Preferred greeting" />
            <Field name="signOffStyle" label="Preferred sign-off" />
            <Field name="wordsToUse" label="Words to use" />
            <Field name="wordsToAvoid" label="Words to avoid" />
            <label className="text-sm font-semibold text-slate-700 sm:col-span-2">
              Writing style / complaint handling
              <textarea
                name="complaintHandlingStyle"
                rows={4}
                className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-3 leading-6"
              />
            </label>
            <label className="flex items-center gap-3 rounded-lg border border-slate-200 p-3 text-sm font-semibold text-slate-700">
              <input type="checkbox" name="useEmojis" className="size-4" />
              Use emojis
            </label>
            <label className="flex items-center gap-3 rounded-lg border border-slate-200 p-3 text-sm font-semibold text-slate-700">
              <input
                type="checkbox"
                name="keepRepliesShortByDefault"
                className="size-4"
              />
              Keep replies short by default
            </label>
          </div>
        </section>

        <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
          Complete setup
        </button>
      </form>
    </div>
  );
}

function Field({
  name,
  label,
  required,
  type = "text",
}: {
  name: string;
  label: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <label className="text-sm font-semibold text-slate-700">
      {label}
      <input
        name={name}
        type={type}
        required={required}
        className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2"
      />
    </label>
  );
}

function Select({
  name,
  label,
  options,
}: {
  name: string;
  label: string;
  options: string[];
}) {
  return (
    <label className="text-sm font-semibold text-slate-700">
      {label}
      <select
        name={name}
        defaultValue={options[0]}
        className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2"
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}
