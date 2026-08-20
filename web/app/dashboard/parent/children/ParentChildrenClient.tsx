"use client";

import { useEffect, useState } from "react";
import { FormField } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/Button";
import type { GuardianLinkSummary } from "@/lib/identityApi";

const statusLabel: Record<GuardianLinkSummary["status"], string> = {
  PENDING_CONSENT: "Awaiting your consent",
  CONFIRMED: "Consent given",
  REVOKED: "Consent revoked",
};

const statusColor: Record<GuardianLinkSummary["status"], string> = {
  PENDING_CONSENT: "bg-amber-50 text-amber-700",
  CONFIRMED: "bg-brand-50 text-brand-700",
  REVOKED: "bg-red-50 text-red-700",
};

export function ParentChildrenClient() {
  const [links, setLinks] = useState<GuardianLinkSummary[] | null>(null);
  const [email, setEmail] = useState("");
  const [linking, setLinking] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/parent/children");
    if (res.ok) setLinks(await res.json());
  }

  useEffect(() => {
    load();
  }, []);

  async function onLink(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLinking(true);
    try {
      const res = await fetch("/api/parent/children", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentEmail: email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.detail ?? "Couldn't link that account.");
        return;
      }
      setEmail("");
      await load();
    } finally {
      setLinking(false);
    }
  }

  async function onConsent(link: GuardianLinkSummary, action: "consent" | "revoke") {
    setBusyId(link.id);
    try {
      const res = await fetch(`/api/parent/children/${link.id}/${action}`, { method: "POST" });
      if (res.ok) await load();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-[26px] font-bold text-ink-700">Consent &amp; Privacy</h1>
        <p className="mt-1 text-sm text-ink-500">
          Link your account to your child's, then explicitly grant consent before you can see their progress
          (stories PAR-01, PAR-02).
        </p>
      </div>

      <form
        onSubmit={onLink}
        className="flex flex-col gap-4 rounded-2xl border border-ink-100 bg-white p-6 shadow-sm shadow-ink-100/40 sm:flex-row sm:items-end"
      >
        <div className="flex-1">
          <FormField
            label="Your child's account email"
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="child@email.com"
          />
        </div>
        <Button type="submit" variant="primary" disabled={linking}>
          {linking ? "Linking…" : "Link child"}
        </Button>
      </form>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-sm shadow-ink-100/40">
        {links === null && <p className="px-6 py-8 text-center text-sm text-ink-400">Loading…</p>}
        {links && links.length === 0 && (
          <p className="px-6 py-8 text-center text-sm text-ink-400">No linked children yet.</p>
        )}
        {links && links.length > 0 && (
          <ul className="divide-y divide-ink-100">
            {links.map((link) => (
              <li key={link.id} className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-ink-700">{link.studentEmail}</p>
                  <span className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-semibold ${statusColor[link.status]}`}>
                    {statusLabel[link.status]}
                  </span>
                </div>
                <div className="flex gap-2">
                  {link.status !== "CONFIRMED" && (
                    <button
                      onClick={() => onConsent(link, "consent")}
                      disabled={busyId === link.id}
                      className="rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-60"
                    >
                      {busyId === link.id ? "Working…" : "Grant consent"}
                    </button>
                  )}
                  {link.status === "CONFIRMED" && (
                    <button
                      onClick={() => onConsent(link, "revoke")}
                      disabled={busyId === link.id}
                      className="rounded-lg border border-ink-200 px-3 py-1.5 text-xs font-semibold text-ink-600 transition-colors hover:border-ink-400 disabled:opacity-60"
                    >
                      {busyId === link.id ? "Working…" : "Revoke consent"}
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
