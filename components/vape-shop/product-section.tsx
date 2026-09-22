"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/vape-shop/product-card";
import { PRODUCT_SECTIONS, type ProductSectionData } from "@/components/vape-shop/product-data";

export function HomeProductSections() {
  return (
    <>
      {PRODUCT_SECTIONS.map((section) => (
        <ProductSection key={section.title} {...section} />
      ))}
    </>
  );
}

function ProductSection({ title, href, products }: ProductSectionData) {
  return (
    <section className="wrap py-6 sm:py-8">
      <div className="flex items-end justify-between gap-4">
        <h2 className="font-heading text-2xl font-black tracking-tight uppercase xs:text-3xl">
          {title}
        </h2>
        <Link
          href={href}
          className="inline-flex shrink-0 items-center gap-0.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase transition-colors hover:text-foreground xs:text-sm"
        >
          View All
          <ChevronRight className="size-3.5" />
        </Link>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 xs:gap-4 sm:mt-6 sm:grid-cols-4 sm:gap-5">
        {products.map((product, i) => (
          <motion.div
            key={product.name + i}
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
