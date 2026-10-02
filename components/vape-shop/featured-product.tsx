"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ChevronRight, Mail, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ProductDetailActions } from "@/components/vape-shop/product-detail/product-detail-actions";
import type { ProductDetail } from "@/lib/data/products";
import { cn } from "@/lib/utils";

const SHARE_LINKS = [
  { icon: Share2, label: "Share" },
  { icon: Mail, label: "Email" },
];

export function FeaturedProduct({ product }: { product: ProductDetail }) {
  // The product photo plus any distinct per-option photos, as a small gallery.
  const gallery = [
    ...new Set([product.image, ...product.variants.flatMap((v) => (v.image ? [v.image] : []))]),
  ].slice(0, 4);
  const [activeImage, setActiveImage] = useState(gallery[0]);
  const href = `/vape-shop/product/${product.slug}`;

  return (
    <section className="wrap py-6 sm:py-8">
      <div className="flex items-end justify-between gap-4">
        <h2 className="font-heading text-2xl font-black tracking-tight uppercase xs:text-3xl">
          Best Value Big Puff Vape
        </h2>
        <Link
          href={href}
          className="inline-flex shrink-0 items-center gap-0.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase transition-colors hover:text-foreground xs:text-sm"
        >
          View Detail
          <ChevronRight className="size-3.5" />
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5 }}
        className="mt-6 grid grid-cols-1 gap-6 overflow-hidden rounded-2xl bg-card p-4 ring-1 ring-foreground/10 xs:p-6 sm:mt-8 md:grid-cols-2 md:gap-10 md:p-8"
      >
        <div>
          <div className="flex gap-3">
            {gallery.length > 1 && (
              <div className="hidden flex-col gap-3 xs:flex">
                {gallery.map((src) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setActiveImage(src)}
                    className={cn(
                      "relative flex size-14 items-center justify-center overflow-hidden rounded-lg bg-muted ring-1 ring-border transition-colors hover:ring-primary/50 sm:size-16",
                      activeImage === src && "ring-2 ring-primary",
                    )}
                  >
                    <Image src={src} alt="" fill sizes="64px" className="object-contain p-1.5" />
                  </button>
                ))}
              </div>
            )}
            <div className="relative aspect-square flex-1 overflow-hidden rounded-xl bg-[radial-gradient(circle_at_35%_25%,var(--color-secondary)_0%,var(--color-muted)_75%)]">
              <Image
                src={activeImage}
                alt={product.name}
                fill
                sizes="(min-width: 768px) 40vw, 90vw"
                className="object-contain p-6 transition-transform duration-500 hover:scale-110"
              />
            </div>
          </div>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Roll over image to zoom in
          </p>
        </div>

        <div className="flex flex-col">
          <h3 className="font-heading text-xl font-bold tracking-tight xs:text-2xl">
            <Link href={href} className="hover:text-primary">
              {product.name}
            </Link>
          </h3>

          <div className="mt-3 flex flex-wrap gap-2">
            {product.badge && (
              <Badge
                className={cn(
                  "border-transparent text-white",
                  product.badge === "Sale" ? "bg-destructive" : "bg-primary",
                )}
              >
                {product.badge}
              </Badge>
            )}
            <Badge className="border-transparent bg-neutral-900 text-white">Hot Seller</Badge>
          </div>

          <p className="mt-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
            {product.brand?.name ?? "V & M Online Shop"}
          </p>

          <Separator className="my-5" />

          <ProductDetailActions
            id={product.id}
            name={product.name}
            price={product.price}
            oldPrice={product.old_price}
            image={product.image}
            stock={product.stock}
            variants={product.variants}
          />

          <div className="mt-4 flex items-center gap-3">
            {SHARE_LINKS.map(({ icon: Icon, label }) => (
              <button
                key={label}
                type="button"
                aria-label={label}
                className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <Icon className="size-4" />
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
