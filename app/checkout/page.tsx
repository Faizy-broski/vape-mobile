import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CheckoutForm } from "@/components/checkout/checkout-form";

export const metadata: Metadata = {
  title: "Checkout — V&M Vape | Mobile",
  description: "Review your order and confirm your details.",
};

export default function CheckoutPage() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="wrap section-y">
          <div className="mx-auto max-w-4xl">
            <span className="inline-block text-xs font-semibold tracking-[0.2em] text-accent uppercase">
              Checkout
            </span>
            <h1 className="mt-2 font-heading text-3xl font-black tracking-tight uppercase xs:text-4xl">
              Confirm Your Order
            </h1>
            <p className="mt-3 max-w-md text-sm text-muted-foreground">
              We&apos;ll get everything ready — pay when you collect or on
              delivery.
            </p>

            <div className="mt-10">
              <CheckoutForm />
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
