import { ReviewInbox } from "@/components/review-workspace";
import { demoReviews } from "@/lib/demo-data";

export default function ReviewInboxPage() {
  return <ReviewInbox reviews={demoReviews} />;
}
