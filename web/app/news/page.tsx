import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { Footer } from "@/components/layout/Footer";
import { newsItems } from "@/lib/content/news";

export const metadata: Metadata = {
  title: "Newsroom — IvySchool.ai",
  description: "The latest school, college, and business partnerships from IvySchool.ai.",
};

export default function NewsIndexPage() {
  return (
    <>
      <PageHeader
        eyebrow="Newsroom"
        title="Latest from IvySchool.ai"
        subtitle="Partnership announcements and program launches, as they happen."
      />
      <div className="mx-auto max-w-5xl px-6 py-16 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2">
          {newsItems.map((n) => (
            <Link
              key={n.slug}
              href={`/news/${n.slug}`}
              className="group overflow-hidden rounded-2xl border border-ink-100 transition-shadow hover:shadow-md"
            >
              <div className="relative h-48 w-full">
                <Image src={n.photo} alt={n.title} fill sizes="50vw" className="object-cover" />
              </div>
              <div className="p-6">
                <p className="text-xs text-ink-400">{n.date}</p>
                <h2 className="mt-2 font-display text-lg font-bold leading-snug text-ink-700 group-hover:text-brand-700">
                  {n.title}
                </h2>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}
