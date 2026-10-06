"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { NEW_STOCK_STORE, PHONE_SPECS, displayPrice } from "@/lib/phones/catalog";
import type { Phone } from "@/lib/data/phones";
import { PhoneCard, StockNote, colourOptions } from "@/components/new-stock/phone-card";

export function NewStockShowcase({ phones }: { phones: Phone[] }) {
  const inStock = phones.filter((p) => p.stock > 0);
  const [feature, ...rest] = inStock;
  const fromPrice = inStock.length > 0 ? Math.min(...inStock.map((p) => p.price)) : null;
  const units = inStock.reduce((sum, p) => sum + p.stock, 0);

  return (
    <section className="wrap section-y">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-accent uppercase">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-primary" />
            </span>
            03 — Just Landed
          </span>
          <h2 className="mt-3 font-heading text-4xl leading-[0.95] font-black tracking-tight uppercase xs:text-5xl sm:text-6xl">
            New Stock
          </h2>
          <p className="mt-3 max-w-lg text-sm text-muted-foreground sm:text-base">
            Brand-new, boxed Samsung Galaxy and iPhone — in stock now at {NEW_STOCK_STORE}
            {units > 0 && (
              <>
                . <span className="font-semibold text-foreground">{units} phones</span>
              </>
            )}
            {fromPrice !== null && (
              <>
                {" "}
                from <span className="font-semibold text-foreground">{displayPrice(fromPrice)}</span>
              </>
            )}
            .
          </p>
        </div>
        <Link
          href="/new-stock"
          className="group inline-flex h-12 shrink-0 items-center gap-2 self-start rounded-full bg-foreground px-6 text-sm font-semibold text-background transition-all hover:gap-3 sm:self-auto"
        >
          Shop all new stock
          <ArrowRight className="size-4" />
        </Link>
      </motion.div>

      {feature ? (
        <div className="mt-10 grid grid-cols-2 gap-3 xs:gap-4 sm:gap-5 lg:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55 }}
            className="col-span-2"
          >
            <Link
              href={`/new-stock/${feature.slug}`}
              className="group relative flex h-full min-h-80 flex-col justify-between overflow-hidden rounded-3xl bg-[oklch(0.15_0.02_155)] p-6 text-white xs:p-8 sm:min-h-96"
            >
              <div
                aria-hidden
                className="absolute -right-20 -bottom-24 size-96 rounded-full bg-[oklch(0.72_0.17_55)] opacity-30 blur-[100px] transition-opacity duration-500 group-hover:opacity-50"
              />
              <div
                aria-hidden
                className="absolute -top-24 -left-24 size-80 rounded-full bg-[oklch(0.414_0.128_141)] opacity-35 blur-[100px]"
              />
              <div className="relative z-10 max-w-[55%]">
                <p className="text-[11px] font-semibold tracking-[0.2em] text-white/50 uppercase">
                  {feature.brand?.name ?? "Featured"}
                  {PHONE_SPECS[feature.slug] && ` · ${PHONE_SPECS[feature.slug].network}`}
                </p>
                <h3 className="mt-2 font-heading text-2xl leading-tight font-black tracking-tight xs:text-3xl sm:text-4xl">
                  {feature.name.replace(/^(Samsung|Apple) /, "")}
                </h3>
                <p className="mt-3 text-xs text-white/60">
                  {colourOptions(feature)
                    .map((c) => c.colour)
                    .join(" · ")}
                </p>
              </div>
              <div className="relative z-10">
                <p className="text-xs text-white/50">
                  {new Set(feature.variants.map((v) => v.price)).size > 1 ? "From" : "Only"}
                </p>
                <p className="font-heading text-3xl font-black tracking-tight sm:text-4xl">
                  {displayPrice(feature.price)}
                </p>
                <StockNote stock={feature.stock} className="mt-1 text-xs font-semibold text-white/80" />
                <span className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-semibold text-black transition-all group-hover:gap-2.5">
                  View phone
                  <ArrowUpRight className="size-3.5" />
                </span>
              </div>
              <div className="absolute top-1/2 right-0 aspect-square w-[62%] -translate-y-1/2 transition-transform duration-700 ease-out group-hover:scale-105 group-hover:-rotate-2 sm:right-2">
                <Image
                  src={feature.image}
                  alt={feature.name}
                  fill
                  sizes="(min-width: 1024px) 30vw, 60vw"
                  className="object-contain drop-shadow-[0_30px_35px_rgba(0,0,0,0.5)]"
                />
              </div>
            </Link>
          </motion.div>

          {rest.slice(0, 2).map((phone, i) => (
            <motion.div
              key={phone.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
            >
              <PhoneCard phone={phone} />
            </motion.div>
          ))}
        </div>
      ) : (
        <Link
          href="/new-stock"
          className="mt-10 flex items-center justify-between rounded-3xl bg-muted p-8 text-sm font-semibold hover:bg-muted/80"
        >
          See what&apos;s just arrived
          <ArrowRight className="size-4" />
        </Link>
      )}
    </section>
  );
}
