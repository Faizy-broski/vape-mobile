"use client";

import { useEffect, useRef } from "react";
import { motion, useInView, useMotionValue, useTransform, animate } from "motion/react";

const STATS = [
  { value: 12000, suffix: "+", label: "Repairs Completed" },
  { value: 4.9, suffix: "★", label: "Average Rating", decimals: 1 },
  { value: 2, suffix: "", label: "Store Locations" },
  { value: 7, suffix: "yrs", label: "Trading Locally" },
];

function Counter({ value, suffix, decimals = 0 }: { value: number; suffix: string; decimals?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => latest.toFixed(decimals));

  useEffect(() => {
    if (!inView) return;
    const controls = animate(count, value, { duration: 1.4, ease: "easeOut" });
    return controls.stop;
  }, [inView, value, count]);

  return (
    <span ref={ref} className="font-heading text-4xl font-black tracking-tight sm:text-5xl">
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
}

export function StatsBand() {
  return (
    <section className="relative overflow-hidden bg-[oklch(0.28_0.05_155)]">
      <div className="wrap relative z-10 grid grid-cols-2 gap-8 py-12 sm:grid-cols-4 sm:py-16">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="text-center text-white"
          >
            <Counter value={stat.value} suffix={stat.suffix} decimals={stat.decimals} />
            <p className="mt-1.5 text-xs font-medium tracking-wide text-white/60 uppercase xs:text-sm">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
