import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { ProductCard } from "@/components/vape-shop/product-card";
import { CategoryFilters } from "@/components/vape-shop/category/category-filters";
import { getShopCategoryBySlug, getShopBrands } from "@/lib/data/shop-catalog";
import { listActiveProductsByCategory, type CategoryProductFilters } from "@/lib/data/products";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (!isSupabaseConfigured()) return { title: "Category — V&M Vape | Mobile" };
  const category = await getShopCategoryBySlug(slug);
  return {
    title: category ? `${category.name} — V&M Vape | Mobile` : "Category — V&M Vape | Mobile",
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    brand?: string;
    sort?: string;
    inStock?: string;
    min?: string;
    max?: string;
  }>;
}) {
  if (!isSupabaseConfigured()) notFound();

  const { slug } = await params;
  const query = await searchParams;

  const category = await getShopCategoryBySlug(slug);
  if (!category) notFound();

  const filters: CategoryProductFilters = {
    brandId: query.brand,
    inStockOnly: query.inStock === "1",
    minPrice: query.min ? Number.parseFloat(query.min) : undefined,
    maxPrice: query.max ? Number.parseFloat(query.max) : undefined,
    sort: (query.sort as CategoryProductFilters["sort"]) ?? "featured",
  };

  const [products, brands] = await Promise.all([
    listActiveProductsByCategory(category.id, filters),
    getShopBrands(),
  ]);

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="wrap pt-4 sm:pt-6">
          <div className="relative flex min-h-40 items-end overflow-hidden rounded-2xl sm:min-h-52 sm:rounded-3xl">
            <Image
              src={category.image}
              alt=""
              fill
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
            <h1 className="relative z-10 p-6 font-heading text-3xl font-black tracking-tight text-white uppercase xs:p-8 xs:text-4xl">
              {category.name}
            </h1>
          </div>
        </section>

        <section className="wrap section-y">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              {products.length} {products.length === 1 ? "product" : "products"}
            </p>
          </div>

          <div className="mt-4">
            <CategoryFilters brands={brands} />
          </div>

          {products.length === 0 ? (
            <div className="mt-10 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
              <p className="text-sm font-medium text-foreground">No products match your filters</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Try clearing a filter or check back soon — we&apos;re adding stock all the time.
              </p>
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-2 gap-3 xs:gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
