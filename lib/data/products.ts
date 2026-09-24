import "server-only";
import { createServerReadClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Product, ProductBadge } from "@/lib/supabase/types";

export type ProductWithRelations = Product & {
  section: { id: string; title: string; slug: string } | null;
  category: { id: string; name: string; slug: string } | null;
};

// --- Public storefront reads (anon client, respects RLS -> is_active only) ---

export async function listActiveProductsBySection() {
  const supabase = createServerReadClient();
  const { data: sections, error: sectionsError } = await supabase
    .from("product_sections")
    .select("*")
    .order("sort_order");
  if (sectionsError) throw sectionsError;

  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");
  if (productsError) throw productsError;

  return (sections ?? []).map((section) => ({
    ...section,
    products: (products ?? []).filter((p) => p.section_id === section.id),
  }));
}

// --- Admin CRUD (service-role client, sees everything) ---

export type ProductFilters = {
  query?: string;
  sectionId?: string;
  categoryId?: string;
  activeOnly?: boolean;
};

export async function listProducts(filters: ProductFilters = {}): Promise<ProductWithRelations[]> {
  const supabase = createAdminClient();
  let query = supabase
    .from("products")
    .select("*, section:product_sections(id, title, slug), category:shop_categories(id, name, slug)")
    .order("created_at", { ascending: false });

  if (filters.sectionId) query = query.eq("section_id", filters.sectionId);
  if (filters.categoryId) query = query.eq("category_id", filters.categoryId);
  if (filters.activeOnly) query = query.eq("is_active", true);
  if (filters.query) query = query.ilike("name", `%${filters.query.replace(/[%,]/g, "")}%`);

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as unknown as ProductWithRelations[];
}

export async function getProduct(id: string): Promise<ProductWithRelations | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, section:product_sections(id, title, slug), category:shop_categories(id, name, slug)")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data as unknown as ProductWithRelations | null;
}

export type ProductInput = {
  name: string;
  price: number;
  oldPrice: number | null;
  badge: ProductBadge;
  image: string;
  stock: number;
  isActive: boolean;
  sectionId: string | null;
  categoryId: string | null;
};

export async function createProduct(input: ProductInput) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("products").insert({
    name: input.name,
    price: input.price,
    old_price: input.oldPrice,
    badge: input.badge,
    image: input.image,
    stock: input.stock,
    is_active: input.isActive,
    section_id: input.sectionId,
    category_id: input.categoryId,
  });
  if (error) throw error;
}

export async function updateProduct(id: string, input: ProductInput) {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("products")
    .update({
      name: input.name,
      price: input.price,
      old_price: input.oldPrice,
      badge: input.badge,
      image: input.image,
      stock: input.stock,
      is_active: input.isActive,
      section_id: input.sectionId,
      category_id: input.categoryId,
    })
    .eq("id", id);
  if (error) throw error;
}

export async function deleteProduct(id: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
}
