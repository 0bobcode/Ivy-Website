import Link from "next/link";
import type { MouseEventHandler, ReactNode } from "react";

type Variant = "primary" | "outline" | "outlineLight" | "light";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand-600 text-white hover:bg-brand-700 border border-brand-600",
  outline:
    "bg-transparent text-ink-700 border border-ink-200 hover:border-ink-400",
  outlineLight:
    "bg-transparent text-white border border-white/70 hover:bg-white/10",
  light: "bg-white text-forest-800 hover:bg-cream-50 border border-white",
};

export function Button({
  href,
  variant = "primary",
  children,
  className = "",
  type,
  onClick,
  disabled,
}: {
  href?: string;
  variant?: Variant;
  children: ReactNode;
  className?: string;
  type?: "submit" | "button";
  onClick?: MouseEventHandler;
  disabled?: boolean;
}) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes} onClick={onClick}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type ?? "button"} className={classes} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

export function TextLink({
  href,
  children,
  className = "",
  onClick,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: MouseEventHandler;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 underline underline-offset-4 hover:text-brand-800 ${className}`}
    >
      {children}
    </Link>
  );
}
