"use client";

import type { ReactNode } from "react";
import { CartProvider } from "@/lib/cart/cart-context";

export function AppProviders({ children }: { children: ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}
