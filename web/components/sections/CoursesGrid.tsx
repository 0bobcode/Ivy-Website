import Link from "next/link";
import { Eyebrow } from "@/components/ui/Pill";
import { TextLink } from "@/components/ui/Button";
import { courses } from "@/lib/content/courses";

export function CoursesGrid() {
  return (
    <section id="courses" className="bg-forest-700 px-6 py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Eyebrow tone="light">Courses</Eyebrow>
            <h2 className="max-w-xl font-display text-3xl font-bold text-white balance sm:text-4xl">
              Future-ready courses, taught by expert mentors.
            </h2>
          </div>
          <TextLink href="/courses" className="!text-white">
            View all courses →
          </TextLink>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((c) => (
            <Link
              key={c.slug}
              href="/courses"
              className="rounded-2xl bg-white p-6 transition-shadow hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-ink-50 px-3 py-1 text-xs font-semibold text-ink-600">
                  {c.grade}
                </span>
                <span className="font-serif text-sm font-bold text-ink-500">
                  {c.provider}
                </span>
              </div>
              <h3 className="mt-5 font-display text-lg font-bold leading-snug text-ink-700">
                {c.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-ink-500">
                {c.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
