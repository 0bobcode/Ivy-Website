"use client";

import { useEffect, useState } from "react";
import { FormField } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/Button";
import type { TenantSummary } from "@/lib/identityApi";

export function SchoolProfileClient() {
  const [tenant, setTenant] = useState<TenantSummary | null>(null);
  const [name, setName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/school/tenant")
      .then((res) => (res.ok ? res.json() : null))
      .then((t: TenantSummary | null) => {
        if (t) {
          setTenant(t);
          setName(t.name);
          setLogoUrl(t.logoUrl ?? "");
          setDescription(t.description ?? "");
        }
      });
  }, []);

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaved(false);
    setSaving(true);
    try {
      const res = await fetch("/api/school/tenant", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, logoUrl: logoUrl || null, description: description || null }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.detail ?? "Couldn't save your school profile.");
        return;
      }
      setTenant(data);
      setSaved(true);
    } finally {
      setSaving(false);
    }
  }

  if (!tenant) {
    return <p className="text-sm text-ink-500">Loading…</p>;
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-[26px] font-bold text-ink-700">School Profile</h1>
        <p className="mt-1 text-sm text-ink-500">
          Your school's name, logo, and description as it appears on the platform (story SAD-01).
        </p>
      </div>

      <form
        onSubmit={onSave}
        className="space-y-5 rounded-2xl border border-ink-100 bg-white p-6 shadow-sm shadow-ink-100/40"
      >
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        )}
        {saved && (
          <div className="rounded-lg border border-brand-100 bg-brand-50 px-4 py-3 text-sm text-brand-700">
            Saved.
          </div>
        )}
        <FormField label="School or district name" required value={name} onChange={(e) => setName(e.target.value)} />
        <FormField
          label="Logo URL"
          value={logoUrl}
          onChange={(e) => setLogoUrl(e.target.value)}
          placeholder="https://…"
        />
        <div>
          <label className="mb-2 block text-sm text-ink-600">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full rounded-lg border border-ink-100 px-4 py-3 text-sm text-ink-700 placeholder:text-ink-400 focus:border-brand-500 focus:outline-none"
          />
        </div>
        <Button type="submit" variant="primary" disabled={saving}>
          {saving ? "Saving…" : "Save profile"}
        </Button>
      </form>
    </div>
  );
}
