import { createHmac, randomBytes, timingSafeEqual } from "crypto";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";

export const initialSuperAdminEmail = "hussain.dadu@gmail.com";

export type AdminRole = "super_admin" | "business_admin";
export type AdminStatus = "active" | "disabled";

export type AdminSession = {
  email: string;
  name: string | null;
  role: AdminRole;
  status: AdminStatus;
  expiresAt: number;
};

export const adminSessionCookie = "rrp_admin_session";
export const googleStateCookie = "rrp_google_oauth_state";

const sessionMaxAgeSeconds = 60 * 60 * 24 * 7;

function getSessionSecret() {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    "reviewreply-pro-local-admin-session-secret"
  );
}

function sign(value: string) {
  return createHmac("sha256", getSessionSecret()).update(value).digest("base64url");
}

function isValidSignature(value: string, signature: string) {
  const expected = sign(value);
  const expectedBuffer = Buffer.from(expected);
  const signatureBuffer = Buffer.from(signature);

  if (expectedBuffer.length !== signatureBuffer.length) {
    return false;
  }

  return timingSafeEqual(expectedBuffer, signatureBuffer);
}

export function createAdminSessionToken(session: Omit<AdminSession, "expiresAt">) {
  const payload = Buffer.from(
    JSON.stringify({
      ...session,
      expiresAt: Date.now() + sessionMaxAgeSeconds * 1000,
    }),
  ).toString("base64url");

  return `${payload}.${sign(payload)}`;
}

export function parseAdminSessionToken(token: string | undefined) {
  if (!token) {
    return null;
  }

  const [payload, signature] = token.split(".");

  if (!payload || !signature || !isValidSignature(payload, signature)) {
    return null;
  }

  try {
    const session = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    ) as AdminSession;

    if (!session.email || Date.now() > session.expiresAt) {
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

export async function setAdminSession(session: Omit<AdminSession, "expiresAt">) {
  const cookieStore = await cookies();

  cookieStore.set(adminSessionCookie, createAdminSessionToken(session), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: sessionMaxAgeSeconds,
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();

  cookieStore.delete(adminSessionCookie);
}

export async function createGoogleOAuthState() {
  const state = randomBytes(24).toString("base64url");
  const cookieStore = await cookies();

  cookieStore.set(googleStateCookie, state, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 10,
  });

  return state;
}

export async function validateGoogleOAuthState(state: string | null) {
  const cookieStore = await cookies();
  const storedState = cookieStore.get(googleStateCookie)?.value;

  cookieStore.delete(googleStateCookie);

  return Boolean(state && storedState && state === storedState);
}

export async function getBaseUrl() {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  const headerStore = await headers();
  const host = headerStore.get("host") ?? "localhost:3000";
  const protocol = host.includes("localhost") ? "http" : "https";

  return `${protocol}://${host}`;
}

export async function getGoogleRedirectUri() {
  return `${await getBaseUrl()}/api/auth/google/callback`;
}

export async function ensureInitialSuperAdmin() {
  const db = getDb();

  return db.adminUser.upsert({
    where: { email: initialSuperAdminEmail },
    update: {
      role: "super_admin",
      status: "active",
      name: "Hussain Dadu",
    },
    create: {
      email: initialSuperAdminEmail,
      name: "Hussain Dadu",
      role: "super_admin",
      status: "active",
    },
  });
}

export async function getCurrentAdmin() {
  const cookieStore = await cookies();
  const session = parseAdminSessionToken(
    cookieStore.get(adminSessionCookie)?.value,
  );

  if (!session) {
    return null;
  }

  const db = getDb();
  const adminUser = await db.adminUser.findUnique({
    where: { email: session.email.toLowerCase() },
  });

  if (!adminUser || adminUser.status !== "active") {
    return null;
  }

  return {
    id: adminUser.id,
    email: adminUser.email,
    name: adminUser.name,
    role: adminUser.role as AdminRole,
    status: adminUser.status as AdminStatus,
    createdAt: adminUser.createdAt,
    lastLoginAt: adminUser.lastLoginAt,
  };
}

export async function requireAdmin() {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect("/admin/login");
  }

  return admin;
}

export async function requireSuperAdmin() {
  const admin = await requireAdmin();

  if (admin.role !== "super_admin") {
    redirect("/admin");
  }

  return admin;
}
