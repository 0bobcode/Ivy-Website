"use client";

import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { NavItem } from "@/lib/dashboardNav";

export function DashboardShell({
  items,
  roleLabel,
  email,
  roleLabels,
  children,
}: {
  items: NavItem[];
  roleLabel: string;
  email: string;
  roleLabels: string[];
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-cream-50">
      <div className="hidden shrink-0 border-r border-ink-100/80 lg:block">
        <Sidebar items={items} roleLabel={roleLabel} />
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-ink-900/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-72 border-r border-ink-100 shadow-xl">
            <Sidebar items={items} roleLabel={roleLabel} onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      <div className="min-w-0 flex-1">
        <Topbar email={email} roleLabels={roleLabels} onMenuClick={() => setMobileOpen(true)} />
        <main className="p-5 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
