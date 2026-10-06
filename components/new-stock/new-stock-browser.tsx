"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { PHONE_SPECS } from "@/lib/phones/catalog";
import type { Phone } from "@/lib/data/phones";
import { PhoneCard } from "@/components/new-stock/phone-card";

type Sort = "featured" | "price-asc" | "price-desc";

const SORTS: { value: Sort; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

function Segmented<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex rounded-full bg-muted p-1">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            "relative rounded-full px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors xs:px-4 xs:text-sm",
            value === o.value ? "text-background" : "text-muted-foreground hover:text-foreground",
          )}
        >
          {value === o.value && (
            <motion.span
              layoutId={`seg-${label}`}
              className="absolute inset-0 rounded-full bg-foreground"
              transition={{ type: "spring", bounce: 0.2, duration: 0.45 }}
            />
          )}
          <span className="relative">{o.label}</span>
        </button>
      ))}
    </div>
  );
}

export function NewStockBrowser({ phones }: { phones: Phone[] }) {
  const brands = useMemo(
    () => [...new Set(phones.flatMap((p) => (p.brand ? [p.brand.name] : [])))].sort(),
    [phones],
  );
  const [brand, setBrand] = useState("all");
  const [network, setNetwork] = useState("any");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>("featured");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = phones.filter((p) => {
      if (brand !== "all" && p.brand?.name !== brand) return false;
      if (network !== "any" && PHONE_SPECS[p.slug]?.network !== network) return false;
      if (q && !`${p.name} ${p.variants.map((v) => v.name).join(" ")}`.toLowerCase().includes(q)) {
        return false;
      }
      return true;
    });
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    return list;
  }, [phones, brand, network, query, sort]);

  const filtered = brand !== "all" || network !== "any" || query !== "";

  return (
    <section id="phones" className="wrap section-y scroll-mt-20">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="text-xs font-semibold tracking-[0.2em] text-accent uppercase">
            Shop Phones
          </span>
          <h2 className="mt-2 font-heading text-3xl font-black tracking-tight uppercase xs:text-4xl sm:text-5xl">
            In Stock Now
          </h2>
        </div>
        <p className="text-sm text-muted-foreground" aria-live="polite">
          Showing {visible.length} of {phones.length} {phones.length === 1 ? "model" : "models"}
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-border/70 bg-card p-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <Segmented
            label="Brand"
            value={brand}
            onChange={setBrand}
            options={[{ value: "all", label: "All" }, ...brands.map((b) => ({ value: b, label: b }))]}
          />
          <Segmented
            label="Network"
            value={network}
            onChange={setNetwork}
            options={[
              { value: "any", label: "Any" },
              { value: "5G", label: "5G" },
              { value: "4G", label: "4G" },
            ]}
          />
        </div>

        <div className="flex flex-col gap-2 xs:flex-row">
          <label className="relative flex-1">
            <span className="sr-only">Search phones</span>
            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search model, colour, storage…"
              className="h-10 w-full rounded-full border border-input bg-background pr-4 pl-10 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 lg:w-64"
            />
          </label>
          <label className="relative">
            <span className="sr-only">Sort by</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="h-10 w-full cursor-pointer appearance-none rounded-full border border-input bg-background pr-9 pl-4 text-sm font-medium outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
            <svg
              aria-hidden
              viewBox="0 0 16 16"
              className="pointer-events-none absolute top-1/2 right-3.5 size-3.5 -translate-y-1/2 text-muted-foreground"
            >
              <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </label>
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="mt-10 flex flex-col items-center justify-center rounded-3xl border border-dashed border-border py-16 text-center">
          <p className="text-sm font-medium text-foreground">No phones match your filters</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try a different search, or ask us in store — new stock lands every week.
          </p>
          {filtered && (
            <button
              type="button"
              onClick={() => {
                setBrand("all");
                setNetwork("any");
                setQuery("");
              }}
              className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background"
            >
              <X className="size-3.5" />
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <motion.div
          layout
          className="mt-8 grid grid-cols-2 gap-3 xs:gap-4 sm:grid-cols-3 sm:gap-5 xl:grid-cols-4"
        >
          <AnimatePresence mode="popLayout">
            {visible.map((phone, i) => (
              <motion.div
                key={phone.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35, delay: Math.min(i, 8) * 0.03 }}
              >
                <PhoneCard phone={phone} priority={i < 4} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </section>
  );
}
