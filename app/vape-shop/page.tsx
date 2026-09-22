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

export const metadata: Metadata = {
  title: "Vape Shop — V&M Vape | Mobile",
  description:
    "Shop vape kits, pods, e-liquids, coils and accessories with next day UK delivery.",
};

export default function VapeShopPage() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader />
      <main className="flex-1">
        <ShopHero />
        <TrustStrip />
        <ShopByCategory />
        <MultiBuyDeals />
        <HomeProductSections />
        <BrandStrip />
        <FeaturedProduct />
        <Testimonials />
        <FlavorFinderCta />
      </main>
      <SiteFooter />
    </div>
  );
}
