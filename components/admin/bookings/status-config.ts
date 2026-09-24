import type { BookingStatus } from "@/lib/supabase/types";

export const STATUS_CONFIG: Record<
  BookingStatus,
  { label: string; className: string }
> = {
  new: {
    label: "New",
    className: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  in_progress: {
    label: "In Progress",
    className: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
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

export const STATUS_OPTIONS: BookingStatus[] = [
  "new",
  "in_progress",
  "completed",
  "cancelled",
];
