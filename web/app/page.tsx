import { Hero } from "@/components/sections/Hero";
import { PartnerLogos } from "@/components/sections/PartnerLogos";
import { CoursesGrid } from "@/components/sections/CoursesGrid";
import { LearningPathways } from "@/components/sections/LearningPathways";
import { Certifications } from "@/components/sections/Certifications";
import { PartnerWithUs } from "@/components/sections/PartnerWithUs";
import { IndiaPlacement } from "@/components/sections/IndiaPlacement";
import { Newsroom } from "@/components/sections/Newsroom";
import { Testimonials } from "@/components/sections/Testimonials";
import { LeadForm } from "@/components/sections/LeadForm";
import { Footer } from "@/components/layout/Footer";

export default function LandingPage() {
  return (
    <>
      <Hero
        tags={["AI-POWERED", "CODING", "ENTREPRENEURSHIP"]}
        title="Ivy-League learning for the"
        highlight="AI generation"
        subcopy="Live, mentor-led courses in AI, coding and entrepreneurship for students in grades 4–12 — plus placement pathways that connect learners to universities and careers worldwide."
        primaryCta={{ label: "Book a free trial class", href: "/#get-started" }}
        secondaryCta={{ label: "Explore courses", href: "/#courses" }}
        image="/images/hero-landing.jpg"
        imageAlt="A student wearing headphones takes notes during a live video mentoring session"
        stats={[
          { value: "50k+", label: "Students" },
          { value: "30+", label: "Countries" },
          { value: "30", label: "Pathways" },
          { value: "4.9/5", label: "Avg rating" },
        ]}
      />
      <PartnerLogos />
      <CoursesGrid />
      <LearningPathways />
      <Certifications />
      <PartnerWithUs />
      <IndiaPlacement />
      <Newsroom />
      <Testimonials />
      <LeadForm />
      <Footer />
    </>
  );
}
