"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const PRICING = [
  {
    number: "01",
    title: "Battery",
    description: "Same-day swaps",
    price: "From £35",
  },
  {
    number: "02",
    title: "Charging Port",
    description: "Clean or replace",
    price: "From £30",
  },
  {
    number: "03",
    title: "Camera",
    description: "Front & rear modules",
    price: "From £40",
  },
  {
    number: "04",
    title: "Back Glass",
    description: "Laser-clean removal",
    price: "From £45",
  },
  {
    number: "05",
    title: "Water Damage",
    description: "Ultrasonic recovery",
    price: "From £50",
  },
  {
    number: "06",
    title: "Software",
    description: "Unlocks & data",
    price: "From £20",
  },
];

export function WhyVandM() {
  return (
    <section className="wrap section-y">
      <span className="inline-block text-xs font-semibold tracking-[0.2em] text-accent uppercase">
        03 — Why V&amp;M
      </span>

      <div className="mt-6 grid grid-cols-1 gap-10 sm:mt-8 lg:grid-cols-2 lg:gap-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          <div className="relative aspect-4/3 overflow-hidden rounded-3xl">
            <Image
              src="/tech/tech-repair-hero.png"
              alt="Screen repair in progress"
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
          </div>

          <div className="mt-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-start sm:gap-8">
            <h2 className="font-heading text-4xl leading-[0.95] font-black tracking-tight uppercase xs:text-5xl">
              Screen
              <br />
              Repair
            </h2>

            <div className="flex max-w-xs flex-col gap-3 sm:pt-1">
              <p className="text-sm text-muted-foreground">
                Genuine-grade OLED and LCD replacements fitted, sealed and
                tested in under an hour on most models.
              </p>
              <Link
                href="/repairs/book"
                className="inline-flex shrink-0 items-center gap-1 text-sm font-bold text-primary uppercase tracking-wide transition-opacity hover:opacity-80"
              >
                From £45
                <ArrowUpRight className="size-4" />
              </Link>
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col">
          {PRICING.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
            >
              <div className="flex items-start justify-between gap-4 py-5 xs:py-6">
                <div className="flex items-start gap-3 xs:gap-4">
                  <span className="mt-1 text-xs font-semibold text-muted-foreground">
                    {item.number}
                  </span>
                  <div>
                    <h3 className="font-heading text-xl font-bold tracking-tight uppercase xs:text-2xl">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
                <span className="shrink-0 pt-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  {item.price}
                </span>
              </div>
              {i < PRICING.length - 1 && <Separator />}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
