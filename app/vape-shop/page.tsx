import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { ShopHero } from "@/components/vape-shop/shop-hero";
import { TrustStrip } from "@/components/marketing/trust-strip";
import { ShopByCategory } from "@/components/vape-shop/shop-by-category";
import { MultiBuyDeals } from "@/components/vape-shop/multi-buy-deals";
import { HomeProductSections } from "@/components/vape-shop/product-section";
import { BrandStrip } from "@/components/vape-shop/brand-strip";
import { FeaturedProduct } from "@/components/vape-shop/featured-product";
import { Testimonials } from "@/components/marketing/testimonials";
import { FlavorFinderCta } from "@/components/vape-shop/flavor-finder-cta";
import { SupabaseSetupNotice } from "@/components/admin/supabase-setup-notice";
import { getShopCategories, getShopBrands } from "@/lib/data/shop-catalog";
import { listActiveProductsBySection } from "@/lib/data/products";
import { isSupabaseConfigured } from "@/lib/supabase/env";

// Always fetch fresh from Supabase — otherwise product/category edits made
// in /admin wouldn't show up until the next production build.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Vape Shop — V&M Vape | Mobile",
  description:
    "Shop vape kits, pods, e-liquids, coils and accessories with next day UK delivery.",
};

export default async function VapeShopPage() {
  const configured = isSupabaseConfigured();
  const [categories, brands, sections] = configured
    ? await Promise.all([getShopCategories(), getShopBrands(), listActiveProductsBySection()])
    : [[], [], []];

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader />
      <main className="flex-1">
        <ShopHero />
        <TrustStrip />
        {configured ? (
          <>
            <ShopByCategory categories={categories} />
            <MultiBuyDeals />
            <HomeProductSections sections={sections} />
            <BrandStrip brands={brands} />
            <FeaturedProduct />
            <Testimonials />
            <FlavorFinderCta />
          </>
        ) : (
          <div className="wrap section-y">
            <SupabaseSetupNotice />
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
