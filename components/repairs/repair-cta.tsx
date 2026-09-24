"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function RepairCta() {
  return (
    <section className="wrap section-y">
      <div className="relative flex min-h-90 items-center justify-center overflow-hidden rounded-2xl bg-[oklch(0.14_0.02_141)] px-5 py-14 text-center xs:min-h-95 sm:min-h-105 sm:rounded-3xl sm:px-10">
        <Image
          aria-hidden
          src="/tech/tech-repair-hero.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[oklch(0.2_0.05_141/0.55)]"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/45"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="relative z-10 flex max-w-2xl flex-col items-center"
        >
          <h2 className="font-heading text-3xl leading-[1.05] font-black tracking-tight text-white uppercase xs:text-4xl sm:text-5xl">
            Your Device
            <br />
            Deserves Better.
          </h2>
          <p className="mt-4 max-w-md text-sm text-white/70 sm:text-base">
            Book your repair today and get your device back to working
            properly.
          </p>

          <div className="mt-7 flex w-full flex-col gap-3 xs:w-auto xs:flex-row sm:mt-8">
            <Link
              href="/repairs/book"
              className={cn(
                buttonVariants({ variant: "default" }),
                "h-auto rounded-full bg-white px-7 py-3.5 text-sm text-black hover:bg-white/90",
              )}
            >
              Book a Repair
            </Link>
            <Link
              href="/repairs/get-a-quote"
              className="inline-flex items-center justify-center rounded-full border border-white/30 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Get a Quote
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
