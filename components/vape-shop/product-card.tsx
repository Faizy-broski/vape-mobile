import Image from "next/image";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Product } from "@/components/vape-shop/product-data";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="gap-0 py-0">
      <div className="relative aspect-square overflow-hidden rounded-t-xl bg-[radial-gradient(circle_at_35%_25%,var(--color-secondary)_0%,var(--color-muted)_70%)]">
        {product.badge && (
          <Badge
            className={cn(
              "absolute top-2.5 left-2.5 z-10 border-transparent text-white xs:top-3 xs:left-3",
              product.badge === "Sale" ? "bg-destructive" : "bg-primary",
            )}
          >
            {product.badge}
          </Badge>
        )}
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(min-width: 640px) 25vw, 50vw"
          className="object-contain p-4 xs:p-5"
        />
      </div>

      <CardContent className="flex flex-1 flex-col gap-2.5 px-3 py-3 xs:px-4 xs:py-4">
        <p className="line-clamp-2 min-h-9 text-xs font-semibold text-foreground xs:text-sm">
          {product.name}
        </p>

        <div className="flex items-baseline gap-1.5">
          <span className="text-sm font-bold text-foreground xs:text-base">
            {product.price}
          </span>
          {product.oldPrice && (
            <span className="text-xs text-muted-foreground line-through">
              {product.oldPrice}
            </span>
          )}
        </div>

        <button
          type="button"
          className="mt-auto inline-flex h-9 items-center justify-center gap-1.5 rounded-full bg-primary text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90 xs:h-10 xs:text-sm"
        >
          <Plus className="size-3.5 xs:size-4" />
          Add to Cart
        </button>
      </CardContent>
    </Card>
  );
}
