import {
  Archive,
  CheckCircle2,
  Save,
  Sparkles,
} from "lucide-react";
import { notFound } from "next/navigation";
import { getReviewForApp, toBrandVoiceInput } from "@/lib/app-data";
import {
  archiveReviewAction,
  editReplyAction,
  generateRepliesAction,
  markPostedAction,
  saveReplyAction,
  selectReplyAction,
} from "@/lib/review-actions";
import { CopyReplyButton } from "@/components/copy-reply-button";
import { ReviewStars } from "@/components/review-stars";
import { StatusBadge } from "@/components/status-badge";

export default async function ReviewDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const review = await getReviewForApp(id);

  if (!review) {
    notFound();
  }

  const brandVoice = toBrandVoiceInput(review.location);
  const selected =
    review.generatedReplies.find((reply) => reply.id === review.selectedReplyId) ??
    review.generatedReplies.find((reply) => reply.selected) ??
    review.generatedReplies[0];
  const replyBody = review.editedReply ?? selected?.body ?? "";

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <section className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-blue-700">{review.source} review</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950">
              {review.customerName ?? "Google reviewer"}
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {review.location.workspace.plan === "Free for Life" ? <FreeForLifeBadge /> : null}
            {review.location.workspace.accountType === "pilot" ? <PilotBadge /> : null}
            <StatusBadge status={review.status as never} />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <ReviewStars rating={review.starRating} />
          <span className="text-sm text-slate-500">
            {review.receivedAt.toLocaleDateString("en-GB")}
          </span>
        </div>
        <p className="mt-5 rounded-lg bg-slate-50 p-4 text-sm leading-7 text-slate-700">
          {review.reviewText}
        </p>
        <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
          <Info label="Business" value={review.location.businessName} />
          <Info label="Location" value={review.location.city} />
          <Info label="Business type" value={review.location.businessType} />
          <Info
            label="Google profile"
            value={
              review.location.googleRating
                ? `Google ${review.location.googleRating.toFixed(1)} from ${review.location.googleReviewCount} reviews`
                : "Google Business Profile integration coming soon"
            }
          />
          <Info
            label="Connection"
            value="Google Business Profile integration coming soon"
          />
          <Info
            label="Last action"
            value={review.actionedByEmail ?? "No user action yet"}
          />
          <Info
            label="Copied"
            value={review.copiedAt ? review.copiedAt.toLocaleString("en-GB") : "Not copied"}
          />
          <Info
            label="Posted"
            value={review.postedAt ? review.postedAt.toLocaleString("en-GB") : "Not posted"}
          />
        </dl>
      </section>

      <section className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-slate-950">
              Reply options
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Uses this location&apos;s brand voice and UK English rules.
            </p>
          </div>
          <form action={generateRepliesAction} className="flex flex-wrap gap-2">
            <input type="hidden" name="reviewId" value={review.id} />
            <select
              name="tone"
              defaultValue={brandVoice.preferredTone}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
            >
              {["Friendly", "Professional", "Empathetic", "Short & Simple"].map((tone) => (
                <option key={tone}>{tone}</option>
              ))}
            </select>
            <select
              name="replyLength"
              defaultValue={brandVoice.defaultLength}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
            >
              {["Short", "Standard", "Detailed"].map((length) => (
                <option key={length}>{length}</option>
              ))}
            </select>
            <button className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
              <Sparkles className="size-4" />
              Generate 3 replies
            </button>
          </form>
        </div>

        <div className="mt-5 grid gap-3">
          {review.generatedReplies.map((reply) => (
            <form key={reply.id} action={selectReplyAction}>
              <input type="hidden" name="reviewId" value={review.id} />
              <input type="hidden" name="replyId" value={reply.id} />
              <button
                className={`w-full rounded-lg border p-4 text-left text-sm leading-6 ${
                  reply.id === selected?.id
                    ? "border-blue-300 bg-blue-50 text-blue-950"
                    : "border-slate-200 bg-white text-slate-700 hover:border-blue-200"
                }`}
              >
                <span className="mb-2 block text-xs font-semibold uppercase tracking-wide">
                  Option {reply.variant}
                </span>
                {reply.body}
              </button>
            </form>
          ))}
          {!review.generatedReplies.length ? (
            <div className="rounded-lg border border-dashed border-slate-200 p-4 text-sm leading-6 text-slate-600">
              No reply options yet. Generate three replies to start the workflow.
            </div>
          ) : null}
        </div>

        <form action={editReplyAction} className="mt-5">
          <input type="hidden" name="reviewId" value={review.id} />
          <label className="block text-sm font-semibold text-slate-700">
            Edit selected reply
            <textarea
              name="editedReply"
              defaultValue={replyBody}
              rows={7}
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-3 text-sm leading-6"
            />
          </label>
          <div className="mt-4 flex flex-wrap gap-2">
            <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-blue-200 hover:text-blue-700">
              <Save className="size-4" />
              Save edit
            </button>
          </div>
        </form>

        <div className="mt-4 flex flex-wrap gap-2">
          <CopyReplyButton reviewId={review.id} body={replyBody} />
          <form action={saveReplyAction}>
            <input type="hidden" name="reviewId" value={review.id} />
            <input type="hidden" name="body" value={replyBody} />
            <input type="hidden" name="tone" value={brandVoice.preferredTone} />
            <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-blue-200 hover:text-blue-700">
              <Save className="size-4" />
              Save reply
            </button>
          </form>
          <form action={markPostedAction}>
            <input type="hidden" name="reviewId" value={review.id} />
            <button className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
              <CheckCircle2 className="size-4" />
              Mark as posted
            </button>
          </form>
          <form action={archiveReviewAction}>
            <input type="hidden" name="reviewId" value={review.id} />
            <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-blue-200 hover:text-blue-700">
              <Archive className="size-4" />
              Archive
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-semibold text-slate-950">{label}</dt>
      <dd className="mt-1 text-slate-600">{value}</dd>
    </div>
  );
}

function PilotBadge() {
  return (
    <span className="inline-flex w-fit rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-200">
      Pilot Customer
    </span>
  );
}

function FreeForLifeBadge() {
  return (
    <span className="inline-flex w-fit rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
      Free for Life
    </span>
  );
}
