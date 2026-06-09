"use client";

import {
  Archive,
  CheckCircle2,
  Copy,
  Edit3,
  ExternalLink,
  Save,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { getLocationKey, usePilotStore } from "@/lib/pilot-store";
import type { ReplyLength, Review, ReviewStatus, Tone } from "@/lib/types";
import { ReviewStars } from "@/components/review-stars";
import { StatusBadge } from "@/components/status-badge";

const statuses: ReviewStatus[] = [
  "draft_ready",
  "new",
  "edited",
  "copied",
  "posted",
  "archived",
];

const statusLabels: Record<ReviewStatus | "All", string> = {
  All: "All",
  new: "New",
  draft_ready: "Draft ready",
  edited: "Edited",
  copied: "Copied",
  posted: "Posted",
  archived: "Archived",
};

export function ReviewInbox({ reviews }: { reviews: Review[] }) {
  const store = usePilotStore();
  const items = store.hydrated ? store.reviews : reviews;
  const locations = store.locations;
  const [filter, setFilter] = useState<ReviewStatus | "All">("All");
  const [locationFilter, setLocationFilter] = useState("All locations");
  const [generatingId, setGeneratingId] = useState<string | null>(null);

  const visibleReviews = useMemo(() => {
    return items.filter((review) => {
      const statusMatches = filter === "All" || review.status === filter;
      const locationMatches =
        locationFilter === "All locations" ||
        getLocationKey(review) === locationFilter;

      return statusMatches && locationMatches;
    });
  }, [filter, items, locationFilter]);

  async function generateDrafts(review: Review) {
    setGeneratingId(review.id);
    const location = locations.find((item) => getLocationKey(item) === getLocationKey(review));
    const response = await fetch("/api/replies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reviewText: review.reviewText,
        starRating: review.rating,
        customerName: review.customerName,
        businessName: review.businessName,
        businessType: review.businessType,
        location: review.location,
        tone: location?.brandVoice.preferredTone ?? "Professional",
        replyLength: location?.brandVoice.defaultLength ?? "Standard",
        brandVoiceSettings: location?.brandVoice,
      }),
    });
    const data = (await response.json()) as { replies: string[] };
    store.updateReview(review.id, {
      status: "draft_ready",
      draftReplies: data.replies,
      selectedReplyIndex: 0,
      selectedReply: data.replies[0],
      editedReply: data.replies[0],
    });
    setGeneratingId(null);
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-4">
        {[
          ["Visible reviews", visibleReviews.length],
          ["Demo locations", locations.length],
          [
            "Drafts ready",
            visibleReviews.filter((item) => item.status === "draft_ready").length,
          ],
          ["posted", visibleReviews.filter((item) => item.status === "posted").length],
        ].map(([label, value]) => (
          <div key={label} className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm font-medium text-slate-500">{label}</p>
            <p className="mt-2 text-3xl font-semibold text-slate-950">{value}</p>
          </div>
        ))}
      </section>

      <section className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-slate-950">Review Inbox</h2>
            <p className="mt-1 text-sm text-slate-600">
              Demo Google-style reviews are imported here and prepared as reply drafts.
            </p>
          </div>
          <Link
            href="/app/generate"
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:border-blue-200 hover:text-blue-700"
          >
            Add review manually
          </Link>
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_1fr]">
          <label className="text-sm font-semibold text-slate-700">
            Business/location switcher
            <select
              value={locationFilter}
              onChange={(event) => setLocationFilter(event.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
            >
              <option>All locations</option>
              {locations.map((location) => (
                <option key={location.id}>
                  {location.businessName} — {location.location}
                </option>
              ))}
            </select>
          </label>
          <div className="rounded-lg border border-blue-100 bg-blue-50 p-3 text-sm leading-6 text-blue-950">
            Demo mode uses fictional UK businesses only, so screenshots and
            public examples never display real trading names.
          </div>
        </div>

        <div className="mt-5 flex gap-2 overflow-x-auto pb-2">
          {(["All", ...statuses] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`rounded-full px-3 py-1.5 text-sm font-semibold ${
                filter === status
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {statusLabels[status]}
            </button>
          ))}
        </div>

        <div className="mt-4 overflow-hidden rounded-lg border border-slate-200">
          <div className="hidden grid-cols-[1.1fr_0.7fr_0.8fr_0.8fr_1.4fr_1fr] gap-4 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 lg:grid">
            <span>Customer</span>
            <span>Business</span>
            <span>Received</span>
            <span>Status</span>
            <span>Draft preview</span>
            <span>Actions</span>
          </div>
          <div className="divide-y divide-slate-200">
            {visibleReviews.map((review) => (
              <article
                key={review.id}
                className="grid gap-4 p-4 lg:grid-cols-[1.1fr_0.7fr_0.8fr_0.8fr_1.4fr_1fr] lg:items-center"
              >
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-slate-950">{review.customerName}</p>
                    <ReviewStars rating={review.rating} />
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
                    {review.reviewText}
                  </p>
                  <p className="mt-2 text-xs font-medium text-slate-500">
                    Source: {review.source}
                  </p>
                </div>
                <p className="text-sm font-medium text-slate-700">
                  {review.businessName}
                  <span className="block text-xs text-slate-500">
                    {review.location}
                    {review.address ? ` · ${review.address}` : ""}
                  </span>
                  <span className="mt-1 block text-xs text-slate-500">
                    {review.googleRating
                      ? `Google ${review.googleRating.toFixed(1)} · ${
                          review.googleReviewCount
                        } reviews`
                      : ""}
                    {review.priceRange ? ` · ${review.priceRange}` : ""}
                  </span>
                </p>
                <p className="text-sm text-slate-600">{review.dateReceived}</p>
                <StatusBadge status={review.status} />
                <p className="line-clamp-3 text-sm leading-6 text-slate-600">
                  {review.draftReplies[0] ?? "No draft generated yet."}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/app/reviews/${review.id}`}
                    className="inline-flex size-9 items-center justify-center rounded-lg border border-slate-200 text-slate-700 hover:border-blue-200 hover:text-blue-700"
                    title="Open review"
                  >
                    <ExternalLink className="size-4" />
                  </Link>
                  <button
                    onClick={() => generateDrafts(review)}
                    className="inline-flex size-9 items-center justify-center rounded-lg border border-slate-200 text-slate-700 hover:border-blue-200 hover:text-blue-700"
                    title="Generate drafts"
                  >
                    <Sparkles className="size-4" />
                    <span className="sr-only">
                      {generatingId === review.id ? "Generating" : "Generate drafts"}
                    </span>
                  </button>
                  <button
                    onClick={() => store.updateReviewStatus(review.id, "edited")}
                    className="inline-flex size-9 items-center justify-center rounded-lg border border-slate-200 text-slate-700 hover:border-blue-200 hover:text-blue-700"
                    title="Edit reply"
                  >
                    <Edit3 className="size-4" />
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(
                        review.editedReply ??
                          review.selectedReply ??
                          review.draftReplies[0] ??
                          "",
                      );
                      store.updateReviewStatus(review.id, "copied");
                    }}
                    className="inline-flex size-9 items-center justify-center rounded-lg border border-slate-200 text-slate-700 hover:border-blue-200 hover:text-blue-700"
                    title="Copy reply"
                  >
                    <Copy className="size-4" />
                  </button>
                  <button
                    onClick={() => store.updateReviewStatus(review.id, "posted")}
                    className="inline-flex size-9 items-center justify-center rounded-lg border border-slate-200 text-slate-700 hover:border-blue-200 hover:text-blue-700"
                    title="Mark as posted"
                  >
                    <CheckCircle2 className="size-4" />
                  </button>
                  <button
                    onClick={() => store.updateReviewStatus(review.id, "archived")}
                    className="inline-flex size-9 items-center justify-center rounded-lg border border-slate-200 text-slate-700 hover:border-blue-200 hover:text-blue-700"
                    title="Archive"
                  >
                    <Archive className="size-4" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export function ReviewDetail({ review }: { review?: Review }) {
  const store = usePilotStore();
  const activeReview =
    store.reviews.find((item) => item.id === review?.id) ?? review ?? store.reviews[0];
  const location = activeReview
    ? store.locations.find(
        (item) => getLocationKey(item) === getLocationKey(activeReview),
      )
    : undefined;
  const [tone, setTone] = useState<Tone>(
    location?.brandVoice.preferredTone ?? "Professional",
  );
  const [length, setLength] = useState<ReplyLength>(
    location?.brandVoice.defaultLength ?? "Standard",
  );
  const selected = activeReview?.selectedReplyIndex ?? 0;
  const options = activeReview?.draftReplies ?? [];
  const reply =
    activeReview?.editedReply ??
    activeReview?.selectedReply ??
    activeReview?.draftReplies[selected] ??
    "";
  const [isGenerating, setIsGenerating] = useState(false);

  if (!activeReview) {
    return (
      <section className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-xl font-semibold text-slate-950">Review not found</h2>
      </section>
    );
  }

  function patchReview(patch: Partial<Review>) {
    store.updateReview(activeReview.id, patch);
  }

  async function regenerate() {
    setIsGenerating(true);
    const response = await fetch("/api/replies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reviewText: activeReview.reviewText,
        starRating: activeReview.rating,
        customerName: activeReview.customerName,
        businessName: activeReview.businessName,
        businessType: activeReview.businessType,
        location: activeReview.location,
        tone,
        replyLength: length,
        brandVoiceSettings: location?.brandVoice,
      }),
    });
    const data = (await response.json()) as { replies: string[] };
    patchReview({
      status: "draft_ready",
      draftReplies: data.replies,
      selectedReplyIndex: 0,
      selectedReply: data.replies[0],
      editedReply: data.replies[0],
    });
    setIsGenerating(false);
  }

  function saveReply() {
    patchReview({ status: "edited", editedReply: reply, selectedReply: reply });
    store.saveReply({
      id: `saved_${activeReview.id}`,
      reviewId: activeReview.id,
      originalReviewSnippet: activeReview.reviewText,
      replyPreview: reply,
      tone,
      businessType: activeReview.businessType,
      dateSaved: new Date().toISOString().slice(0, 10),
      usageCount: 1,
      sentiment: activeReview.sentiment,
    });
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <section className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-blue-700">{activeReview.source} review</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950">
              {activeReview.customerName}
            </h2>
          </div>
          <StatusBadge status={activeReview.status} />
        </div>
        <div className="mt-4 flex items-center gap-3">
          <ReviewStars rating={activeReview.rating} />
          <span className="text-sm text-slate-500">{activeReview.dateReceived}</span>
        </div>
        <p className="mt-5 rounded-lg bg-slate-50 p-4 text-sm leading-7 text-slate-700">
          {activeReview.reviewText}
        </p>
        <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="font-semibold text-slate-950">Business/location</dt>
            <dd className="mt-1 text-slate-600">
              {activeReview.businessName}, {activeReview.location}
            </dd>
            {activeReview.address ? (
              <dd className="mt-1 text-slate-500">{activeReview.address}</dd>
            ) : null}
          </div>
          <div>
            <dt className="font-semibold text-slate-950">Business type</dt>
            <dd className="mt-1 text-slate-600">{activeReview.businessType}</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-950">Demo profile</dt>
            <dd className="mt-1 text-slate-600">
              {activeReview.googleRating
                ? `Google ${activeReview.googleRating.toFixed(1)} from ${
                    activeReview.googleReviewCount
                  } reviews`
                : "Fictional demo profile"}
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-950">Contact</dt>
            <dd className="mt-1 text-slate-600">
              {activeReview.phone ?? "Not set"}
              {activeReview.website ? ` · ${activeReview.website}` : ""}
            </dd>
          </div>
        </dl>
      </section>

      <section className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-slate-950">Draft reply options</h2>
            <p className="mt-1 text-sm text-slate-600">
              Restaurant complaints invite direct contact; solicitor replies stay
              discreet, avoid case details, and avoid legal admissions.
            </p>
          </div>
          <button
            onClick={regenerate}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <Sparkles className="size-4" />
            {isGenerating ? "Generating..." : "Generate drafts"}
          </button>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <label className="text-sm font-semibold text-slate-700">
            Tone
            <select
              value={tone}
              onChange={(event) => setTone(event.target.value as Tone)}
              className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
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
              className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
            >
              {["Short", "Standard", "Detailed"].map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-5 grid gap-3">
          {options.length ? options.map((option, index) => (
            <button
              key={`${option}-${index}`}
              onClick={() => {
                patchReview({
                  selectedReplyIndex: index,
                  selectedReply: option,
                  editedReply: option,
                  status: "draft_ready",
                });
              }}
              className={`rounded-lg border p-4 text-left text-sm leading-6 ${
                selected === index
                  ? "border-blue-300 bg-blue-50 text-blue-950"
                  : "border-slate-200 bg-white text-slate-700 hover:border-blue-200"
              }`}
            >
              <span className="mb-2 block text-xs font-semibold uppercase tracking-wide">
                Option {index + 1}
              </span>
              {option}
            </button>
          )) : (
            <div className="rounded-lg border border-dashed border-slate-200 p-4 text-sm leading-6 text-slate-600">
              No draft options yet. Generate drafts to create 3 reply options
              using this location&apos;s brand voice.
            </div>
          )}
        </div>

        <label className="mt-5 block text-sm font-semibold text-slate-700">
          Edit selected reply
          <textarea
            value={reply}
            onChange={(event) => {
              patchReview({
                editedReply: event.target.value,
                selectedReply: event.target.value,
                status: "edited",
              });
            }}
            rows={7}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-3 text-sm leading-6"
          />
        </label>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => {
              navigator.clipboard?.writeText(reply);
              patchReview({ status: "copied", selectedReply: reply, editedReply: reply });
            }}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-blue-200 hover:text-blue-700"
          >
            <Copy className="size-4" />
            Copy
          </button>
          <button
            onClick={saveReply}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-blue-200 hover:text-blue-700"
          >
            <Save className="size-4" />
            Save
          </button>
          <button
            onClick={() => patchReview({ status: "posted", selectedReply: reply, editedReply: reply })}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            <CheckCircle2 className="size-4" />
            Mark as posted
          </button>
          <button
            onClick={() => patchReview({ status: "archived" })}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-blue-200 hover:text-blue-700"
          >
            <Archive className="size-4" />
            Archive
          </button>
        </div>
      </section>
    </div>
  );
}
