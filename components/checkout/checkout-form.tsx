"use client";

import { useEffect } from "react";
import { useActionState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { CircleCheck, ShoppingBag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { parsePrice, useCart } from "@/lib/cart/cart-context";
import { submitOrder } from "@/app/checkout/actions";
import { initialCheckoutState } from "@/app/checkout/checkout-state";

export function CheckoutForm() {
  const { items, subtotal, clearCart, applyPriceUpdates } = useCart();
  const [state, formAction, pending] = useActionState(submitOrder, initialCheckoutState);

  useEffect(() => {
    if (state.status === "success") clearCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.status]);

  useEffect(() => {
    if (state.cartUpdates?.length) applyPriceUpdates(state.cartUpdates);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.cartUpdates]);

  if (state.status === "success") {
    return (
      <div className="flex flex-col items-center py-16 text-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          <CircleCheck className="size-9" strokeWidth={1.5} />
        </span>
        <h1 className="mt-5 font-heading text-2xl font-black tracking-tight uppercase">
          Order Received
        </h1>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">{state.message}</p>
        <Link
          href="/vape-shop"
          className="mt-6 text-sm font-semibold text-primary underline-offset-4 hover:underline"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center py-16 text-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <ShoppingBag className="size-7" />
        </span>
        <h1 className="mt-5 font-heading text-2xl font-black tracking-tight uppercase">
          Your Cart Is Empty
        </h1>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Add something from the shop before checking out.
        </p>
        <Link
          href="/vape-shop"
          className="mt-6 inline-flex h-11 items-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Browse Vape Shop
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_22rem]">
      <input
        type="hidden"
        name="items"
        value={JSON.stringify(
          items.map(({ id, productId, variantId, price, quantity }) => ({
            id,
            productId,
            variantId,
            price,
            quantity,
          })),
        )}
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-4"
      >
        <div className="grid grid-cols-1 gap-4 xs:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="text-sm font-medium">
              Full name
            </label>
            <Input id="name" name="name" required className="h-11 rounded-xl" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="phone" className="text-sm font-medium">
              Phone number
            </label>
            <Input id="phone" name="phone" type="tel" required className="h-11 rounded-xl" />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium">
            Email address
          </label>
          <Input id="email" name="email" type="email" required className="h-11 rounded-xl" />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="address" className="text-sm font-medium">
            Delivery or pickup address
          </label>
          <Textarea id="address" name="address" required className="min-h-20 rounded-xl" />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="notes" className="text-sm font-medium">
            Notes (optional)
          </label>
          <Textarea id="notes" name="notes" className="min-h-16 rounded-xl" />
        </div>

        {state.status === "error" && (
          <p className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {state.message}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="mt-2 inline-flex h-12 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-60"
        >
          {pending ? "Placing order…" : `Place Order — £${subtotal.toFixed(2)}`}
        </button>
        <p className="text-center text-xs text-muted-foreground">
          Pay in store or on collection — no card details needed online.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="h-fit rounded-2xl border border-border bg-card p-5"
      >
        <h2 className="font-heading text-lg font-bold tracking-tight">Order Summary</h2>
        <div className="mt-4 flex flex-col gap-4">
          {items.map((item) => (
            <div key={item.id} className="flex gap-3">
              <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-muted">
                {item.image && (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="56px"
                    className="object-contain p-1.5"
                  />
                )}
              </div>
              <div className="flex flex-1 flex-col">
                <p className="text-sm font-medium">{item.name}</p>
                {item.variantName && (
                  <p className="text-xs text-muted-foreground">{item.variantName}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  {item.quantity} × {item.price}
                </p>
              </div>
              <p className="text-sm font-semibold">
                £{(parsePrice(item.price) * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-sm font-semibold">
          <span>Subtotal</span>
          <span>£{subtotal.toFixed(2)}</span>
        </div>
      </motion.div>
    </form>
  );
}
