import "server-only";
import { createServerReadClient } from "@/lib/supabase/server";
import { PHONE_CATEGORY_SLUG } from "@/lib/phones/catalog";
import type { Product, ProductVariant } from "@/lib/supabase/types";

export type PhoneVariant = Pick<ProductVariant, "id" | "name" | "price" | "old_price" | "stock" | "image">;

export type Phone = Pick<
  Product,
  "id" | "slug" | "name" | "description" | "price" | "old_price" | "badge" | "image" | "stock"
> & {
  brand: { name: string } | null;
  variants: PhoneVariant[];
};

const PHONE_SELECT =
  "id, slug, name, description, price, old_price, badge, image, stock, sort_order, brand:shop_brands(name), variants:product_variants(id, name, price, old_price, stock, image, sort_order), category:shop_categories!inner(slug)";

type PhoneRow = Omit<Phone, "variants"> & { variants: (PhoneVariant & { sort_order: number })[] };

function toPhone(row: PhoneRow): Phone {
  row.variants.sort((a, b) => a.sort_order - b.sort_order || a.name.localeCompare(b.name));
  return row;
}

/** Active phones in the New Stock category, in admin sort order. */
export async function listNewStockPhones(): Promise<Phone[]> {
  const supabase = createServerReadClient();
  const { data, error } = await supabase
    .from("products")
    .select(PHONE_SELECT)
    .eq("category.slug", PHONE_CATEGORY_SLUG)
    .eq("is_active", true)
    .order("sort_order");
  if (error) throw error;
  return ((data ?? []) as unknown as PhoneRow[]).map(toPhone);
}

export async function getNewStockPhone(slug: string): Promise<Phone | null> {
  const supabase = createServerReadClient();
  const { data, error } = await supabase
    .from("products")
    .select(PHONE_SELECT)
    .eq("category.slug", PHONE_CATEGORY_SLUG)
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();
  if (error) throw error;
  return data ? toPhone(data as unknown as PhoneRow) : null;
}
