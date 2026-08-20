import { NextRequest, NextResponse } from "next/server";
import { identityApi, IdentityApiError } from "@/lib/identityApi";

export async function POST(req: NextRequest) {
  const { token, newPassword } = await req.json();
  if (!token || !newPassword) {
    return NextResponse.json({ detail: "Token and new password are required." }, { status: 400 });
  }
  try {
    await identityApi.completePasswordReset(token, newPassword);
    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e instanceof IdentityApiError) {
      return NextResponse.json({ code: e.code, detail: e.message }, { status: e.status });
    }
    return NextResponse.json({ detail: "The reset service is unavailable. Please try again shortly." }, { status: 502 });
  }
}
