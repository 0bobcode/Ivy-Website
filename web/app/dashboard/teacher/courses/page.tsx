import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { TeacherCoursesClient } from "./TeacherCoursesClient";

export default async function TeacherCoursesPage() {
  const session = await getSession();
  if (!session || !session.roles.includes("TEACHER")) {
    redirect("/dashboard");
  }
  return <TeacherCoursesClient />;
}
