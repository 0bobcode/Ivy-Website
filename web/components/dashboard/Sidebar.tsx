"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { NavItem } from "@/lib/dashboardNav";
import { iconMap } from "@/components/dashboard/icons";

export function Sidebar({
  items,
  roleLabel,
  onNavigate,
}: {
  items: NavItem[];
  roleLabel: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-72 shrink-0 flex-col bg-white">
      <div className="flex items-center gap-2 px-6 py-6">
        <Logo />
      </div>

      <p className="px-6 pb-2 text-[11px] font-bold uppercase tracking-widest text-ink-400">
        {roleLabel} console
      </p>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3">
        {items.map((item) => {
          const active = pathname === item.href.split("?")[0] && !item.href.includes("coming-soon");
          const Icon = iconMap[item.icon] ?? iconMap.home;
          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={onNavigate}
              className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                active ? "bg-brand-50 text-brand-700" : "text-ink-600 hover:bg-cream-50 hover:text-ink-700"
              }`}
            >
              {active && (
                <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-brand-600" />
              )}
              <Icon className={`h-[18px] w-[18px] shrink-0 ${active ? "text-brand-600" : "text-ink-400 group-hover:text-ink-600"}`} />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="space-y-0.5 border-t border-ink-100 px-3 pb-3 pt-2">
        <Link
          href="/help"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-500 hover:bg-cream-50 hover:text-ink-700"
        >
          <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9" />
            <path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 1.5-2.5 2-2.5 3.5M12 17h.01" />
          </svg>
          Help &amp; Support
        </Link>
        <Link
          href="/"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-500 hover:bg-cream-50 hover:text-ink-700"
        >
          <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Back to site
        </Link>
      </div>
    </aside>
  );
}
