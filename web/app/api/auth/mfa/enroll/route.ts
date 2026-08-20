import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { identityApi, IdentityApiError } from "@/lib/identityApi";

export async function POST() {
  const store = await cookies();
  const accessToken = store.get("ivy_access")?.value;
  if (!accessToken) {
    return NextResponse.json({ detail: "Sign in required." }, { status: 401 });
  }
  try {
    const result = await identityApi.mfaEnroll(accessToken);
    return NextResponse.json(result);
  } catch (e) {
    if (e instanceof IdentityApiError) {
      return NextResponse.json({ code: e.code, detail: e.message }, { status: e.status });
    }
    return NextResponse.json({ detail: "Unable to start MFA enrollment." }, { status: 502 });
  }
}
