import Link from "next/link";
import { MarketingNav } from "@/components/marketing-nav";
import { plans } from "@/lib/billing";

export default function PricingPage() {
  return (
    <>
      <MarketingNav />
      <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-semibold text-slate-950">Simple UK pricing</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
          Start manually, then upgrade when the Review Inbox and mock Google sync
          become part of your weekly workflow.
        </p>
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {plans.map((plan) => (
            <article key={plan.id} className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h2 className="text-xl font-semibold text-slate-950">{plan.name}</h2>
              <p className="mt-3 text-4xl font-semibold text-slate-950">{plan.price}</p>
              <p className="mt-4 text-sm leading-6 text-slate-600">{plan.description}</p>
              <ul className="mt-5 space-y-2 text-sm text-slate-600">
                {plan.features.map((feature) => (
                  <li key={feature}>- {feature}</li>
                ))}
              </ul>
              <Link href="/app/reviews" className="mt-6 inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
                Choose {plan.name}
              </Link>
            </article>
          ))}
        </div>
      </main>
    </>
  );
}
