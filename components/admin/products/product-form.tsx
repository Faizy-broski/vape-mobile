"use client";

import { useActionState } from "react";
import Image from "next/image";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ProductWithRelations } from "@/lib/data/products";
import type { ProductSection, ShopCategory } from "@/lib/supabase/types";
import type { ProductFormState } from "@/app/admin/(dashboard)/products/product-form-state";
import { ImageUpload } from "@/components/admin/products/image-upload";

const NONE = "none";

export function ProductForm({
  action,
  product,
  sections,
  categories,
}: {
  action: (state: ProductFormState, formData: FormData) => Promise<ProductFormState>;
  product?: ProductWithRelations;
  sections: ProductSection[];
  categories: ShopCategory[];
}) {
  const [state, formAction, pending] = useActionState(action, { error: "" });
  const [image, setImage] = useState(product?.image ?? "");
  const [badge, setBadge] = useState(product?.badge ?? NONE);
  const [sectionId, setSectionId] = useState(product?.section_id ?? NONE);
  const [categoryId, setCategoryId] = useState(product?.category_id ?? NONE);

  return (
    <form action={formAction} className="flex flex-col gap-6 lg:flex-row">
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" defaultValue={product?.name} required />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="price">Price (£)</Label>
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="0"
              defaultValue={product?.price}
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="oldPrice">Old price (optional)</Label>
            <Input
              id="oldPrice"
              name="oldPrice"
              type="number"
              step="0.01"
              min="0"
              defaultValue={product?.old_price ?? undefined}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="stock">Stock</Label>
            <Input
              id="stock"
              name="stock"
              type="number"
              min="0"
              defaultValue={product?.stock ?? 0}
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Badge</Label>
            <Select value={badge ?? NONE} onValueChange={(v) => setBadge((v as typeof badge) ?? NONE)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NONE}>None</SelectItem>
                <SelectItem value="Sale">Sale</SelectItem>
                <SelectItem value="New">New</SelectItem>
              </SelectContent>
            </Select>
            <input type="hidden" name="badge" value={badge === NONE ? "" : badge} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label>Homepage section</Label>
            <Select value={sectionId ?? NONE} onValueChange={(v) => setSectionId(v ?? NONE)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="None" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NONE}>None</SelectItem>
                {sections.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input type="hidden" name="sectionId" value={sectionId === NONE ? "" : sectionId} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Category</Label>
            <Select value={categoryId ?? NONE} onValueChange={(v) => setCategoryId(v ?? NONE)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="None" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NONE}>None</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input
              type="hidden"
              name="categoryId"
              value={categoryId === NONE ? "" : categoryId}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="image">Image path or URL</Label>
          <div className="flex flex-col gap-2 xs:flex-row xs:items-start">
            <Input
              id="image"
              name="image"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="/vape/vapes/1.png"
              required
              className="flex-1"
            />
            <ImageUpload onUploaded={setImage} />
          </div>
        </div>

        <label className="flex w-fit items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="isActive"
            defaultChecked={product?.is_active ?? true}
            className="size-4 rounded border-input"
          />
          Active (visible on the storefront)
        </label>

        {state.error && (
          <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {state.error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="mt-2 inline-flex h-11 w-fit items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-60"
        >
          {pending ? "Saving…" : product ? "Save Changes" : "Create Product"}
        </button>
      </div>

      <div className="w-full shrink-0 lg:w-48">
        <p className="mb-1.5 text-sm font-medium text-muted-foreground">Preview</p>
        <div className="relative aspect-square overflow-hidden rounded-2xl border border-border bg-muted">
          {image && (
            <Image src={image} alt="" fill sizes="192px" className="object-contain p-4" />
          )}
        </div>
      </div>
    </form>
  );
}
