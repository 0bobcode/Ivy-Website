import { redirect } from "next/navigation";
import { getSession, getAccessToken } from "@/lib/session";
import { catalogApi } from "@/lib/catalogApi";
import { CourseCard } from "@/components/courses/CourseCard";

export default async function AdminCoursesPage() {
  const session = await getSession();
  // Defense in depth: the backend already rejects non-admins with 403 on
  // every call, but redirecting here avoids rendering an admin-only page
  // shell for a role that can't use anything on it (ARCHITECTURE.md §7.2).
  if (!session || !session.roles.includes("ADMIN")) {
    redirect("/dashboard");
  }

  const accessToken = await getAccessToken();
  const courses = accessToken ? await catalogApi.all(accessToken).catch(() => []) : [];

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="font-display text-[26px] font-bold text-ink-700">Course Catalog</h1>
        <p className="mt-1 text-sm text-ink-500">
          Every course across every teacher and provider, regardless of publish status (story ADM-05).
        </p>
      </div>

      {courses.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-ink-200 bg-white px-6 py-16 text-center text-sm text-ink-500">
          No courses yet.
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((c) => (
            <div key={c.id} className="relative">
              <span
                className={`absolute right-3 top-3 z-10 rounded-full px-3 py-1 text-xs font-semibold shadow-sm ${
                  c.status === "PUBLISHED" ? "bg-emerald-600 text-white" : "bg-ink-500 text-white"
                }`}
              >
                {c.status === "PUBLISHED" ? "Published" : "Draft"}
              </span>
              <CourseCard course={c} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
