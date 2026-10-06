import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { HeroSplit } from "@/components/home/hero-split";
import { NewStockShowcase } from "@/components/home/new-stock-showcase";
import { listNewStockPhones } from "@/lib/data/phones";
import { isSupabaseConfigured } from "@/lib/supabase/env";

// The New Stock row follows stock edits made in /admin.
export const dynamic = "force-dynamic";

export default async function Home() {
  const phones = isSupabaseConfigured()
    ? await listNewStockPhones().catch((error) => {
        // The homepage shouldn't go down with the catalogue — fall back to the bare CTA.
        console.error("Failed to load new stock:", error);
        return [];
      })
    : [];

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader />
      <main className="flex-1">
        <HeroSplit />
        <NewStockShowcase phones={phones} />
      </main>
      <SiteFooter />
    </div>
  );
}
