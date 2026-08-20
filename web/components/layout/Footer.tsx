"use client";

import { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import {
  FacebookIcon,
  XIcon,
  LinkedInIcon,
  YouTubeIcon,
  InstagramIcon,
} from "@/components/ui/SocialIcons";

const columns = [
  {
    heading: "Explore",
    links: [
      { label: "Pathways", href: "/#pathways" },
      { label: "AI Sandbox", href: "/coming-soon?topic=AI%20Sandbox" },
      { label: "For Institutions", href: "/#partners" },
      { label: "Resources", href: "/coming-soon?topic=Resources" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Blogs", href: "/news" },
      { label: "Student Stories", href: "/#testimonials" },
      { label: "Help Centers", href: "/help" },
      { label: "Guides", href: "/coming-soon?topic=Guides" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Careers", href: "/coming-soon?topic=Careers" },
      { label: "Press & Media", href: "/news" },
      { label: "Contact Us", href: "/#get-started" },
    ],
  },
];

const socials = [
  { Icon: FacebookIcon, label: "Facebook" },
  { Icon: XIcon, label: "X" },
  { Icon: LinkedInIcon, label: "LinkedIn" },
  { Icon: YouTubeIcon, label: "YouTube" },
  { Icon: InstagramIcon, label: "Instagram" },
];

export function Footer() {
  return (
    <footer className="bg-ink-900 text-white">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.3fr_1fr_1fr_1fr_1.1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-6 text-white/60">
              Empowering the next generation with AI-generated skills Learn .
              Build . Lead
            </p>
            <div className="mt-6 flex items-center gap-4 text-white/80">
              {socials.map(({ Icon, label }) => (
                <Link
                  key={label}
                  href={`/coming-soon?topic=Our%20${label}%20page`}
                  aria-label={label}
                  className="transition-colors hover:text-brand-400"
                >
                  <Icon className="h-4.5 w-4.5" />
                </Link>
              ))}
            </div>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                href="/coming-soon?topic=Our%20Android%20app"
                className="flex items-center gap-2 rounded-lg border border-white/25 px-3 py-2"
              >
                <span className="text-[10px] leading-tight">
                  <span className="block text-white/70">GET IT ON</span>
                  <span className="block text-sm font-semibold">
                    Google Play
                  </span>
                </span>
              </Link>
              <Link
                href="/coming-soon?topic=Our%20iOS%20app"
                className="flex items-center gap-2 rounded-lg border border-white/25 px-3 py-2"
              >
                <span className="text-[10px] leading-tight">
                  <span className="block text-white/70">Download on the</span>
                  <span className="block text-sm font-semibold">
                    App Store
                  </span>
                </span>
              </Link>
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.heading}>
              <h3 className="font-display text-base font-semibold">
                {col.heading}
              </h3>
              <ul className="mt-5 space-y-4">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/65 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <NewsletterForm />
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-sm text-white/60 sm:flex-row">
          <p>© {new Date().getFullYear()} IvySchool.ai. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/coming-soon?topic=Privacy%20Policy" className="hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/coming-soon?topic=Terms%20of%20Service" className="hover:text-white">
              Terms of Service
            </Link>
            <Link href="/coming-soon?topic=Refund%20Policy" className="hover:text-white">
              Refund Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setStatus(res.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div>
      <h3 className="font-display text-base font-semibold">Stay Updated</h3>
      <p className="mt-5 text-sm leading-6 text-white/65">
        Get the latest updates straight to your inbox
      </p>
      {status === "done" ? (
        <p className="mt-4 rounded-lg border border-brand-400/40 bg-brand-500/10 px-3 py-2.5 text-sm text-brand-300">
          You&rsquo;re subscribed — thanks!
        </p>
      ) : (
        <form onSubmit={onSubmit} className="mt-4 flex overflow-hidden rounded-lg border border-white/25">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full bg-transparent px-3 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            aria-label="Subscribe"
            className="flex shrink-0 items-center justify-center bg-brand-500 px-3.5 text-white hover:bg-brand-600 disabled:opacity-60"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
              <path
                d="M5 12h14m0 0-6-6m6 6-6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </form>
      )}
      {status === "error" && (
        <p className="mt-2 text-xs text-red-300">Something went wrong — please try again.</p>
      )}
    </div>
  );
}
