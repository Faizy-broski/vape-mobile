"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useTransition } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ShopBrand } from "@/lib/supabase/types";

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A to Z" },
  { value: "newest", label: "Newest" },
];

export function CategoryFilters({ brands }: { brands: ShopBrand[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [minPrice, setMinPrice] = useState(searchParams.get("min") ?? "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("max") ?? "");
  const [, startTransition] = useTransition();

  function setParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  const inStockOnly = searchParams.get("inStock") === "1";
  const hasFilters =
    searchParams.get("brand") ||
    searchParams.get("sort") ||
    searchParams.get("inStock") ||
    searchParams.get("min") ||
    searchParams.get("max");

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <Select
        value={searchParams.get("sort") ?? "featured"}
        onValueChange={(v) => setParam("sort", v === "featured" ? null : v)}
      >
        <SelectTrigger className="h-10 w-full rounded-full sm:w-52">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {brands.length > 0 && (
        <Select
          value={searchParams.get("brand") ?? "all"}
          onValueChange={(v) => setParam("brand", v === "all" ? null : v)}
        >
          <SelectTrigger className="h-10 w-full rounded-full sm:w-44">
            <SelectValue placeholder="Brand" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All brands</SelectItem>
            {brands.map((b) => (
              <SelectItem key={b.id} value={b.id}>
                {b.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      <div className="flex items-center gap-2">
        <Input
          type="number"
          min="0"
          placeholder="Min £"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          onBlur={() => setParam("min", minPrice || null)}
          className="h-10 w-24 rounded-full"
        />
        <span className="text-muted-foreground">–</span>
        <Input
          type="number"
          min="0"
          placeholder="Max £"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          onBlur={() => setParam("max", maxPrice || null)}
          className="h-10 w-24 rounded-full"
        />
      </div>

      <label className="flex h-10 items-center gap-2 rounded-full border border-input px-4 text-sm">
        <input
          type="checkbox"
          checked={inStockOnly}
          onChange={(e) => setParam("inStock", e.target.checked ? "1" : null)}
          className="size-4 rounded border-input"
        />
        In stock only
      </label>

      {hasFilters && (
        <button
          type="button"
          onClick={() => {
            setMinPrice("");
            setMaxPrice("");
            router.push(pathname);
          }}
          className="inline-flex h-10 items-center gap-1 rounded-full px-3 text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="size-3.5" />
          Clear
        </button>
      )}
    </div>
  );
}
