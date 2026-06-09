"use client";

import { Clock3, Mail, MessageSquarePlus, Sparkles } from "lucide-react";
import Link from "next/link";
import { mockLocations } from "@/lib/demo-data";

export function IntegrationsPanel() {
  return (
    <div className="space-y-6">
      <section className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-blue-700">Google Business Profile</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950">
              Google Business Profile connection coming next
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Demo Google-style reviews are available now for fictional example
              businesses. Manual review entry is active now while the real Google
              OAuth flow is built.
            </p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700 ring-1 ring-blue-200">
            <Sparkles className="size-4" />
            Demo Google-style reviews
          </span>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link
            href="/app/generate"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <MessageSquarePlus className="size-4" />
            Manual review entry is active now
          </Link>
          <span
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-blue-200 hover:text-blue-700"
          >
            <Clock3 className="size-4" />
            Google Business Profile connection coming next
          </span>
        </div>
        <p className="mt-4 text-sm text-slate-600">
          Demo Google-style reviews are seeded locally for product testing.
        </p>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {mockLocations.map((location) => (
            <div key={location.id} className="rounded-lg border border-slate-200 p-4">
              <p className="font-semibold text-slate-950">{location.businessName}</p>
              <p className="mt-1 text-sm font-medium text-blue-700">
                {location.location}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">{location.address}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {location.phone}
                {location.website ? ` · ${location.website}` : ""}
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-700">
                Google {location.googleRating?.toFixed(1)} ·{" "}
                {location.googleReviewCount} reviews
                {location.priceRange ? ` · ${location.priceRange}` : ""}
              </p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-blue-700">
                {location.status}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center gap-3">
            <Mail className="size-5 text-blue-600" />
            <h3 className="font-semibold text-slate-950">Email forwarding</h3>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Coming later. Forward review notification emails and ReviewReply Pro
            will prepare draft replies automatically.
          </p>
        </div>
        <div className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <h3 className="font-semibold text-slate-950">Manual entry</h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Manual review entry is active now. Add a review, save it to the
            inbox, generate replies, edit, copy, post, archive, and save useful
            replies for reuse.
          </p>
        </div>
      </section>
    </div>
  );
}
