"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Clock, MapPin, Navigation, Phone } from "lucide-react";
import type { Store } from "@/components/stores/stores-data";

export function StoreCard({ store, delay = 0 }: { store: Store; delay?: number }) {
  const directionsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.address)}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay }}
      className="overflow-hidden rounded-3xl border border-border bg-card"
    >
      <div className="relative aspect-16/9 w-full">
        <Image
          src={store.image}
          alt={store.name}
          fill
          sizes="(min-width: 1024px) 45vw, 100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <h3 className="absolute bottom-4 left-5 font-heading text-2xl font-black tracking-tight text-white uppercase">
          {store.name}
        </h3>
      </div>

      <div className="flex flex-col gap-4 p-5 xs:p-6">
        <div className="flex items-start gap-3">
          <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
          <p className="text-sm text-foreground">{store.address}</p>
        </div>

        <div className="flex items-start gap-3">
          <Phone className="mt-0.5 size-4 shrink-0 text-primary" />
          <a
            href={`tel:${store.phone.replace(/\s/g, "")}`}
            className="text-sm text-foreground transition-colors hover:text-primary"
          >
            {store.phone}
          </a>
        </div>

        <div className="flex items-start gap-3">
          <Clock className="mt-0.5 size-4 shrink-0 text-primary" />
          <dl className="text-sm text-foreground">
            {store.hours.map((h) => (
              <div key={h.days} className="flex justify-between gap-4">
                <dt className="text-muted-foreground">{h.days}</dt>
                <dd className="font-medium">{h.time}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {store.services.map((service) => (
            <span
              key={service}
              className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
            >
              {service}
            </span>
          ))}
        </div>

        <a
          href={directionsHref}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-primary text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Navigation className="size-4" />
          Get Directions
        </a>
      </div>
    </motion.div>
  );
}
