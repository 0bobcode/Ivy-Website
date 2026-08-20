import { NextRequest, NextResponse } from "next/server";
import { getAccessToken } from "@/lib/session";

const CATALOG_API_URL = process.env.CATALOG_API_URL ?? "http://localhost:8082";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = await getAccessToken();
  if (!token) return NextResponse.json({ detail: "Sign in required." }, { status: 401 });
  const { id } = await params;

  // Forward the multipart body as-is — course-catalog-service does the real
  // validation and storage (MediaStorage); this route only adds auth.
  const formData = await req.formData();
  const res = await fetch(`${CATALOG_API_URL}/api/v1/courses/${id}/lessons/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  const text = await res.text();
  const body = text ? JSON.parse(text) : {};
  return NextResponse.json(body, { status: res.status });
}
