import { redirect } from "next/navigation";
import { getSession, getAccessToken } from "@/lib/session";
import { catalogApi } from "@/lib/catalogApi";

export default async function TeacherRosterPage() {
  const session = await getSession();
  if (!session || !session.roles.includes("TEACHER")) {
    redirect("/dashboard");
  }

  const accessToken = await getAccessToken();
  const courses = accessToken ? await catalogApi.mine(accessToken).catch(() => []) : [];
  const rosters = accessToken
    ? await Promise.all(
        courses.map(async (c) => ({
          course: c,
          students: await catalogApi.roster(accessToken, c.id).catch(() => []),
        })),
      )
    : [];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-[26px] font-bold text-ink-700">My Classes / Roster</h1>
        <p className="mt-1 text-sm text-ink-500">
          Students enrolled in courses you teach — scoped to your own roster only (story TCH-03).
        </p>
      </div>

      {rosters.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-ink-200 bg-white px-6 py-16 text-center text-sm text-ink-500">
          You don't have any courses yet.
        </p>
      ) : (
        <div className="space-y-6">
          {rosters.map(({ course, students }) => (
            <div key={course.id} className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-sm shadow-ink-100/40">
              <div className="border-b border-ink-100 bg-cream-50/60 px-6 py-4">
                <p className="font-display text-sm font-bold text-ink-700">{course.title}</p>
                <p className="text-xs text-ink-400">
                  {students.length} {students.length === 1 ? "student" : "students"} enrolled
                </p>
              </div>
              {students.length === 0 ? (
                <p className="px-6 py-8 text-center text-sm text-ink-400">No enrollments yet.</p>
              ) : (
                <ul className="divide-y divide-ink-100">
                  {students.map((s) => (
                    <li key={s.studentId} className="flex items-center justify-between px-6 py-4">
                      <p className="text-sm font-semibold text-ink-700">{s.email ?? s.studentId}</p>
                      <p className="text-xs text-ink-400">
                        Enrolled {new Date(s.enrolledAt).toLocaleDateString()}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
