"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function CourseFilters({ grades, providers }: { grades: string[]; providers: string[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateParam(key: "grade" | "provider", value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/courses${params.toString() ? `?${params}` : ""}`);
  }

  const selectClass =
    "rounded-lg border border-ink-100 bg-white px-4 py-2.5 text-sm text-ink-700 focus:border-brand-500 focus:outline-none";

  return (
    <div className="mb-8 flex flex-wrap gap-3">
      <select
        className={selectClass}
        value={searchParams.get("grade") ?? ""}
        onChange={(e) => updateParam("grade", e.target.value)}
      >
        <option value="">All grades</option>
        {grades.map((g) => (
          <option key={g} value={g}>
            {g}
          </option>
        ))}
      </select>
      <select
        className={selectClass}
        value={searchParams.get("provider") ?? ""}
        onChange={(e) => updateParam("provider", e.target.value)}
      >
        <option value="">All partners</option>
        {providers.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>
    </div>
  );
}
