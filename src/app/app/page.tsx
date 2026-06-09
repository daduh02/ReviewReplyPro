import Link from "next/link";
import { getDashboardStats } from "@/lib/app-data";
import { ReviewStars } from "@/components/review-stars";

export default async function AppHomePage() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-4">
        <Metric label="Total reviews" value={stats.totalReviews} />
        <Metric label="Awaiting response" value={stats.awaitingResponse} />
        <Metric label="Responded to" value={stats.respondedTo} />
        <Metric label="Average rating" value={stats.averageRating.toFixed(1)} />
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-slate-950">Recent reviews</h2>
            <Link href="/app/reviews" className="text-sm font-semibold text-blue-700">
              View inbox
            </Link>
          </div>
          <div className="mt-5 divide-y divide-slate-200">
            {stats.recentReviews.map((review) => (
              <Link
                key={review.id}
                href={`/app/reviews/${review.id}`}
                className="block py-4 hover:bg-slate-50"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-slate-950">
                    {review.customerName ?? "Google reviewer"}
                  </p>
                  <ReviewStars rating={review.starRating} />
                </div>
                <p className="mt-1 text-sm text-slate-500">
                  {review.location.businessName} — {review.location.city}
                </p>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
                  {review.reviewText}
                </p>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-xl font-semibold text-slate-950">
            Recent generated replies
          </h2>
          <div className="mt-5 divide-y divide-slate-200">
            {stats.recentGeneratedReplies.map((reply) => (
              <Link
                key={reply.id}
                href={`/app/reviews/${reply.reviewId}`}
                className="block py-4 hover:bg-slate-50"
              >
                <p className="text-sm font-semibold text-slate-950">
                  {reply.review.location.businessName} — {reply.review.location.city}
                </p>
                <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">
                  {reply.body}
                </p>
                <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-blue-700">
                  {reply.tone} · {reply.createdAt.toLocaleDateString("en-GB")}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-slate-950">{value}</p>
    </div>
  );
}
