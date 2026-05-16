import { Resend } from "resend";
import { formatCurrency } from "@/lib/utils";

const FROM = process.env.RESEND_FROM_EMAIL ?? "Porada <invoices@poradasolutions.com>";

function resend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

export interface InvoiceEmailParams {
  to: string;
  invoiceUrl: string;
  amountCents: number;
  description: string;
  customerName?: string | null;
}

export async function sendInvoiceEmail(params: InvoiceEmailParams): Promise<void> {
  const client = resend();
  const amount = formatCurrency(params.amountCents);

  if (!client) {
    console.log(
      `[email:dev] invoice for ${params.to} — ${amount} — ${params.invoiceUrl}`
    );
    return;
  }

  const greeting = params.customerName ? `Hi ${escapeHtml(params.customerName)},` : "Hi,";
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color:#1a1a1a; max-width:560px; margin:0 auto; padding:24px;">
      <p style="font-size:14px; letter-spacing:0.08em; text-transform:uppercase; color:#888; margin:0 0 24px;">Porada Solutions</p>
      <p>${greeting}</p>
      <p>Your invoice is ready. Total: <strong>${amount}</strong></p>
      <p style="color:#555; font-size:14px;">${escapeHtml(params.description)}</p>
      <p style="margin-top:32px;">
        <a href="${params.invoiceUrl}" style="display:inline-block; background:#1a1a1a; color:#fff; text-decoration:none; padding:14px 22px; border-radius:8px; font-weight:600;">View &amp; pay invoice</a>
      </p>
      <p style="color:#888; font-size:13px; margin-top:24px;">
        You'll sign in with your email at the link above. Only the email this invoice was sent to can view it.
      </p>
      <p style="color:#aaa; font-size:12px; margin-top:32px;">Direct link: ${params.invoiceUrl}</p>
    </div>
  `.trim();

  try {
    await client.emails.send({
      from: FROM,
      to: params.to,
      subject: `Invoice from Porada — ${amount}`,
      html,
    });
  } catch (err) {
    console.error("[email] failed to send invoice email", err);
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
