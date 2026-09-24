"use server";

import nodemailer from "nodemailer";
import { revalidatePath } from "next/cache";
import { addBooking } from "@/lib/data/bookings";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { BookingState } from "@/app/repairs/book/booking-state";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function sendBookingEmail(booking: {
  device: string;
  brand: string;
  issue: string;
  name: string;
  email: string;
  phone: string;
  store: string;
  notes: string;
}) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM, ADMIN_EMAIL } =
    process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASSWORD || !ADMIN_EMAIL) {
    console.warn(
      "Repair booking saved, but no email was sent: SMTP_HOST, SMTP_USER, SMTP_PASSWORD or ADMIN_EMAIL is not configured. See .env.example.",
    );
    return;
  }

  const rows: [string, string][] = [
    ["Device", booking.device],
    ["Brand", booking.brand],
    ["Issue", booking.issue],
    ["Name", booking.name],
    ["Email", booking.email],
    ["Phone", booking.phone],
    ["Preferred store", booking.store || "No preference"],
    ["Notes", booking.notes || "—"],
  ];

  const html = `
    <h2>New repair booking request</h2>
    <table cellpadding="6" cellspacing="0" border="0">
      ${rows
        .map(
          ([label, value]) =>
            `<tr><td><strong>${escapeHtml(label)}</strong></td><td>${escapeHtml(value)}</td></tr>`,
        )
        .join("")}
    </table>
  `;
  const text = rows.map(([label, value]) => `${label}: ${value}`).join("\n");

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
  });

  try {
    await transporter.sendMail({
      from: SMTP_FROM || SMTP_USER,
      to: ADMIN_EMAIL,
      replyTo: booking.email,
      subject: `Repair booking request — ${booking.device} (${booking.brand})`,
      text,
      html,
    });
  } catch (error) {
    console.error("Failed to send repair booking email:", error);
  }
}

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
  // if outbound email isn't configured yet.
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

  await sendBookingEmail(booking);

  return {
    status: "success",
    message: "Thanks — your repair request has been sent. We'll be in touch shortly.",
  };
}
