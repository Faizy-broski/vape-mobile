"use client";

import { useState } from "react";
import { Check, Minus, Plus } from "lucide-react";
import { useCart } from "@/lib/cart/cart-context";

export function ProductDetailActions({
  id,
  name,
  price,
  image,
  stock,
}: {
  id: string;
  name: string;
  price: string;
  image: string;
  stock: number;
}) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const outOfStock = stock <= 0;

  function handleAddToCart() {
    addItem({ id, name, price, image }, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="flex flex-col gap-4">
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
