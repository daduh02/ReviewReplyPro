import { Copy } from "lucide-react";
import { requireAdmin } from "@/lib/admin-auth";
import { workspaceScopeForAdmin } from "@/lib/app-data";
import { getDb } from "@/lib/db";
import { CopyReplyButton } from "@/components/copy-reply-button";

export default async function SavedRepliesPage() {
  const admin = await requireAdmin();
  const replies = await getDb().savedReply.findMany({
    where: {
      archived: false,
      workspace: workspaceScopeForAdmin(admin),
    },
    include: {
      review: {
        include: {
          location: {
            include: { workspace: true },
          },
        },
      },
      workspace: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <section className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-slate-950">Saved Replies</h2>
          <p className="mt-2 text-sm text-slate-600">
            Reusable replies saved from real pilot workflows.
          </p>
        </div>
      </div>
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {replies.map((reply) => (
          <article key={reply.id} className="rounded-lg border border-slate-200 p-4">
            <p className="text-sm font-semibold text-slate-950">
              {reply.review?.location.businessName ?? reply.workspace.name}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              {reply.review?.location.city ?? "Workspace reply"}
            </p>
            {reply.review ? (
              <p className="mt-3 line-clamp-2 text-sm text-slate-500">
                Review: {reply.review.reviewText}
              </p>
            ) : null}
            <p className="mt-3 text-sm leading-6 text-slate-800">{reply.body}</p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
              <span className="rounded-full bg-blue-50 px-2.5 py-1 text-blue-700">
                {reply.tone}
              </span>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-700">
                {reply.category}
              </span>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-700">
                Saved {reply.createdAt.toLocaleDateString("en-GB")}
              </span>
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700">
                Used {reply.usageCount} times
              </span>
            </div>
            <div className="mt-4 flex gap-2">
              {reply.reviewId ? (
                <CopyReplyButton reviewId={reply.reviewId} body={reply.body} />
              ) : (
                <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">
                  <Copy className="size-4" />
                  Copy
                </button>
              )}
            </div>
          </article>
        ))}
        {!replies.length ? (
          <div className="rounded-lg border border-dashed border-slate-200 p-6 text-sm text-slate-600">
            No saved replies yet. Save a reply from a review detail page to build
            this library.
          </div>
        ) : null}
      </div>
    </section>
  );
}
