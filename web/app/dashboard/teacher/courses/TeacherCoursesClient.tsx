"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FormField } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/Button";
import { BookIcon } from "@/components/dashboard/icons";
import type { CourseSummary } from "@/lib/catalogApi";

export function TeacherCoursesClient() {
  const [courses, setCourses] = useState<CourseSummary[] | null>(null);
  const [title, setTitle] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/teacher/courses");
    if (res.ok) setCourses(await res.json());
  }

  useEffect(() => {
    load();
  }, []);

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setCreating(true);
    try {
      const res = await fetch("/api/teacher/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.detail ?? "Couldn't create the course.");
        return;
      }
      setTitle("");
      await load();
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-[26px] font-bold text-ink-700">My Courses</h1>
        <p className="mt-1 text-sm text-ink-500">Author a course, add lessons, then publish it to the catalog.</p>
      </div>

      <form
        onSubmit={onCreate}
        className="flex flex-col gap-4 rounded-2xl border border-ink-100 bg-white p-6 shadow-sm shadow-ink-100/40 sm:flex-row sm:items-end"
      >
        <div className="flex-1">
          <FormField
            label="New course title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Intro to Neural Networks"
          />
        </div>
        <Button type="submit" variant="primary" disabled={creating}>
          {creating ? "Creating…" : "Create course"}
        </Button>
      </form>
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-sm shadow-ink-100/40">
        <div className="flex items-center gap-3 border-b border-ink-100 bg-cream-50/60 px-6 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
            <BookIcon className="h-4.5 w-4.5" />
          </div>
          <p className="font-display text-sm font-bold text-ink-700">
            {courses ? `${courses.length} course${courses.length === 1 ? "" : "s"}` : "Loading…"}
          </p>
        </div>
        {courses && courses.length === 0 && (
          <p className="px-6 py-8 text-center text-sm text-ink-400">
            No courses yet — create your first one above.
          </p>
        )}
        {courses && courses.length > 0 && (
          <ul className="divide-y divide-ink-100">
            {courses.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/dashboard/teacher/courses/${c.id}`}
                  className="flex items-center justify-between px-6 py-4 hover:bg-cream-50"
                >
                  <div>
                    <p className="text-sm font-semibold text-ink-700">{c.title}</p>
                    <p className="text-xs text-ink-400">
                      {c.lessonCount} {c.lessonCount === 1 ? "lesson" : "lessons"}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      c.status === "PUBLISHED" ? "bg-brand-50 text-brand-700" : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {c.status === "PUBLISHED" ? "Published" : "Draft"}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
