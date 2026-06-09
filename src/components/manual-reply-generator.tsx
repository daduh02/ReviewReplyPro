"use client";

import { Sparkles } from "lucide-react";
import { useState } from "react";
import { buildMockReplies } from "@/lib/providers/ai";
import type { ReplyLength, Tone } from "@/lib/types";

export function ManualReplyGenerator() {
  const [business, setBusiness] = useState("Example Hair Salon");
  const [customer, setCustomer] = useState("Sarah M");
  const [rating, setRating] = useState(5);
  const [source, setSource] = useState("Google");
  const [tone, setTone] = useState<Tone>("Friendly");
  const [length, setLength] = useState<ReplyLength>("Standard");
  const [review, setReview] = useState(
    "Brilliant service from start to finish. The team were friendly, professional, and I'm really pleased with the result. I'll definitely be coming back.",
  );
  const [replies, setReplies] = useState<string[]>([]);

  function generateReplies() {
    setReplies(
      buildMockReplies({
        reviewText: review,
        starRating: rating,
        customerName: customer,
        businessName: business,
        businessType: business.includes("Dental")
          ? "Dentist"
          : business.includes("Restaurant")
            ? "Restaurant"
            : "Salon",
        location: business.includes("Restaurant") ? "Birmingham" : "Leeds",
        tone,
        replyLength: length,
      }),
    );
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <section className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <p className="text-sm font-semibold text-blue-700">Fallback workflow</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-950">
          Generate Reply / Add Review manually
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Manual entry is here for reviews outside the inbox. The main workflow is
          still Google Business Profile sync into Review Inbox.
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field label="Business/location" value={business} onChange={setBusiness} />
          <Field label="Customer name" value={customer} onChange={setCustomer} />
          <label className="text-sm font-semibold text-slate-700">
            Star rating
            <input
              type="number"
              min={1}
              max={5}
              value={rating}
              onChange={(event) => setRating(Number(event.target.value))}
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2"
            />
          </label>
          <Field label="Source" value={source} onChange={setSource} />
          <label className="text-sm font-semibold text-slate-700">
            Tone
            <select
              value={tone}
              onChange={(event) => setTone(event.target.value as Tone)}
              className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2"
            >
              {["Friendly", "Professional", "Empathetic", "Short & Simple"].map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label className="text-sm font-semibold text-slate-700">
            Reply length
            <select
              value={length}
              onChange={(event) => setLength(event.target.value as ReplyLength)}
              className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2"
            >
              {["Short", "Standard", "Detailed"].map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
        </div>
        <label className="mt-4 block text-sm font-semibold text-slate-700">
          Review text
          <textarea
            value={review}
            onChange={(event) => setReview(event.target.value)}
            rows={6}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-3 leading-6"
          />
        </label>
        <button
          onClick={generateReplies}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <Sparkles className="size-4" />
          Generate 3 replies
        </button>
      </section>
      <section className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-xl font-semibold text-slate-950">Draft options</h2>
        <div className="mt-4 space-y-3">
          {(replies.length ? replies : ["Generated replies will appear here."]).map(
            (reply, index) => (
              <div key={reply} className="rounded-lg border border-slate-200 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Option {replies.length ? index + 1 : ""}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-700">{reply}</p>
              </div>
            ),
          )}
        </div>
      </section>
    </div>
  );
}

function Field({
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
