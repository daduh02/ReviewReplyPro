import { CreditCard, TrendingUp } from "lucide-react";
import { plans } from "@/lib/billing";

export function BillingPanel() {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm font-medium text-slate-500">Current plan</p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">
            Demo Free
          </p>
          <p className="mt-2 text-sm text-slate-600">
            Fictional demo workspace with mocked billing
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
            Demo mode uses fictional businesses and local-safe billing placeholders.
          </p>
        </div>
      </section>
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
