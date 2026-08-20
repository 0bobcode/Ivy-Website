import { NextRequest, NextResponse } from "next/server";
import { identityApi, IdentityApiError } from "@/lib/identityApi";
import { setSessionCookies } from "@/lib/session";

export async function POST(req: NextRequest) {
  const { email, password, captchaToken } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ code: "VALIDATION_ERROR", detail: "Email and password are required." }, { status: 400 });
  }

  try {
    await identityApi.signup(email, password, captchaToken);
    // Sign the new account straight in — no reason to make them re-enter
    // credentials immediately after choosing them.
    const tokens = await identityApi.login(email, password);
    await setSessionCookies(tokens.accessToken, tokens.refreshToken, tokens.expiresInSeconds);
    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e instanceof IdentityApiError) {
      return NextResponse.json({ code: e.code, detail: e.message, fields: e.fields }, { status: e.status });
    }
    return NextResponse.json({ detail: "The signup service is unavailable. Please try again shortly." }, { status: 502 });
  }
}
