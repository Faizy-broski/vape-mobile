"use server";

import { revalidatePath } from "next/cache";
import { addOrder, type OrderItem } from "@/lib/data/orders";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { sendNotificationEmail } from "@/lib/email/send-notification-email";
import type { CheckoutState } from "@/app/checkout/checkout-state";

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
  const subtotalRaw = String(formData.get("subtotal") ?? "0");

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

  let items: OrderItem[];
  try {
    items = JSON.parse(itemsRaw);
  } catch {
    items = [];
  }

  if (!Array.isArray(items) || items.length === 0) {
    return { status: "error", message: "Your cart is empty." };
  }

  const subtotal = Number.parseFloat(subtotalRaw) || 0;

  if (!isSupabaseConfigured()) {
    return {
      status: "error",
      message:
        "Sorry, orders can't be submitted right now — the site isn't connected to a database yet.",
    };
  }

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
    item.name,
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
