"use client";

import Image from "next/image";
import { motion } from "motion/react";

export function OurStory() {
  return (
    <section className="wrap section-y">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="relative aspect-4/3 overflow-hidden rounded-3xl"
        >
          <Image
            src="/tech/tech-repair.png"
            alt="A technician repairing a phone at the counter"
            fill
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="object-cover"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <span className="inline-block text-xs font-semibold tracking-[0.2em] text-accent uppercase">
            Our Story
          </span>
          <h2 className="mt-2 font-heading text-3xl leading-[1.05] font-black tracking-tight uppercase xs:text-4xl">
            Started with a screwdriver and a shortfill.
          </h2>
          <div className="mt-5 flex flex-col gap-4 text-sm text-muted-foreground sm:text-base">
            <p>
              V&amp;M started as a single repair bench fixing cracked screens
              for friends and neighbours. Word got around, the queue got
              longer, and a vape counter went in next to it — because half
              the people waiting for a repair asked where to get pods anyway.
            </p>
            <p>
              We&apos;re still the same two things done properly: honest,
              same-day device repairs with genuine parts, and a vape shop
              that actually knows what it&apos;s selling. No upselling, no
              guesswork — just straight answers from people who use this
              stuff themselves.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
