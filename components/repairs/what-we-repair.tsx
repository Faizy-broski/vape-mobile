"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";

type RepairCategory = {
  name: string;
  description: string;
  image: string;
};

const CATEGORIES: RepairCategory[] = [
  {
    name: "Phone",
    description: "iPhone, Samsung, Google Pixel repairs across London",
    image: "/tech/repairs/phone.png",
  },
  {
    name: "Tablet",
    description: "iPad, Surface Pro, and all tablet brands",
    image: "/tech/repairs/tablet.png",
  },
  {
    name: "Laptop",
    description: "MacBook, Windows laptops, screen and motherboard repairs",
    image: "/tech/repairs/laptop.png",
  },
  {
    name: "PC Desktop",
    description: "Custom builds, gaming PCs, hardware upgrades",
    image: "/tech/repairs/pc.png",
  },
  {
    name: "Data Recovery",
    description: "Professional recovery from failed drives and devices",
    image: "/tech/repairs/data-recovery.png",
  },
  {
    name: "Drone",
    description: "DJI specialists for motors, gimbal, camera repairs",
    image: "/tech/repairs/drone.png",
  },
  {
    name: "Game Console",
    description: "PlayStation, Xbox, Nintendo Switch repairs",
    image: "/tech/repairs/gaming-console.png",
  },
  {
    name: "Other Devices",
    description: "Ask us about your specific device repair needs",
    image: "/tech/repairs/other-device.png",
  },
];

export function WhatWeRepair() {
  return (
    <section className="relative overflow-hidden">
      <Image
        aria-hidden
        src="/tech/repair-bg.png"
        alt=""
        fill
        sizes="100vw"
        className="pointer-events-none object-cover object-top opacity-70 w-100 select-none"
      />

      <div className="wrap section-y relative z-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="inline-block text-xs font-semibold tracking-[0.2em] text-accent uppercase">
              01 — Services
            </span>
            <h2 className="mt-2 font-heading text-3xl font-black tracking-tight uppercase xs:text-4xl sm:text-5xl">
              What We Repair
            </h2>
          </div>
          <p className="max-w-xs text-sm text-muted-foreground sm:text-right">
            Twelve core services across phones, tablets, Macs and laptops.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 xs:gap-4 sm:mt-10 sm:grid-cols-4 sm:gap-5">
          {CATEGORIES.map((category, i) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: (i % 4) * 0.05 }}
            >
              <Card className="h-full bg-card/90 backdrop-blur-sm transition-shadow hover:shadow-md">
                <CardContent className="flex h-full flex-col items-center gap-3 py-2 text-center">
                  <span className="relative size-16 shrink-0 xs:size-20">
                    <Image
                      src={category.image}
                      alt=""
                      fill
                      sizes="80px"
                      className="object-contain"
                    />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground xs:text-base">
                      {category.name}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {category.description}
                    </p>
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
