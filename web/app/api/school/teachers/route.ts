import { NextRequest, NextResponse } from "next/server";
import { identityApi, IdentityApiError } from "@/lib/identityApi";
import { getAccessToken } from "@/lib/session";

export async function GET() {
  const token = await getAccessToken();
  if (!token) return NextResponse.json({ detail: "Sign in required." }, { status: 401 });
  try {
    const tenant = await identityApi.myTenant(token);
    const members = await identityApi.tenantMembers(token, tenant.id);
    return NextResponse.json(members.filter((m) => m.roles.includes("TEACHER")));
  } catch (e) {
    if (e instanceof IdentityApiError) return NextResponse.json({ detail: e.message }, { status: e.status });
    return NextResponse.json({ detail: "Unable to load teachers." }, { status: 502 });
  }
}

export async function POST(req: NextRequest) {
  const token = await getAccessToken();
  if (!token) return NextResponse.json({ detail: "Sign in required." }, { status: 401 });
  const { email } = await req.json();
  if (!email || !email.trim()) {
    return NextResponse.json({ detail: "A teacher email is required." }, { status: 400 });
  }
  try {
    const tenant = await identityApi.myTenant(token);
    const result = await identityApi.inviteTeacher(token, tenant.id, email);
    return NextResponse.json(result, { status: 201 });
  } catch (e) {
    if (e instanceof IdentityApiError) return NextResponse.json({ detail: e.message }, { status: e.status });
    return NextResponse.json({ detail: "Unable to invite that teacher." }, { status: 502 });
  }
}
