import { redirect } from "next/navigation";
import { getSession, getAccessToken } from "@/lib/session";
import { catalogApi } from "@/lib/catalogApi";
import { CourseCard } from "@/components/courses/CourseCard";

export default async function StudentCoursesPage() {
  const session = await getSession();
  if (!session || !session.roles.includes("STUDENT")) {
    redirect("/dashboard");
  }

  const accessToken = await getAccessToken();
  const courses = accessToken ? await catalogApi.myEnrollments(accessToken).catch(() => []) : [];

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="font-display text-[26px] font-bold text-ink-700">My Courses</h1>
        <p className="mt-1 text-sm text-ink-500">Everything you've enrolled in (story STU-04).</p>
      </div>

      {courses.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-ink-200 bg-white px-6 py-16 text-center text-sm text-ink-500">
          You haven't enrolled in anything yet — browse the{" "}
          <a href="/courses" className="font-semibold text-brand-700 underline underline-offset-4">
            course catalog
          </a>{" "}
          to get started.
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((c) => (
            <CourseCard key={c.id} course={c} />
          ))}
        </div>
      )}
    </div>
  );
}
