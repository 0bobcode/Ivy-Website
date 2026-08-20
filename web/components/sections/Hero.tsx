import Image from "next/image";
import { Header } from "@/components/layout/Header";
import { Pill } from "@/components/ui/Pill";
import { Button } from "@/components/ui/Button";

export type HeroStat = { value: string; label: string };

export function Hero({
  tags,
  title,
  highlight,
  subcopy,
  primaryCta,
  secondaryCta,
  stats,
  image,
  imageAlt,
}: {
  tags: string[];
  title: string;
  highlight: string;
  subcopy: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  stats?: HeroStat[];
  image: string;
  imageAlt: string;
}) {
  return (
    <div className="relative isolate overflow-hidden bg-navy-900">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(120deg, #0e1a2b 20%, #16283e 55%, #1f3b57 100%)",
        }}
      />

      <div
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-[46%] lg:block"
        style={{
          maskImage: "linear-gradient(to right, transparent, black 22%)",
          WebkitMaskImage: "linear-gradient(to right, transparent, black 22%)",
        }}
      >
        <Image
          src={image}
          alt={imageAlt}
          fill
          priority
          sizes="46vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-navy-900/25" />
      </div>

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      <Header />

      <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-8 lg:px-8 lg:pb-28 lg:pt-12">
        <div className="max-w-2xl">
          <div className="flex flex-wrap gap-2">
            {tags.map((t) => (
              <Pill key={t}>{t}</Pill>
            ))}
          </div>

          <h1 className="mt-6 font-display text-4xl font-bold leading-[1.08] text-white balance sm:text-5xl lg:text-6xl">
            {title} <span className="text-brand-400">{highlight}</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-7 text-white/75 sm:text-lg">
            {subcopy}
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Button href={primaryCta.href} variant="primary">
              {primaryCta.label}
            </Button>
            <Button href={secondaryCta.href} variant="outlineLight">
              {secondaryCta.label}
            </Button>
          </div>

          {stats && (
            <dl className="mt-14 grid max-w-xl grid-cols-4 gap-4 border-t border-white/15 pt-8">
              {stats.map((s) => (
                <div key={s.label}>
                  <dt className="sr-only">{s.label}</dt>
                  <dd className="font-display text-2xl font-bold text-white sm:text-3xl">
                    {s.value}
                  </dd>
                  <dd className="mt-1 text-xs text-white/60 sm:text-sm">
                    {s.label}
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </div>
    </div>
  );
}
