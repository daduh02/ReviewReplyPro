"use client";

import { useState } from "react";
import { defaultBrandVoice } from "@/lib/demo-data";
import type { BrandVoiceSettings, ReplyLength, Tone } from "@/lib/types";

export function BrandVoiceForm() {
  const [settings, setSettings] =
    useState<BrandVoiceSettings>(defaultBrandVoice);

  function update<K extends keyof BrandVoiceSettings>(
    key: K,
    value: BrandVoiceSettings[K],
  ) {
    setSettings((current) => ({ ...current, [key]: value }));
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
      <section className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-2xl font-semibold text-slate-950">Brand Voice</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Set the defaults used when ReviewReply Pro prepares reply drafts.
        </p>
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
          This is how a reply for {settings.businessName} could read.
        </p>
        <div className="mt-5 rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm leading-7 text-blue-950">
          Hi Sarah, thank you for your lovely review. We are delighted you had
          a great experience with {settings.mentionBusinessName ? ` ${settings.businessName}` : " us"}
          {settings.location ? ` in ${settings.location}` : ""}.{" "}
          {settings.defaultLength !== "Short"
            ? "The team really appreciates your kind words and recommendation. "
            : ""}
          {settings.signOffStyle}.
        </div>
        <div className="mt-5 rounded-lg border border-amber-100 bg-amber-50 p-4 text-sm leading-7 text-amber-950">
          Hi James, thank you for raising this.{" "}
          {settings.apologiseForPoorExperiences
            ? "We are sorry to hear your experience did not meet expectations. "
            : "We appreciate you sharing your experience. "}
          We would like to look into this calmly.{" "}
          {settings.inviteUnhappyCustomersToContact
            ? `Please contact ${settings.businessName} directly so the team can review the details.`
            : ""}
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
