"use client";

import { motion } from "motion/react";
import { BadgePoundSterling, Clock, MapPin, ShieldCheck } from "lucide-react";

const VALUES = [
  {
    icon: Clock,
    title: "Same-Day Service",
    description: "Most repairs are diagnosed and fixed while you wait or run errands.",
  },
  {
    icon: ShieldCheck,
    title: "Genuine Parts",
    description: "Quality components with a 6 month warranty on every repair.",
  },
  {
    icon: BadgePoundSterling,
    title: "Honest Pricing",
    description: "Upfront quotes before we start. No surprise fees at collection.",
  },
  {
    icon: MapPin,
    title: "Local & Trusted",
    description: "A real counter you can walk into — not a call centre.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="wrap section-y">
      <span className="inline-block text-xs font-semibold tracking-[0.2em] text-accent uppercase">
        Why V&amp;M
      </span>
      <h2 className="mt-2 font-heading text-3xl font-black tracking-tight uppercase xs:text-4xl sm:text-5xl">
        Why people come back
      </h2>

      <div className="mt-8 grid grid-cols-2 gap-3 xs:gap-4 sm:mt-10 sm:grid-cols-4 sm:gap-5">
        {VALUES.map((value, i) => (
          <motion.div
            key={value.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            className="rounded-2xl border border-border bg-card p-5"
          >
            <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <value.icon className="size-5" strokeWidth={1.75} />
            </span>
            <p className="mt-4 text-sm font-semibold text-foreground xs:text-base">
              {value.title}
            </p>
            <p className="mt-1 text-xs text-muted-foreground xs:text-sm">
              {value.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
