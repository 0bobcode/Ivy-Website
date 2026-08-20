import { NextRequest, NextResponse } from "next/server";
import { catalogApi, CatalogApiError } from "@/lib/catalogApi";
import { getAccessToken } from "@/lib/session";

export async function GET() {
  const token = await getAccessToken();
  if (!token) return NextResponse.json({ detail: "Sign in required." }, { status: 401 });
  try {
    return NextResponse.json(await catalogApi.mine(token));
  } catch (e) {
    if (e instanceof CatalogApiError) return NextResponse.json({ detail: e.message }, { status: e.status });
    return NextResponse.json({ detail: "Unable to load your courses." }, { status: 502 });
  }
}

export async function POST(req: NextRequest) {
  const token = await getAccessToken();
  if (!token) return NextResponse.json({ detail: "Sign in required." }, { status: 401 });
  const body = await req.json();
  if (!body.title || !body.title.trim()) {
    return NextResponse.json({ detail: "A course title is required." }, { status: 400 });
  }
  try {
    const course = await catalogApi.create(token, body);
    return NextResponse.json(course, { status: 201 });
  } catch (e) {
    if (e instanceof CatalogApiError) return NextResponse.json({ detail: e.message }, { status: e.status });
    return NextResponse.json({ detail: "Unable to create the course." }, { status: 502 });
  }
}
