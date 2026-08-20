"use client";

import { useEffect, useState } from "react";
import { FormField } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/Button";
import { UsersIcon } from "@/components/dashboard/icons";
import type { TenantMemberSummary } from "@/lib/identityApi";

export function SchoolTeachersClient() {
  const [teachers, setTeachers] = useState<TenantMemberSummary[] | null>(null);
  const [email, setEmail] = useState("");
  const [inviting, setInviting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastInvite, setLastInvite] = useState<{ email: string; devResetToken: string | null } | null>(null);

  async function load() {
    const res = await fetch("/api/school/teachers");
    if (res.ok) setTeachers(await res.json());
  }

  useEffect(() => {
    load();
  }, []);

  async function onInvite(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLastInvite(null);
    setInviting(true);
    try {
      const res = await fetch("/api/school/teachers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.detail ?? "Couldn't invite that teacher.");
        return;
      }
      setLastInvite({ email: data.email, devResetToken: data.devResetToken });
      setEmail("");
      await load();
    } finally {
      setInviting(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-[26px] font-bold text-ink-700">Staff &amp; Teachers</h1>
        <p className="mt-1 text-sm text-ink-500">
          Invite teachers into your school — access is scoped from day one (story SAD-02).
        </p>
      </div>

      <form
        onSubmit={onInvite}
        className="flex flex-col gap-4 rounded-2xl border border-ink-100 bg-white p-6 shadow-sm shadow-ink-100/40 sm:flex-row sm:items-end"
      >
        <div className="flex-1">
          <FormField
            label="Teacher's email"
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="teacher@school.edu"
          />
        </div>
        <Button type="submit" variant="primary" disabled={inviting}>
          {inviting ? "Inviting…" : "Invite teacher"}
        </Button>
      </form>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}
      {lastInvite && (
        <div className="rounded-lg border border-brand-100 bg-brand-50 px-4 py-3 text-sm text-brand-700">
          Invited {lastInvite.email}.
          {lastInvite.devResetToken && (
            <>
              {" "}
              Dev-only: share this link to set a password —{" "}
              <span className="break-all font-mono text-xs">
                /reset-password?token={lastInvite.devResetToken}
              </span>
            </>
          )}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-sm shadow-ink-100/40">
        <div className="flex items-center gap-3 border-b border-ink-100 bg-cream-50/60 px-6 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
            <UsersIcon className="h-4.5 w-4.5" />
          </div>
          <p className="font-display text-sm font-bold text-ink-700">
            {teachers ? `${teachers.length} teacher${teachers.length === 1 ? "" : "s"}` : "Loading…"}
          </p>
        </div>
        {teachers && teachers.length === 0 && (
          <p className="px-6 py-8 text-center text-sm text-ink-400">No teachers yet — invite the first one above.</p>
        )}
        {teachers && teachers.length > 0 && (
          <ul className="divide-y divide-ink-100">
            {teachers.map((t) => (
              <li key={t.userId} className="flex items-center justify-between px-6 py-4">
                <p className="text-sm font-semibold text-ink-700">{t.email}</p>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    t.status === "ACTIVE" ? "bg-brand-50 text-brand-700" : "bg-ink-50 text-ink-500"
                  }`}
                >
                  {t.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
