import { NextResponse } from "next/server";
import { identityApi, IdentityApiError } from "@/lib/identityApi";
import { getAccessToken } from "@/lib/session";

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const token = await getAccessToken();
  if (!token) return NextResponse.json({ detail: "Sign in required." }, { status: 401 });
  const { id } = await params;
  try {
    return NextResponse.json(await identityApi.revokeConsent(token, id));
  } catch (e) {
    if (e instanceof IdentityApiError) return NextResponse.json({ detail: e.message }, { status: e.status });
    return NextResponse.json({ detail: "Unable to revoke consent." }, { status: 502 });
  }
}
