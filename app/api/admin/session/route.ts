import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_NAME, verifySessionToken } from "@/lib/auth/session";

/**
 * Tiny read-only endpoint so client components (the site header's account
 * menu) can find out whether the visitor has an admin session, without
 * being able to read the httpOnly session cookie directly.
 */
export async function GET() {
  const cookieStore = await cookies();
  const loggedIn = await verifySessionToken(cookieStore.get(COOKIE_NAME)?.value);
  return NextResponse.json({ loggedIn });
}
