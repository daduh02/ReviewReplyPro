"use client";

import { Archive, Copy, Edit3, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { usePilotStore } from "@/lib/pilot-store";

const filters = ["All", "Positive", "Negative", "Complaints", "5-Star"];

export function SavedRepliesBoard() {
  const store = usePilotStore();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");

  const replies = useMemo(
    () =>
      store.savedReplies.filter((reply) => {
        const matchesSearch =
          reply.replyPreview.toLowerCase().includes(query.toLowerCase()) ||
          reply.originalReviewSnippet.toLowerCase().includes(query.toLowerCase());
        const matchesFilter =
          filter === "All" ||
          reply.sentiment === filter ||
          (filter === "Negative" && reply.sentiment === "Complaint") ||
          (filter === "Complaints" && reply.sentiment === "Complaint") ||
          (filter === "5-Star" &&
            /(excellent|professional|fresh|recommend)/i.test(
              reply.originalReviewSnippet,
            ));
        return matchesSearch && matchesFilter;
      }),
    [filter, query, store.savedReplies],
  );

  return (
    <section className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-slate-950">Saved Replies</h2>
          <p className="mt-2 text-sm text-slate-600">
            Reuse strong replies across similar UK review situations.
          </p>
        </div>
        <label className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search saved replies"
            className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm"
          />
        </label>
      </div>
      <div className="mt-5 flex gap-2 overflow-x-auto pb-2">
        {filters.map((item) => (
          <button
            key={item}
            onClick={() => setFilter(item)}
            className={`rounded-full px-3 py-1.5 text-sm font-semibold ${
              filter === item
                ? "bg-blue-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {replies.map((reply) => (
          <article key={reply.id} className="rounded-lg border border-slate-200 p-4">
            <p className="line-clamp-2 text-sm text-slate-500">
              Review: {reply.originalReviewSnippet}
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-800">
              {reply.replyPreview}
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
              <span className="rounded-full bg-blue-50 px-2.5 py-1 text-blue-700">
                {reply.tone}
              </span>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-700">
                {reply.businessType}
              </span>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-700">
                Saved {reply.dateSaved}
              </span>
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700">
                Used {reply.usageCount} times
              </span>
            </div>
            <div className="mt-4 flex gap-2">
              {[Copy, Edit3, Archive].map((Icon, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (Icon === Copy) {
                      navigator.clipboard?.writeText(reply.replyPreview);
                    }
                  }}
                  className="inline-flex size-9 items-center justify-center rounded-lg border border-slate-200 text-slate-700 hover:border-blue-200 hover:text-blue-700"
                >
                  <Icon className="size-4" />
                </button>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
