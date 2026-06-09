import { notFound } from "next/navigation";
import { ReviewDetail } from "@/components/review-workspace";
import { demoReviews } from "@/lib/demo-data";

export default async function ReviewDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const review = demoReviews.find((item) => item.id === id);

  if (!review) {
    notFound();
  }

  return <ReviewDetail review={review} />;
}
