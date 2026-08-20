const partners = [
  { name: "HarvardX", className: "font-serif text-3xl font-bold text-ink-700" },
  { name: "Stanford Online", className: "font-serif text-3xl font-semibold text-[#8C1515]" },
  { name: "Duke University", className: "font-serif text-2xl font-semibold text-[#012169]" },
  { name: "Wharton Online", className: "font-serif text-2xl font-semibold text-[#990000]" },
];

export function PartnerLogos() {
  return (
    <div className="border-b border-ink-100 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-6 py-10 lg:flex-row lg:justify-between lg:gap-10 lg:px-8">
        <p className="max-w-[13rem] shrink-0 text-xs font-bold uppercase leading-relaxed tracking-wide text-ink-500">
          Partnering with the world&rsquo;s leading universities
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4 opacity-90 lg:justify-end">
          {partners.map((p) => (
            <span key={p.name} className={p.className}>
              {p.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
