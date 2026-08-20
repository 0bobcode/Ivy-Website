"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthShell, FormError, FormField } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mfaCode, setMfaCode] = useState("");
  const [mfaRequired, setMfaRequired] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, mfaCode: mfaCode || undefined }),
      });
      const data = await res.json();
      if (res.ok) {
        router.push("/dashboard");
        router.refresh();
        return;
      }
      if (data.code === "MFA_CODE_REQUIRED") {
        setMfaRequired(true);
        setError("Enter the 6-digit code from your authenticator app.");
      } else {
        setError(data.detail ?? "Something went wrong. Please try again.");
      }
    } catch {
      setError("Couldn't reach the server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to continue your learning."
      footer={
        <>
          Don&rsquo;t have an account?{" "}
          <Link href="/signup" className="font-semibold text-brand-700 underline underline-offset-4">
            Start learning
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-5">
        <FormError message={error} />
        <FormField
          label="Email address"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          disabled={mfaRequired}
        />
        <FormField
          label="Password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••••••"
          disabled={mfaRequired}
        />
        {mfaRequired && (
          <FormField
            label="Authenticator code"
            type="text"
            inputMode="numeric"
            autoFocus
            required
            value={mfaCode}
            onChange={(e) => setMfaCode(e.target.value)}
            placeholder="123456"
          />
        )}
        <div className="flex items-center justify-between text-sm">
          <Link href="/forgot-password" className="font-medium text-brand-700 hover:underline">
            Forgot password?
          </Link>
        </div>
        <Button type="submit" variant="primary" className="w-full">
          {loading ? "Signing in…" : mfaRequired ? "Verify & sign in" : "Sign In"}
        </Button>
      </form>
    </AuthShell>
  );
}
