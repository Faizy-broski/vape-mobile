"use client";

import Image from "next/image";
import { motion } from "motion/react";

const DEALS = [
  { price: "2 for £25", description: "Selected big puff kits" },
  { price: "3 for £15", description: "Selected prefilled pods" },
  { price: "3 for £12", description: "Selected 10ml nic salts" },
  { price: "2 for £30", description: "Selected 100ml shortfills" },
];

export function MultiBuyDeals() {
  return (
    <section className="relative isolate overflow-hidden bg-[oklch(0.16_0.015_155)]">
      <Image
        src="/vape/bg-image-multi.png"
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
      />
      {/* <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/70"
      /> */}

      <div className="wrap relative z-10 flex flex-col gap-6 py-10 xs:gap-8 sm:py-12 lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:py-16">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="font-heading text-3xl leading-[0.95] font-black tracking-tight text-white uppercase xs:text-4xl sm:text-5xl lg:shrink-0"
        >
          Multi-Buy
          <br />
          Deals
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-white/15 backdrop-blur-sm sm:grid-cols-4 lg:max-w-2xl lg:shrink-0"
        >
          {DEALS.map((deal) => (
            <div key={deal.price} className="bg-black/35 px-4 py-5 xs:px-5 sm:px-6">
              <p className="font-heading text-lg font-black tracking-tight text-white uppercase xs:text-xl sm:text-2xl">
                {deal.price}
              </p>
              <p className="mt-1.5 text-xs text-white/70 sm:text-sm">
                {deal.description}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
