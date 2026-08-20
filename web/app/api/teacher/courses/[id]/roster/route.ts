import { NextResponse } from "next/server";
import { catalogApi, CatalogApiError } from "@/lib/catalogApi";
import { getAccessToken } from "@/lib/session";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const token = await getAccessToken();
  if (!token) return NextResponse.json({ detail: "Sign in required." }, { status: 401 });
  const { id } = await params;
  try {
    return NextResponse.json(await catalogApi.roster(token, id));
  } catch (e) {
    if (e instanceof CatalogApiError) return NextResponse.json({ detail: e.message }, { status: e.status });
    return NextResponse.json({ detail: "Unable to load the roster." }, { status: 502 });
  }
}
