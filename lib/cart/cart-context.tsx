"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type CartItem = {
  /** Cart line key: `productId` or `productId:variantId`. */
  id: string;
  productId: string;
  variantId: string | null;
  name: string;
  variantName: string | null;
  price: string;
  image?: string;
  quantity: number;
};

export type NewCartItem = Omit<CartItem, "id" | "quantity">;

type CartContextValue = {
  items: CartItem[];
  addItem: (item: NewCartItem, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  /** Applies checkout's price corrections; a null price removes the line. */
  applyPriceUpdates: (updates: { id: string; price: string | null }[]) => void;
  itemCount: number;
  subtotal: number;
};

const CartContext = createContext<CartContextValue | null>(null);

// Bumped from "vm-cart" when cart lines gained productId/variantId — old
// carts can't be priced at checkout, so they're dropped rather than migrated.
const STORAGE_KEY = "vm-cart-v2";

export function cartLineId(productId: string, variantId: string | null) {
  return variantId ? `${productId}:${variantId}` : productId;
}

export function parsePrice(price: string) {
  const value = Number.parseFloat(price.replace(/[^0-9.]/g, ""));
  return Number.isFinite(value) ? value : 0;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Hydrating from localStorage must happen post-mount (window isn't
    // available during SSR), so this one-time sync-on-mount is intentional.
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (stored) setItems(JSON.parse(stored));
    } catch {
      // ignore malformed/unavailable storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore unavailable storage (private browsing, etc.)
    }
  }, [items, hydrated]);

  function addItem(item: NewCartItem, quantity = 1) {
    const id = cartLineId(item.productId, item.variantId);
    setItems((prev) => {
      const existing = prev.find((i) => i.id === id);
      if (existing) {
        return prev.map((i) => (i.id === id ? { ...i, quantity: i.quantity + quantity } : i));
      }
      return [...prev, { ...item, id, quantity }];
    });
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function updateQuantity(id: string, quantity: number) {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity } : i)));
  }

  function clearCart() {
    setItems([]);
  }

  function applyPriceUpdates(updates: { id: string; price: string | null }[]) {
    const byId = new Map(updates.map((u) => [u.id, u.price]));
    setItems((prev) =>
      prev.flatMap((i) => {
        if (!byId.has(i.id)) return [i];
        const price = byId.get(i.id);
        return price ? [{ ...i, price }] : [];
      }),
    );
  }

  const itemCount = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items],
  );
  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + parsePrice(i.price) * i.quantity, 0),
    [items],
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        applyPriceUpdates,
        itemCount,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
