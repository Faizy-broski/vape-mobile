import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { SupabaseSetupNotice } from "@/components/admin/supabase-setup-notice";
import { NewStockHero } from "@/components/new-stock/new-stock-hero";
import { NewStockBrowser } from "@/components/new-stock/new-stock-browser";
import { NewStockHelp } from "@/components/new-stock/new-stock-help";
import { listNewStockPhones } from "@/lib/data/phones";
import { isSupabaseConfigured } from "@/lib/supabase/env";

// Stock changes from /admin, so always read fresh.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "New Stock — Brand New Phones | V&M Vape | Mobile",
  description:
    "Brand new, boxed Samsung Galaxy and iPhone 17 Pro Max in stock now at our 25 Kingston shop. Order online or collect in store.",
};

export default async function NewStockPage() {
  const configured = isSupabaseConfigured();
  const phones = configured ? await listNewStockPhones() : [];
  const inStock = phones.filter((p) => p.stock > 0);
  const [lead, second] = inStock;

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader />
      <main className="flex-1">
        <NewStockHero
          models={phones.length}
          units={phones.reduce((sum, p) => sum + p.stock, 0)}
          fromPrice={inStock.length > 0 ? Math.min(...inStock.map((p) => p.price)) : null}
          showcase={[
            lead
              ? { src: lead.image, alt: lead.name }
              : { src: "/tech/phones/apple-iphone-17-pro-max-cosmic-orange.svg", alt: "" },
            second
              ? { src: second.image, alt: second.name }
              : { src: "/tech/phones/samsung-galaxy-a56-5g-white.svg", alt: "" },
          ]}
        />
        {configured ? (
          <NewStockBrowser phones={phones} />
        ) : (
          <div className="wrap section-y">
            <SupabaseSetupNotice />
          </div>
        )}
        <NewStockHelp />
      </main>
      <SiteFooter />
    </div>
  );
}
