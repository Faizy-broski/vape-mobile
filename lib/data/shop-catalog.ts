import "server-only";
import { createServerReadClient } from "@/lib/supabase/server";
import { PHONE_BRAND_NAMES, PHONE_CATEGORY_SLUG } from "@/lib/phones/catalog";
import type { ShopBrand, ShopCategory, ProductSection } from "@/lib/supabase/types";

export async function getShopCategories(): Promise<ShopCategory[]> {
  const supabase = createServerReadClient();
  const { data, error } = await supabase
    .from("shop_categories")
    .select("*")
    .order("sort_order");
  if (error) throw error;
  return data ?? [];
}

export async function getShopCategoryBySlug(slug: string): Promise<ShopCategory | null> {
  const supabase = createServerReadClient();
  const { data, error } = await supabase
    .from("shop_categories")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getShopBrands(): Promise<ShopBrand[]> {
  const supabase = createServerReadClient();
  const { data, error } = await supabase.from("shop_brands").select("*").order("sort_order");
  if (error) throw error;
  return data ?? [];
}

export async function getProductSections(): Promise<ProductSection[]> {
  const supabase = createServerReadClient();
  const { data, error } = await supabase
    .from("product_sections")
    .select("*")
    .order("sort_order");
  if (error) throw error;
  return data ?? [];
}

// Phones share the catalogue tables but are sold from /new-stock, so the
// vape shop's category tiles, brand strip and brand filters leave them out.
export async function getVapeShopCategories(): Promise<ShopCategory[]> {
  return (await getShopCategories()).filter((c) => c.slug !== PHONE_CATEGORY_SLUG);
}

export async function getVapeShopBrands(): Promise<ShopBrand[]> {
  return (await getShopBrands()).filter((b) => !PHONE_BRAND_NAMES.includes(b.name));
}
