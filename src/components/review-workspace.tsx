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
import { buildMockReplies } from "@/lib/providers/ai";
import type { ReplyLength, Review, ReviewStatus, Tone } from "@/lib/types";
import { ReviewStars } from "@/components/review-stars";
import { StatusBadge } from "@/components/status-badge";

const statuses: ReviewStatus[] = [
  "New",
  "Draft ready",
  "Edited",
  "Copied",
  "Posted",
  "Archived",
];

export function ReviewInbox({ reviews }: { reviews: Review[] }) {
  const [items, setItems] = useState(reviews);
  const [filter, setFilter] = useState<ReviewStatus | "All">("All");

  const visibleReviews = useMemo(
    () => items.filter((review) => filter === "All" || review.status === filter),
    [filter, items],
  );

  function updateStatus(id: string, status: ReviewStatus) {
    setItems((current) =>
      current.map((review) => (review.id === id ? { ...review, status } : review)),
    );
  }

  function generateDrafts(id: string) {
    setItems((current) =>
      current.map((review) =>
        review.id === id
          ? {
              ...review,
              status: "Draft ready",
              draftReplies: buildMockReplies({
                reviewText: review.reviewText,
                starRating: review.rating,
                customerName: review.customerName,
                businessName: review.businessName,
                businessType: review.businessType,
                location: review.location,
                tone: "Professional",
                replyLength: "Standard",
              }),
            }
          : review,
      ),
    );
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-4">
        {[
          ["Reviews imported", items.length],
          ["Drafts ready", items.filter((item) => item.status === "Draft ready").length],
          ["Copied", items.filter((item) => item.status === "Copied").length],
          ["Posted", items.filter((item) => item.status === "Posted").length],
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
              Mock Google reviews are imported here and prepared as reply drafts.
            </p>
          </div>
          <Link
            href="/app/generate"
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:border-blue-200 hover:text-blue-700"
          >
            Add review manually
          </Link>
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
              {status}
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
                  <span className="block text-xs text-slate-500">{review.location}</span>
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
                    onClick={() => generateDrafts(review.id)}
                    className="inline-flex size-9 items-center justify-center rounded-lg border border-slate-200 text-slate-700 hover:border-blue-200 hover:text-blue-700"
                    title="Generate drafts"
                  >
                    <Sparkles className="size-4" />
                  </button>
                  <button
                    onClick={() => updateStatus(review.id, "Edited")}
                    className="inline-flex size-9 items-center justify-center rounded-lg border border-slate-200 text-slate-700 hover:border-blue-200 hover:text-blue-700"
                    title="Edit reply"
                  >
                    <Edit3 className="size-4" />
                  </button>
                  <button
                    onClick={() => updateStatus(review.id, "Copied")}
                    className="inline-flex size-9 items-center justify-center rounded-lg border border-slate-200 text-slate-700 hover:border-blue-200 hover:text-blue-700"
                    title="Copy reply"
                  >
                    <Copy className="size-4" />
                  </button>
                  <button
                    onClick={() => updateStatus(review.id, "Posted")}
                    className="inline-flex size-9 items-center justify-center rounded-lg border border-slate-200 text-slate-700 hover:border-blue-200 hover:text-blue-700"
                    title="Mark as posted"
                  >
                    <CheckCircle2 className="size-4" />
                  </button>
                  <button
                    onClick={() => updateStatus(review.id, "Archived")}
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

export function ReviewDetail({ review }: { review: Review }) {
  const [tone, setTone] = useState<Tone>("Professional");
  const [length, setLength] = useState<ReplyLength>("Standard");
  const [options, setOptions] = useState(review.draftReplies);
  const [selected, setSelected] = useState(0);
  const [reply, setReply] = useState(review.draftReplies[0] ?? "");
  const [status, setStatus] = useState<ReviewStatus>(review.status);

  function regenerate() {
    const next = buildMockReplies({
      reviewText: review.reviewText,
      starRating: review.rating,
      customerName: review.customerName,
      businessName: review.businessName,
      businessType: review.businessType,
      location: review.location,
      tone,
      replyLength: length,
    });
    setOptions(next);
    setSelected(0);
    setReply(next[0]);
    setStatus("Draft ready");
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <section className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-blue-700">{review.source} review</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950">
              {review.customerName}
            </h2>
          </div>
          <StatusBadge status={status} />
        </div>
        <div className="mt-4 flex items-center gap-3">
          <ReviewStars rating={review.rating} />
          <span className="text-sm text-slate-500">{review.dateReceived}</span>
        </div>
        <p className="mt-5 rounded-lg bg-slate-50 p-4 text-sm leading-7 text-slate-700">
          {review.reviewText}
        </p>
        <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="font-semibold text-slate-950">Business/location</dt>
            <dd className="mt-1 text-slate-600">
              {review.businessName}, {review.location}
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-950">Business type</dt>
            <dd className="mt-1 text-slate-600">{review.businessType}</dd>
          </div>
        </dl>
      </section>

      <section className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-slate-950">Draft reply options</h2>
            <p className="mt-1 text-sm text-slate-600">
              Complaint replies stay calm, non-defensive, and avoid legal admissions.
            </p>
          </div>
          <button
            onClick={regenerate}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <Sparkles className="size-4" />
            Generate drafts
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
          {options.map((option, index) => (
            <button
              key={option}
              onClick={() => {
                setSelected(index);
                setReply(option);
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
          ))}
        </div>

        <label className="mt-5 block text-sm font-semibold text-slate-700">
          Edit selected reply
          <textarea
            value={reply}
            onChange={(event) => {
              setReply(event.target.value);
              setStatus("Edited");
            }}
            rows={7}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-3 text-sm leading-6"
          />
        </label>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => setStatus("Copied")}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-blue-200 hover:text-blue-700"
          >
            <Copy className="size-4" />
            Copy
          </button>
          <button
            onClick={() => setStatus("Edited")}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-blue-200 hover:text-blue-700"
          >
            <Save className="size-4" />
            Save
          </button>
          <button
            onClick={() => setStatus("Posted")}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            <CheckCircle2 className="size-4" />
            Mark as posted
          </button>
        </div>
      </section>
    </div>
  );
}
