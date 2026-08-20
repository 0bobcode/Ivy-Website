import { NextRequest, NextResponse } from "next/server";
import { identityApi } from "@/lib/identityApi";

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) {
    return NextResponse.json({ detail: "Email is required." }, { status: 400 });
  }
  // In production this responds identically whether or not the email exists
  // — the backend enforces that. The devResetToken field only appears at all
  // when identity-service's dev-only expose flag is on (no email service
  // exists yet to deliver the real link) — see AuthController.
  const result = await identityApi.requestPasswordReset(email).catch(() => undefined);
  return NextResponse.json({ ok: true, devResetToken: result?.devResetToken || undefined });
}
