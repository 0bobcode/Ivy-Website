import { NextRequest, NextResponse } from "next/server";
import { identityApi, IdentityApiError } from "@/lib/identityApi";
import { setSessionCookies } from "@/lib/session";

export async function POST(req: NextRequest) {
  const { email, password, mfaCode } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ code: "VALIDATION_ERROR", detail: "Email and password are required." }, { status: 400 });
  }

  try {
    const tokens = await identityApi.login(email, password, mfaCode);
    await setSessionCookies(tokens.accessToken, tokens.refreshToken, tokens.expiresInSeconds);
    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e instanceof IdentityApiError) {
      return NextResponse.json({ code: e.code, detail: e.message }, { status: e.status });
    }
    return NextResponse.json({ detail: "The login service is unavailable. Please try again shortly." }, { status: 502 });
  }
}
