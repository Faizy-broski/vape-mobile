"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  slugify,
  type ProductInput,
  type VariantInput,
} from "@/lib/data/products";
import { createAdminClient } from "@/lib/supabase/admin";
import type { ProductBadge } from "@/lib/supabase/types";
import type { ProductFormState } from "@/app/admin/(dashboard)/products/product-form-state";

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif", "image/svg+xml"];

export async function uploadProductImageAction(
  formData: FormData,
): Promise<{ url?: string; error?: string }> {
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Choose an image file first." };
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { error: "Please upload a PNG, JPEG, WEBP, GIF or SVG image." };
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return { error: "Images must be under 5MB." };
  }

  const extension = file.name.split(".").pop()?.toLowerCase() || "png";
  const path = `${crypto.randomUUID()}.${extension}`;

  const supabase = createAdminClient();
  const { error: uploadError } = await supabase.storage
    .from("product-images")
    .upload(path, file, { contentType: file.type, upsert: false });

  if (uploadError) {
    console.error("Failed to upload product image:", uploadError);
    return { error: "Upload failed. Please try again." };
  }

  const { data } = supabase.storage.from("product-images").getPublicUrl(path);
  return { url: data.publicUrl };
}

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Parses the variants editor's JSON field; returns null if any row is invalid. */
function parseVariants(raw: string): VariantInput[] | null {
  let rows: unknown;
  try {
    rows = JSON.parse(raw || "[]");
  } catch {
    return null;
  }
  if (!Array.isArray(rows)) return null;

  const variants: VariantInput[] = [];
  const names = new Set<string>();
  for (const row of rows as Record<string, unknown>[]) {
    const name = String(row.name ?? "").trim();
    const price = Number.parseFloat(String(row.price ?? ""));
    const oldPriceRaw = String(row.oldPrice ?? "").trim();
    const oldPrice = oldPriceRaw ? Number.parseFloat(oldPriceRaw) : null;
    const stock = Number.parseInt(String(row.stock ?? "0"), 10) || 0;
    const id = typeof row.id === "string" && UUID_PATTERN.test(row.id) ? row.id : null;

    if (!name || !Number.isFinite(price) || price < 0) return null;
    if (names.has(name.toLowerCase())) return null;
    names.add(name.toLowerCase());

    variants.push({
      id,
      name,
      price,
      oldPrice: oldPrice !== null && Number.isFinite(oldPrice) ? oldPrice : null,
      stock: Math.max(0, stock),
      isActive: row.isActive !== false,
    });
  }
  return variants;
}

const INVALID_INPUT = "Please fill in a name, image and a valid price.";
const INVALID_VARIANTS =
  "Every option needs a unique name and a valid price — check the Options list.";

/** Returns the parsed input, or an error message to show on the form. */
function parseInput(formData: FormData): ProductInput | string {
  const variants = parseVariants(String(formData.get("variants") ?? "[]"));
  if (!variants) return INVALID_VARIANTS;

  const name = String(formData.get("name") ?? "").trim();
  const slugRaw = String(formData.get("slug") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const priceRaw = String(formData.get("price") ?? "").trim();
  const oldPriceRaw = String(formData.get("oldPrice") ?? "").trim();
  const badgeRaw = String(formData.get("badge") ?? "").trim();
  const image = String(formData.get("image") ?? "").trim();
  const stockRaw = String(formData.get("stock") ?? "0").trim();
  const isActive = formData.get("isActive") === "on";
  const sectionId = String(formData.get("sectionId") ?? "").trim();
  const categoryId = String(formData.get("categoryId") ?? "").trim();
  const brandId = String(formData.get("brandId") ?? "").trim();

  // With options, the product price comes from the cheapest option instead.
  const price = variants.length > 0 ? 0 : Number.parseFloat(priceRaw);
  if (!name || !image || !Number.isFinite(price) || price < 0) return INVALID_INPUT;

  const slug = slugify(slugRaw || name);
  if (!slug) return INVALID_INPUT;

  const oldPrice = oldPriceRaw ? Number.parseFloat(oldPriceRaw) : null;
  const stock = Number.parseInt(stockRaw, 10) || 0;
  const badge: ProductBadge = badgeRaw === "Sale" || badgeRaw === "New" ? badgeRaw : null;

  return {
    name,
    slug,
    description: description || null,
    price,
    oldPrice: oldPrice !== null && Number.isFinite(oldPrice) ? oldPrice : null,
    badge,
    image,
    stock,
    isActive,
    sectionId: sectionId || null,
    categoryId: categoryId || null,
    brandId: brandId || null,
    variants,
  };
}

function isUniqueViolation(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "23505"
  );
}

function revalidateStorefront() {
  revalidatePath("/admin/products");
  revalidatePath("/vape-shop");
  revalidatePath("/vape-shop/category/[slug]", "page");
  revalidatePath("/vape-shop/product/[slug]", "page");
  revalidatePath("/");
}

export async function createProductAction(
  _prevState: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  const input = parseInput(formData);
  if (typeof input === "string") return { error: input };

  try {
    await createProduct(input);
  } catch (error) {
    if (isUniqueViolation(error)) {
      return { error: `The slug "${input.slug}" is already used by another product.` };
    }
    console.error("Failed to create product:", error);
    return { error: "Something went wrong creating the product." };
  }

  revalidateStorefront();
  redirect("/admin/products");
}

export async function updateProductAction(
  id: string,
  _prevState: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  const input = parseInput(formData);
  if (typeof input === "string") return { error: input };

  try {
    await updateProduct(id, input);
  } catch (error) {
    if (isUniqueViolation(error)) {
      return { error: `The slug "${input.slug}" is already used by another product.` };
    }
    console.error("Failed to update product:", error);
    return { error: "Something went wrong updating the product." };
  }

  revalidateStorefront();
  redirect("/admin/products");
}

export async function deleteProductAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await deleteProduct(id);
  revalidateStorefront();
}
