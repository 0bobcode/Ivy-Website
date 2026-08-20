import { NextRequest, NextResponse } from "next/server";
import { catalogApi, CatalogApiError } from "@/lib/catalogApi";
import { getAccessToken } from "@/lib/session";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = await getAccessToken();
  if (!token) return NextResponse.json({ detail: "Sign in required." }, { status: 401 });
  const { id } = await params;
  const { title, textContent } = await req.json();
  if (!title || !title.trim()) {
    return NextResponse.json({ detail: "A lesson title is required." }, { status: 400 });
  }
  try {
    const lesson = await catalogApi.addTextLesson(token, id, title, textContent ?? "");
    return NextResponse.json(lesson, { status: 201 });
  } catch (e) {
    if (e instanceof CatalogApiError) return NextResponse.json({ detail: e.message }, { status: e.status });
    return NextResponse.json({ detail: "Unable to add the lesson." }, { status: 502 });
  }
}
