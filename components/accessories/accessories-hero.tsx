"use client";

import Image from "next/image";
import { motion } from "motion/react";

export function AccessoriesHero() {
  return (
    <section className="wrap pt-4 sm:pt-6">
      <div className="relative flex min-h-70 items-center overflow-hidden rounded-2xl xs:min-h-80 sm:min-h-95 sm:rounded-3xl">
        <Image
          src="/tech/your-device-bg.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/40" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="relative z-10 px-6 py-10 xs:px-8 sm:px-14"
        >
          <span className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
            Everyday Kit
          </span>
          <h1 className="mt-3 max-w-lg font-heading text-3xl leading-[1.05] font-black tracking-tight text-white uppercase xs:text-4xl sm:text-5xl">
            Accessories for Every Device.
          </h1>
          <p className="mt-4 max-w-sm text-sm text-white/70 sm:text-base">
            Chargers, cables and cases stocked at the counter — priced fairly,
            available same day.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
