import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { identityApi, IdentityApiError } from "@/lib/identityApi";

export async function POST(req: NextRequest) {
  const store = await cookies();
  const accessToken = store.get("ivy_access")?.value;
  if (!accessToken) {
    return NextResponse.json({ detail: "Sign in required." }, { status: 401 });
  }
  const { code } = await req.json();
  try {
    await identityApi.mfaConfirm(accessToken, code);
    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e instanceof IdentityApiError) {
      return NextResponse.json({ code: e.code, detail: e.message }, { status: e.status });
    }
    return NextResponse.json({ detail: "Unable to confirm MFA enrollment." }, { status: 502 });
  }
}
