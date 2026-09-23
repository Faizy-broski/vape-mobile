"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SMALL_CARDS = [
  { title: "Adapters", description: "USB-C hubs, headphone" },
  { title: "Accessories", description: "Screen protectors, holders" },
];

const IMAGE_CARDS = [
  {
    title: "Cables",
    description: "Braided USB-C, Lightning",
    image: "/tech/cables.png",
  },
  {
    title: "Cases",
    description: "Clear, rugged, leather",
    image: "/tech/cases.png",
  },
];

export function ShopAccessories() {
  return (
    <section className="wrap section-y">
      <span className="inline-block text-xs font-semibold tracking-[0.2em] text-accent uppercase">
        04 — Shop From Us
      </span>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:mt-8 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="flex flex-col justify-between gap-5"
        >
          <div className="relative flex min-h-90 flex-1 flex-col justify-end overflow-hidden rounded-3xl bg-[oklch(0.93_0.02_60)] xs:min-h-105">
            <Image
              src="/tech/usb-c-charge.png"
              alt="Fast charge kit"
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
            <div className="relative z-10 flex flex-col gap-3 bg-gradient-to-t from-[oklch(0.96_0.01_60)] via-[oklch(0.96_0.01_60/0.9)] to-transparent px-6 pt-16 pb-6 xs:flex-row xs:items-end xs:justify-between">
              <div>
                <h3 className="font-heading text-xl font-black tracking-tight uppercase xs:text-2xl">
                  Fast Charge Kit
                </h3>
                <p className="mt-1 max-w-xs text-sm text-muted-foreground">
                  30W plug and a braided cable that outlives the phone.
                </p>
              </div>
              <span className="shrink-0 text-xl font-black text-primary">£24</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            {SMALL_CARDS.map((card) => (
              <div
                key={card.title}
                className="rounded-2xl bg-card p-5 ring-1 ring-foreground/10"
              >
                <h4 className="font-heading text-base font-bold tracking-tight uppercase xs:text-lg">
                  {card.title}
                </h4>
                <p className="mt-1 text-xs text-muted-foreground xs:text-sm">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col justify-between gap-5"
        >
          <div className="flex flex-col justify-center rounded-3xl bg-card p-6 ring-1 ring-foreground/10 xs:p-8">
            <h2 className="font-heading text-2xl leading-[1.05] font-black tracking-tight uppercase xs:text-3xl sm:text-4xl">
              Chargers, Cables &amp; Everyday Kit.
            </h2>
            <p className="mt-3 max-w-sm text-sm text-muted-foreground">
              Stocked at the counter and priced fairly — the accessories
              we&apos;d actually put on our own devices.
            </p>
            <Link
              href="/accessories"
              className={cn(
                buttonVariants({ variant: "default" }),
                "mt-5 h-auto gap-2 rounded-full px-6 py-3 text-sm",
              )}
            >
              Shop Accessories
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-5">
            {IMAGE_CARDS.map((card) => (
              <div
                key={card.title}
                className="overflow-hidden rounded-2xl bg-card ring-1 ring-foreground/10"
              >
                <div className="relative aspect-square">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    sizes="(min-width: 1024px) 22vw, 45vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h4 className="font-heading text-sm font-bold tracking-tight uppercase xs:text-base">
                    {card.title}
                  </h4>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {card.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
