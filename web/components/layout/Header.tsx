"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";

const navLinks = [
  { label: "About", href: "/about" },
  {
    label: "Pathways",
    href: "/#pathways",
    dropdown: [
      { label: "Grade Pathway · K-12", href: "/#pathways" },
      { label: "Job & Career Pathway", href: "/#pathways" },
    ],
  },
  { label: "For Schools", href: "/#partners" },
  { label: "For Colleges", href: "/#partners" },
  { label: "For Business", href: "/#partners" },
  { label: "News", href: "/#news" },
];

export function Header({ forceSolid = false }: { forceSolid?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [pathwaysOpen, setPathwaysOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (forceSolid) return;
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [forceSolid]);

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const solid = forceSolid || scrolled || mobileOpen;

  return (
    <header
      className={`sticky top-0 z-40 transition-colors duration-200 ${
        solid
          ? "border-b border-ink-100 bg-white/95 backdrop-blur"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link href="/" className={solid ? "text-ink-700" : "text-white"} onClick={() => setMobileOpen(false)}>
          <Logo markClassName="text-brand-400" />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) =>
            link.dropdown ? (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={() => setPathwaysOpen(true)}
                onMouseLeave={() => setPathwaysOpen(false)}
              >
                <Link
                  href={link.href}
                  className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                    solid ? "text-ink-600 hover:text-ink-700" : "text-white/90 hover:text-white"
                  }`}
                >
                  {link.label}
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none">
                    <path
                      d="m6 9 6 6 6-6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
                {pathwaysOpen && (
                  <div className="absolute left-0 top-full w-56 rounded-xl border border-ink-100 bg-white p-2 shadow-lg">
                    {link.dropdown.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        className="block rounded-lg px-3 py-2 text-sm text-ink-600 hover:bg-cream-50"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={link.label}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  solid ? "text-ink-600 hover:text-ink-700" : "text-white/90 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            )
          )}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Button href="/login" variant={solid ? "outline" : "outlineLight"} className="!px-5 !py-2.5">
            Sign In
          </Button>
          <Button href="/signup" variant="primary" className="!px-5 !py-2.5">
            Start Learning
          </Button>
        </div>

        <MobileMenuButton solid={solid} open={mobileOpen} onToggle={() => setMobileOpen((v) => !v)} />
      </div>

      {mobileOpen && (
        <div className="border-t border-ink-100 bg-white px-6 py-4 lg:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink-600 hover:bg-cream-50"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 flex flex-col gap-3 border-t border-ink-100 pt-4">
            <Button href="/login" variant="outline" onClick={() => setMobileOpen(false)}>
              Sign In
            </Button>
            <Button href="/signup" variant="primary" onClick={() => setMobileOpen(false)}>
              Start Learning
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}

function MobileMenuButton({
  solid,
  open,
  onToggle,
}: {
  solid: boolean;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className={`flex h-9 w-9 items-center justify-center rounded-lg lg:hidden ${
        solid ? "text-ink-700" : "text-white"
      }`}
      aria-label={open ? "Close menu" : "Open menu"}
      aria-expanded={open}
    >
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none">
        {open ? (
          <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        ) : (
          <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        )}
      </svg>
    </button>
  );
}
