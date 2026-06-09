import { Archive, CheckCircle2, ExternalLink, Search, Sparkles } from "lucide-react";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import {
  getActiveLocations,
  getReviewsForApp,
  reviewStatusLabels,
} from "@/lib/app-data";
import {
  archiveReviewAction,
  generateRepliesAction,
  markPostedAction,
} from "@/lib/review-actions";
import { ReviewStars } from "@/components/review-stars";
import { StatusBadge } from "@/components/status-badge";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function paramValue(params: Record<string, string | string[] | undefined>, key: string) {
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
}

export default async function ReviewInboxPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const admin = await requireAdmin();
  const params = await searchParams;
  const location = paramValue(params, "location") ?? "all";
  const status = paramValue(params, "status") ?? "all";
  const rating = paramValue(params, "rating") ?? "all";
  const sort = (paramValue(params, "sort") ?? "newest") as "newest" | "oldest";
  const query = paramValue(params, "q") ?? "";
  const [locations, reviews] = await Promise.all([
    getActiveLocations(admin),
    getReviewsForApp({ admin, locationId: location, status, rating, sort, query }),
  ]);
  const awaiting = reviews.filter((review) =>
    ["new", "draft_ready", "edited", "copied"].includes(review.status),
  ).length;

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-4">
        <Metric label="Reviews" value={reviews.length} />
        <Metric label="Awaiting response" value={awaiting} />
        <Metric
          label="Drafted"
          value={reviews.filter((review) => review.generatedReplies.length).length}
        />
        <Metric
          label="Posted"
          value={reviews.filter((review) => review.status === "posted").length}
        />
      </section>

      <section className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-slate-950">Review Inbox</h2>
            <p className="mt-1 text-sm text-slate-600">
              Google Business Profile integration coming soon. Manual review entry is active now.
            </p>
          </div>
          <Link
            href="/app/generate"
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:border-blue-200 hover:text-blue-700"
          >
            Add review manually
          </Link>
        </div>

        <form className="mt-5 grid gap-3 lg:grid-cols-[1.1fr_0.8fr_0.7fr_0.7fr_1fr_auto]">
          <label className="text-sm font-semibold text-slate-700">
            Business/location
            <select
              name="location"
              defaultValue={location}
              className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
            >
              <option value="all">All locations</option>
              {locations.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.businessName} — {item.city}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-semibold text-slate-700">
            Status
            <select
              name="status"
              defaultValue={status}
              className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
            >
              <option value="all">All statuses</option>
              {["new", "draft_ready", "edited", "copied", "posted", "archived"].map((item) => (
                <option key={item} value={item}>
                  {reviewStatusLabels[item]}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-semibold text-slate-700">
            Rating
            <select
              name="rating"
              defaultValue={rating}
              className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
            >
              <option value="all">All ratings</option>
              {[5, 4, 3, 2, 1].map((item) => (
                <option key={item} value={item}>
                  {item} star
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-semibold text-slate-700">
            Sort
            <select
              name="sort"
              defaultValue={sort}
              className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
          </label>
          <label className="text-sm font-semibold text-slate-700">
            Search
            <span className="relative mt-2 block">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input
                name="q"
                defaultValue={query}
                placeholder="Customer, review or location"
                className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm"
              />
            </span>
          </label>
          <div className="flex items-end">
            <button className="w-full rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
              Filter
            </button>
          </div>
        </form>

        <div className="mt-5 overflow-hidden rounded-lg border border-slate-200">
          <div className="hidden grid-cols-[1fr_0.8fr_0.65fr_0.7fr_1.15fr_0.8fr] gap-4 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 lg:grid">
            <span>Customer</span>
            <span>Business</span>
            <span>Received</span>
            <span>Status</span>
            <span>Reply preview</span>
            <span>Actions</span>
          </div>
          <div className="divide-y divide-slate-200">
            {reviews.map((review) => {
              const reply =
                review.editedReply ??
                review.generatedReplies.find((item) => item.selected)?.body ??
                review.generatedReplies[0]?.body;

              return (
                <article
                  key={review.id}
                  className="grid gap-4 p-4 lg:grid-cols-[1fr_0.8fr_0.65fr_0.7fr_1.15fr_0.8fr] lg:items-center"
                >
                  <div>
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold text-slate-950">
                        {review.customerName ?? "Google reviewer"}
                      </p>
                      <ReviewStars rating={review.starRating} />
                    </div>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
                      {review.reviewText}
                    </p>
                    <p className="mt-2 text-xs font-medium text-slate-500">
                      Source: {review.source}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-slate-700">
                    <span className="block">{review.location.businessName}</span>
                    <span className="block text-xs text-slate-500">
                      {review.location.city}
                    </span>
                  </p>
                  <p className="text-sm text-slate-600">
                    {review.receivedAt.toLocaleDateString("en-GB")}
                  </p>
                  <StatusBadge status={review.status as never} />
                  <p className="line-clamp-3 text-sm leading-6 text-slate-600">
                    {reply ?? "No reply generated yet."}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/app/reviews/${review.id}`}
                      className="inline-flex size-9 items-center justify-center rounded-lg border border-slate-200 text-slate-700 hover:border-blue-200 hover:text-blue-700"
                      title="Open review"
                    >
                      <ExternalLink className="size-4" />
                    </Link>
                    <form action={generateRepliesAction}>
                      <input type="hidden" name="reviewId" value={review.id} />
                      <button
                        className="inline-flex size-9 items-center justify-center rounded-lg border border-slate-200 text-slate-700 hover:border-blue-200 hover:text-blue-700"
                        title="Generate replies"
                      >
                        <Sparkles className="size-4" />
                      </button>
                    </form>
                    <form action={markPostedAction}>
                      <input type="hidden" name="reviewId" value={review.id} />
                      <button
                        className="inline-flex size-9 items-center justify-center rounded-lg border border-slate-200 text-slate-700 hover:border-blue-200 hover:text-blue-700"
                        title="Mark as posted"
                      >
                        <CheckCircle2 className="size-4" />
                      </button>
                    </form>
                    <form action={archiveReviewAction}>
                      <input type="hidden" name="reviewId" value={review.id} />
                      <button
                        className="inline-flex size-9 items-center justify-center rounded-lg border border-slate-200 text-slate-700 hover:border-blue-200 hover:text-blue-700"
                        title="Archive"
                      >
                        <Archive className="size-4" />
                      </button>
                    </form>
                  </div>
                </article>
              );
            })}
            {!reviews.length ? (
              <div className="p-8 text-center text-sm text-slate-600">
                No reviews match those filters.
              </div>
            ) : null}
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
