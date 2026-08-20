import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { SchoolProfileClient } from "./SchoolProfileClient";

export default async function SchoolProfilePage() {
  const session = await getSession();
  if (!session || !session.roles.includes("SCHOOL_ADMIN")) {
    redirect("/dashboard");
  }

  return <SchoolProfileClient />;
}
