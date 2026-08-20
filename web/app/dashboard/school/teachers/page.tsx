import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { SchoolTeachersClient } from "./SchoolTeachersClient";

export default async function SchoolTeachersPage() {
  const session = await getSession();
  if (!session || !session.roles.includes("SCHOOL_ADMIN")) {
    redirect("/dashboard");
  }

  return <SchoolTeachersClient />;
}
