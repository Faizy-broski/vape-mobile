"use server";

import nodemailer from "nodemailer";

export type BookingState = {
  status: "idle" | "success" | "error";
  message: string;
};

export const initialBookingState: BookingState = {
  status: "idle",
  message: "",
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
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

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM, ADMIN_EMAIL } =
    process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASSWORD || !ADMIN_EMAIL) {
    console.error(
      "Repair booking email not sent: missing SMTP_HOST, SMTP_USER, SMTP_PASSWORD or ADMIN_EMAIL environment variables.",
    );
    return {
      status: "error",
      message:
        "Sorry, bookings can't be submitted right now. Please call the store instead.",
    };
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
  });

  const rows: [string, string][] = [
    ["Device", device],
    ["Brand", brand],
    ["Issue", issue],
    ["Name", name],
    ["Email", email],
    ["Phone", phone],
    ["Preferred store", store || "No preference"],
    ["Notes", notes || "—"],
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

  try {
    await transporter.sendMail({
      from: SMTP_FROM || SMTP_USER,
      to: ADMIN_EMAIL,
      replyTo: email,
      subject: `Repair booking request — ${device} (${brand})`,
      text,
      html,
    });
  } catch (error) {
    console.error("Failed to send repair booking email:", error);
    return {
      status: "error",
      message:
        "Something went wrong sending your request. Please try again or call the store.",
    };
  }

  return {
    status: "success",
    message: "Thanks — your repair request has been sent. We'll be in touch shortly.",
  };
}
