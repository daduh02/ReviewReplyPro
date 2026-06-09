import type { ReviewStatus } from "@/lib/types";

const styles: Record<ReviewStatus, string> = {
  new: "bg-slate-100 text-slate-700 ring-slate-200",
  draft_ready: "bg-blue-50 text-blue-700 ring-blue-200",
  edited: "bg-violet-50 text-violet-700 ring-violet-200",
  copied: "bg-amber-50 text-amber-700 ring-amber-200",
  posted: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  archived: "bg-zinc-100 text-zinc-600 ring-zinc-200",
};

const labels: Record<ReviewStatus, string> = {
  new: "New",
  draft_ready: "Draft ready",
  edited: "Edited",
  copied: "Copied",
  posted: "Posted",
  archived: "Archived",
};

export function StatusBadge({ status }: { status: ReviewStatus }) {
  return (
    <span
      className={`inline-flex w-fit items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}
