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

const appLinks = [
  { href: "/app/reviews", label: "Review Inbox", icon: Inbox },
  { href: "/app/generate", label: "Generate Reply", icon: MessageSquarePlus },
  { href: "/app/saved-replies", label: "Saved Replies", icon: FileText },
  { href: "/app/brand-voice", label: "Brand Voice", icon: SlidersHorizontal },
  { href: "/app/integrations", label: "Integrations", icon: Link2 },
  { href: "/app/settings", label: "Settings", icon: Settings },
  { href: "/app/billing", label: "Billing", icon: CreditCard },
];

export function AppShell({ children }: { children: React.ReactNode }) {
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
            Pro demo workspace
          </div>
          <p className="mt-2 text-sm leading-6 text-blue-900/75">
            Mock Google sync is active for Ashpazi Batley and Gardner Champion
            Dewsbury/Rugeley pilot locations.
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
                Mock authenticated app
              </p>
              <h1 className="text-lg font-semibold text-slate-950">
                Review inbox with draft replies ready
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
                Free Forever pilot
              </span>
              <div className="flex size-9 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                HD
              </div>
            </div>
          </div>
        </header>
        <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
