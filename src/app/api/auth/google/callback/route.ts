import { NextRequest, NextResponse } from "next/server";
import {
  ensureInitialSuperAdmin,
  getBaseUrl,
  getGoogleRedirectUri,
  setAdminSession,
  toAdminRole,
  toAdminStatus,
  validateGoogleOAuthState,
} from "@/lib/admin-auth";
import { getDb } from "@/lib/db";

type GoogleTokenResponse = {
  access_token?: string;
  error?: string;
  error_description?: string;
};

type GoogleUserInfo = {
  email?: string;
  name?: string;
};

async function exchangeCodeForToken(code: string) {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID ?? "",
      client_secret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      redirect_uri: await getGoogleRedirectUri(),
      grant_type: "authorization_code",
    }),
  });

  const token = (await response.json()) as GoogleTokenResponse;

  if (!response.ok || !token.access_token) {
    throw new Error(token.error_description || token.error || "OAuth failed");
  }

  return token.access_token;
}

async function getGoogleUserInfo(accessToken: string) {
  const response = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: { authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    throw new Error("Could not fetch Google profile");
  }

  return (await response.json()) as GoogleUserInfo;
}

export async function GET(request: NextRequest) {
  const baseUrl = await getBaseUrl();
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");

  if (!code || !(await validateGoogleOAuthState(state))) {
    return NextResponse.redirect(`${baseUrl}/admin/login?error=oauth`);
  }

  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return NextResponse.redirect(`${baseUrl}/admin/login?error=configuration`);
  }

  try {
    const accessToken = await exchangeCodeForToken(code);
    const googleUser = await getGoogleUserInfo(accessToken);
    const email = googleUser.email?.toLowerCase();

    if (!email) {
      return NextResponse.redirect(`${baseUrl}/admin/login?error=profile`);
    }

    await ensureInitialSuperAdmin();

    const db = getDb();
    const adminUser = await db.adminUser.findUnique({ where: { email } });

    if (!adminUser || adminUser.status !== "active") {
      return NextResponse.redirect(`${baseUrl}/admin/blocked`);
    }

    const updatedAdmin = await db.adminUser.update({
      where: { email },
      data: {
        name: adminUser.name || googleUser.name || null,
        lastLoginAt: new Date(),
      },
    });

    await setAdminSession({
      email: updatedAdmin.email,
      name: updatedAdmin.name,
      role: toAdminRole(updatedAdmin.role),
      status: toAdminStatus(updatedAdmin.status),
    });

    return NextResponse.redirect(`${baseUrl}/admin`);
  } catch (error) {
    console.error("Google admin login failed", error);
    return NextResponse.redirect(`${baseUrl}/admin/login?error=oauth`);
  }
}
