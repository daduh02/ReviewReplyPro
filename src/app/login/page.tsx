import Link from "next/link";
import { MarketingNav } from "@/components/marketing-nav";

export default function LoginPage() {
  return (
    <>
      <MarketingNav />
      <main className="mx-auto flex min-h-[calc(100vh-73px)] max-w-7xl items-center px-4 py-12 sm:px-6 lg:px-8">
        <section className="mx-auto w-full max-w-md rounded-lg bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm font-semibold text-blue-700">Google OAuth login</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-950">
            Sign up or log in
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            ReviewReply Pro uses authorised Google accounts for pilot customer
            and admin access. Sign in to reach your protected dashboard.
          </p>
          <div className="mt-5 space-y-3">
            <a
              href="/api/auth/google/start"
              className="block rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-blue-700"
            >
              Continue with Google
            </a>
            <Link
              href="/pilot"
              className="block rounded-lg border border-slate-200 px-4 py-2.5 text-center text-sm font-semibold text-slate-700 hover:border-blue-200 hover:text-blue-700"
            >
              Join the Pilot Programme
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
