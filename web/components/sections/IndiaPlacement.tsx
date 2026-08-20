import { Eyebrow } from "@/components/ui/Pill";
import { Button } from "@/components/ui/Button";

const stats = [
  { value: "1,200+", label: "Students placed" },
  { value: "40+", label: "Partner colleges" },
  { value: "GIIT", label: "Placement partner" },
  { value: "92%", label: "Placement rate" },
];

export function IndiaPlacement() {
  return (
    <section id="placement" className="bg-forest-700 px-6 py-20 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <Eyebrow tone="light">India Student Placement</Eyebrow>
          <h2 className="font-display text-3xl font-bold text-white balance sm:text-4xl">
            Bridging Indian talent to job opportunities
          </h2>
          <p className="mt-4 max-w-md text-white/75">
            Our college placement program pairs live AI &amp; coding training
            with real hiring pipelines. Through our{" "}
            <b className="text-white">GIIT partnership</b>, students train,
            get certified, and get placed — no gap between learning and a
            career.
          </p>
          <Button href="/#get-started" variant="light" className="mt-7">
            Bring this to your campus →
          </Button>
        </div>

        <div className="grid grid-cols-2 overflow-hidden rounded-2xl border border-white/25">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`p-8 ${i % 2 === 0 ? "border-r" : ""} ${
                i < 2 ? "border-b" : ""
              } border-white/25`}
            >
              <p className="font-display text-3xl font-bold text-white">
                {s.value}
              </p>
              <p className="mt-2 text-sm text-white/70">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
