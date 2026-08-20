import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { SchoolRosterClient } from "./SchoolRosterClient";

export default async function SchoolRosterPage() {
  const session = await getSession();
  if (!session || !session.roles.includes("SCHOOL_ADMIN")) {
    redirect("/dashboard");
  }

  return <SchoolRosterClient />;
}
