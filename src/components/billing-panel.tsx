"use client";

import { CreditCard, Gift, TrendingUp } from "lucide-react";
import { plans } from "@/lib/billing";
import { usePilotStore } from "@/lib/pilot-store";

export function BillingPanel() {
  const store = usePilotStore();
  const freeForLifeLocations = store.locations.filter(
    (location) => location.plan === "Free for Life",
  );

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm font-medium text-slate-500">Current plan</p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">
            Demo Free
          </p>
          <p className="mt-2 text-sm text-slate-600">
            Demo workspace with active pilot billing records
          </p>
        </div>
        <div className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm font-medium text-slate-500">Usage this month</p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">18 / 100</p>
          <p className="mt-2 text-sm text-slate-600">AI draft replies generated</p>
        </div>
        <div className="rounded-lg bg-blue-600 p-5 text-white shadow-sm">
          <div className="flex items-center gap-2">
            <TrendingUp className="size-5" />
            <p className="font-semibold">Demo billing paused</p>
          </div>
          <p className="mt-3 text-sm leading-6 text-blue-50">
            Free for Life pilot accounts are permanently free and do not require
            Stripe checkout.
          </p>
        </div>
      </section>
      {freeForLifeLocations.length ? (
        <section className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center gap-3">
            <Gift className="size-5 text-emerald-600" />
            <h2 className="text-2xl font-semibold text-slate-950">
              Free for Life pilot accounts
            </h2>
          </div>
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            {freeForLifeLocations.map((location) => (
              <article
                key={location.id}
                className="rounded-lg border border-emerald-200 bg-emerald-50/40 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-slate-950">
                      {location.businessName}
                    </h3>
                    <p className="mt-1 text-sm text-slate-600">
                      {location.location}
                    </p>
                  </div>
                  <span className="inline-flex rounded-full bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white">
                    Free for Life
                  </span>
                </div>
                <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="font-semibold text-slate-950">Billing status</dt>
                    <dd className="text-slate-600">{location.billingStatus}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-slate-950">Pilot status</dt>
                    <dd className="text-slate-600">{location.pilotStatus}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-slate-950">GBP status</dt>
                    <dd className="text-slate-600">
                      {location.gbpConnectionStatus}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-slate-950">Reviews</dt>
                    <dd className="text-slate-600">
                      Google {location.googleRating?.toFixed(1)} ·{" "}
                      {location.googleReviewCount} reviews
                    </dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </section>
      ) : null}
      <section className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold text-slate-950">Billing</h2>
            <p className="mt-2 text-sm text-slate-600">
              Stripe checkout is scaffolded and safely mocked when keys are not set.
            </p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
            <CreditCard className="size-4" />
            Stripe checkout placeholder
          </button>
        </div>
        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="rounded-lg border border-slate-200 p-5 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-slate-950">{plan.name}</h3>
              {plan.id === "free" ? (
                <span className="mt-2 inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
                  Demo: Free
                </span>
              ) : null}
              <p className="mt-2 text-3xl font-semibold text-slate-950">
                {plan.price}
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {plan.description}
              </p>
              <p className="mt-4 text-sm font-semibold text-blue-700">
                {plan.monthlyReplies} replies/month
              </p>
              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                {plan.features.map((feature) => (
                  <li key={feature}>- {feature}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
