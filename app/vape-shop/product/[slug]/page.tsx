import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ProductDetailActions } from "@/components/vape-shop/product-detail/product-detail-actions";
import { ProductCard } from "@/components/vape-shop/product-card";
import { getProductBySlug, getRelatedProducts } from "@/lib/data/products";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { PHONE_CATEGORY_SLUG } from "@/lib/phones/catalog";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (!isSupabaseConfigured()) return { title: "Product — V&M Vape | Mobile" };
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product — V&M Vape | Mobile" };
  return {
    title: `${product.name} — V&M Vape | Mobile`,
    description: product.description ?? undefined,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  if (!isSupabaseConfigured()) notFound();

  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();
  if (product.category?.slug === PHONE_CATEGORY_SLUG) redirect(`/new-stock/${product.slug}`);

  const related = product.category_id
    ? await getRelatedProducts(product.category_id, product.id)
    : [];

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="wrap section-y">
          <nav className="mb-6 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link href="/vape-shop" className="hover:text-foreground">
              Vape Shop
            </Link>
            <ChevronRight className="size-3.5" />
            {product.category ? (
              <>
                <Link
                  href={`/vape-shop/category/${product.category.slug}`}
                  className="hover:text-foreground"
                >
                  {product.category.name}
                </Link>
                <ChevronRight className="size-3.5" />
              </>
            ) : null}
            <span className="text-foreground">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14">
            <div className="relative aspect-square overflow-hidden rounded-3xl bg-[radial-gradient(circle_at_35%_25%,var(--color-secondary)_0%,var(--color-muted)_70%)]">
              {product.badge && (
                <Badge
                  className={cn(
                    "absolute top-4 left-4 z-10 border-transparent text-white",
                    product.badge === "Sale" ? "bg-destructive" : "bg-primary",
                  )}
                >
                  {product.badge}
                </Badge>
              )}
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-contain p-10"
              />
            </div>

            <div className="flex flex-col">
              {product.brand && (
                <p className="text-xs font-semibold tracking-[0.2em] text-accent uppercase">
                  {product.brand.name}
                </p>
              )}
              <h1 className="mt-2 font-heading text-3xl font-black tracking-tight xs:text-4xl">
                {product.name}
              </h1>

              <div className="mt-4">
                <ProductDetailActions
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  oldPrice={product.old_price}
                  image={product.image}
                  stock={product.stock}
                  variants={product.variants}
                />
              </div>

              {product.description && (
                <>
                  <Separator className="my-6" />
                  <p className="text-sm leading-relaxed whitespace-pre-line text-muted-foreground">
                    {product.description}
                  </p>
                </>
              )}
            </div>
          </div>
        </section>

        {related.length > 0 && (
          <section className="wrap pb-16 sm:pb-24">
            <h2 className="font-heading text-xl font-black tracking-tight uppercase xs:text-2xl">
              You Might Also Like
            </h2>
            <div className="mt-5 grid grid-cols-2 gap-3 xs:gap-4 sm:grid-cols-4 sm:gap-5">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
