import { NextRequest, NextResponse } from "next/server";
import { identityApi, IdentityApiError } from "@/lib/identityApi";
import { getAccessToken } from "@/lib/session";

export async function GET() {
  const token = await getAccessToken();
  if (!token) return NextResponse.json({ detail: "Sign in required." }, { status: 401 });
  try {
    return NextResponse.json(await identityApi.myGuardianLinks(token));
  } catch (e) {
    if (e instanceof IdentityApiError) return NextResponse.json({ detail: e.message }, { status: e.status });
    return NextResponse.json({ detail: "Unable to load linked children." }, { status: 502 });
  }
}

export async function POST(req: NextRequest) {
  const token = await getAccessToken();
  if (!token) return NextResponse.json({ detail: "Sign in required." }, { status: 401 });
  const { studentEmail } = await req.json();
  if (!studentEmail || !studentEmail.trim()) {
    return NextResponse.json({ detail: "Your child's account email is required." }, { status: 400 });
  }
  try {
    const link = await identityApi.linkChild(token, studentEmail);
    return NextResponse.json(link, { status: 201 });
  } catch (e) {
    if (e instanceof IdentityApiError) return NextResponse.json({ detail: e.message }, { status: e.status });
    return NextResponse.json({ detail: "Unable to link that account." }, { status: 502 });
  }
}
