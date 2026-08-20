import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { Footer } from "@/components/layout/Footer";
import { CourseCard } from "@/components/courses/CourseCard";
import { CourseFilters } from "@/components/courses/CourseFilters";
import { catalogApi } from "@/lib/catalogApi";

export const metadata: Metadata = {
  title: "Course Catalog — IvySchool.ai",
  description: "Browse every live, mentor-led course on IvySchool.ai.",
};

export default async function CoursesIndexPage(props: PageProps<"/courses">) {
  const searchParams = await props.searchParams;
  const grade = typeof searchParams.grade === "string" ? searchParams.grade : undefined;
  const provider = typeof searchParams.provider === "string" ? searchParams.provider : undefined;

  const allCourses = await catalogApi.browse().catch(() => []);
  const grades = [...new Set(allCourses.map((c) => c.gradeLabel).filter(Boolean))].sort();
  const providers = [...new Set(allCourses.map((c) => c.provider).filter(Boolean))].sort();

  const courses = grade || provider ? await catalogApi.browse({ grade, provider }).catch(() => []) : allCourses;

  const popular = allCourses.slice(0, 3);

  return (
    <>
      <PageHeader
        eyebrow="Course Catalog"
        title="Every course, in one place"
        subtitle="Live, mentor-led courses in AI, coding, and entrepreneurship — from grades 4-12 through career pathways."
      />
      <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
        <Suspense fallback={null}>
          <CourseFilters grades={grades} providers={providers} />
        </Suspense>

        {courses.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-ink-200 bg-white px-6 py-16 text-center">
            <p className="text-sm text-ink-500">
              {allCourses.length === 0 ? (
                <>
                  No published courses yet — check back soon, or{" "}
                  <Link href="/#get-started" className="font-semibold text-brand-700 underline underline-offset-4">
                    tell us what you're looking for
                  </Link>
                  .
                </>
              ) : (
                <>
                  No courses match those filters —{" "}
                  <Link href="/courses" className="font-semibold text-brand-700 underline underline-offset-4">
                    clear filters
                  </Link>{" "}
                  to see everything.
                </>
              )}
            </p>
            {popular.length > 0 && (
              <div className="mt-10 grid gap-6 text-left md:grid-cols-3">
                {popular.map((c) => (
                  <CourseCard key={c.id} course={c} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((c) => (
              <CourseCard key={c.id} course={c} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
