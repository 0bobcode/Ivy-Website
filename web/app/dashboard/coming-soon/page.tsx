export default async function ComingSoonPage({
  searchParams,
}: {
  searchParams: Promise<{ feature?: string }>;
}) {
  const { feature } = await searchParams;

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center rounded-2xl border border-dashed border-ink-200 bg-white px-8 py-16 text-center shadow-sm shadow-ink-100/40">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3.5 2" />
        </svg>
      </div>
      <span className="mt-4 rounded-full bg-brand-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand-700">
        On the roadmap
      </span>
      <h1 className="mt-3 font-display text-2xl font-bold text-ink-700">
        {feature ?? "This feature"} is coming
      </h1>
      <p className="mt-3 max-w-md text-sm leading-6 text-ink-500">
        This part of the console lands with its owning service in a later Phase 1 sprint —
        see <code className="rounded bg-ink-50 px-1.5 py-0.5 text-xs">docs/PHASE_1_PLAN.md</code>{" "}
        for the sequence. Everything you can click today is fully wired; this just isn&rsquo;t built yet.
      </p>
    </div>
  );
}
