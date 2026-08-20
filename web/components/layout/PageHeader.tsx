import { Header } from "@/components/layout/Header";
import { Eyebrow } from "@/components/ui/Pill";

export function PageHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="border-b border-ink-100 bg-cream-50">
      <Header forceSolid />
      <div className="mx-auto max-w-4xl px-6 py-16 text-center lg:px-8">
        <div className="flex justify-center">
          <Eyebrow>{eyebrow}</Eyebrow>
        </div>
        <h1 className="font-display text-3xl font-bold text-ink-700 balance sm:text-4xl">{title}</h1>
        {subtitle && <p className="mt-4 text-ink-500">{subtitle}</p>}
      </div>
    </div>
  );
}
