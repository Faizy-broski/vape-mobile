"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { PHONE_SPECS, displayPrice, parseVariantName, swatchFor } from "@/lib/phones/catalog";
import type { Phone } from "@/lib/data/phones";

/** One swatch per colour, pointing at the first option in that colour. */
export function colourOptions(phone: Phone) {
  const seen = new Map<string, { colour: string; image: string; inStock: boolean }>();
  for (const v of phone.variants) {
    const { colour } = parseVariantName(v.name);
    if (!colour) continue;
    const existing = seen.get(colour);
    if (existing) {
      existing.inStock ||= v.stock > 0;
    } else {
      seen.set(colour, { colour, image: v.image ?? phone.image, inStock: v.stock > 0 });
    }
  }
  return [...seen.values()];
}

export function memoryOptions(phone: Phone) {
  return [...new Set(phone.variants.map((v) => parseVariantName(v.name).memory))];
}

export function StockNote({ stock, className }: { stock: number; className?: string }) {
  if (stock <= 0) {
    return <span className={cn("text-muted-foreground", className)}>Sold out</span>;
  }
  const low = stock <= 2;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5",
        low ? "text-amber-600 dark:text-amber-400" : "text-primary",
        className,
      )}
    >
      <span className="relative flex size-2">
        <span
          className={cn(
            "absolute inline-flex size-full animate-ping rounded-full opacity-60",
            low ? "bg-amber-500" : "bg-primary",
          )}
        />
        <span className={cn("relative inline-flex size-2 rounded-full", low ? "bg-amber-500" : "bg-primary")} />
      </span>
      {low ? `Only ${stock} left` : "In stock"}
    </span>
  );
}

export function PhoneCard({ phone, priority = false }: { phone: Phone; priority?: boolean }) {
  const colours = colourOptions(phone);
  const memory = memoryOptions(phone);
  const [preview, setPreview] = useState<string | null>(null);
  const spec = PHONE_SPECS[phone.slug];
  const pricesVary = new Set(phone.variants.map((v) => v.price)).size > 1;
  const href = `/new-stock/${phone.slug}`;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border/70 bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_24px_60px_-28px_rgba(0,0,0,0.35)]">
      <Link
        href={href}
        className="relative block aspect-square overflow-hidden bg-[radial-gradient(circle_at_50%_35%,var(--color-card)_0%,var(--color-muted)_75%)]"
      >
        <div className="absolute top-3 left-3 z-10 flex gap-1.5 xs:top-4 xs:left-4">
          {spec && (
            <span className="rounded-full bg-foreground px-2.5 py-1 text-[10px] font-bold tracking-wider text-background">
              {spec.network}
            </span>
          )}
          {phone.badge === "New" && (
            <span className="rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold tracking-wider text-primary-foreground uppercase">
              New
            </span>
          )}
        </div>
        <ArrowUpRight className="absolute top-3 right-3 z-10 size-5 text-muted-foreground opacity-0 transition-all duration-300 group-hover:opacity-100 xs:top-4 xs:right-4" />
        <Image
          src={preview ?? phone.image}
          alt={phone.name}
          fill
          priority={priority}
          sizes="(min-width: 1280px) 22vw, (min-width: 640px) 33vw, 50vw"
          className="object-contain p-3 transition-transform duration-500 ease-out group-hover:scale-[1.04] xs:p-5"
        />
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4 xs:p-5">
        <div>
          {phone.brand && (
            <p className="text-[10px] font-semibold tracking-[0.2em] text-muted-foreground uppercase xs:text-[11px]">
              {phone.brand.name}
            </p>
          )}
          <h3 className="mt-1 font-heading text-base leading-tight font-bold tracking-tight xs:text-lg">
            <Link href={href} className="after:absolute after:inset-0 hover:text-primary">
              {phone.name.replace(/^(Samsung|Apple) /, "")}
            </Link>
          </h3>
          <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{memory.join(" · ")}</p>
        </div>

        {colours.length > 0 && (
          <div className="relative z-10 flex flex-wrap gap-1.5">
            {colours.map((c) => (
              <button
                key={c.colour}
                type="button"
                title={c.colour}
                aria-label={`Preview ${c.colour}`}
                onMouseEnter={() => setPreview(c.image)}
                onMouseLeave={() => setPreview(null)}
                onFocus={() => setPreview(c.image)}
                onBlur={() => setPreview(null)}
                className={cn(
                  "size-5 rounded-full border border-black/15 ring-offset-2 ring-offset-card transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none dark:border-white/20",
                  !c.inStock && "opacity-40",
                )}
                style={{ backgroundColor: swatchFor(c.colour) }}
              />
            ))}
          </div>
        )}

        <div className="mt-auto flex items-end justify-between gap-2 pt-1">
          <div>
            {pricesVary && <p className="text-[11px] text-muted-foreground">From</p>}
            <p className="font-heading text-xl font-black tracking-tight xs:text-2xl">
              {displayPrice(phone.price)}
            </p>
          </div>
          <StockNote stock={phone.stock} className="pb-1 text-[11px] font-semibold xs:text-xs" />
        </div>
      </div>
    </article>
  );
}
