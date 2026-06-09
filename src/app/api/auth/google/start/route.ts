import { NextResponse } from "next/server";
import { createGoogleOAuthState, getGoogleRedirectUri } from "@/lib/admin-auth";

export async function GET() {
  const clientId = process.env.GOOGLE_CLIENT_ID;

  if (!clientId) {
    return NextResponse.json(
      {
        error:
          "Google OAuth is not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.",
      },
      { status: 500 },
    );
  }

  const state = await createGoogleOAuthState();
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: await getGoogleRedirectUri(),
    response_type: "code",
    scope: "openid email profile",
    state,
    prompt: "select_account",
  });

  return NextResponse.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`,
  );
}
