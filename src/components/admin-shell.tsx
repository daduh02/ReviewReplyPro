import {
  BookOpen,
  CreditCard,
  FileText,
  Inbox,
  Link2,
  LogOut,
  MapPinned,
  ShieldCheck,
  SlidersHorizontal,
  UserRoundCheck,
  Users,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import type { AdminRole } from "@/lib/admin-auth";

const adminLinks = [
  { href: "/admin", label: "Admin Overview", icon: ShieldCheck },
  { href: "/admin/accounts", label: "Accounts", icon: MapPinned, superAdminOnly: true },
  { href: "/admin/leads", label: "Leads", icon: UserRoundCheck, superAdminOnly: true },
  { href: "/admin/users", label: "Admin Users", icon: Users, superAdminOnly: true },
  { href: "/admin/documentation", label: "Documentation", icon: BookOpen, superAdminOnly: true },
  { href: "/app/reviews", label: "All Reviews", icon: Inbox },
  { href: "/app/saved-replies", label: "Saved Replies", icon: FileText },
  { href: "/app/brand-voice", label: "Brand Voice", icon: SlidersHorizontal },
  { href: "/app/integrations", label: "Connections", icon: Link2 },
  { href: "/app/billing", label: "Billing", icon: CreditCard },
];

type AdminShellProps = {
  admin: {
    email: string;
    name: string | null;
    role: AdminRole;
  };
  children: ReactNode;
};

export function AdminShell({ admin, children }: AdminShellProps) {
  return (
    <div className="min-h-screen bg-slate-100">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-72 border-r border-slate-200 bg-white p-5 lg:block">
        <Link href="/" className="flex items-center gap-3 font-semibold">
          <span className="flex size-10 items-center justify-center rounded-lg bg-slate-950 text-sm font-bold text-white">
            RR
          </span>
          <span>ReviewReply Pro Admin</span>
        </Link>
        <div className="mt-8 rounded-lg border border-emerald-100 bg-emerald-50 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-emerald-900">
            <ShieldCheck className="size-4" />
            Google admin session
          </div>
          <p className="mt-2 text-sm leading-6 text-emerald-900/75">
            {admin.role === "super_admin"
              ? "Super Admin access across all pilot controls."
              : "Business Admin access for authorised pilot work."}
          </p>
        </div>
        <nav className="mt-6 space-y-1">
          {adminLinks
            .filter((link) => !link.superAdminOnly || admin.role === "super_admin")
            .map((link) => {
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
                Admin workspace
              </p>
              <h1 className="text-lg font-semibold text-slate-950">
                Pilot businesses, reviews, replies and billing controls
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold text-slate-950">
                  {admin.name || admin.email}
                </p>
                <p className="text-xs capitalize text-slate-500">
                  {admin.role.replace("_", " ")}
                </p>
              </div>
              <form action="/api/auth/logout" method="post">
                <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:border-blue-200 hover:text-blue-700">
                  <LogOut className="size-4" />
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </header>
        <nav
          aria-label="Mobile admin navigation"
          className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 px-3 py-2 shadow-[0_-10px_30px_rgba(15,23,42,0.08)] backdrop-blur lg:hidden"
        >
          <div className="flex gap-2 overflow-x-auto pb-1">
            {adminLinks
              .filter((link) => !link.superAdminOnly || admin.role === "super_admin")
              .map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex min-w-20 flex-col items-center justify-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-2 text-center text-[11px] font-semibold leading-tight text-slate-700 shadow-sm hover:border-blue-200 hover:text-blue-700"
                  >
                    <Icon className="size-4" />
                    <span>{link.label.replace("Admin ", "")}</span>
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
