import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { RepairHero } from "@/components/repairs/repair-hero";
import { WhatWeRepair } from "@/components/repairs/what-we-repair";
import { RepairProcess } from "@/components/repairs/repair-process";
import { WhyVandM } from "@/components/repairs/why-vandm";
import { ShopAccessories } from "@/components/repairs/shop-accessories";
import { QuickBooking } from "@/components/repairs/quick-booking";
import { Testimonials } from "@/components/marketing/testimonials";
import { RepairCta } from "@/components/repairs/repair-cta";

export const metadata: Metadata = {
  title: "Tech Repair — V&M Vape | Mobile",
  description:
    "Fast, professional repairs for phones, tablets, Macs and laptops.",
};

export default function RepairsPage() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader />
      <main className="flex-1">
        <RepairHero />
        <WhatWeRepair />
        <RepairProcess />
        <WhyVandM />
        <ShopAccessories />
        <QuickBooking />
        <Testimonials
          sectionNumber="06 — Testimonials"
          backgroundImage="/tech/testimonial-bg.png"
        />
        <RepairCta />
      </main>
      <SiteFooter />
    </div>
  );
}
