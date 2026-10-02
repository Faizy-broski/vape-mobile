"use client";

import { useState } from "react";
import { Check, Minus, Plus } from "lucide-react";
import { useCart } from "@/lib/cart/cart-context";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ProductVariant } from "@/lib/supabase/types";

function formatPrice(value: number) {
  return `£${value.toFixed(2)}`;
}

/**
 * Price, stock, option picker, quantity and Add to Cart for the product
 * page. With variants, the shown price/stock follow the selected option and
 * that option is what goes in the cart.
 */
export function ProductDetailActions({
  id,
  name,
  price,
  oldPrice,
  image,
  stock,
  variants,
}: {
  id: string;
  name: string;
  price: number;
  oldPrice: number | null;
  image: string;
  stock: number;
  variants: ProductVariant[];
}) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [variantId, setVariantId] = useState<string | null>(
    () => (variants.find((v) => v.stock > 0) ?? variants[0])?.id ?? null,
  );

  const variant = variants.find((v) => v.id === variantId) ?? null;
  const shownPrice = variant ? variant.price : price;
  const shownOldPrice = variant ? variant.old_price : oldPrice;
  const shownStock = variant ? variant.stock : stock;
  const outOfStock = shownStock <= 0;

  function handleAddToCart() {
    addItem(
      {
        productId: id,
        variantId: variant?.id ?? null,
        name,
        variantName: variant?.name ?? null,
        price: formatPrice(shownPrice),
        image: variant?.image ?? image,
      },
      quantity,
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-foreground">{formatPrice(shownPrice)}</span>
          {shownOldPrice && shownOldPrice > shownPrice && (
            <span className="text-base text-muted-foreground line-through">
              {formatPrice(shownOldPrice)}
            </span>
          )}
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          {outOfStock ? "Currently out of stock" : "In stock"}
        </p>
      </div>

      {variants.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-foreground">
            Option: <span className="font-normal text-muted-foreground">{variant?.name}</span>
          </p>
          <Select
            value={variantId}
            onValueChange={(v) => setVariantId(v as string | null)}
            items={variants.map((v) => ({ value: v.id, label: v.name }))}
          >
            <SelectTrigger className="mt-2 w-full xs:w-72">
              <SelectValue placeholder="Choose an option" />
            </SelectTrigger>
            <SelectContent>
              {variants.map((v) => (
                <SelectItem key={v.id} value={v.id} disabled={v.stock <= 0}>
                  {v.name}
                  {v.stock <= 0 ? " — out of stock" : ""}
                  {v.price !== price ? ` (${formatPrice(v.price)})` : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="flex items-center gap-3">
        <p className="text-sm font-semibold text-foreground">Quantity:</p>
        <div className="inline-flex items-center rounded-full border border-input">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="flex size-9 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Decrease quantity"
          >
            <Minus className="size-3.5" />
          </button>
          <span className="w-8 text-center text-sm font-semibold tabular-nums">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            className="flex size-9 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Increase quantity"
          >
            <Plus className="size-3.5" />
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={handleAddToCart}
        disabled={outOfStock}
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50 xs:w-auto xs:px-8"
      >
        {added ? <Check className="size-4" /> : null}
        {outOfStock ? "Out of Stock" : added ? "Added to Cart" : "Add to Cart"}
      </button>
    </div>
  );
}
