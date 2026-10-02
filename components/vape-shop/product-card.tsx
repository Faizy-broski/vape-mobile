"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, ChevronRight, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useCart } from "@/lib/cart/cart-context";
import type { Product } from "@/lib/supabase/types";

export type ProductCardData = Pick<
  Product,
  "id" | "name" | "price" | "old_price" | "badge" | "image"
> & {
  slug?: string;
  /** Options summary; products with options are added to cart from their page. */
  variants?: { id: string; price: number }[];
};

export function ProductCard({ product }: { product: ProductCardData }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const variants = product.variants ?? [];
  const hasOptions = variants.length > 0;
  const pricesVary = new Set(variants.map((v) => v.price)).size > 1;
  const price = `£${product.price.toFixed(2)}`;
  const oldPrice = product.old_price ? `£${product.old_price.toFixed(2)}` : null;
  const href = product.slug ? `/vape-shop/product/${product.slug}` : null;

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    addItem({
      productId: product.id,
      variantId: null,
      name: product.name,
      variantName: null,
      price,
      image: product.image,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  const media = (
    <div className="relative aspect-square overflow-hidden rounded-t-xl bg-[radial-gradient(circle_at_35%_25%,var(--color-secondary)_0%,var(--color-muted)_70%)]">
      {product.badge && (
        <Badge
          className={cn(
            "absolute top-2.5 left-2.5 z-10 border-transparent text-white xs:top-3 xs:left-3",
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
        sizes="(min-width: 640px) 25vw, 50vw"
        className="object-contain p-4 xs:p-5"
      />
    </div>
  );

  return (
    <Card className="gap-0 py-0">
      {href ? <Link href={href}>{media}</Link> : media}

      <CardContent className="flex flex-1 flex-col gap-2.5 px-3 py-3 xs:px-4 xs:py-4">
        {href ? (
          <Link href={href} className="hover:text-primary">
            <p className="line-clamp-2 min-h-9 text-xs font-semibold text-foreground xs:text-sm">
              {product.name}
            </p>
          </Link>
        ) : (
          <p className="line-clamp-2 min-h-9 text-xs font-semibold text-foreground xs:text-sm">
            {product.name}
          </p>
        )}

        <div className="flex items-baseline gap-1.5">
          <span className="text-sm font-bold text-foreground xs:text-base">
            {pricesVary && <span className="text-xs font-medium text-muted-foreground">From </span>}
            {price}
          </span>
          {oldPrice && (
            <span className="text-xs text-muted-foreground line-through">{oldPrice}</span>
          )}
        </div>

        {hasOptions && href ? (
          <Link
            href={href}
            className="mt-auto inline-flex h-9 items-center justify-center gap-1.5 rounded-full bg-primary text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90 xs:h-10 xs:text-sm"
          >
            Choose Options
            <ChevronRight className="size-3.5 xs:size-4" />
          </Link>
        ) : (
          <button
            type="button"
            onClick={handleAddToCart}
            className={cn(
              "mt-auto inline-flex h-9 items-center justify-center gap-1.5 rounded-full text-xs font-semibold transition-colors xs:h-10 xs:text-sm",
              added
                ? "bg-primary/15 text-primary"
                : "bg-primary text-primary-foreground hover:bg-primary/90",
            )}
          >
            {added ? <Check className="size-3.5 xs:size-4" /> : <Plus className="size-3.5 xs:size-4" />}
            {added ? "Added" : "Add to Cart"}
          </button>
        )}
      </CardContent>
    </Card>
  );
}
