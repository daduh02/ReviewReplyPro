"use client";

import { CheckCircle2, Download, Link2, Mail, RotateCcw } from "lucide-react";
import { useState } from "react";
import { mockLocations } from "@/lib/demo-data";

export function IntegrationsPanel() {
  const [connected, setConnected] = useState(true);
  const [lastSync, setLastSync] = useState("9 June 2026, 12:15");

  return (
    <div className="space-y-6">
      <section className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-blue-700">Google Business Profile</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950">
              Mock connection ready
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Use the Google account that manages your verified Google Business
              Profile. We will never ask for your Google password.
            </p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-200">
            <CheckCircle2 className="size-4" />
            {connected ? "Connected" : "Disconnected"}
          </span>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <button
            onClick={() => setConnected(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <Link2 className="size-4" />
            Connect Google Business Profile
          </button>
          <button
            onClick={() => setLastSync("Just now")}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-blue-200 hover:text-blue-700"
          >
            <Download className="size-4" />
            Import latest reviews
          </button>
          <button
            onClick={() => setConnected(false)}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-blue-200 hover:text-blue-700"
          >
            <RotateCcw className="size-4" />
            Disconnect mock
          </button>
        </div>
        <p className="mt-4 text-sm text-slate-600">Last sync: {lastSync}</p>
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
            Use manual review entry as a fallback when a review is not available
            through a connected source.
          </p>
        </div>
      </section>
    </div>
  );
}
