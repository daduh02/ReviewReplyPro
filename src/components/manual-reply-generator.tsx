"use client";

import { Save, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { getLocationKey, usePilotStore } from "@/lib/pilot-store";
import type { ReplyLength, Review, Tone } from "@/lib/types";

export function ManualReplyGenerator() {
  const store = usePilotStore();
  const defaultLocation = store.locations[0];
  const [locationKey, setLocationKey] = useState(
    defaultLocation ? getLocationKey(defaultLocation) : "",
  );
  const activeLocation =
    store.locationsByKey[locationKey] ?? defaultLocation;
  const [customer, setCustomer] = useState("Sarah M");
  const [rating, setRating] = useState(5);
  const [source, setSource] = useState("Manual");
  const [tone, setTone] = useState<Tone>("Friendly");
  const [length, setLength] = useState<ReplyLength>("Standard");
  const [review, setReview] = useState(
    "Brilliant service from start to finish. The team were friendly, professional, and I'm really pleased with the result. I'll definitely be coming back.",
  );
  const [savedReviewId, setSavedReviewId] = useState<string | null>(null);
  const [replies, setReplies] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  function buildReview(nextReplies = replies): Review {
    if (!activeLocation) {
      throw new Error("No demo location is available");
    }

    const id = savedReviewId ?? `review_${Date.now()}`;
    const sentiment = rating <= 2 ? "Complaint" : rating <= 3 ? "Negative" : "Positive";

    return {
      id,
      customerName: customer,
      rating,
      reviewText: review,
      source: source === "Manual" ? "Manual" : "Google",
      businessName: activeLocation.businessName,
      businessType: activeLocation.businessType,
      location: activeLocation.location,
      address: activeLocation.address,
      googleRating: activeLocation.googleRating,
      googleReviewCount: activeLocation.googleReviewCount,
      priceRange: activeLocation.priceRange,
      dateReceived: new Date().toISOString().slice(0, 10),
      status: nextReplies.length ? "draft_ready" : "new",
      sentiment,
      draftReplies: nextReplies,
      selectedReplyIndex: nextReplies.length ? 0 : undefined,
      selectedReply: nextReplies[0],
      editedReply: nextReplies[0],
    };
  }

  function saveReview() {
    const next = buildReview();
    if (savedReviewId) {
      store.updateReview(savedReviewId, next);
    } else {
      store.addReview(next);
      setSavedReviewId(next.id);
    }
  }

  async function generateReplies() {
    if (!activeLocation) {
      return;
    }

    setIsGenerating(true);
    const response = await fetch("/api/replies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reviewText: review,
        starRating: rating,
        customerName: customer,
        businessName: activeLocation.businessName,
        businessType: activeLocation.businessType,
        location: activeLocation.location,
        tone,
        replyLength: length,
        brandVoiceSettings: activeLocation.brandVoice,
      }),
    });
    const data = (await response.json()) as { replies: string[] };
    setReplies(data.replies);
    const next = buildReview(data.replies);
    if (savedReviewId) {
      store.updateReview(savedReviewId, next);
    } else {
      store.addReview(next);
      setSavedReviewId(next.id);
    }
    setIsGenerating(false);
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <section className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <p className="text-sm font-semibold text-blue-700">Manual review entry is active now</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-950">
          Generate Reply / Add Review manually
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Google Business Profile connection coming next. For the pilot workflow,
          save manual reviews into the inbox and generate reply options from the
          selected location&apos;s brand voice.
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold text-slate-700">
            Business/location
            <select
              value={locationKey}
              onChange={(event) => setLocationKey(event.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2"
            >
              {store.locations.map((location) => (
                <option key={location.id} value={getLocationKey(location)}>
                  {getLocationKey(location)}
                </option>
              ))}
            </select>
          </label>
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
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={saveReview}
            disabled={!activeLocation}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-blue-200 hover:text-blue-700"
          >
            <Save className="size-4" />
            Save review to inbox
          </button>
          <button
            onClick={generateReplies}
            disabled={!activeLocation || isGenerating}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <Sparkles className="size-4" />
            {isGenerating ? "Generating..." : "Generate 3 replies"}
          </button>
          {savedReviewId ? (
            <Link
              href={`/app/reviews/${savedReviewId}`}
              className="inline-flex items-center rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Open saved review
            </Link>
          ) : null}
        </div>
      </section>
      <section className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-xl font-semibold text-slate-950">Draft options</h2>
        <div className="mt-4 space-y-3">
          {(replies.length ? replies : ["Generated replies will appear here."]).map(
            (reply, index) => (
              <div key={`${reply}-${index}`} className="rounded-lg border border-slate-200 p-4">
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
