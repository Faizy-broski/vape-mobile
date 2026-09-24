"use client";

import { motion } from "motion/react";
import { ProductCard } from "@/components/vape-shop/product-card";
import { ACCESSORIES } from "@/components/accessories/accessories-data";

export function AccessoriesGrid() {
  return (
    <section className="wrap section-y">
      <span className="inline-block text-xs font-semibold tracking-[0.2em] text-accent uppercase">
        Shop
      </span>
      <h2 className="mt-2 font-heading text-3xl font-black tracking-tight uppercase xs:text-4xl sm:text-5xl">
        Chargers, Cables &amp; Cases
      </h2>

      <div className="mt-8 grid grid-cols-2 gap-3 xs:gap-4 sm:mt-10 sm:grid-cols-3 sm:gap-5">
        {ACCESSORIES.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
