import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { TrustStrip } from "@/components/marketing/trust-strip";
import { AccessoriesHero } from "@/components/accessories/accessories-hero";
import { AccessoriesGrid } from "@/components/accessories/accessories-grid";
import { NeedSomethingElse } from "@/components/accessories/need-something-else";

export const metadata: Metadata = {
  title: "Accessories — V&M Vape | Mobile",
  description:
    "Chargers, cables and cases stocked at the counter — priced fairly, available same day.",
};

export default function AccessoriesPage() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader />
      <main className="flex-1">
        <AccessoriesHero />
        <TrustStrip />
        <AccessoriesGrid />
        <NeedSomethingElse />
      </main>
      <SiteFooter />
    </div>
  );
}
