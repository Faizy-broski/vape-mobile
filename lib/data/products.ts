import "server-only";
import { createServerReadClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Product, ProductBadge } from "@/lib/supabase/types";

type SectionRef = { id: string; title: string; slug: string } | null;
type CategoryRef = { id: string; name: string; slug: string } | null;
type BrandRef = { id: string; name: string; image: string } | null;

export type ProductWithRelations = Product & {
  section: SectionRef;
  category: CategoryRef;
  brand: BrandRef;
};

const RELATIONS_SELECT =
  "*, section:product_sections(id, title, slug), category:shop_categories(id, name, slug), brand:shop_brands(id, name, image)";

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

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

export async function getProductBySlug(slug: string): Promise<ProductWithRelations | null> {
  const supabase = createServerReadClient();
  const { data, error } = await supabase
    .from("products")
    .select(RELATIONS_SELECT)
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();
  if (error) throw error;
  return data as unknown as ProductWithRelations | null;
}

export type CategoryProductFilters = {
  brandId?: string;
  inStockOnly?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sort?: "featured" | "price-asc" | "price-desc" | "name-asc" | "newest";
};

export async function listActiveProductsByCategory(
  categoryId: string,
  filters: CategoryProductFilters = {},
): Promise<ProductWithRelations[]> {
  const supabase = createServerReadClient();
  let query = supabase
    .from("products")
    .select(RELATIONS_SELECT)
    .eq("category_id", categoryId)
    .eq("is_active", true);

  if (filters.brandId) query = query.eq("brand_id", filters.brandId);
  if (filters.inStockOnly) query = query.gt("stock", 0);
  if (typeof filters.minPrice === "number") query = query.gte("price", filters.minPrice);
  if (typeof filters.maxPrice === "number") query = query.lte("price", filters.maxPrice);

  switch (filters.sort) {
    case "price-asc":
      query = query.order("price", { ascending: true });
      break;
    case "price-desc":
      query = query.order("price", { ascending: false });
      break;
    case "name-asc":
      query = query.order("name", { ascending: true });
      break;
    case "newest":
      query = query.order("created_at", { ascending: false });
      break;
    default:
      query = query.order("sort_order", { ascending: true });
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as unknown as ProductWithRelations[];
}

export async function getRelatedProducts(
  categoryId: string,
  excludeId: string,
  limit = 4,
): Promise<Product[]> {
  const supabase = createServerReadClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("category_id", categoryId)
    .eq("is_active", true)
    .neq("id", excludeId)
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as Product[];
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
    .select(RELATIONS_SELECT)
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
    .select(RELATIONS_SELECT)
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data as unknown as ProductWithRelations | null;
}

export type ProductInput = {
  name: string;
  slug: string;
  description: string | null;
  price: number;
  oldPrice: number | null;
  badge: ProductBadge;
  image: string;
  stock: number;
  isActive: boolean;
  sectionId: string | null;
  categoryId: string | null;
  brandId: string | null;
};

function toRow(input: ProductInput) {
  return {
    name: input.name,
    slug: input.slug,
    description: input.description,
    price: input.price,
    old_price: input.oldPrice,
    badge: input.badge,
    image: input.image,
    stock: input.stock,
    is_active: input.isActive,
    section_id: input.sectionId,
    category_id: input.categoryId,
    brand_id: input.brandId,
  };
}

export async function createProduct(input: ProductInput) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("products").insert(toRow(input));
  if (error) throw error;
}

export async function updateProduct(id: string, input: ProductInput) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("products").update(toRow(input)).eq("id", id);
  if (error) throw error;
}

export async function deleteProduct(id: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
}
