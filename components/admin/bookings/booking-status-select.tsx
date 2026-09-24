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
import { updateStatusAction } from "@/app/admin/(dashboard)/bookings/actions";
import type { BookingStatus } from "@/lib/supabase/types";
import { STATUS_CONFIG, STATUS_OPTIONS } from "@/components/admin/bookings/status-config";

export function BookingStatusSelect({
  id,
  status,
}: {
  id: string;
  status: BookingStatus;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <Select
      value={status}
      onValueChange={(value) => {
        if (!value) return;
        startTransition(() => {
          updateStatusAction(id, value as BookingStatus);
        });
      }}
    >
      <SelectTrigger
        className={cn(
          "h-7 w-fit rounded-full border-transparent px-3 text-xs font-semibold",
          STATUS_CONFIG[status].className,
          pending && "opacity-50",
        )}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {STATUS_OPTIONS.map((option) => (
          <SelectItem key={option} value={option}>
            {STATUS_CONFIG[option].label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
