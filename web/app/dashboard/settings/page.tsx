"use client";

import { useState } from "react";
import QRCode from "qrcode";
import { FormField } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/Button";
import { GearIcon } from "@/components/dashboard/icons";

type Step = "idle" | "enrolling" | "confirming" | "done";

export default function SettingsPage() {
  const [step, setStep] = useState<Step>("idle");
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function startEnrollment() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/mfa/enroll", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.detail ?? "Couldn't start MFA setup.");
        return;
      }
      setSecret(data.secret);
      setQrDataUrl(await QRCode.toDataURL(data.otpAuthUri));
      setStep("enrolling");
    } finally {
      setLoading(false);
    }
  }

  async function confirmEnrollment(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/mfa/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.detail ?? "That code didn't work. Try again.");
        return;
      }
      setStep("done");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-[26px] font-bold text-ink-700">Security settings</h1>
      <p className="mt-1 text-sm text-ink-500">Manage two-factor authentication for your account.</p>

      <div className="mt-6 overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-sm shadow-ink-100/40">
        <div className="flex items-center gap-3 border-b border-ink-100 bg-cream-50/60 px-6 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
            <GearIcon className="h-4.5 w-4.5" />
          </div>
          <p className="font-display text-sm font-bold text-ink-700">Two-factor authentication</p>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {step === "idle" && (
            <>
              <h2 className="font-display text-lg font-bold text-ink-700">Authenticator app</h2>
              <p className="mt-2 text-sm text-ink-500">
                Use Google Authenticator, 1Password, or any TOTP app to add a second step to sign-in.
              </p>
              <Button onClick={startEnrollment} variant="primary" className="mt-5">
                {loading ? "Starting…" : "Set up MFA"}
              </Button>
            </>
          )}

          {step === "enrolling" && (
            <>
              <h2 className="font-display text-lg font-bold text-ink-700">Scan this QR code</h2>
              <p className="mt-2 text-sm text-ink-500">
                Scan with your authenticator app, then enter the 6-digit code it shows.
              </p>
              {qrDataUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={qrDataUrl}
                  alt="MFA enrollment QR code"
                  className="mt-4 h-48 w-48 rounded-xl border border-ink-100 p-2"
                />
              )}
              <p className="mt-3 font-mono text-xs text-ink-400">Manual key: {secret}</p>
              <form onSubmit={confirmEnrollment} className="mt-5 flex items-end gap-3">
                <div className="flex-1">
                  <FormField
                    label="6-digit code"
                    inputMode="numeric"
                    autoFocus
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="123456"
                  />
                </div>
                <Button type="submit" variant="primary">
                  {loading ? "Verifying…" : "Verify"}
                </Button>
              </form>
            </>
          )}

          {step === "done" && (
            <p className="rounded-lg border border-brand-100 bg-brand-50 px-4 py-3 text-sm font-semibold text-brand-800">
              MFA is now enabled on your account.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
