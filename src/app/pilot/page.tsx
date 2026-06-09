import { ArrowRight } from "lucide-react";
import { MarketingNav } from "@/components/marketing-nav";
import { submitLeadAction } from "@/lib/lead-actions";

const businessTypes = [
  "Restaurant / takeaway",
  "Salon / beauty",
  "Barber",
  "Dental practice",
  "Solicitors / legal services",
  "Garage / automotive",
  "Trades / home services",
  "Estate agents",
  "Community organisation",
  "Other local business",
];

const reviewPlatforms = [
  "Google Business Profile",
  "Facebook",
  "Tripadvisor",
  "Trustpilot",
  "Multiple platforms",
  "Not sure",
];

const reviewVolumes = ["0-5", "6-15", "16-30", "31-50", "50+"];

export default function PilotProgrammePage() {
  return (
    <>
      <MarketingNav />
      <main className="bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <section className="self-start rounded-lg bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">
              UK pilot programme
            </p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight text-slate-950">
              Join the ReviewReply Pro Pilot Programme
            </h1>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              We are accepting a limited number of UK local businesses to test
              the real review reply workflow: add reviews, generate reply
              options, edit, copy and track posted replies.
            </p>
            <div className="mt-6 rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-blue-950">
              This is for businesses ready to use ReviewReply Pro with real
              reviews during MVP testing.
            </div>
          </section>

          <section className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-2xl font-semibold text-slate-950">
              Pilot interest form
            </h2>
            <form action={submitLeadAction} className="mt-6 grid gap-4 sm:grid-cols-2">
              <Field name="name" label="Name" required />
              <Field name="businessName" label="Business Name" required />
              <Select name="businessType" label="Business Type" options={businessTypes} />
              <Field
                name="numberOfLocations"
                label="Number of Locations"
                type="number"
                min="1"
                defaultValue="1"
                required
              />
              <Field name="email" label="Email" type="email" required />
              <Field name="mobileNumber" label="Mobile Number (optional)" type="tel" />
              <Select
                name="currentReviewPlatform"
                label="Current Review Platform"
                options={reviewPlatforms}
              />
              <Select
                name="averageReviewsPerMonth"
                label="Average Reviews Per Month"
                options={reviewVolumes}
              />
              <label className="text-sm font-semibold text-slate-700 sm:col-span-2">
                Biggest Challenge
                <textarea
                  name="biggestChallenge"
                  required
                  rows={5}
                  className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-3 leading-6"
                />
              </label>
              <div className="sm:col-span-2">
                <button className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700">
                  Submit interest
                  <ArrowRight className="size-4" />
                </button>
              </div>
            </form>
          </section>
        </div>
      </main>
    </>
  );
}

function Field({
  name,
  label,
  type = "text",
  required,
  min,
  defaultValue,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  min?: string;
  defaultValue?: string;
}) {
  return (
    <label className="text-sm font-semibold text-slate-700">
      {label}
      <input
        name={name}
        type={type}
        required={required}
        min={min}
        defaultValue={defaultValue}
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
        required
        className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2"
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}
