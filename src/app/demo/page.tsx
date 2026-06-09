import Link from "next/link";
import { MarketingNav } from "@/components/marketing-nav";
import { ReviewInbox } from "@/components/review-workspace";
import { demoReviews } from "@/lib/demo-data";

export default function DemoPage() {
  return (
    <>
      <MarketingNav />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-semibold text-slate-950">Product demo</h1>
            <p className="mt-3 max-w-2xl text-lg leading-8 text-slate-600">
              A preview of the Review Inbox using demo Google-style reviews
              from fictional UK local businesses.
            </p>
          </div>
          <Link href="/app/reviews" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
            Open app demo
          </Link>
        </div>
        <ReviewInbox reviews={demoReviews} />
      </main>
    </>
  );
}
