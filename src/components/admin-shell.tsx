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
  const visibleLinks = adminLinks.filter(
    (link) => !link.superAdminOnly || admin.role === "super_admin",
  );

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
          {visibleLinks
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
      <div className="min-w-0 lg:pl-72">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
                Admin workspace
              </p>
              <h1 className="text-balance text-lg font-semibold text-slate-950">
                Pilot businesses, reviews, replies and billing controls
              </h1>
            </div>
            <div className="flex min-w-0 items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="max-w-56 truncate text-sm font-semibold text-slate-950">
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
          <nav
            aria-label="Mobile admin navigation"
            className="mt-4 grid grid-cols-2 gap-2 rounded-lg border border-slate-200 bg-white p-2 shadow-sm sm:grid-cols-3 lg:hidden"
          >
            {visibleLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-blue-700"
                >
                  <Icon className="size-4 shrink-0" />
                  <span className="truncate">{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </header>
        <main className="min-w-0 px-4 pb-8 pt-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
