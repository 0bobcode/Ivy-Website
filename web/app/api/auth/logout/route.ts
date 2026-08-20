import { NextResponse } from "next/server";
import { identityApi } from "@/lib/identityApi";
import { clearSessionCookies, getRefreshToken } from "@/lib/session";

export async function POST() {
  const refreshToken = await getRefreshToken();
  if (refreshToken) {
    await identityApi.logout(refreshToken).catch(() => undefined);
  }
  await clearSessionCookies();
  return NextResponse.json({ ok: true });
}
