import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { PartnerLogos } from "@/components/sections/PartnerLogos";
import { RolesGrid } from "@/components/sections/RolesGrid";
import { LearningPathways } from "@/components/sections/LearningPathways";
import { Certifications } from "@/components/sections/Certifications";
import { PartnerWithUs } from "@/components/sections/PartnerWithUs";
import { IndiaPlacement } from "@/components/sections/IndiaPlacement";
import { Newsroom } from "@/components/sections/Newsroom";
import { Testimonials } from "@/components/sections/Testimonials";
import { LeadForm } from "@/components/sections/LeadForm";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "About — IvySchool.ai",
  description:
    "Ivy is rolling out across Central Columbia School District's K-12 schools, giving students hands-on AI and Python experience years before college.",
};

export default function AboutPage() {
  return (
    <>
      <Hero
        tags={["K-12 PARTNERSHIP", "CAREER READY", "REAL-WORLD SKILLS"]}
        title="Career skills, starting in"
        highlight="high school"
        subcopy="Ivy is rolling out across Central Columbia School District's K-12 schools, giving students hands-on AI and Python experience years before college."
        primaryCta={{ label: "See the CCSD program", href: "/about#news" }}
        secondaryCta={{ label: "Explore courses", href: "/about#courses" }}
        image="/images/hero-about.jpg"
        imageAlt="Central Columbia School District administration building sign"
      />
      <PartnerLogos />
      <RolesGrid />
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
