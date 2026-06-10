import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ShieldCheck, UserPlus, Users } from "lucide-react";
import { getDb } from "@/lib/db";
import { requireSuperAdmin } from "@/lib/admin-auth";
import { ensurePilotCustomerAccounts } from "@/lib/account-admin";

const roleOptions = [
  { value: "super_admin", label: "Super Admin" },
  { value: "business_admin", label: "Business Admin" },
];

const statusOptions = [
  { value: "active", label: "Active" },
  { value: "disabled", label: "Disabled" },
];

function normaliseEmail(value: FormDataEntryValue | null) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

function normaliseOptionalString(value: FormDataEntryValue | null) {
  const stringValue = String(value || "").trim();
  return stringValue.length > 0 ? stringValue : null;
}

async function addAdminUser(formData: FormData) {
  "use server";

  await requireSuperAdmin();

  const email = normaliseEmail(formData.get("email"));
  const name = normaliseOptionalString(formData.get("name"));
  const role = String(formData.get("role")) === "super_admin"
    ? "super_admin"
    : "business_admin";

  if (!email) {
    redirect("/admin/users");
  }

  const db = getDb();
  const workspaceIds = formData.getAll("workspaceId").map(String);

  const adminUser = await db.adminUser.upsert({
    where: { email },
    update: { name, role, status: "active" },
    create: { email, name, role, status: "active" },
  });

  if (role === "business_admin") {
    await db.adminWorkspaceAccess.deleteMany({
      where: { adminUserId: adminUser.id },
    });
    await db.adminWorkspaceAccess.createMany({
      data: workspaceIds.map((workspaceId) => ({
        adminUserId: adminUser.id,
        workspaceId,
      })),
    });
  }

  revalidatePath("/admin/users");
  redirect("/admin/users");
}

async function updateAdminUser(formData: FormData) {
  "use server";

  const currentAdmin = await requireSuperAdmin();
  const id = String(formData.get("id") || "");
  const role = String(formData.get("role")) === "super_admin"
    ? "super_admin"
    : "business_admin";
  const status = String(formData.get("status")) === "disabled"
    ? "disabled"
    : "active";

  if (!id) {
    redirect("/admin/users");
  }

  const db = getDb();
  const workspaceIds = formData.getAll("workspaceId").map(String);
  const targetAdmin = await db.adminUser.findUnique({ where: { id } });

  if (!targetAdmin) {
    redirect("/admin/users");
  }

  const nextStatus =
    targetAdmin.email === currentAdmin.email && status === "disabled"
      ? "active"
      : status;

  await db.adminUser.update({
    where: { id },
    data: { role, status: nextStatus },
  });
  await db.adminWorkspaceAccess.deleteMany({ where: { adminUserId: id } });

  if (role === "business_admin") {
    await db.adminWorkspaceAccess.createMany({
      data: workspaceIds.map((workspaceId) => ({
        adminUserId: id,
        workspaceId,
      })),
    });
  }

  revalidatePath("/admin/users");
  redirect("/admin/users");
}

async function removeAdminUser(formData: FormData) {
  "use server";

  const currentAdmin = await requireSuperAdmin();
  const id = String(formData.get("id") || "");

  if (!id) {
    redirect("/admin/users");
  }

  const db = getDb();
  const targetAdmin = await db.adminUser.findUnique({ where: { id } });

  if (!targetAdmin || targetAdmin.email === currentAdmin.email) {
    redirect("/admin/users");
  }

  await db.adminWorkspaceAccess.deleteMany({ where: { adminUserId: id } });
  await db.adminUser.delete({ where: { id } });

  revalidatePath("/admin/users");
  redirect("/admin/users");
}

export default async function AdminUsersPage() {
  const currentAdmin = await requireSuperAdmin();
  await ensurePilotCustomerAccounts();
  const db = getDb();
  const [adminUsers, workspaces] = await Promise.all([
    db.adminUser.findMany({
      include: { workspaceAccess: true },
      orderBy: [{ role: "desc" }, { createdAt: "asc" }],
    }),
    db.workspace.findMany({
      where: { active: true },
      orderBy: [{ accountType: "desc" }, { name: "asc" }],
    }),
  ]);

  return (
    <div className="space-y-6">
      <section className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <div className="flex items-start gap-3">
          <Users className="mt-1 size-5 shrink-0 text-blue-700" />
          <div className="min-w-0">
            <h2 className="text-2xl font-semibold text-slate-950">
              Admin Users
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Add authorised Google accounts, assign admin roles, and disable or
              remove access.
            </p>
          </div>
        </div>

        <form
          action={addAdminUser}
          className="mt-6 grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_220px_auto]"
        >
          <label className="text-sm font-semibold text-slate-700">
            Email
            <input
              required
              name="email"
              type="email"
              placeholder="admin@example.co.uk"
              className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
            />
          </label>
          <label className="text-sm font-semibold text-slate-700">
            Name
            <input
              name="name"
              placeholder="Admin name"
              className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
            />
          </label>
          <label className="text-sm font-semibold text-slate-700">
            Role
            <select
              name="role"
              defaultValue="business_admin"
              className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
            >
              {roleOptions.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
          </label>
          <button className="self-end rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 sm:w-fit">
            <span className="inline-flex items-center gap-2">
              <UserPlus className="size-4" />
              Add user
            </span>
          </button>
          <fieldset className="sm:col-span-2 lg:col-span-4">
            <legend className="text-sm font-semibold text-slate-700">
              Business Admin workspace access
            </legend>
            <div className="mt-2 grid gap-2 md:grid-cols-3">
              {workspaces.map((workspace) => (
                <label
                  key={workspace.id}
                  className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-3 text-sm font-medium text-slate-700"
                >
                  <input
                    type="checkbox"
                    name="workspaceId"
                    value={workspace.id}
                    className="size-4"
                  />
                  <span className="min-w-0 break-words">{workspace.name}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </form>
      </section>

      <section className="overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-slate-200">
        <div className="hidden grid-cols-[1.1fr_0.8fr_0.7fr_0.8fr_0.8fr] gap-4 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 xl:grid">
          <span>User</span>
          <span>Role</span>
          <span>Status</span>
          <span>Last login</span>
          <span>Actions</span>
        </div>
        <div className="divide-y divide-slate-200">
          {adminUsers.map((adminUser) => {
            const isCurrentUser = adminUser.email === currentAdmin.email;
            const assignedWorkspaceIds = new Set(
              adminUser.workspaceAccess.map((access) => access.workspaceId),
            );

            return (
              <article
                key={adminUser.id}
                className="grid gap-4 p-4 xl:grid-cols-[1.1fr_0.8fr_0.7fr_0.8fr_0.8fr] xl:items-center"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="break-words font-semibold text-slate-950">
                      {adminUser.name || adminUser.email}
                    </p>
                    {isCurrentUser ? (
                      <span className="rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-100">
                        You
                      </span>
                    ) : null}
                    {adminUser.role === "super_admin" ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100">
                        <ShieldCheck className="size-3" />
                        Super Admin
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 break-all text-sm text-slate-600">
                    {adminUser.email}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Created {adminUser.createdAt.toLocaleDateString("en-GB")}
                  </p>
                </div>

                <form action={updateAdminUser} className="contents">
                  <input type="hidden" name="id" value={adminUser.id} />
                  <label className="text-sm font-semibold text-slate-700 lg:text-slate-600">
                    <span className="xl:hidden">Role</span>
                    <select
                      name="role"
                      defaultValue={adminUser.role}
                      className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm xl:mt-0"
                    >
                      {roleOptions.map((role) => (
                        <option key={role.value} value={role.value}>
                          {role.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="text-sm font-semibold text-slate-700 lg:text-slate-600">
                    <span className="xl:hidden">Status</span>
                    <select
                      name="status"
                      defaultValue={adminUser.status}
                      className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm xl:mt-0"
                    >
                      {statusOptions.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <p className="text-sm text-slate-600">
                    {adminUser.lastLoginAt
                      ? adminUser.lastLoginAt.toLocaleString("en-GB")
                      : "Not yet"}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:border-blue-200 hover:text-blue-700">
                      Update
                    </button>
                    <button
                      formAction={removeAdminUser}
                      disabled={isCurrentUser}
                      className="rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Remove
                    </button>
                  </div>
                  {adminUser.role === "business_admin" ? (
                    <fieldset className="xl:col-span-5">
                      <legend className="text-sm font-semibold text-slate-700">
                        Workspace access
                      </legend>
                      <div className="mt-2 grid gap-2 md:grid-cols-3">
                        {workspaces.map((workspace) => (
                          <label
                            key={workspace.id}
                            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-3 text-sm font-medium text-slate-700"
                          >
                            <input
                              type="checkbox"
                              name="workspaceId"
                              value={workspace.id}
                              defaultChecked={assignedWorkspaceIds.has(workspace.id)}
                              className="size-4"
                            />
                            <span className="min-w-0 break-words">{workspace.name}</span>
                          </label>
                        ))}
                      </div>
                    </fieldset>
                  ) : null}
                </form>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
