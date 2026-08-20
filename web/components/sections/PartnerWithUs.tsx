import { Eyebrow } from "@/components/ui/Pill";
import { TextLink } from "@/components/ui/Button";

const cards = [
  {
    title: "For US Schools & Colleges",
    body: (
      <>
        Bring AI, coding and entrepreneurship into your curriculum with
        ready-made, standards-aligned pathways and live mentors. Now rolling
        out with <b>Central Columbia School District</b>.
      </>
    ),
    cta: "Explore programs",
  },
  {
    title: "For Indian Colleges",
    body: (
      <>
        Bring AI, coding and entrepreneurship into your curriculum with
        ready-made, standards-aligned pathways and live mentors. Now rolling
        out with <b>Delhi Technical University</b>.
      </>
    ),
    cta: "Explore programs",
  },
  {
    title: "For Business",
    body: "Upskill teams in applied AI and build a hiring pipeline of job-ready, placement-tested talent sourced through our college network.",
    cta: "Talk to our team",
  },
];

export function PartnerWithUs() {
  return (
    <section id="partners" className="bg-cream-50 px-6 py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Eyebrow>Partner With Us</Eyebrow>
        <h2 className="max-w-2xl font-display text-3xl font-bold text-ink-700 balance sm:text-4xl">
          Built for students, schools, colleges and business.
        </h2>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {cards.map((c) => (
            <div
              key={c.title}
              className="rounded-2xl border border-ink-100 bg-white p-7"
            >
              <h3 className="font-display text-xl font-bold text-ink-700">
                {c.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-ink-500">{c.body}</p>
              <TextLink href="/#get-started" className="mt-5">
                {c.cta} →
              </TextLink>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
