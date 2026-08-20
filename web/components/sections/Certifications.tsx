import { Eyebrow } from "@/components/ui/Pill";

const certs = [
  { course: "CS50 SQL: Introduction to Databases with SQL", name: "Learner Name" },
  { course: "CS50W: Web Programming with Python and JavaScript", name: "Learner Name" },
  { course: "CS50AI: Introduction to Artificial Intelligence with Python", name: "Learner Name" },
];

export function Certifications() {
  return (
    <section id="certifications" className="bg-forest-700 px-6 py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Eyebrow tone="light">Future-Ready Certifications</Eyebrow>
        <h2 className="font-display text-3xl font-bold text-white balance sm:text-4xl">
          Recognition for Skills That Matter
        </h2>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {certs.map((c) => (
            <div
              key={c.course}
              className="rounded-lg border border-ink-100 bg-white p-6 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <p className="font-serif text-lg italic text-ink-700">Verified</p>
                <p className="font-serif text-sm font-bold text-ink-700">
                  Partner<span className="text-brand-600">X</span>
                </p>
              </div>
              <p className="text-xs font-semibold text-ink-500">Certificate</p>
              <p className="mt-6 text-xs text-ink-500">This is to certify that</p>
              <p className="mt-1 font-display text-base font-bold text-ink-700">
                {c.name}
              </p>
              <p className="mt-2 text-xs text-ink-500">
                successfully completed and received a passing grade in
              </p>
              <p className="mt-1 text-sm font-semibold text-ink-700">
                {c.course}
              </p>
              <p className="mt-4 text-[11px] text-ink-400">
                a course of study offered as part of the IvySchool.ai partner
                network.
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
