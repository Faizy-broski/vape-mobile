"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Quote, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type Testimonial = {
  quote: string;
  name: string;
  location: string;
  initials: string;
  avatarClassName: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Brought in my MacBook with a liquid spill — every other shop quoted a board replacement. V&M diagnosed and microsoldered the issue. Saved me £1,200.",
    name: "Sarah M.",
    location: "Wimbledon",
    initials: "SM",
    avatarClassName: "bg-[oklch(0.5_0.16_20)]",
  },
  {
    quote:
      "Same-day iPhone screen and battery replacement. Genuine professionalism and an honest, upfront quote. The warranty made all the difference.",
    name: "James O.",
    location: "Victoria",
    initials: "JO",
    avatarClassName: "bg-[oklch(0.5_0.1_155)]",
  },
  {
    quote:
      "Recovered data from a hard drive I thought dead forever. The team kept me informed throughout and delivered exactly as promised.",
    name: "Priya K.",
    location: "Clapham",
    initials: "PK",
    avatarClassName: "bg-[oklch(0.5_0.13_280)]",
  },
];

function StarRow({ count = 5 }: { count?: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-hidden>
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="size-3.5 fill-amber-500 text-amber-500" />
      ))}
    </div>
  );
}

type TestimonialsProps = {
  sectionNumber?: string;
  backgroundImage?: string;
};

export function Testimonials({
  sectionNumber = "04 — Testimonials",
  backgroundImage = "/vape/tesimonial-bg.png",
}: TestimonialsProps) {
  return (
    <section className="relative overflow-hidden">
      <Image
        aria-hidden
        src={backgroundImage}
        alt=""
        width={950}
        height={1350}
        className="pointer-events-none absolute -top-16 right-0 hidden w-80 opacity-70 mix-blend-multiply select-none sm:block lg:w-104"
      />
      <Image
        aria-hidden
        src={backgroundImage}
        alt=""
        width={950}
        height={1350}
        className="pointer-events-none absolute -right-10 -bottom-24 hidden w-48 rotate-180 opacity-50 mix-blend-multiply select-none sm:block"
      />

      <div className="wrap section-y relative">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="inline-block text-xs font-semibold tracking-[0.2em] text-amber-500 uppercase">
              {sectionNumber}
            </span>
            <h2 className="mt-2 max-w-lg font-heading text-3xl leading-[1.05] font-black tracking-tight uppercase xs:text-4xl sm:text-5xl">
              What people say at the counter.
            </h2>
          </div>

          <div className="flex flex-col items-start gap-1.5 sm:items-end">
            <StarRow />
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              5.0 Average · Google Reviews
            </p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-10 sm:grid-cols-3 sm:gap-5">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
            >
              <Card className="h-full">
                <CardContent className="flex h-full flex-col gap-4">
                  <Quote
                    aria-hidden
                    className="size-6 fill-muted text-muted"
                    strokeWidth={1}
                  />
                  <StarRow />
                  <p className="flex-1 text-sm leading-relaxed text-foreground">
                    {t.quote}
                  </p>

                  <Separator />

                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white",
                        t.avatarClassName,
                      )}
                    >
                      {t.initials}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.location}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
