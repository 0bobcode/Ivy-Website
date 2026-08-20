import { NextRequest, NextResponse } from "next/server";
import { identityApi, IdentityApiError } from "@/lib/identityApi";
import { getAccessToken } from "@/lib/session";

export async function GET() {
  const token = await getAccessToken();
  if (!token) return NextResponse.json({ detail: "Sign in required." }, { status: 401 });
  try {
    return NextResponse.json(await identityApi.myTenant(token));
  } catch (e) {
    if (e instanceof IdentityApiError) return NextResponse.json({ detail: e.message }, { status: e.status });
    return NextResponse.json({ detail: "Unable to load your school." }, { status: 502 });
  }
}

export async function PUT(req: NextRequest) {
  const token = await getAccessToken();
  if (!token) return NextResponse.json({ detail: "Sign in required." }, { status: 401 });
  const body = await req.json();
  try {
    const tenant = await identityApi.myTenant(token);
    const updated = await identityApi.updateTenant(token, tenant.id, body);
    return NextResponse.json(updated);
  } catch (e) {
    if (e instanceof IdentityApiError) return NextResponse.json({ detail: e.message }, { status: e.status });
    return NextResponse.json({ detail: "Unable to update your school profile." }, { status: 502 });
  }
}
