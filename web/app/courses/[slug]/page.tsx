import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { EnrollButton } from "@/components/courses/EnrollButton";
import { catalogApi, CatalogApiError } from "@/lib/catalogApi";
import { getAccessToken, getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function CourseDetailPage(props: PageProps<"/courses/[slug]">) {
  const { slug: id } = await props.params;
  const token = await getAccessToken();
  const session = await getSession();
  const isStudent = session?.roles.includes("STUDENT") ?? false;

  let course;
  try {
    course = await catalogApi.view(id, token);
  } catch (e) {
    if (e instanceof CatalogApiError && e.status === 404) notFound();
    throw e;
  }

  let alreadyEnrolled = false;
  if (isStudent && token) {
    const enrolled = await catalogApi.myEnrollments(token).catch(() => []);
    alreadyEnrolled = enrolled.some((c) => c.id === course.id);
  }

  return (
    <>
      <div className="border-b border-ink-100 bg-cream-50">
        <Header forceSolid />
      </div>
      <article className="mx-auto max-w-3xl px-6 py-16 lg:px-8">
        <Link href="/courses" className="text-sm font-semibold text-brand-700 underline underline-offset-4">
          ← Back to Course Catalog
        </Link>

        <div className="mt-6 flex items-center justify-between gap-2">
          {course.gradeLabel && (
            <span className="rounded-full bg-ink-50 px-3 py-1 text-xs font-semibold text-ink-600">
              {course.gradeLabel}
            </span>
          )}
          {course.provider && (
            <span className="font-serif text-sm font-bold text-ink-500">{course.provider}</span>
          )}
        </div>
        <h1 className="mt-4 font-display text-2xl font-bold text-ink-700 balance sm:text-3xl">
          {course.title}
        </h1>
        {course.status === "DRAFT" && (
          <span className="mt-3 inline-block rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
            Draft — only visible to you
          </span>
        )}
        <p className="mt-4 text-base leading-7 text-ink-600">{course.description}</p>

        {course.lessons.length > 0 && (
          <div className="mt-8 space-y-3">
            <h2 className="font-display text-lg font-bold text-ink-700">Lessons</h2>
            {course.lessons.map((lesson, i) => (
              <div key={lesson.id} className="rounded-xl border border-ink-100 bg-white p-4">
                <p className="text-xs font-semibold text-ink-400">
                  {i + 1}. {lesson.contentType}
                </p>
                <p className="mt-1 text-sm font-semibold text-ink-700">{lesson.title}</p>
                {lesson.textContent && (
                  <p className="mt-2 text-sm leading-6 text-ink-500">{lesson.textContent}</p>
                )}
                {lesson.mediaUrl && (
                  <a
                    href={lesson.mediaUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-block text-sm font-semibold text-brand-700 underline underline-offset-4"
                  >
                    Open attachment →
                  </a>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 rounded-2xl border border-ink-100 bg-white p-6">
          <h2 className="font-display text-lg font-bold text-ink-700">Ready to start?</h2>
          {isStudent ? (
            <>
              <p className="mt-2 text-sm text-ink-500">
                One click and it's yours — no payment needed for this trial period.
              </p>
              {alreadyEnrolled ? (
                <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700">
                  You're already enrolled — find it under My Courses.
                </p>
              ) : (
                <EnrollButton courseId={course.id} />
              )}
            </>
          ) : (
            <>
              <p className="mt-2 text-sm text-ink-500">
                Create your free account to enroll — no card required for the trial class.
              </p>
              <Button href="/signup" variant="primary" className="mt-4">
                Start Learning
              </Button>
            </>
          )}
        </div>
      </article>
      <Footer />
    </>
  );
}
