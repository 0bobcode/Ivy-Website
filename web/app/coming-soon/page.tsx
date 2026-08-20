import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";

export default async function ComingSoonPage({
  searchParams,
}: {
  searchParams: Promise<{ topic?: string }>;
}) {
  const { topic } = await searchParams;

  return (
    <>
      <div className="border-b border-ink-100 bg-cream-50">
        <Header forceSolid />
      </div>
      <div className="mx-auto flex max-w-2xl flex-col items-center px-6 py-24 text-center lg:px-8">
        <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand-700">
          On the way
        </span>
        <h1 className="mt-4 font-display text-3xl font-bold text-ink-700 balance">
          {topic ?? "This page"} is coming soon
        </h1>
        <p className="mt-4 text-ink-500">
          We&rsquo;re still building this out. In the meantime, get in touch and
          we&rsquo;ll follow up directly.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button href="/#get-started" variant="primary">
            Talk to us
          </Button>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-ink-200 px-6 py-3 text-sm font-semibold text-ink-700 hover:border-ink-400"
          >
            Back to home
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
}
