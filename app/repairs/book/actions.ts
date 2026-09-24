"use server";

import { revalidatePath } from "next/cache";
import { addBooking } from "@/lib/data/bookings";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { sendNotificationEmail } from "@/lib/email/send-notification-email";
import type { BookingState } from "@/app/repairs/book/booking-state";

export async function submitRepairBooking(
  _prevState: BookingState,
  formData: FormData,
): Promise<BookingState> {
  const device = String(formData.get("device") ?? "").trim();
  const brand = String(formData.get("brand") ?? "").trim();
  const issue = String(formData.get("issue") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const store = String(formData.get("store") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();

  if (!device || !brand || !issue || !name || !email || !phone) {
    return {
      status: "error",
      message: "Please complete every required field before submitting.",
    };
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return { status: "error", message: "Please enter a valid email address." };
  }

  const booking = { device, brand, issue, name, email, phone, store, notes };

  if (!isSupabaseConfigured()) {
    return {
      status: "error",
      message:
        "Sorry, bookings can't be submitted right now — the site isn't connected to a database yet.",
    };
  }

  // Persist first so the request always lands on the admin dashboard, even
  // if outbound email isn't configured (or unreachable) right now.
  try {
    await addBooking(booking);
  } catch (error) {
    console.error("Failed to save repair booking:", error);
    return {
      status: "error",
      message: "Something went wrong saving your request. Please try again.",
    };
  }
  revalidatePath("/admin/bookings");
  revalidatePath("/admin");

  await sendNotificationEmail({
    subject: `Repair booking request — ${device} (${brand})`,
    replyTo: email,
    rows: [
      ["Device", device],
      ["Brand", brand],
      ["Issue", issue],
      ["Name", name],
      ["Email", email],
      ["Phone", phone],
      ["Preferred store", store || "No preference"],
      ["Notes", notes || "—"],
    ],
  });

  return {
    status: "success",
    message: "Thanks — your repair request has been sent. We'll be in touch shortly.",
  };
}
