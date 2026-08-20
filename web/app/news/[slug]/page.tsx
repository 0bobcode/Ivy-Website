import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { newsItems } from "@/lib/content/news";

export function generateStaticParams() {
  return newsItems.map((n) => ({ slug: n.slug }));
}

export default async function NewsDetailPage(props: PageProps<"/news/[slug]">) {
  const { slug } = await props.params;
  const item = newsItems.find((n) => n.slug === slug);
  if (!item) notFound();

  return (
    <>
      <div className="border-b border-ink-100 bg-cream-50">
        <Header forceSolid />
      </div>
      <article className="mx-auto max-w-3xl px-6 py-16 lg:px-8">
        <Link href="/news" className="text-sm font-semibold text-brand-700 underline underline-offset-4">
          ← Back to Newsroom
        </Link>
        <p className="mt-6 text-xs text-ink-400">{item.date}</p>
        <h1 className="mt-2 font-display text-2xl font-bold text-ink-700 balance sm:text-3xl">
          {item.title}
        </h1>
        <div className="relative mt-8 h-72 w-full overflow-hidden rounded-2xl">
          <Image src={item.photo} alt={item.title} fill sizes="768px" className="object-cover" />
        </div>
        <div className="mt-8 rounded-xl border border-dashed border-ink-200 bg-cream-50 p-6 text-sm leading-6 text-ink-500">
          The full story for this announcement is being written up — check back soon, or{" "}
          <Link href="/#get-started" className="font-semibold text-brand-700 underline underline-offset-4">
            get in touch
          </Link>{" "}
          if you&rsquo;d like details on this partnership now.
        </div>
      </article>
      <Footer />
    </>
  );
}
