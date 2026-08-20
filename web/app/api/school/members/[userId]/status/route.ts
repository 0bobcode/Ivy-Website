import { NextRequest, NextResponse } from "next/server";
import { identityApi, IdentityApiError } from "@/lib/identityApi";
import { getAccessToken } from "@/lib/session";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  const token = await getAccessToken();
  if (!token) return NextResponse.json({ detail: "Sign in required." }, { status: 401 });
  const { userId } = await params;
  const { status } = await req.json();
  try {
    const tenant = await identityApi.myTenant(token);
    const updated = await identityApi.updateMemberStatus(token, tenant.id, userId, status);
    return NextResponse.json(updated);
  } catch (e) {
    if (e instanceof IdentityApiError) return NextResponse.json({ detail: e.message }, { status: e.status });
    return NextResponse.json({ detail: "Unable to update that member's status." }, { status: 502 });
  }
}
