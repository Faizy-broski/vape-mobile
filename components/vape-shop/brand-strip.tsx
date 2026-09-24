"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ChevronRight } from "lucide-react";
import type { ShopBrand } from "@/lib/supabase/types";

export function BrandStrip({ brands }: { brands: ShopBrand[] }) {
  return (
    <section className="wrap py-6 sm:py-8">
      <span className="inline-block text-xs font-semibold tracking-[0.2em] text-accent uppercase">
        02 — Brands
      </span>
      <div className="mt-2 flex items-end justify-between gap-4">
        <h2 className="font-heading text-2xl font-black tracking-tight uppercase xs:text-3xl">
          Shop by Brand
        </h2>
        <Link
          href="/vape-shop/brands"
          className="inline-flex shrink-0 items-center gap-0.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase transition-colors hover:text-foreground xs:text-sm"
        >
          View All
          <ChevronRight className="size-3.5" />
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4 xs:gap-5 sm:mt-8 sm:grid-cols-6 sm:gap-6">
        {brands.map((brand, i) => (
          <motion.div
            key={brand.name}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
          >
            <Link
              href="/vape-shop/brands"
              className="group flex flex-col items-center gap-2 text-center"
            >
              <span className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-full bg-white p-3 shadow-sm ring-1 ring-border transition-transform duration-300 group-hover:scale-105 xs:p-4">
                <Image
                  src={brand.image}
                  alt={brand.name}
                  fill
                  sizes="(min-width: 640px) 16vw, 30vw"
                  className="object-contain"
                />
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
