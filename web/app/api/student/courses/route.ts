import { NextResponse } from "next/server";
import { catalogApi, CatalogApiError } from "@/lib/catalogApi";
import { getAccessToken } from "@/lib/session";

export async function GET() {
  const token = await getAccessToken();
  if (!token) return NextResponse.json({ detail: "Sign in required." }, { status: 401 });
  try {
    return NextResponse.json(await catalogApi.myEnrollments(token));
  } catch (e) {
    if (e instanceof CatalogApiError) return NextResponse.json({ detail: e.message }, { status: e.status });
    return NextResponse.json({ detail: "Unable to load your courses." }, { status: 502 });
  }
}
