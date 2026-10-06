"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { ArrowDown, MapPin, PackageCheck, ShieldCheck } from "lucide-react";
import { NEW_STOCK_STORE, displayPrice } from "@/lib/phones/catalog";

export function NewStockHero({
  models,
  units,
  fromPrice,
  showcase,
}: {
  models: number;
  units: number;
  fromPrice: number | null;
  /** Two phone photos for the right-hand composition: [large, small]. */
  showcase: [{ src: string; alt: string }, { src: string; alt: string }];
}) {
  return (
    <section className="wrap pt-4 sm:pt-6">
      <div className="relative isolate overflow-hidden rounded-2xl bg-[oklch(0.15_0.02_155)] text-white sm:rounded-3xl">
        <div
          aria-hidden
          className="absolute -top-40 -left-32 -z-10 size-[34rem] rounded-full bg-[oklch(0.414_0.128_141)] opacity-40 blur-[120px]"
        />
        <div
          aria-hidden
          className="absolute -right-24 -bottom-48 -z-10 size-[30rem] rounded-full bg-[oklch(0.72_0.17_55)] opacity-25 blur-[120px]"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
        />

        <div className="grid items-center gap-6 px-6 pt-10 xs:px-8 sm:px-14 sm:pt-14 lg:grid-cols-[1.1fr_1fr] lg:gap-0 lg:py-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[11px] font-semibold tracking-[0.18em] text-white/80 uppercase backdrop-blur">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-[oklch(0.75_0.17_141)] opacity-70" />
                <span className="relative inline-flex size-2 rounded-full bg-[oklch(0.75_0.17_141)]" />
              </span>
              Just landed
            </span>
            <h1 className="mt-5 font-heading text-4xl leading-[0.95] font-black tracking-tight xs:text-5xl sm:text-6xl lg:text-7xl">
              New Stock.
              <br />
              <span className="bg-linear-to-r from-[oklch(0.82_0.15_141)] to-[oklch(0.82_0.13_75)] bg-clip-text text-transparent">
                Brand New. Boxed.
              </span>
            </h1>
            <p className="mt-5 max-w-md text-sm text-white/70 sm:text-lg">
              The latest Samsung Galaxy and iPhone models — factory sealed and ready to
              collect today from our {NEW_STOCK_STORE} shop.
            </p>

            <div className="mt-7 flex flex-wrap gap-2.5">
              {[
                { icon: PackageCheck, label: "Sealed in box" },
                { icon: ShieldCheck, label: "Secure checkout" },
                { icon: MapPin, label: `In store at ${NEW_STOCK_STORE}` },
              ].map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/8 px-3 py-1.5 text-xs text-white/80 ring-1 ring-white/10"
                >
                  <Icon className="size-3.5 text-[oklch(0.82_0.15_141)]" />
                  {label}
                </span>
              ))}
            </div>

            {models > 0 && (
              <dl className="mt-8 grid max-w-md grid-cols-3 divide-x divide-white/10 rounded-2xl bg-white/5 py-4 ring-1 ring-white/10">
                {[
                  { term: "Models", value: String(models) },
                  { term: "Phones", value: String(units) },
                  { term: "From", value: fromPrice === null ? "—" : displayPrice(fromPrice) },
                ].map((s) => (
                  <div key={s.term} className="px-4 text-center">
                    <dd className="font-heading text-2xl font-black tracking-tight sm:text-3xl">
                      {s.value}
                    </dd>
                    <dt className="mt-0.5 text-[11px] tracking-wider text-white/50 uppercase">
                      {s.term}
                    </dt>
                  </div>
                ))}
              </dl>
            )}

            <a
              href="#phones"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-black transition-all hover:gap-3 hover:bg-white/90"
            >
              Browse phones
              <ArrowDown className="size-4" />
            </a>
          </motion.div>

          <div className="relative mx-auto aspect-square w-full max-w-md lg:max-w-none">
            <motion.div
              initial={{ opacity: 0, x: 40, rotate: 4 }}
              animate={{ opacity: 1, x: 0, rotate: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
              className="absolute inset-y-0 right-0 w-[78%]"
            >
              <Image
                src={showcase[0].src}
                alt={showcase[0].alt}
                fill
                priority
                sizes="(min-width: 1024px) 35vw, 80vw"
                className="object-contain drop-shadow-[0_30px_40px_rgba(0,0,0,0.45)]"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -40, rotate: -4 }}
              animate={{ opacity: 1, x: 0, rotate: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
              className="absolute bottom-0 left-0 w-[58%] aspect-square"
            >
              <Image
                src={showcase[1].src}
                alt={showcase[1].alt}
                fill
                sizes="(min-width: 1024px) 25vw, 60vw"
                className="object-contain drop-shadow-[0_30px_40px_rgba(0,0,0,0.5)]"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
