"use client";

import { useTransition } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { updateOrderStatusAction } from "@/app/admin/(dashboard)/orders/actions";
import type { OrderStatus } from "@/lib/data/orders";
import {
  ORDER_STATUS_CONFIG,
  ORDER_STATUS_OPTIONS,
} from "@/components/admin/orders/order-status-config";

export function OrderStatusSelect({ id, status }: { id: string; status: OrderStatus }) {
  const [pending, startTransition] = useTransition();

  return (
    <Select
      value={status}
      onValueChange={(value) => {
        if (!value) return;
        startTransition(() => {
          updateOrderStatusAction(id, value as OrderStatus);
        });
      }}
    >
      <SelectTrigger
        className={cn(
          "h-7 w-fit rounded-full border-transparent px-3 text-xs font-semibold",
          ORDER_STATUS_CONFIG[status].className,
          pending && "opacity-50",
        )}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {ORDER_STATUS_OPTIONS.map((option) => (
          <SelectItem key={option} value={option}>
            {ORDER_STATUS_CONFIG[option].label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
