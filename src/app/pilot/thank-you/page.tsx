import Link from "next/link";
import { MarketingNav } from "@/components/marketing-nav";

export default function PilotThankYouPage() {
  return (
    <>
      <MarketingNav />
      <main className="flex min-h-[calc(100vh-73px)] items-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
        <section className="mx-auto max-w-xl rounded-lg bg-white p-6 text-center shadow-sm ring-1 ring-slate-200">
          <h1 className="text-2xl font-semibold text-slate-950">
            Thank you for your interest.
          </h1>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            ReviewReply Pro is currently accepting a limited number of UK pilot
            businesses. We will contact you shortly.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Back to homepage
          </Link>
        </section>
      </main>
    </>
  );
}
