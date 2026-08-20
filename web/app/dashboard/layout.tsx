import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { navForRoles, roleLabels } from "@/lib/dashboardNav";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

export default async function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const items = navForRoles(session.roles);
  const labels = session.roles.map((r) => roleLabels[r] ?? r);

  return (
    <DashboardShell
      items={items}
      roleLabel={labels[0] ?? "Student"}
      email={session.email ?? session.userId}
      roleLabels={labels}
    >
      {children}
    </DashboardShell>
  );
}
