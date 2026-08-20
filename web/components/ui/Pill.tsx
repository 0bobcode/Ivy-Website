export function Pill({
  children,
  tone = "light",
}: {
  children: React.ReactNode;
  tone?: "light" | "dark" | "brand";
}) {
  const tones = {
    light: "bg-white/95 text-ink-700",
    dark: "bg-ink-50 text-ink-600",
    brand: "bg-brand-50 text-brand-700",
  } as const;

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export function Eyebrow({
  children,
  tone = "brand",
}: {
  children: React.ReactNode;
  tone?: "brand" | "light";
}) {
  return (
    <p
      className={`mb-3 text-xs font-bold uppercase tracking-[0.14em] ${
        tone === "brand" ? "text-brand-600" : "text-brand-200"
      }`}
    >
      {children}
    </p>
  );
}
