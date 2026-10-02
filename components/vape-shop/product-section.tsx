"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/vape-shop/product-card";
import type { ProductSection as ProductSectionRow } from "@/lib/supabase/types";
import type { ProductWithVariantSummary } from "@/lib/data/products";

export type SectionWithProducts = ProductSectionRow & { products: ProductWithVariantSummary[] };

export function HomeProductSections({ sections }: { sections: SectionWithProducts[] }) {
  return (
    <>
      {sections
        .filter((section) => section.products.length > 0)
        .map((section) => (
          <ProductSection key={section.id} section={section} />
        ))}
    </>
  );
}

function ProductSection({ section }: { section: SectionWithProducts }) {
  return (
    <section className="wrap py-6 sm:py-8">
      <div className="flex items-end justify-between gap-4">
        <h2 className="font-heading text-2xl font-black tracking-tight uppercase xs:text-3xl">
          {section.title}
        </h2>
        <Link
          href={section.href}
          className="inline-flex shrink-0 items-center gap-0.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase transition-colors hover:text-foreground xs:text-sm"
        >
          View All
          <ChevronRight className="size-3.5" />
        </Link>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 xs:gap-4 sm:mt-6 sm:grid-cols-4 sm:gap-5">
        {section.products.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: (i % 4) * 0.05 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
