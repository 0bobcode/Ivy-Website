import Link from "next/link";
import { getAccessToken } from "@/lib/session";
import { identityApi } from "@/lib/identityApi";
import { roleLabels } from "@/lib/dashboardNav";
import { GearIcon, AwardIcon, BookIcon, MapIcon } from "@/components/dashboard/icons";

export default async function DashboardHome() {
  const token = await getAccessToken();
  const me = token ? await identityApi.me(token).catch(() => null) : null;
  const roles = me?.roles.length ? me.roles : ["STUDENT"];
  const mfaEnabled = !!me?.mfaEnabled;
  const completeness = mfaEnabled ? 100 : 50;

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[26px] font-bold text-ink-700">
            Welcome{me ? `, ${me.email.split("@")[0]}` : ""}
          </h1>
          <p className="mt-1 text-sm text-ink-500">Here&rsquo;s the state of your account on IvySchool.ai.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {roles.map((r) => (
            <span key={r} className="rounded-full bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700">
              {roleLabels[r] ?? r}
            </span>
          ))}
        </div>
      </div>

      {/* Account completeness */}
      <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-sm shadow-ink-100/40">
        <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-5">
            <ProgressRing value={completeness} />
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-ink-400">Account setup</p>
              <p className="mt-1 font-display text-lg font-bold text-ink-700">
                {completeness}% complete
              </p>
              <p className="mt-0.5 text-sm text-ink-500">
                {mfaEnabled ? "Two-factor authentication is on." : "Add two-factor authentication to finish setup."}
              </p>
            </div>
          </div>
          {!mfaEnabled && (
            <Link
              href="/dashboard/settings"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
            >
              Set up MFA →
            </Link>
          )}
        </div>
      </div>

      {/* Stat tiles */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatTile icon={<BookIcon className="h-5 w-5" />} label="Enrolled courses" value="0" tint="brand" />
        <StatTile icon={<MapIcon className="h-5 w-5" />} label="Active pathways" value="0" tint="sky" />
        <StatTile icon={<AwardIcon className="h-5 w-5" />} label="Certificates earned" value="0" tint="amber" />
      </div>

      {/* Security card */}
      <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-sm shadow-ink-100/40">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-forest-50 text-forest-700">
            <GearIcon className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-display text-base font-bold text-ink-700">Two-factor authentication</p>
            <p className="mt-1 text-sm leading-6 text-ink-500">
              {mfaEnabled
                ? "Enabled — your account is protected with an authenticator app."
                : "Not enabled yet. Add an authenticator app for a second layer of security."}
            </p>
            {!mfaEnabled && (
              <Link href="/dashboard/settings" className="mt-3 inline-block text-sm font-semibold text-brand-700 underline underline-offset-4">
                Set up MFA →
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Roadmap note */}
      <div className="rounded-2xl border border-dashed border-ink-200 bg-white/60 p-6">
        <p className="text-xs font-bold uppercase tracking-wide text-ink-400">What&rsquo;s next</p>
        <p className="mt-2 text-sm leading-6 text-ink-500">
          You&rsquo;re signed in through the Identity &amp; Access service — Sprint 1 of the
          Phase 1 plan. Course browsing, enrollment, live classes, and grading come online
          in Sprints 2–5 as those services ship. Every sidebar item already routes
          somewhere real; the ones not built yet say so explicitly instead of pretending.
        </p>
      </div>
    </div>
  );
}

function StatTile({
  icon,
  label,
  value,
  tint,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tint: "brand" | "sky" | "amber";
}) {
  const tints = {
    brand: "bg-brand-50 text-brand-700",
    sky: "bg-sky-50 text-sky-700",
    amber: "bg-amber-50 text-amber-700",
  } as const;
  return (
    <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-sm shadow-ink-100/40">
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${tints[tint]}`}>{icon}</div>
      <p className="mt-4 font-display text-2xl font-bold tabular-nums text-ink-700">{value}</p>
      <p className="mt-0.5 text-sm text-ink-500">{label}</p>
    </div>
  );
}

function ProgressRing({ value }: { value: number }) {
  const size = 56;
  const stroke = 5;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <svg width={size} height={size} className="shrink-0 -rotate-90">
      <circle cx={size / 2} cy={size / 2} r={radius} stroke="currentColor" strokeWidth={stroke} fill="none" className="text-ink-100" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="currentColor"
        strokeWidth={stroke}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="text-brand-600 transition-all duration-500"
      />
    </svg>
  );
}
