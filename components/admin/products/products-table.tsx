import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { ProductWithRelations } from "@/lib/data/products";
import { DeleteProductButton } from "@/components/admin/products/delete-product-button";

export function ProductsTable({ products }: { products: ProductWithRelations[] }) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
        <p className="text-sm font-medium text-foreground">No products found</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Try adjusting your filters, or add your first product.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-border">
      <table className="w-full min-w-220 text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50 text-left text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            <th className="px-4 py-3">Product</th>
            <th className="px-4 py-3">Price</th>
            <th className="px-4 py-3">Section</th>
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3">Stock</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-b border-border last:border-0 hover:bg-muted/30">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-muted">
                    <Image
                      src={product.image}
                      alt=""
                      fill
                      sizes="40px"
                      className="object-contain p-1"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{product.name}</p>
                    {product.badge && (
                      <Badge
                        className={
                          product.badge === "Sale"
                            ? "border-transparent bg-destructive text-white"
                            : "border-transparent bg-primary text-white"
                        }
                      >
                        {product.badge}
                      </Badge>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                £{product.price.toFixed(2)}
                {product.old_price && (
                  <span className="ml-1.5 text-xs text-muted-foreground line-through">
                    £{product.old_price.toFixed(2)}
                  </span>
                )}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">{product.section?.title ?? "—"}</td>
              <td className="px-4 py-3 whitespace-nowrap">{product.category?.name ?? "—"}</td>
              <td className="px-4 py-3">{product.stock}</td>
              <td className="px-4 py-3">
                <span
                  className={
                    product.is_active
                      ? "rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary"
                      : "rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground"
                  }
                >
                  {product.is_active ? "Active" : "Hidden"}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-1">
                  {product.is_active && (
                    <Link
                      href={`/vape-shop/product/${product.slug}`}
                      target="_blank"
                      aria-label={`View ${product.name} on the storefront`}
                      className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      <ExternalLink className="size-4" />
                    </Link>
                  )}
                  <Link
                    href={`/admin/products/${product.id}/edit`}
                    aria-label={`Edit ${product.name}`}
                    className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <Pencil className="size-4" />
                  </Link>
                  <DeleteProductButton id={product.id} name={product.name} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
