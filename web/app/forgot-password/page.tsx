"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthShell, FormField } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/Button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [devResetToken, setDevResetToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/auth/password-reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json().catch(() => ({}));
    setDevResetToken(data.devResetToken || null);
    setLoading(false);
    setSent(true);
  }

  return (
    <AuthShell
      title="Reset your password"
      subtitle="We'll email you a link to get back in."
      footer={
        <Link href="/login" className="font-semibold text-brand-700 underline underline-offset-4">
          Back to sign in
        </Link>
      }
    >
      {sent ? (
        <div className="space-y-4">
          <p className="rounded-lg border border-brand-100 bg-brand-50 px-4 py-3 text-sm text-brand-800">
            If an account exists for <b>{email}</b>, a reset link is on its way.
          </p>
          {devResetToken && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              <p className="font-semibold">Dev mode — no email service is wired up yet.</p>
              <Link
                href={`/reset-password?token=${encodeURIComponent(devResetToken)}`}
                className="mt-2 inline-block break-all font-semibold underline underline-offset-4"
              >
                Continue to reset your password →
              </Link>
            </div>
          )}
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-5">
          <FormField
            label="Email address"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
          />
          <Button type="submit" variant="primary" className="w-full">
            {loading ? "Sending…" : "Send reset link"}
          </Button>
        </form>
      )}
    </AuthShell>
  );
}
