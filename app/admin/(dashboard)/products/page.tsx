import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { listProducts } from "@/lib/data/products";
import { getProductSections, getShopCategories } from "@/lib/data/shop-catalog";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { SupabaseSetupNotice } from "@/components/admin/supabase-setup-notice";
import { ProductFilters } from "@/components/admin/products/product-filters";
import { ProductsTable } from "@/components/admin/products/products-table";

export const metadata: Metadata = { title: "Products — Admin" };

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; section?: string; category?: string }>;
}) {
  if (!isSupabaseConfigured()) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="font-heading text-2xl font-black tracking-tight">Products</h1>
        <SupabaseSetupNotice />
      </div>
    );
  }

  const params = await searchParams;
  const [products, sections, categories] = await Promise.all([
    listProducts({ query: params.q, sectionId: params.section, categoryId: params.category }),
    getProductSections(),
    getShopCategories(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-black tracking-tight">Products</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {products.length} {products.length === 1 ? "product" : "products"}
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Plus className="size-4" />
          New Product
        </Link>
      </div>

      <ProductFilters sections={sections} categories={categories} />

      <ProductsTable products={products} />
    </div>
  );
}
