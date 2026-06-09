import { ShieldX } from "lucide-react";
import Link from "next/link";
import { MarketingNav } from "@/components/marketing-nav";

export default function AdminBlockedPage() {
  return (
    <>
      <MarketingNav />
      <main className="mx-auto flex min-h-[calc(100vh-73px)] max-w-7xl items-center px-4 py-12 sm:px-6 lg:px-8">
        <section className="mx-auto w-full max-w-md rounded-lg bg-white p-6 text-center shadow-sm ring-1 ring-slate-200">
          <div className="mx-auto flex size-12 items-center justify-center rounded-lg bg-red-50 text-red-600">
            <ShieldX className="size-6" />
          </div>
          <h1 className="mt-5 text-2xl font-semibold text-slate-950">
            You do not have access to ReviewReply Pro admin.
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Ask a Super Admin to add your Google account before signing in.
          </p>
          <Link
            href="/admin/login"
            className="mt-6 inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Try another Google account
          </Link>
        </section>
      </main>
    </>
  );
}
