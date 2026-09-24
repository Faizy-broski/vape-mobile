import "server-only";
import { createServerReadClient } from "@/lib/supabase/server";
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
