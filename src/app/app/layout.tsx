import { AppShell } from "@/components/app-shell";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedAppShell>{children}</ProtectedAppShell>;
}

async function ProtectedAppShell({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();

  return <AppShell admin={admin}>{children}</AppShell>;
}
