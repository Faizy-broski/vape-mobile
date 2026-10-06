"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Check, Minus, Plus, ShoppingBag, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/lib/cart/cart-context";
import { displayPrice, parseVariantName, swatchFor } from "@/lib/phones/catalog";
import type { Phone, PhoneVariant } from "@/lib/data/phones";
import { StockNote } from "@/components/new-stock/phone-card";

function cartPrice(value: number) {
  return `£${value.toFixed(2)}`;
}

function firstAvailable(variants: PhoneVariant[]) {
  return variants.find((v) => v.stock > 0) ?? variants[0];
}

/**
 * Gallery, colour + memory picker, quantity and Add to Bag for a phone.
 * Options are the product's variants, split on "memory · colour", and the
 * picked variant is what goes in the cart.
 */
export function PhonePurchase({ phone }: { phone: Phone }) {
  const router = useRouter();
  const { addItem } = useCart();
  const options = phone.variants.map((v) => ({ ...v, ...parseVariantName(v.name) }));
  const [variantId, setVariantId] = useState(() => firstAvailable(phone.variants)?.id ?? null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const selected = options.find((o) => o.id === variantId) ?? null;
  const memories = [...new Set(options.map((o) => o.memory))];
  const colours = [...new Set(options.flatMap((o) => (o.colour ? [o.colour] : [])))];
  const stock = selected ? selected.stock : phone.stock;
  const price = selected ? selected.price : phone.price;
  const oldPrice = selected ? selected.old_price : phone.old_price;
  const image = selected?.image ?? phone.image;
  const outOfStock = stock <= 0;
  const qty = Math.min(quantity, Math.max(stock, 1));

  function pick(memory: string, colour: string | null) {
    const exact = options.find((o) => o.memory === memory && o.colour === colour);
    const fallback =
      exact ??
      firstAvailable(options.filter((o) => (colour ? o.colour === colour : o.memory === memory)));
    if (fallback) {
      setVariantId(fallback.id);
      setQuantity(1);
    }
  }

  function addToCart() {
    if (phone.variants.length > 0 && !selected) return;
    addItem(
      {
        productId: phone.id,
        variantId: selected?.id ?? null,
        name: phone.name,
        variantName: selected?.name ?? null,
        price: cartPrice(price),
        image,
      },
      qty,
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
      <div className="lg:sticky lg:top-24 lg:self-start">
        <div className="relative aspect-square overflow-hidden rounded-3xl bg-[radial-gradient(circle_at_50%_35%,var(--color-card)_0%,var(--color-muted)_75%)] ring-1 ring-border/60">
          {phone.badge === "New" && (
            <span className="absolute top-5 left-5 z-10 rounded-full bg-primary px-3 py-1 text-xs font-bold tracking-wider text-primary-foreground uppercase">
              New
            </span>
          )}
          <AnimatePresence mode="wait">
            <motion.div
              key={image}
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="absolute inset-0"
            >
              <Image
                src={image}
                alt={selected?.colour ? `${phone.name} in ${selected.colour}` : phone.name}
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-contain p-6 sm:p-10"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {colours.length > 1 && (
          <div className="mt-3 grid grid-cols-4 gap-3 sm:grid-cols-5">
            {colours.map((colour) => {
              const o = options.find((x) => x.colour === colour)!;
              const active = selected?.colour === colour;
              return (
                <button
                  key={colour}
                  type="button"
                  onClick={() => pick(selected?.memory ?? o.memory, colour)}
                  aria-label={`Show ${colour}`}
                  className={cn(
                    "relative aspect-square overflow-hidden rounded-2xl bg-muted ring-1 transition-all",
                    active ? "ring-2 ring-foreground" : "ring-border/60 hover:ring-foreground/40",
                  )}
                >
                  <Image src={o.image ?? phone.image} alt="" fill sizes="120px" className="object-contain p-1.5" />
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex flex-col">
        {phone.brand && (
          <p className="text-xs font-semibold tracking-[0.2em] text-accent uppercase">
            {phone.brand.name}
          </p>
        )}
        <h1 className="mt-2 font-heading text-3xl leading-tight font-black tracking-tight xs:text-4xl lg:text-5xl">
          {phone.name}
        </h1>
        {selected && (
          <p className="mt-2 text-sm text-muted-foreground">
            {selected.memory}
            {selected.colour ? ` · ${selected.colour}` : ""}
          </p>
        )}

        <div className="mt-6 flex items-baseline gap-3">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={price}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="font-heading text-4xl font-black tracking-tight"
            >
              {displayPrice(price)}
            </motion.span>
          </AnimatePresence>
          {oldPrice && oldPrice > price && (
            <span className="text-lg text-muted-foreground line-through">{displayPrice(oldPrice)}</span>
          )}
        </div>
        <StockNote stock={stock} className="mt-2 text-sm font-semibold" />

        {colours.length > 0 && (
          <fieldset className="mt-8">
            <legend className="text-sm font-semibold">
              Colour <span className="font-normal text-muted-foreground">— {selected?.colour}</span>
            </legend>
            <div className="mt-3 flex flex-wrap gap-2.5">
              {colours.map((colour) => {
                const available = options.some(
                  (o) => o.colour === colour && o.memory === selected?.memory && o.stock > 0,
                );
                const active = selected?.colour === colour;
                return (
                  <button
                    key={colour}
                    type="button"
                    title={colour}
                    aria-pressed={active}
                    onClick={() => pick(selected?.memory ?? memories[0], colour)}
                    className={cn(
                      "flex items-center gap-2 rounded-full border py-1.5 pr-4 pl-1.5 text-sm transition-all",
                      active
                        ? "border-foreground bg-foreground/5 font-semibold"
                        : "border-border hover:border-foreground/40",
                      !available && !active && "text-muted-foreground",
                    )}
                  >
                    <span
                      className={cn(
                        "size-7 rounded-full border border-black/15 dark:border-white/20",
                        !available && "opacity-50",
                      )}
                      style={{ backgroundColor: swatchFor(colour) }}
                    />
                    {colour}
                  </button>
                );
              })}
            </div>
          </fieldset>
        )}

        {memories.length > 0 && phone.variants.length > 0 && (
          <fieldset className="mt-6">
            <legend className="text-sm font-semibold">
              {memories.some((m) => m.includes("/")) ? "Memory / Storage" : "Storage"}
            </legend>
            <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              {memories.map((memory) => {
                const matches = options.filter((o) => o.memory === memory);
                const sameColour = matches.find((o) => o.colour === selected?.colour);
                const from = Math.min(...matches.map((o) => o.price));
                const anyStock = matches.some((o) => o.stock > 0);
                const active = selected?.memory === memory;
                return (
                  <button
                    key={memory}
                    type="button"
                    aria-pressed={active}
                    onClick={() => pick(memory, sameColour ? sameColour.colour : null)}
                    className={cn(
                      "flex flex-col items-start rounded-2xl border px-4 py-3 text-left transition-all",
                      active
                        ? "border-foreground bg-foreground/5 ring-1 ring-foreground"
                        : "border-border hover:border-foreground/40",
                      !anyStock && "opacity-50",
                    )}
                  >
                    <span className="text-sm font-semibold">{memory}</span>
                    <span className="mt-0.5 text-xs text-muted-foreground">
                      {anyStock ? displayPrice(sameColour?.price ?? from) : "Sold out"}
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="inline-flex h-12 w-fit items-center rounded-full border border-input">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, qty - 1))}
              disabled={qty <= 1}
              className="flex size-12 items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
              aria-label="Decrease quantity"
            >
              <Minus className="size-4" />
            </button>
            <span className="w-8 text-center text-sm font-semibold tabular-nums">{qty}</span>
            <button
              type="button"
              onClick={() => setQuantity(Math.min(stock, qty + 1))}
              disabled={qty >= stock}
              className="flex size-12 items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
              aria-label="Increase quantity"
            >
              <Plus className="size-4" />
            </button>
          </div>

          <button
            type="button"
            disabled={outOfStock}
            onClick={() => {
              addToCart();
              setAdded(true);
              setTimeout(() => setAdded(false), 1800);
            }}
            className={cn(
              "inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full border-2 text-sm font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50",
              added
                ? "border-primary bg-primary/10 text-primary"
                : "border-foreground text-foreground hover:bg-foreground hover:text-background",
            )}
          >
            {added ? <Check className="size-4" /> : <ShoppingBag className="size-4" />}
            {outOfStock ? "Sold Out" : added ? "Added to Bag" : "Add to Bag"}
          </button>
        </div>

        <button
          type="button"
          disabled={outOfStock}
          onClick={() => {
            addToCart();
            router.push("/checkout");
          }}
          className="mt-3 inline-flex h-13 w-full items-center justify-center gap-2 rounded-full bg-primary text-sm font-semibold text-primary-foreground shadow-[0_12px_30px_-12px_var(--color-primary)] transition-colors hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
        >
          <Zap className="size-4" />
          Buy Now
        </button>
      </div>
    </div>
  );
}
