import type { ReviewStatus } from "@/lib/types";

const styles: Record<ReviewStatus, string> = {
  New: "bg-slate-100 text-slate-700 ring-slate-200",
  "Draft ready": "bg-blue-50 text-blue-700 ring-blue-200",
  Edited: "bg-violet-50 text-violet-700 ring-violet-200",
  Copied: "bg-amber-50 text-amber-700 ring-amber-200",
  Posted: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Archived: "bg-zinc-100 text-zinc-600 ring-zinc-200",
};

export function StatusBadge({ status }: { status: ReviewStatus }) {
  return (
    <span
      className={`inline-flex w-fit items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${styles[status]}`}
    >
      {status}
    </span>
  );
}
