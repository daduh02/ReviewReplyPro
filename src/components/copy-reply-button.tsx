"use client";

import { Copy } from "lucide-react";
import { useTransition } from "react";
import { markCopiedAction } from "@/lib/review-actions";

export function CopyReplyButton({
  reviewId,
  body,
  label = "Copy",
}: {
  reviewId: string;
  body: string;
  label?: string;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      onClick={() => {
        void navigator.clipboard?.writeText(body);
        const formData = new FormData();
        formData.set("reviewId", reviewId);
        startTransition(() => {
          void markCopiedAction(formData);
        });
      }}
      className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-blue-200 hover:text-blue-700"
    >
      <Copy className="size-4" />
      {isPending ? "Copied" : label}
    </button>
  );
}
