import { NextResponse } from "next/server";
import { clearAdminSession, getBaseUrl } from "@/lib/admin-auth";

export async function POST() {
  await clearAdminSession();

  return NextResponse.redirect(`${await getBaseUrl()}/admin/login`, 303);
}
