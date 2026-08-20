import { NextRequest, NextResponse } from "next/server";
import { mkdir, appendFile } from "fs/promises";
import path from "path";

// Stopgap lead intake until the CRM/Sales service (SAL-01) exists — persists
// to a local file so submissions are at least durable and inspectable, rather
// than silently discarded. Replace with a POST to the CRM service's lead
// endpoint once that service is stood up (PHASE_1_PLAN.md Sprint 4).
const DATA_DIR = path.join(process.cwd(), ".data");
const LEADS_FILE = path.join(DATA_DIR, "leads.jsonl");

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { fullName, email, mobile, personaType, areaOfInterest, notes } = body;

  if (!fullName || !email || !mobile || !personaType || !areaOfInterest) {
    return NextResponse.json({ detail: "Please fill in all required fields." }, { status: 400 });
  }

  const lead = {
    fullName,
    email,
    mobile,
    personaType,
    areaOfInterest,
    notes: notes ?? null,
    source: "lead-form",
    submittedAt: new Date().toISOString(),
  };

  try {
    await mkdir(DATA_DIR, { recursive: true });
    await appendFile(LEADS_FILE, JSON.stringify(lead) + "\n", "utf-8");
  } catch {
    return NextResponse.json({ detail: "Couldn't save your request. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
