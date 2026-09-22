"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Smartphone, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type Panel = {
  index: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  cta: string;
  href: string;
  icon: React.ReactNode;
  className: string;
};

const PANELS: Panel[] = [
  {
    index: "01",
    eyebrow: "Service",
    title: "Tech Repair",
    subtitle: "Phones • Mac • Laptop • Tablet",
    cta: "Enter Repair",
    href: "/repairs",
    icon: <Smartphone className="size-full" strokeWidth={0.6} />,
    className:
      "bg-[radial-gradient(circle_at_30%_20%,oklch(0.32_0.03_155)_0%,oklch(0.1_0.01_155)_65%)]",
  },
  {
    index: "02",
    eyebrow: "Retail",
    title: "Vape Shop",
    subtitle: "Vapes • Pods • E-Liquids • Accessories",
    cta: "Enter Vape Shop",
    href: "/vape-shop",
    icon: <Sparkles className="size-full" strokeWidth={0.6} />,
    className:
      "bg-[radial-gradient(circle_at_70%_20%,oklch(0.4_0.1_155)_0%,oklch(0.12_0.02_155)_65%)]",
  },
];

export function HeroSplit() {
  return (
    <section className="relative grid min-h-[calc(100svh-4.5rem)] grid-cols-1 lg:grid-cols-2">
      {PANELS.map((panel, i) => (
        <motion.div
          key={panel.href}
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: i * 0.15 }}
          className={cn(
            "group relative flex min-h-[60svh] flex-col justify-end overflow-hidden p-8 text-white sm:p-12 lg:min-h-0 lg:p-16",
            panel.className,
          )}
        >
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -right-10 -top-10 size-72 text-white/[0.06] sm:size-96"
            initial={{ scale: 0.9, rotate: -6 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            {panel.icon}
          </motion.div>

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

          <div className="relative z-10">
            <span className="mb-5 inline-block text-xs font-medium tracking-[0.2em] text-white/60 uppercase">
              {panel.index} — {panel.eyebrow}
            </span>
            <h2 className="font-heading text-6xl leading-[0.95] font-black tracking-tight uppercase sm:text-7xl lg:text-8xl">
              {panel.title}
            </h2>
            <p className="mt-5 text-base text-white/70 sm:text-lg">
              {panel.subtitle}
            </p>

            <Link
              href={panel.href}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-black transition-transform duration-300 group-hover:gap-3 hover:bg-white/90"
            >
              {panel.cta}
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </motion.div>
      ))}

      <div className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 bg-white/10 lg:block" />
    </section>
  );
}
