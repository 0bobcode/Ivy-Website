"use client";

import { useState } from "react";
import { Eyebrow } from "@/components/ui/Pill";
import { Button } from "@/components/ui/Button";

const checklist = [
  "Personalised pathway in 24 hours",
  "Free trial class, no card required",
  "Placement guidance for colleges & business",
];

const initialForm = {
  fullName: "",
  email: "",
  mobile: "",
  personaType: "",
  areaOfInterest: "",
  notes: "",
};

export function LeadForm() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof typeof initialForm>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError(null);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.detail ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }
      setStatus("done");
    } catch {
      setError("Couldn't reach the server. Please try again.");
      setStatus("error");
    }
  }

  return (
    <section id="get-started" className="bg-white px-6 py-20 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <Eyebrow>Free Consultation</Eyebrow>
          <h2 className="font-display text-3xl font-bold text-ink-700 balance sm:text-4xl">
            Not sure where to start? We&rsquo;ll build your plan.
          </h2>
          <p className="mt-4 max-w-md text-ink-500">
            Tell us a little about the learner and their goals. An advisor
            will recommend the right pathway — for a student, a school, a
            college placement cohort, or a team.
          </p>
          <hr className="mt-6 max-w-md border-ink-100" />
          <ul className="mt-6 space-y-3">
            {checklist.map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-ink-700">
                <svg viewBox="0 0 24 24" className="h-4 w-4 text-ink-700" fill="none">
                  <path
                    d="m5 13 4 4L19 7"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {status === "done" ? (
          <div className="rounded-2xl border border-brand-100 bg-brand-50 p-8 text-center">
            <h3 className="font-display text-xl font-bold text-brand-800">You&rsquo;re all set!</h3>
            <p className="mt-2 text-sm text-brand-700">
              An advisor will reach out within 24 hours with your personalised plan.
            </p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="rounded-2xl border border-ink-100 bg-white p-8 shadow-sm">
            {error && (
              <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}
            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="Full name"
                placeholder="Enter your full name"
                required
                value={form.fullName}
                onChange={(v) => update("fullName", v)}
              />
              <Field
                label="Email address"
                placeholder="you@email.com"
                type="email"
                required
                value={form.email}
                onChange={(v) => update("email", v)}
              />
              <Field
                label="Mobile number"
                placeholder="+1 (555) 000-0000"
                required
                value={form.mobile}
                onChange={(v) => update("mobile", v)}
              />
              <SelectField
                label="I am a"
                options={["Student / Parent", "Teacher", "School Admin", "Business"]}
                required
                value={form.personaType}
                onChange={(v) => update("personaType", v)}
              />
            </div>
            <div className="mt-5">
              <SelectField
                label="Area of interest"
                placeholder="Select an area of interest"
                options={["AI & Machine Learning", "Coding & Computer Science", "Entrepreneurship", "Data Analytics"]}
                required
                value={form.areaOfInterest}
                onChange={(v) => update("areaOfInterest", v)}
              />
            </div>
            <div className="mt-5">
              <label className="mb-2 block text-sm text-ink-600">
                Anything specific? (optional)
              </label>
              <textarea
                rows={4}
                placeholder="Tell us about your goals..."
                value={form.notes}
                onChange={(e) => update("notes", e.target.value)}
                className="w-full rounded-lg border border-ink-100 px-4 py-3 text-sm text-ink-700 placeholder:text-ink-400 focus:border-brand-500 focus:outline-none"
              />
            </div>
            <Button type="submit" variant="primary" className="mt-6 w-full" disabled={status === "loading"}>
              {status === "loading" ? "Sending…" : "Get my free plan →"}
            </Button>
            <p className="mt-4 text-center text-xs text-ink-400">
              By submitting, you agree to receive educational consultation
              calls from our advisors.
            </p>
          </form>
        )}
      </div>
    </section>
  );
}

function Field({
  label,
  placeholder,
  type = "text",
  required,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  type?: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm text-ink-600">
        {label} {required && <span className="text-brand-600">*</span>}
      </label>
      <input
        type={type}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-ink-100 px-4 py-3 text-sm text-ink-700 placeholder:text-ink-400 focus:border-brand-500 focus:outline-none"
      />
    </div>
  );
}

function SelectField({
  label,
  options,
  placeholder,
  required,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  placeholder?: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm text-ink-600">
        {label} {required && <span className="text-brand-600">*</span>}
      </label>
      <select
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-ink-100 bg-white px-4 py-3 text-sm text-ink-700 focus:border-brand-500 focus:outline-none"
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}
