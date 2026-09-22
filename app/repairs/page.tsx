import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { RepairHero } from "@/components/repairs/repair-hero";
import { WhatWeRepair } from "@/components/repairs/what-we-repair";
import { RepairProcess } from "@/components/repairs/repair-process";

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
      </main>
      <SiteFooter />
    </div>
  );
}
