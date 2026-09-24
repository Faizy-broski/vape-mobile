"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  icon,
  accentClassName,
  delay = 0,
}: {
  label: string;
  value: number;
  icon: ReactNode;
  accentClassName?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      className="rounded-2xl border border-border bg-card p-5"
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          {label}
        </p>
        <span
          className={cn(
            "flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary [&_svg]:size-4",
            accentClassName,
          )}
        >
          {icon}
        </span>
      </div>
      <p className="mt-3 font-heading text-3xl font-black tracking-tight">{value}</p>
    </motion.div>
  );
}
