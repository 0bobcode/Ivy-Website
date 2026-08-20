"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export function EnrollButton({ courseId }: { courseId: string }) {
  const router = useRouter();
  const [state, setState] = useState<"idle" | "enrolling" | "enrolled" | "error">("idle");

  async function onEnroll() {
    setState("enrolling");
    const res = await fetch(`/api/courses/${courseId}/enroll`, { method: "POST" });
    if (res.ok) {
      setState("enrolled");
      router.refresh();
    } else {
      setState("error");
    }
  }

  if (state === "enrolled") {
    return (
      <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700">
        You're enrolled — find it under My Courses.
      </p>
    );
  }

  return (
    <div className="mt-4">
      <Button variant="primary" onClick={onEnroll} disabled={state === "enrolling"}>
        {state === "enrolling" ? "Enrolling…" : "Enroll now"}
      </Button>
      {state === "error" && <p className="mt-2 text-sm text-red-700">Something went wrong — try again.</p>}
    </div>
  );
}
