"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

function initials(email: string) {
  const name = email.split("@")[0];
  const parts = name.split(/[._-]/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

export function Topbar({
  email,
  roleLabels,
  onMenuClick,
}: {
  email: string;
  roleLabels: string[];
  onMenuClick?: () => void;
}) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function onLogout() {
    setLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 bg-cream-50/80 px-5 py-4 backdrop-blur lg:px-8">
      <button
        onClick={onMenuClick}
        aria-label="Open menu"
        className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-600 hover:bg-white lg:hidden"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </button>

      <div className="hidden lg:block">
        <p className="text-sm font-semibold text-ink-700">
          {new Date().getHours() < 12 ? "Good morning" : new Date().getHours() < 18 ? "Good afternoon" : "Good evening"}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-semibold leading-tight text-ink-700">{email}</p>
          <p className="text-xs leading-tight text-ink-400">{roleLabels.join(" · ") || "Student"}</p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-forest-700 text-xs font-bold text-white">
          {initials(email)}
        </div>
        <button
          onClick={onLogout}
          disabled={loggingOut}
          className="rounded-full border border-ink-200 bg-white px-4 py-2 text-sm font-semibold text-ink-600 transition-colors hover:border-ink-400 disabled:opacity-60"
        >
          {loggingOut ? "…" : "Sign out"}
        </button>
      </div>
    </header>
  );
}
