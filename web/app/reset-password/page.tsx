"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { AuthShell, FormError, FormField } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/Button";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/password-reset/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.detail ?? "That link is invalid or has expired.");
        return;
      }
      setDone(true);
      setTimeout(() => router.push("/login"), 2000);
    } catch {
      setError("Couldn't reach the server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        This reset link is missing its token. Request a new one from{" "}
        <Link href="/forgot-password" className="underline underline-offset-4">
          the forgot-password page
        </Link>
        .
      </p>
    );
  }

  if (done) {
    return (
      <p className="rounded-lg border border-brand-100 bg-brand-50 px-4 py-3 text-sm text-brand-800">
        Password updated — redirecting you to sign in…
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <FormError message={error} />
      <FormField
        label="New password"
        type="password"
        required
        minLength={12}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="At least 12 characters"
      />
      <Button type="submit" variant="primary" className="w-full">
        {loading ? "Updating…" : "Set new password"}
      </Button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <AuthShell
      title="Set a new password"
      subtitle="This link is single-use and expires 15 minutes after it was requested."
      footer={
        <Link href="/login" className="font-semibold text-brand-700 underline underline-offset-4">
          Back to sign in
        </Link>
      }
    >
      <Suspense fallback={null}>
        <ResetPasswordForm />
      </Suspense>
    </AuthShell>
  );
}
