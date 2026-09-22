"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Wrench } from "lucide-react";

type Step = {
  number: string;
  title: string;
  description: string;
  image: string;
};

const STEPS: Step[] = [
  {
    number: "01",
    title: "Diagnose",
    description:
      "Free assessment on arrival. We test the board, battery health and every component before quoting.",
    image: "/tech/diagnose.png",
  },
  {
    number: "02",
    title: "Repair",
    description:
      "Quality parts, micro-soldering where needed, and a technician who has done it a thousand times.",
    image: "/tech/repair.png",
  },
  {
    number: "03",
    title: "Test",
    description:
      "Full function check — touch, cameras, speakers, charging, signal — before it leaves the bench.",
    image: "/tech/test.png",
  },
  {
    number: "04",
    title: "Return",
    description:
      "Cleaned, calibrated and handed back with a 6 month part warranty. Usually the same day.",
    image: "/tech/return.png",
  },
];

const BAR_DURATION = 1.8;

export function RepairProcess() {
  return (
    <section className="relative overflow-hidden bg-[oklch(0.16_0.03_141)]">
      <Image
        aria-hidden
        src="/tech/steps-bg.png"
        alt=""
        fill
        sizes="100vw"
        className="pointer-events-none object-cover select-none"
      />
      <div aria-hidden className="absolute inset-0 bg-black/45" />

      <div className="wrap section-y relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="inline-block text-xs font-semibold tracking-[0.2em] text-primary uppercase">
            02 — Process
          </span>
          <h2 className="mt-3 font-heading text-3xl leading-[1.05] font-black tracking-tight text-white uppercase xs:text-4xl sm:text-5xl">
            Four Steps.
            <br />
            No Guesswork.
          </h2>
        </motion.div>

        <div className="relative mt-14 mb-10 hidden sm:block">
          <div className="h-px w-full bg-white/15" />
          <motion.div
            initial={{ width: "0%" }}
            whileInView={{ width: "100%" }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: BAR_DURATION, ease: "easeInOut" }}
            className="absolute inset-y-0 left-0 h-px bg-white"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.4, delay: BAR_DURATION * 0.15 }}
              className="absolute top-1/2 right-0 flex size-8 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full bg-white shadow-[0_0_20px_4px_oklch(1_0_0/0.35)]"
            >
              <Wrench className="size-4 text-[oklch(0.16_0.03_141)]" strokeWidth={2} />
            </motion.span>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4 sm:gap-x-8">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0.25, y: 14, filter: "blur(2px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.6,
                ease: "easeOut",
                delay: 0.15 + i * (BAR_DURATION / STEPS.length),
              }}
            >
              <span className="font-heading text-4xl font-black tracking-tight text-white/15 sm:text-5xl">
                {step.number}
              </span>
              <h3 className="-mt-1.5 flex items-center gap-1 font-heading text-lg font-bold tracking-tight text-white uppercase xs:text-xl">
                {step.title}
                <span className="text-primary">·</span>
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-white/60 sm:text-sm">
                {step.description}
              </p>

              <div className="relative mt-4 aspect-square w-full max-w-[9rem] overflow-hidden rounded-xl ring-1 ring-white/10">
                <Image
                  src={step.image}
                  alt={step.title}
                  fill
                  sizes="150px"
                  className="object-cover"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
