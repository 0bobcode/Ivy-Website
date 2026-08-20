"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FormField } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/Button";
import type { CourseDetail } from "@/lib/catalogApi";

export function CourseEditorClient({ courseId }: { courseId: string }) {
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonText, setLessonText] = useState("");
  const [addingText, setAddingText] = useState(false);

  const [uploadTitle, setUploadTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  async function load() {
    const res = await fetch(`/api/teacher/courses/${courseId}`);
    if (res.ok) setCourse(await res.json());
    else setError("Couldn't load this course.");
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  async function togglePublish() {
    if (!course) return;
    setBusy(true);
    setError(null);
    try {
      const action = course.status === "PUBLISHED" ? "unpublish" : "publish";
      const res = await fetch(`/api/teacher/courses/${courseId}/${action}`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.detail ?? "That didn't work.");
        return;
      }
      setCourse(data);
    } finally {
      setBusy(false);
    }
  }

  async function onAddTextLesson(e: React.FormEvent) {
    e.preventDefault();
    setAddingText(true);
    setError(null);
    try {
      const res = await fetch(`/api/teacher/courses/${courseId}/lessons`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: lessonTitle, textContent: lessonText }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.detail ?? "Couldn't add that lesson.");
        return;
      }
      setLessonTitle("");
      setLessonText("");
      await load();
    } finally {
      setAddingText(false);
    }
  }

  async function onUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.set("title", uploadTitle || file.name);
      formData.set("file", file);
      const res = await fetch(`/api/teacher/courses/${courseId}/lessons/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.detail ?? "Couldn't upload that file.");
        return;
      }
      setUploadTitle("");
      setFile(null);
      await load();
    } finally {
      setUploading(false);
    }
  }

  if (!course) {
    return <p className="text-sm text-ink-500">{error ?? "Loading…"}</p>;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link href="/dashboard/teacher/courses" className="text-sm font-semibold text-brand-700 underline underline-offset-4">
        ← My Courses
      </Link>

      {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="flex flex-wrap items-start justify-between gap-4 rounded-2xl border border-ink-100 bg-white p-6 shadow-sm shadow-ink-100/40">
        <div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              course.status === "PUBLISHED" ? "bg-brand-50 text-brand-700" : "bg-amber-50 text-amber-700"
            }`}
          >
            {course.status === "PUBLISHED" ? "Published" : "Draft"}
          </span>
          <h1 className="mt-3 font-display text-2xl font-bold text-ink-700">{course.title}</h1>
          {course.description && <p className="mt-2 text-sm text-ink-500">{course.description}</p>}
        </div>
        <Button onClick={togglePublish} variant={course.status === "PUBLISHED" ? "outline" : "primary"} disabled={busy}>
          {busy ? "…" : course.status === "PUBLISHED" ? "Unpublish" : "Publish"}
        </Button>
      </div>

      <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-sm shadow-ink-100/40">
        <h2 className="font-display text-lg font-bold text-ink-700">Lessons ({course.lessons.length})</h2>
        {course.lessons.length === 0 ? (
          <p className="mt-3 text-sm text-ink-400">No lessons yet — add one below.</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {course.lessons.map((l, i) => (
              <li key={l.id} className="rounded-xl border border-ink-100 p-3">
                <p className="text-xs font-semibold text-ink-400">
                  {i + 1}. {l.contentType}
                </p>
                <p className="text-sm font-semibold text-ink-700">{l.title}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-sm shadow-ink-100/40">
        <h2 className="font-display text-lg font-bold text-ink-700">Add a text lesson</h2>
        <form onSubmit={onAddTextLesson} className="mt-4 space-y-4">
          <FormField label="Lesson title" required value={lessonTitle} onChange={(e) => setLessonTitle(e.target.value)} placeholder="e.g. What is a neuron?" />
          <div>
            <label className="mb-2 block text-sm text-ink-600">Content</label>
            <textarea
              rows={4}
              required
              value={lessonText}
              onChange={(e) => setLessonText(e.target.value)}
              placeholder="Write the lesson content..."
              className="w-full rounded-lg border border-ink-100 px-4 py-3 text-sm text-ink-700 placeholder:text-ink-400 focus:border-brand-500 focus:outline-none"
            />
          </div>
          <Button type="submit" variant="outline" disabled={addingText}>
            {addingText ? "Adding…" : "Add text lesson"}
          </Button>
        </form>
      </div>

      <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-sm shadow-ink-100/40">
        <h2 className="font-display text-lg font-bold text-ink-700">Upload a video or file</h2>
        <form onSubmit={onUpload} className="mt-4 space-y-4">
          <FormField label="Lesson title" value={uploadTitle} onChange={(e) => setUploadTitle(e.target.value)} placeholder="e.g. Lecture slides" />
          <div>
            <label className="mb-2 block text-sm text-ink-600">File</label>
            <input
              type="file"
              required
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="w-full rounded-lg border border-ink-100 px-4 py-2.5 text-sm text-ink-700"
            />
          </div>
          <Button type="submit" variant="outline" disabled={uploading || !file}>
            {uploading ? "Uploading…" : "Upload"}
          </Button>
        </form>
      </div>
    </div>
  );
}
