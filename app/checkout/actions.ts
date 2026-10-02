"use server";

import { revalidatePath } from "next/cache";
import { addOrder, type OrderItem } from "@/lib/data/orders";
import { priceCartLines, type PricedLine } from "@/lib/data/products";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { sendNotificationEmail } from "@/lib/email/send-notification-email";
import type { CartUpdate, CheckoutState } from "@/app/checkout/checkout-state";

const MAX_LINES = 100;
const MAX_QUANTITY = 99;

type CartLine = {
  id: string;
  productId: string;
  variantId: string | null;
  price: string;
  quantity: number;
};

function formatPrice(value: number) {
  return `£${value.toFixed(2)}`;
}

function parsePriceString(price: string) {
  const value = Number.parseFloat(price.replace(/[^0-9.]/g, ""));
  return Number.isFinite(value) ? value : 0;
}

/** Keeps only well-formed cart lines; prices sent here are only used to spot changes. */
function parseCartLines(raw: string): CartLine[] {
  let rows: unknown;
  try {
    rows = JSON.parse(raw);
  } catch {
    return [];
  }
  if (!Array.isArray(rows)) return [];

  const lines: CartLine[] = [];
  for (const row of rows.slice(0, MAX_LINES) as Record<string, unknown>[]) {
    const quantity = Number(row?.quantity);
    if (typeof row?.id !== "string" || typeof row.productId !== "string") continue;
    if (!Number.isInteger(quantity) || quantity < 1) continue;
    lines.push({
      id: row.id,
      productId: row.productId,
      variantId: typeof row.variantId === "string" ? row.variantId : null,
      price: typeof row.price === "string" ? row.price : "",
      quantity: Math.min(quantity, MAX_QUANTITY),
    });
  }
  return lines;
}

export async function submitOrder(
  _prevState: CheckoutState,
  formData: FormData,
): Promise<CheckoutState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();
  const itemsRaw = String(formData.get("items") ?? "[]");

  if (!name || !email || !phone || !address) {
    return {
      status: "error",
      message: "Please complete every required field before submitting.",
    };
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return { status: "error", message: "Please enter a valid email address." };
  }

  const lines = parseCartLines(itemsRaw);
  if (lines.length === 0) {
    return { status: "error", message: "Your cart is empty." };
  }

  if (!isSupabaseConfigured()) {
    return {
      status: "error",
      message:
        "Sorry, orders can't be submitted right now — the site isn't connected to a database yet.",
    };
  }

  // Price every line from the database — the browser only tells us what and
  // how many. Anything changed since it went in the cart goes back to the
  // shopper to review instead of being silently charged differently.
  let priced: PricedLine[];
  try {
    priced = await priceCartLines(lines);
  } catch (error) {
    console.error("Failed to price cart:", error);
    return { status: "error", message: "Something went wrong. Please try again." };
  }

  const items: OrderItem[] = [];
  const cartUpdates: CartUpdate[] = [];
  for (const line of lines) {
    const match = priced.find(
      (p) => p.productId === line.productId && p.variantId === line.variantId,
    );
    if (!match || match.stock <= 0) {
      cartUpdates.push({ id: line.id, price: null });
      continue;
    }
    const price = formatPrice(match.price);
    if (price !== line.price) cartUpdates.push({ id: line.id, price });
    items.push({
      id: line.id,
      productId: match.productId,
      variantId: match.variantId,
      name: match.name,
      variantName: match.variantName,
      price,
      quantity: line.quantity,
    });
  }

  if (cartUpdates.length > 0) {
    return {
      status: "error",
      message:
        "Some items in your cart have changed price or are no longer available. We've updated your cart — please check it and place your order again.",
      cartUpdates,
    };
  }

  const subtotal = items.reduce(
    (sum, item) => sum + parsePriceString(item.price) * item.quantity,
    0,
  );

  try {
    await addOrder({ name, email, phone, address, notes, items, subtotal });
  } catch (error) {
    console.error("Failed to save order:", error);
    return {
      status: "error",
      message: "Something went wrong saving your order. Please try again.",
    };
  }
  revalidatePath("/admin/orders");
  revalidatePath("/admin");

  const itemRows: [string, string][] = items.map((item) => [
    item.variantName ? `${item.name} — ${item.variantName}` : item.name,
    `${item.quantity} × ${item.price}`,
  ]);

  await sendNotificationEmail({
    subject: `New order — ${name} (£${subtotal.toFixed(2)})`,
    replyTo: email,
    rows: [
      ["Name", name],
      ["Email", email],
      ["Phone", phone],
      ["Address", address],
      ...itemRows,
      ["Subtotal", `£${subtotal.toFixed(2)}`],
      ["Notes", notes || "—"],
    ],
  });

  return {
    status: "success",
    message: "Thanks — your order has been received. We'll be in touch to confirm.",
  };
}
