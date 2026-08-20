"use client";

import { useEffect, useState } from "react";
import type { TenantMemberSummary } from "@/lib/identityApi";

export function SchoolRosterClient() {
  const [members, setMembers] = useState<TenantMemberSummary[] | null>(null);
  const [busyUserId, setBusyUserId] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/school/members");
    if (res.ok) setMembers(await res.json());
  }

  useEffect(() => {
    load();
  }, []);

  async function toggleStatus(m: TenantMemberSummary) {
    setBusyUserId(m.userId);
    const nextStatus = m.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    try {
      const res = await fetch(`/api/school/members/${m.userId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) await load();
    } finally {
      setBusyUserId(null);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-[26px] font-bold text-ink-700">Students &amp; Enrollment</h1>
        <p className="mt-1 text-sm text-ink-500">
          Deactivate access immediately when someone leaves the school (story SAD-09).
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-sm shadow-ink-100/40">
        {members === null && <p className="px-6 py-8 text-center text-sm text-ink-400">Loading…</p>}
        {members && members.length === 0 && (
          <p className="px-6 py-8 text-center text-sm text-ink-400">No members yet.</p>
        )}
        {members && members.length > 0 && (
          <ul className="divide-y divide-ink-100">
            {members.map((m) => (
              <li key={m.userId} className="flex items-center justify-between px-6 py-4">
                <div>
                  <p className="text-sm font-semibold text-ink-700">{m.email}</p>
                  <p className="text-xs text-ink-400">{m.roles.join(", ")}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      m.status === "ACTIVE" ? "bg-brand-50 text-brand-700" : "bg-red-50 text-red-700"
                    }`}
                  >
                    {m.status}
                  </span>
                  <button
                    onClick={() => toggleStatus(m)}
                    disabled={busyUserId === m.userId}
                    className="rounded-lg border border-ink-200 px-3 py-1.5 text-xs font-semibold text-ink-600 transition-colors hover:border-ink-400 disabled:opacity-60"
                  >
                    {busyUserId === m.userId
                      ? "Working…"
                      : m.status === "ACTIVE"
                        ? "Deactivate"
                        : "Reactivate"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
