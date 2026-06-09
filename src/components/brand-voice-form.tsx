"use client";

import { useState } from "react";
import { defaultBrandVoice } from "@/lib/demo-data";
import { usePilotStore } from "@/lib/pilot-store";
import type { BrandVoiceSettings, ReplyLength, Tone } from "@/lib/types";

export function BrandVoiceForm() {
  const store = usePilotStore();
  const locations = store.locations;
  const firstLocation = locations[0];
  const [settings, setSettings] =
    useState<BrandVoiceSettings>(defaultBrandVoice);
  const [selectedLocation, setSelectedLocation] = useState(firstLocation?.id ?? "");

  function update<K extends keyof BrandVoiceSettings>(
    key: K,
    value: BrandVoiceSettings[K],
  ) {
    setSettings((current) => {
      const next = { ...current, [key]: value };
      if (selectedLocation) {
        store.updateBrandVoice(selectedLocation, next);
      }
      return next;
    });
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
      <section className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-2xl font-semibold text-slate-950">Brand Voice</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Set the defaults used when ReviewReply Pro prepares reply drafts for
          each fictional demo business location.
        </p>
        <label className="mt-5 block text-sm font-semibold text-slate-700">
          Demo business/location
          <select
            value={selectedLocation}
            onChange={(event) => {
              const next = locations.find(
                (location) => location.id === event.target.value,
              );
              setSelectedLocation(event.target.value);
              if (next) {
                setSettings(store.brandVoices[next.id] ?? next.brandVoice);
              }
            }}
            className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2"
          >
            {locations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.businessName} — {location.location}
              </option>
            ))}
          </select>
        </label>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <TextField label="Business name" value={settings.businessName} onChange={(value) => update("businessName", value)} />
          <TextField label="Business type" value={settings.businessType} onChange={(value) => update("businessType", value as BrandVoiceSettings["businessType"])} />
          <TextField label="Location" value={settings.location} onChange={(value) => update("location", value)} />
          <SelectField label="Preferred tone" value={settings.preferredTone} options={["Friendly", "Professional", "Empathetic", "Short & Simple"]} onChange={(value) => update("preferredTone", value as Tone)} />
          <SelectField label="Reply length default" value={settings.defaultLength} options={["Short", "Standard", "Detailed"]} onChange={(value) => update("defaultLength", value as ReplyLength)} />
          <TextField label="Greeting style" value={settings.greetingStyle} onChange={(value) => update("greetingStyle", value)} />
          <TextField label="Sign-off style" value={settings.signOffStyle} onChange={(value) => update("signOffStyle", value)} />
          <TextField label="Words to use" value={settings.wordsToUse} onChange={(value) => update("wordsToUse", value)} />
          <TextField label="Words to avoid" value={settings.wordsToAvoid} onChange={(value) => update("wordsToAvoid", value)} />
          <label className="sm:col-span-2 text-sm font-semibold text-slate-700">
            Complaint handling style
            <textarea
              value={settings.complaintHandlingStyle}
              onChange={(event) => update("complaintHandlingStyle", event.target.value)}
              rows={4}
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-3 leading-6"
            />
          </label>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {[
            ["useEmojis", "Use emojis"],
            ["mentionBusinessName", "Mention business name"],
            ["apologiseForPoorExperiences", "Apologise for poor experiences"],
            ["inviteUnhappyCustomersToContact", "Invite unhappy customers to contact the business"],
            ["keepRepliesShortByDefault", "Keep replies short by default"],
          ].map(([key, label]) => (
            <label
              key={key}
              className="flex items-center gap-3 rounded-lg border border-slate-200 p-3 text-sm font-semibold text-slate-700"
            >
              <input
                type="checkbox"
                checked={Boolean(settings[key as keyof BrandVoiceSettings])}
                onChange={(event) =>
                  update(key as keyof BrandVoiceSettings, event.target.checked as never)
                }
                className="size-4"
              />
              {label}
            </label>
          ))}
        </div>
      </section>

      <aside className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-xl font-semibold text-slate-950">Live preview</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          This is how a reply for {settings.businessName} in {settings.location} could read.
        </p>
        <div className="mt-5 rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm leading-7 text-blue-950">
          {settings.businessType.includes("Solicitors")
            ? `Dear James, thank you for your kind review. We are pleased to hear that everything was explained clearly and that you felt well supported. ${settings.signOffStyle}.`
            : `Hi Sarah, thank you for your lovely review. We are delighted you had a positive experience with ${settings.businessName} in ${settings.location}. ${settings.signOffStyle}.`}
        </div>
        <div className="mt-5 rounded-lg border border-amber-100 bg-amber-50 p-4 text-sm leading-7 text-amber-950">
          {settings.businessType.includes("Solicitors")
            ? `Dear James, thank you for your feedback. We are sorry to hear that communication did not meet your expectations. To avoid discussing details publicly, please contact the office directly so your concerns can be reviewed appropriately. ${settings.signOffStyle}.`
            : `Hi Priya, thank you for letting us know. We are sorry your experience did not meet expectations. Please contact the business directly with the details so we can look into this for you. ${settings.signOffStyle}.`}
        </div>
      </aside>
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="text-sm font-semibold text-slate-700">
      {label}
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2"
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="text-sm font-semibold text-slate-700">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2"
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}
