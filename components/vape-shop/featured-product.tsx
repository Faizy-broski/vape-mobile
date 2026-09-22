"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ChevronRight, Mail, Minus, Plus, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const FLAVOURS = ["Banana", "Blue Razz", "Watermelon Ice", "Strawberry Kiwi"];
const SHARE_LINKS = [
  { icon: Share2, label: "Share" },
  { icon: Mail, label: "Email" },
];
const GALLERY = ["/vape/vapes/9.png", "/vape/vapes/1.png", "/vape/vapes/3.png"];

export function FeaturedProduct() {
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(GALLERY[0]);

  return (
    <section className="wrap py-6 sm:py-8">
      <div className="flex items-end justify-between gap-4">
        <h2 className="font-heading text-2xl font-black tracking-tight uppercase xs:text-3xl">
          Best Value Big Puff Vape
        </h2>
        <Link
          href="/vape-shop/product/ske-cl2000"
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
            <div className="hidden flex-col gap-3 xs:flex">
              {GALLERY.map((src) => (
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
            <div className="relative aspect-square flex-1 overflow-hidden rounded-xl bg-[radial-gradient(circle_at_35%_25%,var(--color-secondary)_0%,var(--color-muted)_75%)]">
              <Image
                src={activeImage}
                alt="SKE CL2000 Prefilled Pod Vape Kit"
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
            SKE CL2000 Prefilled Pod Vape Kit
          </h3>

          <div className="mt-3 flex flex-wrap gap-2">
            <Badge className="border-transparent bg-destructive text-white">
              5 for £5
            </Badge>
            <Badge className="border-transparent bg-neutral-900 text-white">
              Hot Seller
            </Badge>
          </div>

          <p className="mt-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
            V &amp; M Online Shop
          </p>

          <Separator className="my-5" />

          <div className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-semibold text-foreground">
                Flavour: <span className="font-normal text-muted-foreground">Banana</span>
              </label>
              <Select defaultValue="Banana">
                <SelectTrigger className="mt-2 w-full xs:w-48">
                  <SelectValue placeholder="Select flavour" />
                </SelectTrigger>
                <SelectContent>
                  {FLAVOURS.map((flavour) => (
                    <SelectItem key={flavour} value={flavour}>
                      {flavour}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <p className="text-sm font-semibold text-foreground">
              Price: <span className="font-bold">£5.99</span>
            </p>

            <div>
              <p className="mb-2 text-sm font-semibold text-foreground">Quantity:</p>
              <div className="inline-flex items-center rounded-full border border-input">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="flex size-9 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                  aria-label="Decrease quantity"
                >
                  <Minus className="size-3.5" />
                </button>
                <span className="w-8 text-center text-sm font-semibold tabular-nums">
                  {quantity}
                </span>
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
          </div>

          <div className="mt-6 flex flex-col gap-4 xs:flex-row xs:items-center">
            <button
              type="button"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Add to Cart
            </button>

            <div className="flex items-center gap-3">
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
        </div>
      </motion.div>
    </section>
  );
}
