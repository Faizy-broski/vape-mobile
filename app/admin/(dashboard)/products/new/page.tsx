import type { Metadata } from "next";
import { getProductSections, getShopCategories } from "@/lib/data/shop-catalog";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { SupabaseSetupNotice } from "@/components/admin/supabase-setup-notice";
import { ProductForm } from "@/components/admin/products/product-form";
import { createProductAction } from "@/app/admin/(dashboard)/products/actions";

export const metadata: Metadata = { title: "New Product — Admin" };

export default async function NewProductPage() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="font-heading text-2xl font-black tracking-tight">New Product</h1>
        <SupabaseSetupNotice />
      </div>
    );
  }

  const [sections, categories] = await Promise.all([getProductSections(), getShopCategories()]);

  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <h1 className="font-heading text-2xl font-black tracking-tight">New Product</h1>
      <ProductForm action={createProductAction} sections={sections} categories={categories} />
    </div>
  );
}
