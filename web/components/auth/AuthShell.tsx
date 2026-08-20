import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream-50 px-6 py-16">
      <div className="w-full max-w-md">
        <Link href="/" className="flex justify-center text-ink-700">
          <Logo />
        </Link>

        <div className="mt-8 rounded-2xl border border-ink-100 bg-white p-8 shadow-sm">
          <h1 className="font-display text-2xl font-bold text-ink-700">{title}</h1>
          <p className="mt-1.5 text-sm text-ink-500">{subtitle}</p>
          <div className="mt-6">{children}</div>
        </div>

        {footer && <p className="mt-6 text-center text-sm text-ink-500">{footer}</p>}
      </div>
    </div>
  );
}

export function FormError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      {message}
    </div>
  );
}

export function FormField({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <div>
      <label className="mb-2 block text-sm text-ink-600">{label}</label>
      <input
        {...props}
        className="w-full rounded-lg border border-ink-100 px-4 py-3 text-sm text-ink-700 placeholder:text-ink-400 focus:border-brand-500 focus:outline-none"
      />
    </div>
  );
}
