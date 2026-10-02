"use client";

import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ProductVariant } from "@/lib/supabase/types";

export type VariantRow = {
  key: string;
  id: string | null;
  name: string;
  price: string;
  oldPrice: string;
  stock: string;
  isActive: boolean;
};

export function toVariantRows(variants: ProductVariant[] = []): VariantRow[] {
  return variants.map((v) => ({
    key: v.id,
    id: v.id,
    name: v.name,
    price: String(v.price),
    oldPrice: v.old_price === null ? "" : String(v.old_price),
    stock: String(v.stock),
    isActive: v.is_active,
  }));
}

/**
 * Flavour / strength / colour options. Serialized into a hidden `variants`
 * field for the server action; with no rows the product is sold as a single
 * item using the price and stock fields above.
 */
export function VariantsEditor({
  rows,
  onChange,
}: {
  rows: VariantRow[];
  onChange: (rows: VariantRow[]) => void;
}) {
  function update(key: string, patch: Partial<VariantRow>) {
    onChange(rows.map((r) => (r.key === key ? { ...r, ...patch } : r)));
  }

  function addRow() {
    const last = rows.at(-1);
    onChange([
      ...rows,
      {
        key: crypto.randomUUID(),
        id: null,
        name: "",
        price: last?.price ?? "",
        oldPrice: last?.oldPrice ?? "",
        stock: last?.stock ?? "0",
        isActive: true,
      },
    ]);
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <Label>Options (flavours, strengths…)</Label>
        <span className="text-xs text-muted-foreground">
          {rows.length > 0 ? `${rows.length} option${rows.length === 1 ? "" : "s"}` : "None"}
        </span>
      </div>
      {rows.length > 0 && (
        <p className="text-xs text-muted-foreground">
          The product&apos;s price and stock are taken from its options — the cheapest active
          option sets the &quot;From&quot; price.
        </p>
      )}

      {rows.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[34rem] text-sm">
            <thead className="bg-muted/50 text-xs text-muted-foreground">
              <tr>
                <th className="px-2 py-2 text-left font-medium">Name</th>
                <th className="w-24 px-2 py-2 text-left font-medium">Price (£)</th>
                <th className="w-24 px-2 py-2 text-left font-medium">Old price</th>
                <th className="w-20 px-2 py-2 text-left font-medium">Stock</th>
                <th className="w-14 px-2 py-2 text-center font-medium">Active</th>
                <th className="w-10" />
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.key} className="border-t border-border">
                  <td className="px-2 py-1.5">
                    <Input
                      value={row.name}
                      onChange={(e) => update(row.key, { name: e.target.value })}
                      placeholder="e.g. Blue Razz"
                      aria-label="Option name"
                      required
                    />
                  </td>
                  <td className="px-2 py-1.5">
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={row.price}
                      onChange={(e) => update(row.key, { price: e.target.value })}
                      aria-label="Option price"
                      required
                    />
                  </td>
                  <td className="px-2 py-1.5">
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={row.oldPrice}
                      onChange={(e) => update(row.key, { oldPrice: e.target.value })}
                      aria-label="Option old price"
                    />
                  </td>
                  <td className="px-2 py-1.5">
                    <Input
                      type="number"
                      min="0"
                      value={row.stock}
                      onChange={(e) => update(row.key, { stock: e.target.value })}
                      aria-label="Option stock"
                    />
                  </td>
                  <td className="px-2 py-1.5 text-center">
                    <input
                      type="checkbox"
                      checked={row.isActive}
                      onChange={(e) => update(row.key, { isActive: e.target.checked })}
                      className="size-4 rounded border-input"
                      aria-label="Option active"
                    />
                  </td>
                  <td className="px-2 py-1.5">
                    <button
                      type="button"
                      onClick={() => onChange(rows.filter((r) => r.key !== row.key))}
                      className="flex size-8 items-center justify-center text-muted-foreground transition-colors hover:text-destructive"
                      aria-label={`Remove ${row.name || "option"}`}
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <button
        type="button"
        onClick={addRow}
        className="inline-flex h-9 w-fit items-center gap-1.5 rounded-full border border-input px-4 text-sm font-medium transition-colors hover:bg-muted"
      >
        <Plus className="size-4" />
        Add option
      </button>

      <input
        type="hidden"
        name="variants"
        value={JSON.stringify(
          rows.map(({ id, name, price, oldPrice, stock, isActive }) => ({
            id,
            name,
            price,
            oldPrice,
            stock,
            isActive,
          })),
        )}
      />
    </div>
  );
}
