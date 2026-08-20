"use client";

import { useEffect, useState } from "react";
import { FormField } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/Button";
import { SchoolIcon } from "@/components/dashboard/icons";
import type { TenantSummary } from "@/lib/identityApi";

export function TenantsClient() {
  const [tenants, setTenants] = useState<TenantSummary[] | null>(null);
  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/admin/tenants");
    if (res.ok) setTenants(await res.json());
  }

  useEffect(() => {
    load();
  }, []);

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setCreating(true);
    try {
      const res = await fetch("/api/admin/tenants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.detail ?? "Couldn't create the tenant.");
        return;
      }
      setName("");
      await load();
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-[26px] font-bold text-ink-700">Schools &amp; Tenants</h1>
        <p className="mt-1 text-sm text-ink-500">
          Create a new school/district tenant — the first step of onboarding (story ADM-01).
        </p>
      </div>

      <form
        onSubmit={onCreate}
        className="flex flex-col gap-4 rounded-2xl border border-ink-100 bg-white p-6 shadow-sm shadow-ink-100/40 sm:flex-row sm:items-end"
      >
        {error && (
          <div className="w-full rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 sm:hidden">
            {error}
          </div>
        )}
        <div className="flex-1">
          <FormField
            label="School or district name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Central Columbia School District"
          />
        </div>
        <Button type="submit" variant="primary" disabled={creating}>
          {creating ? "Creating…" : "Create tenant"}
        </Button>
      </form>
      {error && (
        <div className="hidden rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 sm:block">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-sm shadow-ink-100/40">
        <div className="flex items-center gap-3 border-b border-ink-100 bg-cream-50/60 px-6 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
            <SchoolIcon className="h-4.5 w-4.5" />
          </div>
          <p className="font-display text-sm font-bold text-ink-700">
            {tenants ? `${tenants.length} tenant${tenants.length === 1 ? "" : "s"}` : "Loading…"}
          </p>
        </div>
        {tenants && tenants.length === 0 && (
          <p className="px-6 py-8 text-center text-sm text-ink-400">
            No tenants yet — create the first one above.
          </p>
        )}
        {tenants && tenants.length > 0 && (
          <ul className="divide-y divide-ink-100">
            {tenants.map((t) => (
              <li key={t.id} className="flex items-center justify-between px-6 py-4">
                <div>
                  <p className="text-sm font-semibold text-ink-700">{t.name}</p>
                  <p className="text-xs text-ink-400">
                    Created {new Date(t.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    t.status === "active" ? "bg-brand-50 text-brand-700" : "bg-ink-50 text-ink-500"
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
