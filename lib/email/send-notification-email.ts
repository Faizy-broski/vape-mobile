import "server-only";
import nodemailer from "nodemailer";

// Fails fast instead of hanging on the OS-level TCP timeout (which can take
// 20+ seconds and block the customer's form submission while it happens).
const SMTP_TIMEOUT_MS = 8000;

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export type NotificationEmail = {
  subject: string;
  rows: [string, string][];
  replyTo?: string;
};

/**
 * Emails the admin inbox a labelled table of rows (used for repair bookings
 * and checkout orders). Best-effort: logs and swallows failures rather than
 * throwing, since the record should already be saved to the database before
 * this is called — a failed email should never undo that.
 */
export async function sendNotificationEmail({
  subject,
  rows,
  replyTo,
}: NotificationEmail): Promise<void> {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM, ADMIN_EMAIL } =
    process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASSWORD || !ADMIN_EMAIL) {
    console.warn(
      "Email not sent: SMTP_HOST, SMTP_USER, SMTP_PASSWORD or ADMIN_EMAIL is not configured. See .env.example.",
    );
    return;
  }

  const html = `
    <h2>${escapeHtml(subject)}</h2>
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
    connectionTimeout: SMTP_TIMEOUT_MS,
    greetingTimeout: SMTP_TIMEOUT_MS,
    socketTimeout: SMTP_TIMEOUT_MS,
  });

  try {
    await transporter.sendMail({
      from: SMTP_FROM || SMTP_USER,
      to: ADMIN_EMAIL,
      replyTo,
      subject,
      text,
      html,
    });
  } catch (error) {
    console.error(`Failed to send email ("${subject}"):`, error);
  }
}
