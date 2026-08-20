import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { TenantsClient } from "./TenantsClient";

export default async function TenantsPage() {
  const session = await getSession();
  // Defense in depth: the backend already rejects non-admins with 403 on
  // every call, but redirecting here avoids rendering an admin-only page
  // shell for a role that can't use anything on it (ARCHITECTURE.md §7.2 —
  // RBAC enforced at gateway *and* service layer; this is the closest this
  // project gets to a gateway layer today).
  if (!session || !session.roles.includes("ADMIN")) {
    redirect("/dashboard");
  }

  return <TenantsClient />;
}
