import { getActiveLocations, toBrandVoiceInput } from "@/lib/app-data";
import { updateBrandVoiceAction } from "@/lib/review-actions";

export default async function BrandVoicePage() {
  const locations = await getActiveLocations();

  return (
    <div className="space-y-6">
      <section className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-2xl font-semibold text-slate-950">Brand Voice</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Configure reply rules per business location. These settings are used
          whenever ReviewReply Pro generates reply options.
        </p>
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        {locations.map((location) => {
          const settings = toBrandVoiceInput(location);

          return (
            <form
              key={location.id}
              action={updateBrandVoiceAction}
              className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200"
            >
              <input type="hidden" name="locationId" value={location.id} />
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-xl font-semibold text-slate-950">
                    {location.businessName}
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">{location.city}</p>
                </div>
                {location.workspace.plan === "Free for Life" ? (
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
                    Free for Life
                  </span>
                ) : null}
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <ReadOnlyField label="Business name" value={settings.businessName} />
                <ReadOnlyField label="Business type" value={settings.businessType} />
                <ReadOnlyField label="Location" value={settings.location} />
                <SelectField
                  label="Preferred tone"
                  name="preferredTone"
                  defaultValue={settings.preferredTone}
                  options={["Friendly", "Professional", "Empathetic", "Short & Simple"]}
                />
                <SelectField
                  label="Maximum reply length"
                  name="defaultLength"
                  defaultValue={settings.defaultLength}
                  options={["Short", "Standard", "Detailed"]}
                />
                <TextField
                  label="Preferred greeting"
                  name="greetingStyle"
                  defaultValue={settings.greetingStyle}
                />
                <TextField
                  label="Preferred sign-off"
                  name="signOffStyle"
                  defaultValue={settings.signOffStyle}
                />
                <TextField
                  label="Words to use"
                  name="wordsToUse"
                  defaultValue={settings.wordsToUse}
                />
                <TextField
                  label="Words to avoid"
                  name="wordsToAvoid"
                  defaultValue={settings.wordsToAvoid}
                />
                <label className="text-sm font-semibold text-slate-700 sm:col-span-2">
                  Writing style / complaint handling
                  <textarea
                    name="complaintHandlingStyle"
                    defaultValue={settings.complaintHandlingStyle}
                    rows={4}
                    className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-3 leading-6"
                  />
                </label>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <Checkbox
                  name="useEmojis"
                  label="Use emojis"
                  defaultChecked={settings.useEmojis}
                />
                <Checkbox
                  name="mentionBusinessName"
                  label="Mention business name"
                  defaultChecked={settings.mentionBusinessName}
                />
                <Checkbox
                  name="apologiseForPoorExperiences"
                  label="Apologise for poor experiences"
                  defaultChecked={settings.apologiseForPoorExperiences}
                />
                <Checkbox
                  name="inviteUnhappyCustomersToContact"
                  label="Invite unhappy reviewers to contact directly"
                  defaultChecked={settings.inviteUnhappyCustomersToContact}
                />
                <Checkbox
                  name="keepRepliesShortByDefault"
                  label="Keep replies short by default"
                  defaultChecked={settings.keepRepliesShortByDefault}
                />
                <Checkbox
                  name="ukEnglish"
                  label="Enforce UK English"
                  defaultChecked
                />
              </div>

              <button className="mt-5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
                Save brand voice
              </button>
            </form>
          );
        })}
      </div>
    </div>
  );
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <label className="text-sm font-semibold text-slate-700">
      {label}
      <input
        value={value}
        readOnly
        className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-600"
      />
    </label>
  );
}

function TextField({
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
        className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2"
      />
    </label>
  );
}

function SelectField({
  label,
  name,
  defaultValue,
  options,
}: {
  label: string;
  name: string;
  defaultValue: string;
  options: string[];
}) {
  return (
    <label className="text-sm font-semibold text-slate-700">
      {label}
      <select
        name={name}
        defaultValue={defaultValue}
        className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2"
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

function Checkbox({
  name,
  label,
  defaultChecked,
}: {
  name: string;
  label: string;
  defaultChecked: boolean;
}) {
  return (
    <label className="flex items-center gap-3 rounded-lg border border-slate-200 p-3 text-sm font-semibold text-slate-700">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="size-4"
      />
      {label}
    </label>
  );
}
