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
import { getVapeShopCategories, getVapeShopBrands } from "@/lib/data/shop-catalog";
import { getProductBySlug, listActiveProductsBySection } from "@/lib/data/products";
import { isSupabaseConfigured } from "@/lib/supabase/env";

// Always fetch fresh from Supabase — otherwise product/category edits made
// in /admin wouldn't show up until the next production build.
export const dynamic = "force-dynamic";

// The "Best Value Big Puff Vape" spotlight. Hidden if this product is
// missing or deactivated in /admin.
const FEATURED_PRODUCT_SLUG = "ske-cl2000-pre-filled-vape-kit";

export const metadata: Metadata = {
  title: "Vape Shop — V&M Vape | Mobile",
  description:
    "Shop vape kits, pods, e-liquids, coils and accessories with next day UK delivery.",
};

export default async function VapeShopPage() {
  const configured = isSupabaseConfigured();
  const [categories, brands, sections, featured] = configured
    ? await Promise.all([
        getVapeShopCategories(),
        getVapeShopBrands(),
        listActiveProductsBySection(),
        getProductBySlug(FEATURED_PRODUCT_SLUG),
      ])
    : [[], [], [], null];

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
            {featured && <FeaturedProduct product={featured} />}
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
