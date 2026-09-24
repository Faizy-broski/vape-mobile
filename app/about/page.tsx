import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { AboutHero } from "@/components/about/about-hero";
import { OurStory } from "@/components/about/our-story";
import { WhyChooseUs } from "@/components/about/why-choose-us";
import { StatsBand } from "@/components/about/stats-band";
import { Testimonials } from "@/components/marketing/testimonials";
import { AboutCta } from "@/components/about/about-cta";

export const metadata: Metadata = {
  title: "About Us — V&M Vape | Mobile",
  description:
    "Honest tech repairs and a proper local vape shop — run by the same team, under the same roof.",
};

export default function AboutPage() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader />
      <main className="flex-1">
        <AboutHero />
        <OurStory />
        <WhyChooseUs />
        <StatsBand />
        <Testimonials
          sectionNumber="05 — Testimonials"
          backgroundImage="/tech/testimonial-bg.png"
        />
        <AboutCta />
      </main>
      <SiteFooter />
    </div>
  );
}
