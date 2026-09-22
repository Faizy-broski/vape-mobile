"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";

type Category = {
  name: string;
  href: string;
  image: string;
};

const CATEGORIES: Category[] = [
  { name: "Vape Kits", href: "/vape-shop/category/vape-kits", image: "/vape/vapes/1.png" },
  {
    name: "600 Puff Kits & Pods",
    href: "/vape-shop/category/600-puff-kits-pods",
    image: "/vape/vapes/2.png",
  },
  {
    name: "Big Puff Kits & Pods",
    href: "/vape-shop/category/big-puff-kits-pods",
    image: "/vape/vapes/3.png",
  },
  { name: "Vape Juice", href: "/vape-shop/category/vape-juice", image: "/vape/vapes/4.png" },
  { name: "Nic Salts", href: "/vape-shop/category/nic-salts", image: "/vape/vapes/5.png" },
  {
    name: "50ml Shortfill",
    href: "/vape-shop/category/50ml-shortfill",
    image: "/vape/vapes/6.png",
  },
  {
    name: "100ml Shortfill",
    href: "/vape-shop/category/100ml-shortfill",
    image: "/vape/vapes/7.png",
  },
  { name: "Coils", href: "/vape-shop/category/coils", image: "/vape/vapes/8.png" },
  { name: "Spare Pods", href: "/vape-shop/category/spare-pods", image: "/vape/vapes/9.png" },
  {
    name: "Nicotine Pouches",
    href: "/vape-shop/category/nicotine-pouches",
    image: "/vape/vapes/10.png",
  },
];

export function ShopByCategory() {
  return (
    <section className="relative overflow-hidden">
      <Image
        aria-hidden
        src="/vape/vape-bg-2.png"
        alt=""
        width={860}
        height={1080}
        className="pointer-events-none absolute -top-10 -right-10 hidden w-72 opacity-60 select-none sm:block lg:w-96"
      />

      <div className="wrap section-y relative z-10">
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="inline-block text-xs font-semibold tracking-[0.2em] text-accent uppercase"
        >
          01 — Category
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="mt-2 font-heading text-3xl font-black tracking-tight uppercase xs:text-4xl sm:text-5xl"
        >
          Shop by Category
        </motion.h2>

        <div className="mt-8 grid grid-cols-2 gap-3 xs:gap-4 sm:mt-10 sm:grid-cols-3 sm:gap-5 lg:grid-cols-5">
          {CATEGORIES.map((category, i) => (
            <motion.div
              key={category.href}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: (i % 5) * 0.05 }}
            >
              <Link
                href={category.href}
                className="group relative flex aspect-square flex-col justify-end overflow-hidden rounded-xl bg-black outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Image
                  src={category.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent transition-opacity duration-300 group-hover:from-black/90" />
                <span className="relative z-10 p-3 text-sm font-semibold text-white xs:p-4 xs:text-base">
                  {category.name}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
