import Image from "next/image";
import { Eyebrow } from "@/components/ui/Pill";
import { TextLink } from "@/components/ui/Button";
import { newsItems } from "@/lib/content/news";

export function Newsroom() {
  return (
    <section id="news" className="bg-white px-6 py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Eyebrow>Newsroom</Eyebrow>
            <h2 className="font-display text-3xl font-bold text-ink-700 sm:text-4xl">
              Latest from IvySchool.ai.
            </h2>
          </div>
          <TextLink href="/news">View all news →</TextLink>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {newsItems.map((n) => (
            <article
              key={n.slug}
              className="overflow-hidden rounded-2xl border border-ink-100"
            >
              <div className="relative h-44 w-full">
                <Image
                  src={n.photo}
                  alt={n.title}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <p className="text-xs text-ink-400">{n.date}</p>
                <h3 className="mt-2 font-display text-base font-bold leading-snug text-ink-700">
                  {n.title}
                </h3>
                <TextLink href={`/news/${n.slug}`} className="mt-4">
                  Read more →
                </TextLink>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
