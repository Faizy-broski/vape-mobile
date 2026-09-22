"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ShopHero() {
  return (
    <section className="wrap pt-4 sm:pt-6">
      <div className="relative flex min-h-95 items-center overflow-hidden rounded-2xl bg-[oklch(0.12_0.015_155)] xs:min-h-105 sm:min-h-125 sm:rounded-3xl lg:min-h-140">
        <Image
          src="/vape/vape-shop-hero.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-black/10"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative z-10 max-w-xl px-6 py-12 xs:px-8 sm:px-14 sm:py-20"
        >
          <h1 className="font-heading text-4xl leading-[0.95] font-black tracking-tight text-white xs:text-5xl sm:text-6xl lg:text-7xl">
            Find Your
            <br />
            Next Vape.
          </h1>
          <p className="mt-4 max-w-sm text-sm text-white/70 sm:mt-5 sm:text-lg">
            Explore vape kits, pods, e-liquids, coils and more.
          </p>

          <div className="mt-6 flex flex-col gap-3 xs:flex-row sm:mt-8">
            <Link
              href="/vape-shop/kits"
              className={cn(
                buttonVariants({ variant: "default" }),
                "h-auto rounded-full bg-white px-6 py-3.5 text-sm text-black hover:bg-white/90",
              )}
            >
              Shop Vape Kits
            </Link>
            <Link
              href="/vape-shop/e-liquids"
              className="inline-flex items-center justify-center rounded-full border border-white/25 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Explore E-Liquids
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
