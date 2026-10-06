"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

type Panel = {
  index: string;
  eyebrow: string;
  titleLines: [string, string];
  subtitle: string;
  cta: string;
  href: string;
  image: string;
};

const PANELS: Panel[] = [
  {
    index: "01",
    eyebrow: "Service",
    titleLines: ["Tech", "Repair"],
    subtitle: "Phones • Mac • Laptop • Tablet",
    cta: "Enter Repair",
    href: "/repairs",
    image: "/tech/tech-repair.png",
  },
  {
    index: "02",
    eyebrow: "Retail",
    titleLines: ["Vape", "Shop"],
    subtitle: "Vapes • Pods • E-Liquids • Accessories",
    cta: "Enter Vape Shop",
    href: "/vape-shop",
    image: "/vape/vape-shop.png",
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
          className="group relative flex min-h-[60svh] flex-col justify-end overflow-hidden p-6 text-white xs:p-8 sm:p-12 lg:min-h-0 lg:p-16"
        >
          <Image
            src={panel.image}
            alt=""
            fill
            priority={i === 0}
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/10" />

          <div className="relative z-10">
            <span className="mb-5 inline-block text-xs font-medium tracking-[0.2em] text-white/60 uppercase">
              {panel.index} — {panel.eyebrow}
            </span>
            <h2 className="font-heading text-5xl leading-[0.95] font-black tracking-tight uppercase xs:text-6xl sm:text-7xl lg:text-8xl">
              {panel.titleLines[0]}
              <br />
              {panel.titleLines[1]}
            </h2>
            <p className="mt-4 text-sm text-white/70 sm:mt-5 sm:text-lg">
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

      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.5 }}
        className="absolute top-5 left-1/2 z-20 w-max max-w-[calc(100%-2rem)] -translate-x-1/2 sm:top-8"
      >
        <Link
          href="/new-stock"
          className="group/pill inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-black/45 py-1.5 pr-4 pl-1.5 text-xs text-white shadow-lg backdrop-blur-md transition-colors hover:bg-black/60 sm:text-sm"
        >
          <span className="rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold tracking-wider text-primary-foreground uppercase sm:text-[11px]">
            New Stock
          </span>
          <span className="truncate">
            iPhone 17 Pro Max &amp; Galaxy phones<span className="hidden xs:inline"> — just landed</span>
          </span>
          <ArrowRight className="size-3.5 shrink-0 transition-transform group-hover/pill:translate-x-0.5" />
        </Link>
      </motion.div>
    </section>
  );
}
