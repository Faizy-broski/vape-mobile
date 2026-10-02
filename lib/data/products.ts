import "server-only";
import { createServerReadClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Product, ProductBadge, ProductVariant } from "@/lib/supabase/types";

type SectionRef = { id: string; title: string; slug: string } | null;
type CategoryRef = { id: string; name: string; slug: string } | null;
type BrandRef = { id: string; name: string; image: string } | null;

// Just enough of each variant for a product card to show "From £X" and to
// know the shopper has to pick an option on the product page first.
export type VariantSummary = Pick<ProductVariant, "id" | "price">;

export type ProductWithRelations = Product & {
  section: SectionRef;
  category: CategoryRef;
  brand: BrandRef;
  variants: VariantSummary[];
};

export type ProductDetail = Omit<ProductWithRelations, "variants"> & {
  variants: ProductVariant[];
};

export type ProductWithVariantSummary = Product & { variants: VariantSummary[] };

const BASE_RELATIONS =
  "section:product_sections(id, title, slug), category:shop_categories(id, name, slug), brand:shop_brands(id, name, image)";
const VARIANT_SUMMARY_SELECT = "variants:product_variants(id, price)";
const RELATIONS_SELECT = `*, ${BASE_RELATIONS}, ${VARIANT_SUMMARY_SELECT}`;
const DETAIL_SELECT = `*, ${BASE_RELATIONS}, variants:product_variants(*)`;

function sortVariants(product: ProductDetail): ProductDetail {
  product.variants.sort((a, b) => a.sort_order - b.sort_order || a.name.localeCompare(b.name));
  return product;
}

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

  // Most of the catalogue isn't on a homepage row, so only pull the ones that are.
  const { data, error: productsError } = await supabase
    .from("products")
    .select(`*, ${VARIANT_SUMMARY_SELECT}`)
    .eq("is_active", true)
    .not("section_id", "is", null)
    .order("sort_order");
  if (productsError) throw productsError;
  const products = (data ?? []) as unknown as ProductWithVariantSummary[];

  return (sections ?? []).map((section) => ({
    ...section,
    products: products.filter((p) => p.section_id === section.id),
  }));
}

export async function getProductBySlug(slug: string): Promise<ProductDetail | null> {
  const supabase = createServerReadClient();
  const { data, error } = await supabase
    .from("products")
    .select(DETAIL_SELECT)
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();
  if (error) throw error;
  return data ? sortVariants(data as unknown as ProductDetail) : null;
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
): Promise<ProductWithVariantSummary[]> {
  const supabase = createServerReadClient();
  const { data, error } = await supabase
    .from("products")
    .select(`*, ${VARIANT_SUMMARY_SELECT}`)
    .eq("category_id", categoryId)
    .eq("is_active", true)
    .neq("id", excludeId)
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as unknown as ProductWithVariantSummary[];
}

export type PricedLine = {
  productId: string;
  variantId: string | null;
  name: string;
  variantName: string | null;
  price: number;
  stock: number;
};

/**
 * Looks up the current price and stock of each (product, variant) pair from
 * the database, so checkout never has to trust prices sent by the browser.
 * Pairs that no longer exist or aren't active are left out of the result.
 */
export async function priceCartLines(
  lines: { productId: string; variantId: string | null }[],
): Promise<PricedLine[]> {
  // Ids come from the browser; anything that isn't a uuid can't match a row
  // and would make Postgres reject the whole query.
  const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const productIds = [...new Set(lines.map((l) => l.productId))].filter((id) => uuid.test(id));
  if (productIds.length === 0) return [];

  const supabase = createServerReadClient();
  const { data, error } = await supabase
    .from("products")
    .select("id, name, price, stock, variants:product_variants(id, name, price, stock)")
    .in("id", productIds)
    .eq("is_active", true);
  if (error) throw error;

  type Row = Pick<Product, "id" | "name" | "price" | "stock"> & {
    variants: Pick<ProductVariant, "id" | "name" | "price" | "stock">[];
  };
  const byId = new Map(((data ?? []) as unknown as Row[]).map((p) => [p.id, p]));

  const priced: PricedLine[] = [];
  for (const line of lines) {
    const product = byId.get(line.productId);
    if (!product) continue;
    if (product.variants.length === 0) {
      if (line.variantId) continue;
      priced.push({
        productId: product.id,
        variantId: null,
        name: product.name,
        variantName: null,
        price: Number(product.price),
        stock: product.stock,
      });
      continue;
    }
    const variant = product.variants.find((v) => v.id === line.variantId);
    if (!variant) continue;
    priced.push({
      productId: product.id,
      variantId: variant.id,
      name: product.name,
      variantName: variant.name,
      price: Number(variant.price),
      stock: variant.stock,
    });
  }
  return priced;
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

export async function getProduct(id: string): Promise<ProductDetail | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("products")
    .select(DETAIL_SELECT)
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data ? sortVariants(data as unknown as ProductDetail) : null;
}

export type VariantInput = {
  id: string | null;
  name: string;
  price: number;
  oldPrice: number | null;
  stock: number;
  isActive: boolean;
};

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
  variants: VariantInput[];
};

/**
 * With variants, the product's own price/old price/stock are derived from
 * them: the cheapest active variant sets the "From £X" price, and stock is
 * the total across active variants (so "in stock only" filters still work).
 */
function toRow(input: ProductInput) {
  const active = input.variants.filter((v) => v.isActive);
  const cheapest = active.reduce<VariantInput | null>(
    (min, v) => (min === null || v.price < min.price ? v : min),
    null,
  );

  return {
    name: input.name,
    slug: input.slug,
    description: input.description,
    price: cheapest ? cheapest.price : input.price,
    old_price: cheapest ? cheapest.oldPrice : input.oldPrice,
    badge: input.badge,
    image: input.image,
    stock: input.variants.length > 0 ? active.reduce((sum, v) => sum + v.stock, 0) : input.stock,
    is_active: input.isActive,
    section_id: input.sectionId,
    category_id: input.categoryId,
    brand_id: input.brandId,
  };
}

async function syncVariants(productId: string, variants: VariantInput[]) {
  const supabase = createAdminClient();

  // Remove variants the admin deleted first, so a new variant can reuse a
  // removed one's name without tripping the (product_id, name) constraint.
  const keepIds = variants.flatMap((v) => (v.id ? [v.id] : []));
  let removal = supabase.from("product_variants").delete().eq("product_id", productId);
  if (keepIds.length > 0) removal = removal.not("id", "in", `(${keepIds.join(",")})`);
  const { error: deleteError } = await removal;
  if (deleteError) throw deleteError;

  if (variants.length === 0) return;

  const rows = variants.map((v, index) => ({
    ...(v.id ? { id: v.id } : {}),
    product_id: productId,
    name: v.name,
    price: v.price,
    old_price: v.oldPrice,
    stock: v.stock,
    is_active: v.isActive,
    sort_order: index,
  }));
  const { error } = await supabase
    .from("product_variants")
    .upsert(rows, { onConflict: "id", defaultToNull: false });
  if (error) throw error;
}

export async function createProduct(input: ProductInput) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("products")
    .insert(toRow(input))
    .select("id")
    .single();
  if (error) throw error;
  await syncVariants(data.id as string, input.variants);
}

export async function updateProduct(id: string, input: ProductInput) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("products").update(toRow(input)).eq("id", id);
  if (error) throw error;
  await syncVariants(id, input.variants);
}

export async function deleteProduct(id: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
}
