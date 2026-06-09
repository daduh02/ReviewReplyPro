import {
  CreditCard,
  FileText,
  Inbox,
  Link2,
  MessageSquarePlus,
  Settings,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import type { getCurrentAdmin } from "@/lib/admin-auth";

const appLinks = [
  { href: "/app/reviews", label: "Review Inbox", mobileLabel: "Inbox", icon: Inbox },
  {
    href: "/app/generate",
    label: "Generate Reply",
    mobileLabel: "Generate",
    icon: MessageSquarePlus,
  },
  {
    href: "/app/saved-replies",
    label: "Saved Replies",
    mobileLabel: "Saved",
    icon: FileText,
  },
  { href: "/app/brand-voice", label: "Brand Voice", icon: SlidersHorizontal },
  { href: "/app/integrations", label: "Integrations", icon: Link2 },
  { href: "/app/settings", label: "Settings", icon: Settings },
  { href: "/app/billing", label: "Billing", icon: CreditCard },
];

export function AppShell({
  admin,
  children,
}: {
  admin: NonNullable<Awaited<ReturnType<typeof getCurrentAdmin>>>;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-100">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-72 border-r border-slate-200 bg-white p-5 lg:block">
        <Link href="/" className="flex items-center gap-3 font-semibold">
          <span className="flex size-10 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
            RR
          </span>
          <span>ReviewReply Pro</span>
        </Link>
        <div className="mt-8 rounded-lg border border-blue-100 bg-blue-50 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-blue-900">
            <Sparkles className="size-4" />
            Pilot workspace
          </div>
          <p className="mt-2 text-sm leading-6 text-blue-900/75">
            Google Business Profile integration coming soon. Manual review entry
            is active now.
          </p>
        </div>
        <nav className="mt-6 space-y-1">
          {appLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-blue-700"
              >
                <Icon className="size-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="lg:pl-72">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
                Functional pilot workspace
              </p>
              <h1 className="text-lg font-semibold text-slate-950">
                Review inbox with persistent replies
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
                {admin.role === "super_admin" ? "Super Admin" : "Business Admin"}
              </span>
              <div className="flex size-9 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                {(admin.name ?? admin.email).slice(0, 2).toUpperCase()}
              </div>
            </div>
          </div>
        </header>
        <nav
          aria-label="Mobile app navigation"
          className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 px-3 py-2 shadow-[0_-10px_30px_rgba(15,23,42,0.08)] backdrop-blur lg:hidden"
        >
          <div className="flex gap-2 overflow-x-auto pb-1">
            {appLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex min-w-20 flex-col items-center justify-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-2 text-center text-[11px] font-semibold leading-tight text-slate-700 shadow-sm hover:border-blue-200 hover:text-blue-700"
                >
                  <Icon className="size-4" />
                  <span>{link.mobileLabel ?? link.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
        <main className="px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-6">
          {children}
        </main>
      </div>
    </div>
  );
}
