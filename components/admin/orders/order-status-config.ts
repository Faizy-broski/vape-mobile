import type { OrderStatus } from "@/lib/data/orders";

export const ORDER_STATUS_CONFIG: Record<OrderStatus, { label: string; className: string }> = {
  new: {
    label: "New",
    className: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  processing: {
    label: "Processing",
    className: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  ready: {
    label: "Ready",
    className: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  },
  completed: {
    label: "Completed",
    className: "bg-primary/10 text-primary",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-muted text-muted-foreground",
  },
};

export const ORDER_STATUS_OPTIONS: OrderStatus[] = [
  "new",
  "processing",
  "ready",
  "completed",
  "cancelled",
];
