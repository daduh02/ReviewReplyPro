import { ArrowRight, CheckCircle2, Inbox, Sparkles } from "lucide-react";
import Link from "next/link";
import { MarketingNav } from "@/components/marketing-nav";
import { ReviewStars } from "@/components/review-stars";
import { demoReviews } from "@/lib/demo-data";
import { plans } from "@/lib/billing";

const businessTypes = [
  "Salons",
  "Barbers",
  "Dentists",
  "Restaurants",
  "Takeaways",
  "Garages",
  "Trades",
  "Estate agents",
  "Small local service businesses",
];

export default function Home() {
  const fiveStar = demoReviews[0];
  const complaint = demoReviews[1];

  return (
    <>
      <MarketingNav />
      <main>
        <section className="bg-white">
          <div className="mx-auto grid min-h-[calc(100vh-73px)] max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_0.95fr] lg:px-8 lg:py-18">
            <div className="flex flex-col justify-center">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">
                UK review inbox for local businesses
              </p>
              <h1 className="mt-5 max-w-4xl text-5xl font-semibold leading-tight text-slate-950 sm:text-6xl">
                Your Google review replies, drafted before you log in.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                ReviewReply Pro helps UK local businesses prepare professional,
                on-brand replies to customer reviews in seconds.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/app/reviews"
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
                >
                  Start free
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  href="/demo"
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:border-blue-200 hover:text-blue-700"
                >
                  View demo
                </Link>
              </div>
            </div>
            <div className="self-end rounded-lg border border-slate-200 bg-slate-50 p-4 shadow-xl">
              <div className="rounded-lg bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-950">Review Inbox</p>
                    <p className="text-xs text-slate-500">Mock Google sync active</p>
                  </div>
                  <Inbox className="size-5 text-blue-600" />
                </div>
                <div className="mt-4 space-y-3">
                  {demoReviews.slice(0, 3).map((review) => (
                    <div key={review.id} className="rounded-lg border border-slate-200 p-3">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-slate-950">
                          {review.customerName}
                        </p>
                        <ReviewStars rating={review.rating} />
                      </div>
                      <p className="mt-2 line-clamp-2 text-sm text-slate-600">
                        {review.reviewText}
                      </p>
                      <p className="mt-2 rounded-md bg-blue-50 p-2 text-xs leading-5 text-blue-950">
                        {review.draftReplies[0]}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <Section title="How it works">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              ["Connect", "Simulate Google Business Profile sync locally."],
              ["Draft", "Generate 3 British English reply options per review."],
              ["Post", "Edit, copy, save, and mark replies as posted."],
            ].map(([title, body]) => (
              <div key={title} className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
                <CheckCircle2 className="size-5 text-blue-600" />
                <h3 className="mt-4 font-semibold text-slate-950">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Review inbox preview">
          <div className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <div className="grid gap-4 md:grid-cols-2">
              {demoReviews.slice(0, 4).map((review) => (
                <div key={review.id} className="rounded-lg border border-slate-200 p-4">
                  <p className="font-semibold text-slate-950">{review.businessName}</p>
                  <p className="mt-2 text-sm text-slate-600">{review.reviewText}</p>
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Section title="5-star review reply example">
          <Example review={fiveStar.reviewText} reply={fiveStar.draftReplies[0]} />
        </Section>

        <Section title="1-star complaint reply example">
          <Example review={complaint.reviewText} reply={complaint.draftReplies[0]} />
        </Section>

        <Section title="Business types">
          <div className="flex flex-wrap gap-2">
            {businessTypes.map((type) => (
              <span key={type} className="rounded-full bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200">
                {type}
              </span>
            ))}
          </div>
        </Section>

        <Section title="Pricing teaser">
          <div className="grid gap-4 md:grid-cols-3">
            {plans.map((plan) => (
              <div key={plan.id} className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
                <h3 className="font-semibold text-slate-950">{plan.name}</h3>
                <p className="mt-2 text-3xl font-semibold text-slate-950">{plan.price}</p>
                <p className="mt-3 text-sm leading-6 text-slate-600">{plan.description}</p>
              </div>
            ))}
          </div>
        </Section>

        <section className="bg-blue-600 px-4 py-16 text-white sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6">
            <div>
              <Sparkles className="size-8" />
              <h2 className="mt-4 text-3xl font-semibold">Draft replies before the next busy shift.</h2>
              <p className="mt-3 max-w-2xl text-blue-50">
                Start with the mock inbox today, then connect real Google, Stripe,
                and OpenAI providers when the MVP is ready to grow.
              </p>
            </div>
            <Link href="/app/reviews" className="rounded-lg bg-white px-5 py-3 text-sm font-semibold text-blue-700">
              Start free
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-2xl font-semibold text-slate-950">{title}</h2>
        <div className="mt-5">{children}</div>
      </div>
    </section>
  );
}

function Example({ review, reply }: { review: string; reply: string }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <p className="text-sm font-semibold text-slate-500">Customer review</p>
        <p className="mt-3 text-slate-700">{review}</p>
      </div>
      <div className="rounded-lg bg-blue-50 p-5 ring-1 ring-blue-100">
        <p className="text-sm font-semibold text-blue-700">Draft reply</p>
        <p className="mt-3 text-blue-950">{reply}</p>
      </div>
    </div>
  );
}
