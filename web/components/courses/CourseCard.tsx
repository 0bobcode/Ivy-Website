import Image from "next/image";
import Link from "next/link";
import { SchoolIcon } from "@/components/dashboard/icons";
import type { CourseSummary } from "@/lib/catalogApi";

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export function CourseCard({ course }: { course: CourseSummary }) {
  const bookable = course.seatsLeft !== null;

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-ink-100 bg-gradient-to-b from-purple-50/70 to-pink-50/40 shadow-sm shadow-ink-100/40 transition-shadow hover:shadow-md">
      <div className="relative aspect-[16/10] w-full bg-ink-100">
        {course.imageUrl ? (
          <Image src={course.imageUrl} alt={course.title} fill className="object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-ink-300">
            <SchoolIcon className="h-10 w-10" />
          </div>
        )}
        {bookable && (
          <span className="absolute left-3 top-3 rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white shadow-sm">
            Only {course.seatsLeft} {course.seatsLeft === 1 ? "seat" : "seats"} left!
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-6">
        {course.provider && (
          <div className="flex items-center gap-2 text-ink-500">
            <SchoolIcon className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wide">{course.provider}</span>
          </div>
        )}

        <h3 className="font-display text-lg font-bold leading-snug text-ink-700">{course.title}</h3>

        <p className="text-sm leading-6 text-ink-500">{course.description}</p>

        {course.features.length > 0 && (
          <ul className="mt-1 space-y-1.5">
            {course.features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-ink-600">
                <CheckIcon />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto pt-3">
          {bookable ? (
            <Link
              href={`/courses/${course.id}`}
              className="block rounded-lg bg-gradient-to-r from-violet-500 to-pink-500 px-4 py-3 text-center text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
            >
              View Details
            </Link>
          ) : (
            <span className="block cursor-not-allowed rounded-lg bg-ink-100 px-4 py-3 text-center text-sm font-semibold text-ink-400">
              Details Coming Soon
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
