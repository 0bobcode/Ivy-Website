import { NextRequest, NextResponse } from "next/server";
import { mkdir, appendFile } from "fs/promises";
import path from "path";

// Stopgap store for GST-06 until Marketing's email tooling (MKT-05) exists.
const DATA_DIR = path.join(process.cwd(), ".data");
const SUBSCRIBERS_FILE = path.join(DATA_DIR, "newsletter-subscribers.jsonl");

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ detail: "Please enter a valid email address." }, { status: 400 });
  }

  try {
    await mkdir(DATA_DIR, { recursive: true });
    await appendFile(SUBSCRIBERS_FILE, JSON.stringify({ email, subscribedAt: new Date().toISOString() }) + "\n", "utf-8");
  } catch {
    return NextResponse.json({ detail: "Couldn't subscribe you right now. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
