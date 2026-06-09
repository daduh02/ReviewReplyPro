import { ShieldCheck } from "lucide-react";
import Link from "next/link";
import { MarketingNav } from "@/components/marketing-nav";

type LoginPageProps = {
  searchParams?: Promise<{ error?: string }>;
};

const errorMessages: Record<string, string> = {
  configuration:
    "Google OAuth is not configured yet. Add the Google client ID and secret, then try again.",
  oauth: "Google sign-in could not be completed. Please try again.",
  profile: "Google did not return an email address for this account.",
};

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const error = params?.error ? errorMessages[params.error] : null;

  return (
    <>
      <MarketingNav />
      <main className="mx-auto flex min-h-[calc(100vh-73px)] max-w-7xl items-center px-4 py-12 sm:px-6 lg:px-8">
        <section className="mx-auto w-full max-w-md rounded-lg bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="flex size-11 items-center justify-center rounded-lg bg-blue-600 text-white">
            <ShieldCheck className="size-5" />
          </div>
          <p className="mt-5 text-sm font-semibold text-blue-700">
            Google admin login
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-950">
            Sign in to admin
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Use an authorised Google account to manage ReviewReply Pro pilot
            businesses, reviews, replies, saved replies, brand voice settings
            and billing controls.
          </p>
          {error ? (
            <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700">
              {error}
            </div>
          ) : null}
          <div className="mt-5 space-y-3">
            <Link
              href="/api/auth/google/start"
              className="block rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-blue-700"
            >
              Continue with Google
            </Link>
            <Link
              href="/"
              className="block rounded-lg border border-slate-200 px-4 py-2.5 text-center text-sm font-semibold text-slate-700 hover:border-blue-200 hover:text-blue-700"
            >
              Back to homepage
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
