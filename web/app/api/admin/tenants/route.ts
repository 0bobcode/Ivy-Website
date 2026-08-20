import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { identityApi, IdentityApiError } from "@/lib/identityApi";

async function requireAccessToken() {
  const store = await cookies();
  return store.get("ivy_access")?.value;
}

export async function GET() {
  const token = await requireAccessToken();
  if (!token) {
    return NextResponse.json({ detail: "Sign in required." }, { status: 401 });
  }
  try {
    const tenants = await identityApi.listTenants(token);
    return NextResponse.json(tenants);
  } catch (e) {
    if (e instanceof IdentityApiError) {
      return NextResponse.json({ code: e.code, detail: e.message }, { status: e.status });
    }
    return NextResponse.json({ detail: "Unable to load tenants." }, { status: 502 });
  }
}

export async function POST(req: NextRequest) {
  const token = await requireAccessToken();
  if (!token) {
    return NextResponse.json({ detail: "Sign in required." }, { status: 401 });
  }
  const { name } = await req.json();
  if (!name || !name.trim()) {
    return NextResponse.json({ detail: "A school/district name is required." }, { status: 400 });
  }
  try {
    const tenant = await identityApi.createTenant(token, name);
    return NextResponse.json(tenant, { status: 201 });
  } catch (e) {
    if (e instanceof IdentityApiError) {
      return NextResponse.json({ code: e.code, detail: e.message }, { status: e.status });
    }
    return NextResponse.json({ detail: "Unable to create the tenant." }, { status: 502 });
  }
}
