import Image from "next/image";
import { Eyebrow } from "@/components/ui/Pill";

const testimonials = [
  {
    quote:
      "I built my first AI agent in eight weeks. The live mentors actually explain the why, not just the how.",
    name: "Aarav Mehta",
    role: "Student · Grade 10",
    initials: "AM",
    tint: "bg-forest-500",
    photo: "/images/testimonial-aarav.jpg",
  },
  {
    quote:
      "My daughter looks forward to class every week. The pathway kept her motivated instead of jumping between random courses.",
    name: "Priya Nair",
    role: "Parent",
    initials: "PN",
    tint: "bg-brand-600",
    photo: "/images/testimonial-priya.jpg",
  },
  {
    quote:
      "The pathways plugged straight into our standards. Rollout was smooth and the mentor support is excellent.",
    name: "Dr. Susan Clark",
    role: "Curriculum Lead, School District",
    initials: "SC",
    tint: "bg-sky-600",
    photo: "/images/testimonial-susan.jpg",
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="bg-forest-700 px-6 py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Eyebrow tone="light">What People Say</Eyebrow>
        <h2 className="font-display text-3xl font-bold text-white balance sm:text-4xl">
          Students, parents and schools.
        </h2>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="overflow-hidden rounded-2xl border border-white/15 bg-cream-50"
            >
              <div className="relative h-48 w-full">
                <Image
                  src={t.photo}
                  alt={`${t.name} portrait`}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 m-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-forest-800 shadow-lg"
                >
                  <svg viewBox="0 0 24 24" className="ml-0.5 h-5 w-5" fill="currentColor">
                    <path d="M8 5v14l11-7L8 5Z" />
                  </svg>
                </div>
              </div>
              <div className="p-6">
                <div className="flex gap-0.5 text-brand-600">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor">
                      <path d="M10 1.5l2.6 5.6 6.1.7-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6-4.5-4.2 6.1-.7L10 1.5Z" />
                    </svg>
                  ))}
                </div>
                <p className="mt-4 text-sm italic leading-6 text-ink-600">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-5 flex items-center gap-3">
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white ${t.tint}`}
                  >
                    {t.initials}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-ink-700">
                      {t.name}
                    </p>
                    <p className="text-xs text-ink-500">{t.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
