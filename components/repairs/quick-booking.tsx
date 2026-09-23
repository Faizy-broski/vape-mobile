"use client";

import { useState, type FormEvent } from "react";
import { motion } from "motion/react";
import { ArrowRight, Check, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const DEVICES = ["iPhone", "Samsung", "Google", "Huawei", "iPad", "MacBook", "Laptop", "Other"];

const SERVICES = [
  "Screen replacement",
  "Battery replacement",
  "Charging port repair",
  "Camera repair",
  "Water damage",
  "Something else",
];

const STORES = ["Nearest available", "High Street"];

export function QuickBooking() {
  const [device, setDevice] = useState("iPhone");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <section className="wrap section-y">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-[2rem] bg-[oklch(0.98_0.01_95)] p-6 ring-1 ring-foreground/5 xs:p-8 sm:p-12"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -bottom-16 size-64 rounded-full bg-[radial-gradient(circle,oklch(0.9_0.03_141)_0%,transparent_70%)]"
        />

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <span className="inline-block text-xs font-semibold tracking-[0.2em] text-accent uppercase">
              05 — Quick booking
            </span>
            <h2 className="mt-2 font-heading text-3xl font-black tracking-tight uppercase xs:text-4xl">
              What need to fix?
            </h2>
          </div>
          <p className="max-w-xs text-sm text-muted-foreground sm:pt-1 sm:text-right">
            Tell us a little about your device and we&apos;ll take it from
            there.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="relative mt-10 grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div>
            <p className="text-xs font-semibold tracking-[0.15em] text-muted-foreground uppercase">
              Choose your device
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {DEVICES.map((item) => {
                const active = device === item;
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setDevice(item)}
                    className={cn(
                      "flex h-12 items-center justify-between rounded-full border px-5 text-sm font-medium transition-colors",
                      active
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-white text-foreground hover:border-primary/40",
                    )}
                  >
                    {item}
                    {active ? (
                      <Check className="size-4" />
                    ) : (
                      <Plus className="size-4 text-muted-foreground" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold tracking-[0.15em] text-muted-foreground uppercase">
              What needs doing?
            </p>

            <div className="mt-4 flex flex-col gap-3">
              <Select defaultValue={SERVICES[0]}>
                <SelectTrigger className="h-12 w-full rounded-full border-border bg-white px-5">
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent>
                  {SERVICES.map((service) => (
                    <SelectItem key={service} value={service}>
                      {service}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="grid grid-cols-1 gap-3 xs:grid-cols-2">
                <Input
                  name="name"
                  placeholder="Your name"
                  required
                  className="h-12 rounded-full border-border bg-white px-5"
                />
                <Input
                  name="phone"
                  type="tel"
                  placeholder="Phone number"
                  required
                  className="h-12 rounded-full border-border bg-white px-5"
                />
              </div>

              <div className="grid grid-cols-1 gap-3 xs:grid-cols-2">
                <Input
                  name="email"
                  type="email"
                  placeholder="Email address"
                  required
                  className="h-12 rounded-full border-border bg-white px-5"
                />
                <Select defaultValue={STORES[0]}>
                  <SelectTrigger className="h-12 w-full rounded-full border-border bg-white px-5">
                    <SelectValue placeholder="Preferred store" />
                  </SelectTrigger>
                  <SelectContent>
                    {STORES.map((store) => (
                      <SelectItem key={store} value={store}>
                        {store}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Textarea
                name="notes"
                placeholder="Tell us a little more (optional)"
                className="min-h-24 rounded-2xl border-border bg-white px-5 py-4"
              />

              <button
                type="submit"
                className="mt-1 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary text-sm font-semibold tracking-wide text-primary-foreground uppercase transition-colors hover:bg-primary/90"
              >
                {submitted ? "Request Sent" : "Request Repair"}
                <ArrowRight className="size-4" />
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </section>
  );
}
