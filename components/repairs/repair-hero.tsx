"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function RepairHero() {
  return (
    <section className="wrap pt-4 sm:pt-6">
      <div className="relative flex min-h-95 items-end overflow-hidden rounded-2xl bg-[oklch(0.14_0.02_155)] xs:min-h-105 sm:min-h-125 sm:rounded-3xl lg:min-h-140">
        <Image
          src="/tech/tech-repair-hero.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/35 to-black/5"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative z-10 max-w-xl px-6 py-8 xs:px-8 sm:px-14 sm:py-12"
        >
          <h1 className="font-heading text-4xl leading-[0.95] font-black tracking-tight text-white xs:text-5xl sm:text-6xl lg:text-7xl">
            Your Device.
            <br />
            Fixed Properly.
          </h1>
          <p className="mt-4 max-w-sm text-sm text-white/70 sm:mt-5 sm:text-lg">
            Fast, professional repairs for phones, tablets, Macs and laptops.
          </p>

          <div className="mt-6 flex flex-col gap-3 xs:flex-row sm:mt-8">
            <Link
              href="/book-a-repair"
              className={cn(
                buttonVariants({ variant: "default" }),
                "h-auto rounded-full bg-white px-6 py-3.5 text-sm text-black hover:bg-white/90",
              )}
            >
              Book a Repair
            </Link>
            <Link
              href="/repairs/get-a-quote"
              className="inline-flex items-center justify-center rounded-full border border-white/25 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Get a Quote
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
