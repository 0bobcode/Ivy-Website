import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Footer } from "@/components/layout/Footer";
import { TextLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Help & Support — IvySchool.ai",
  description: "Answers to common questions, and how to reach us for anything else.",
};

const faqs = [
  {
    q: "How do I book a free trial class?",
    a: "Go to the homepage and select \"Book a free trial class,\" or fill out the consultation form at the bottom of any page — an advisor will follow up within 24 hours with a personalised plan.",
  },
  {
    q: "I forgot my password. What do I do?",
    a: "On the sign-in page, select \"Forgot password?\" and enter your email. We'll send a link to reset it. The link expires after 15 minutes for your security.",
  },
  {
    q: "How does two-factor authentication (MFA) work?",
    a: "From your dashboard, go to Settings and select \"Set up MFA.\" Scan the QR code with an authenticator app (Google Authenticator, 1Password, etc.) and enter the 6-digit code it shows to confirm.",
  },
  {
    q: "Can a parent see their child's progress?",
    a: "Yes — parent accounts can link to a student account. For students under 13, this requires parental consent as part of account setup, in line with COPPA.",
  },
  {
    q: "Who do I contact for schools, colleges, or business partnerships?",
    a: "Use the consultation form and select the option that matches you — our team routes school, college, and business inquiries to the right advisor.",
  },
];

export default function HelpPage() {
  return (
    <>
      <PageHeader
        eyebrow="Help & Support"
        title="How can we help?"
        subtitle="Common questions below — or reach a real person if you need more."
      />
      <div className="mx-auto max-w-3xl px-6 py-16 lg:px-8">
        <div className="space-y-4">
          {faqs.map((item) => (
            <details key={item.q} className="group rounded-2xl border border-ink-100 bg-white p-6 open:shadow-sm">
              <summary className="flex cursor-pointer list-none items-center justify-between font-display text-base font-bold text-ink-700">
                {item.q}
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5 shrink-0 text-ink-400 transition-transform group-open:rotate-45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </summary>
              <p className="mt-3 text-sm leading-6 text-ink-500">{item.a}</p>
            </details>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-brand-100 bg-brand-50 p-6 text-center">
          <h2 className="font-display text-lg font-bold text-brand-800">Still stuck?</h2>
          <p className="mt-2 text-sm text-brand-700">
            Tell us what's going on and an advisor will get back to you directly.
          </p>
          <TextLink href="/#get-started" className="mt-3">
            Contact us →
          </TextLink>
        </div>
      </div>
      <Footer />
    </>
  );
}
