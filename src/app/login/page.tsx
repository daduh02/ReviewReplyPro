import Link from "next/link";
import { MarketingNav } from "@/components/marketing-nav";

export default function LoginPage() {
  return (
    <>
      <MarketingNav />
      <main className="mx-auto flex min-h-[calc(100vh-73px)] max-w-7xl items-center px-4 py-12 sm:px-6 lg:px-8">
        <section className="mx-auto w-full max-w-md rounded-lg bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm font-semibold text-blue-700">Mock authentication</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-950">
            Sign up or log in
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Authentication is scaffolded for the MVP. Continue into the demo
            workspace using fictional demo examples only.
          </p>
          <div className="mt-5 space-y-4">
            <input className="w-full rounded-lg border border-slate-200 px-3 py-2" placeholder="you@example.co.uk" />
            <input className="w-full rounded-lg border border-slate-200 px-3 py-2" placeholder="Password" type="password" />
            <Link href="/app/reviews" className="block rounded-lg bg-blue-600 px-4 py-2 text-center text-sm font-semibold text-white">
              Continue to Review Inbox
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
