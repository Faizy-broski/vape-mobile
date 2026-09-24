import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { StoresHero } from "@/components/stores/stores-hero";
import { StoresList } from "@/components/stores/stores-list";
import { TrustStrip } from "@/components/marketing/trust-strip";
import { AboutCta } from "@/components/about/about-cta";

export const metadata: Metadata = {
  title: "Stores — V&M Vape | Mobile",
  description: "Find your nearest V&M Vape | Mobile store — address, hours and directions.",
};

export default function StoresPage() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader />
      <main className="flex-1">
        <StoresHero />
        <StoresList />
        <TrustStrip />
        <AboutCta />
      </main>
      <SiteFooter />
    </div>
  );
}
