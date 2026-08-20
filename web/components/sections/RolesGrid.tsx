import { Eyebrow } from "@/components/ui/Pill";
import { TextLink } from "@/components/ui/Button";

const roles: { title: string; description: string; icon: React.ReactNode }[] = [
  {
    title: "AI Engineer",
    description:
      "Build AI applications, train models, and master prompt engineering with hands-on projects.",
    icon: (
      <path d="M9 9a3 3 0 1 1 3 3v0a3 3 0 1 1 3 3M12 3v3m0 12v3m9-9h-3M6 12H3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    ),
  },
  {
    title: "Data Analyst",
    description:
      "Learn Python, SQL, Excel, and Power BI to turn data into actionable business insights.",
    icon: (
      <path d="M4 20V10m6 10V4m6 16v-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
  {
    title: "Entrepreneur",
    description:
      "Turn ideas into successful ventures by learning product strategy, pitching, and business growth.",
    icon: (
      <path d="M4 21V9l4-4 4 4v12M12 21V5l4 4v12M4 21h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
  {
    title: "Coding & Computer Science",
    description:
      "From Scratch and Python to full-stack apps and computational thinking.",
    icon: (
      <path d="m9 8-4 4 4 4m6-8 4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
  {
    title: "Machine Learning",
    description:
      "Learn machine learning algorithms, model training, and predictive analytics through hands-on projects.",
    icon: (
      <path d="M12 3a3 3 0 0 0-3 3c0 1 .4 1.7 1 2.3C8.7 9 8 10.3 8 12c0 1.2.5 2.2 1.3 3-1 .7-1.3 1.6-1.3 2.5A2.5 2.5 0 0 0 10.5 20h3A2.5 2.5 0 0 0 16 17.5c0-.9-.3-1.8-1.3-2.5.8-.8 1.3-1.8 1.3-3 0-1.7-.7-3-2-4.7.6-.6 1-1.3 1-2.3a3 3 0 0 0-3-3Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    ),
  },
  {
    title: "Full-Stack Developer",
    description:
      "Build modern web applications using HTML, CSS, JavaScript, and backend technologies.",
    icon: (
      <path d="M3 6h18M3 6v13h18V6M3 6l3-3h12l3 3M9 13l2 2 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
];

export function RolesGrid() {
  return (
    <section id="courses" className="bg-forest-700 px-6 py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Eyebrow tone="light">Courses</Eyebrow>
            <h2 className="max-w-xl font-display text-3xl font-bold text-white balance sm:text-4xl">
              Future-ready skills, taught live by expert mentors.
            </h2>
          </div>
          <TextLink href="/courses" className="!text-white">
            View all courses →
          </TextLink>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {roles.map((r) => (
            <div key={r.title} className="rounded-2xl bg-white p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none">
                  {r.icon}
                </svg>
              </div>
              <h3 className="mt-5 font-display text-xl font-bold text-ink-700">
                {r.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-ink-500">
                {r.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
