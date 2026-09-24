import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct } from "@/lib/data/products";
import { getProductSections, getShopCategories } from "@/lib/data/shop-catalog";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { SupabaseSetupNotice } from "@/components/admin/supabase-setup-notice";
import { ProductForm } from "@/components/admin/products/product-form";
import { updateProductAction } from "@/app/admin/(dashboard)/products/actions";

export const metadata: Metadata = { title: "Edit Product — Admin" };

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!isSupabaseConfigured()) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="font-heading text-2xl font-black tracking-tight">Edit Product</h1>
        <SupabaseSetupNotice />
      </div>
    );
  }

  const { id } = await params;
  const [product, sections, categories] = await Promise.all([
    getProduct(id),
    getProductSections(),
    getShopCategories(),
  ]);

  if (!product) notFound();

  const boundAction = updateProductAction.bind(null, id);

  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <h1 className="font-heading text-2xl font-black tracking-tight">Edit Product</h1>
      <ProductForm
        action={boundAction}
        product={product}
        sections={sections}
        categories={categories}
      />
    </div>
  );
}
