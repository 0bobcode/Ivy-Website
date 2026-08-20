import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { CourseEditorClient } from "./CourseEditorClient";

export default async function TeacherCourseEditorPage(props: PageProps<"/dashboard/teacher/courses/[id]">) {
  const session = await getSession();
  if (!session || !session.roles.includes("TEACHER")) {
    redirect("/dashboard");
  }
  const { id } = await props.params;
  return <CourseEditorClient courseId={id} />;
}
