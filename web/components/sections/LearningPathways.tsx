"use client";

import { useState } from "react";
import { Eyebrow } from "@/components/ui/Pill";
import { Button } from "@/components/ui/Button";

type Course = { provider: string; title: string };
type Column = { icon: "sprout" | "bulb" | "rocket"; title: string; subtitle: string; courses: Course[] };

const gradePathway: Column[] = [
  {
    icon: "sprout",
    title: "Grades 4–6",
    subtitle: "Foundational Programming Logic",
    courses: [
      { provider: "HarvardX", title: "Introduction to Scratch Programming" },
      { provider: "Stanford", title: "Computer Science 101" },
      { provider: "MIT xPRO", title: "Introduction to Computer Science (CS50)" },
    ],
  },
  {
    icon: "bulb",
    title: "Grades 7–9",
    subtitle: "Building Blocks: Data Handling & Web Basics",
    courses: [
      { provider: "HarvardX", title: "Introduction to Web Programming with Python and JavaScript" },
      { provider: "HarvardX", title: "Introduction to Databases" },
      { provider: "Stanford", title: "Introduction to SQL & Databases" },
    ],
  },
  {
    icon: "rocket",
    title: "Grades 10–12",
    subtitle: "Advanced Specialization & Professional Tooling",
    courses: [
      { provider: "Stanford Online", title: "Algorithms — Design and Analysis, Part 1" },
      { provider: "Stanford Online", title: "Algorithms — Design and Analysis, Part 2" },
      { provider: "Stanford Online", title: "Introduction to Artificial Intelligence with Python" },
    ],
  },
];

const careerPathway: Column[] = [
  {
    icon: "rocket",
    title: "AI Engineer Pathway",
    subtitle: "AI Engineering Fundamentals",
    courses: [
      { provider: "HarvardX", title: "Introduction to Scratch Programming" },
      { provider: "Stanford", title: "Computer Science 101" },
      { provider: "HarvardX", title: "Introduction to Computer Science" },
      { provider: "MIT xPRO", title: "Introduction to Web Programming with Python and JavaScript" },
      { provider: "HarvardX", title: "Introduction to Database" },
    ],
  },
  {
    icon: "rocket",
    title: "Data Analyst/Scientist Pathway",
    subtitle: "Data Analysis, Statistical Modeling & Machine Learning",
    courses: [
      { provider: "HarvardX", title: "Introduction to Scratch Programming" },
      { provider: "Stanford", title: "Computer Science 101" },
      { provider: "HarvardX", title: "Introduction to Computer Science (CS50)" },
      { provider: "MIT xPRO", title: "Introduction to Computer Science and Programming with Python" },
      { provider: "HarvardX", title: "Introduction to Programming with Python" },
    ],
  },
];

function ColumnIcon({ type }: { type: Column["icon"] }) {
  const paths: Record<Column["icon"], React.ReactNode> = {
    sprout: (
      <path
        d="M12 21V11m0 0c0-3.5-2.5-6-6-6 0 3.5 2.5 6 6 6Zm0 0c0-4 2.7-7 6.5-7.5C18.2 7.6 16 11 12 11Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
    bulb: (
      <path
        d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.44 1 .96 1.1 1.6h4.8c.1-.64.5-1.16 1.1-1.6A6 6 0 0 0 12 3Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
    rocket: (
      <path
        d="m12 15-3 3H6l3-3M9 9l6 6 3-3c1.5-3.5 1-6.5-1-9-2.5 1-4.5 3-6 6-2 1-4 3-3 3.5.5 1.5 1.5 2.5 1 4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  };
  return (
    <div className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-white bg-forest-700 text-white">
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
        {paths[type]}
      </svg>
    </div>
  );
}

export function LearningPathways() {
  const [tab, setTab] = useState<"grade" | "career">("grade");
  const columns = tab === "grade" ? gradePathway : careerPathway;

  return (
    <section id="pathways" className="bg-white px-6 py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Eyebrow>Learning Pathways</Eyebrow>
        <h2 className="max-w-2xl font-display text-3xl font-bold text-ink-700 balance sm:text-4xl">
          Start with your goal, not just a course.
        </h2>
        <p className="mt-4 max-w-xl text-ink-500">
          Pick a pathway and we build a personalised flow — from first class to
          enrollment, placement, or a career.
        </p>

        <div className="mt-8 inline-flex rounded-full border border-ink-100 bg-white p-1">
          <button
            onClick={() => setTab("grade")}
            className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${
              tab === "grade" ? "bg-brand-600 text-white" : "text-ink-600"
            }`}
          >
            Grade Pathway · K-12
          </button>
          <button
            onClick={() => setTab("career")}
            className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${
              tab === "career" ? "bg-brand-600 text-white" : "text-ink-600"
            }`}
          >
            Job &amp; Career Pathway
          </button>
        </div>

        <div className="mt-8 rounded-2xl border border-ink-100 bg-cream-50 p-8">
          <div
            className={`grid gap-8 ${
              columns.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2"
            }`}
          >
            {columns.map((col) => (
              <div key={col.title} className="text-center">
                <div className="flex justify-center">
                  <ColumnIcon type={col.icon} />
                </div>
                <h3 className="mt-4 font-display text-lg font-bold text-brand-700">
                  {col.title}
                </h3>
                <p className="mt-1 text-sm text-ink-500">{col.subtitle}</p>
                <div className="mt-5 space-y-3 text-left">
                  {col.courses.map((c) => (
                    <div
                      key={c.title}
                      className="rounded-xl border border-ink-100 bg-white p-4"
                    >
                      <p className="text-right text-xs font-semibold text-ink-500">
                        {c.provider}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-ink-700">
                        {c.title}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            <Button href="/#get-started" variant="primary">
              View full recommended track
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
