"use server";

import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  const role = user.app_metadata?.role ?? user.user_metadata?.role;
  if (role !== "admin") throw new Error("Forbidden");
  return user;
}

// ─── Customer Management ───

export async function createCustomer(formData: FormData) {
  await requireAdmin();

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const company = formData.get("company") as string;
  const phone = formData.get("phone") as string;

  // Create Stripe customer if Stripe is configured
  let stripeCustomerId: string | null = null;
  if (process.env.STRIPE_SECRET_KEY) {
    const { stripe } = await import("@/lib/stripe");
    if (stripe) {
      const customer = await stripe.customers.create({
        name,
        email,
        phone: phone || undefined,
        metadata: { company: company || "" },
      });
      stripeCustomerId = customer.id;
    }
  }

  // Store in Supabase
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const { createServiceClient } = await import("@/lib/supabase/server");
    const supabase = await createServiceClient();
    await supabase.from("customers").insert({
      name,
      email,
      company: company || null,
      phone: phone || null,
      stripe_customer_id: stripeCustomerId,
    });
  }

  revalidatePath("/admin/customers");
  return { success: true };
}

export async function deleteCustomer(customerId: string) {
  await requireAdmin();

  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const { createServiceClient } = await import("@/lib/supabase/server");
    const supabase = await createServiceClient();
    await supabase.from("customers").delete().eq("id", customerId);
  }

  revalidatePath("/admin/customers");
  return { success: true };
}

// ─── Invoice / Charge Management ───

export async function createOneTimeCharge(formData: FormData) {
  await requireAdmin();

  const customerEmail = formData.get("customerEmail") as string;
  const amount = parseInt(formData.get("amount") as string);
  const description = formData.get("description") as string;
  const stripeCustomerId = formData.get("stripeCustomerId") as string;

  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("Stripe is not configured");
  }

  const { stripe } = await import("@/lib/stripe");
  if (!stripe) throw new Error("Stripe not available");

  // Create an invoice item and invoice for the customer
  const invoice = await stripe.invoices.create({
    customer: stripeCustomerId,
    collection_method: "send_invoice",
    days_until_due: 30,
    description,
  });

  await stripe.invoiceItems.create({
    customer: stripeCustomerId,
    amount,
    currency: "usd",
    description,
    invoice: invoice.id,
  });

  await stripe.invoices.sendInvoice(invoice.id);

  // Record in Supabase
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const { createServiceClient } = await import("@/lib/supabase/server");
    const supabase = await createServiceClient();
    await supabase.from("payments").insert({
      customer_email: customerEmail,
      amount,
      description,
      status: "invoiced",
      mode: "payment",
      stripe_session_id: invoice.id,
    });
  }

  revalidatePath("/admin/payments");
  revalidatePath("/admin/customers");
  return { success: true, invoiceId: invoice.id };
}

export async function createSubscription(formData: FormData) {
  await requireAdmin();

  const stripeCustomerId = formData.get("stripeCustomerId") as string;
  const priceId = formData.get("priceId") as string;
  const customerEmail = formData.get("customerEmail") as string;

  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("Stripe is not configured");
  }

  const { stripe } = await import("@/lib/stripe");
  if (!stripe) throw new Error("Stripe not available");

  const subscription = await stripe.subscriptions.create({
    customer: stripeCustomerId,
    items: [{ price: priceId }],
    payment_behavior: "default_incomplete",
    expand: ["latest_invoice.payment_intent"],
  });

  // Record in Supabase
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const { createServiceClient } = await import("@/lib/supabase/server");
    const supabase = await createServiceClient();
    await supabase.from("payments").insert({
      customer_email: customerEmail,
      amount: 0,
      description: `Subscription: ${priceId}`,
      status: "active",
      mode: "subscription",
      stripe_session_id: subscription.id,
    });
  }

  revalidatePath("/admin/payments");
  revalidatePath("/admin/customers");
  return { success: true, subscriptionId: subscription.id };
}

export async function createStripeProduct(formData: FormData) {
  await requireAdmin();

  const name = formData.get("name") as string;
  const amount = parseInt(formData.get("amount") as string);
  const recurring = formData.get("recurring") === "true";
  const interval = (formData.get("interval") as string) || "month";

  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("Stripe is not configured");
  }

  const { stripe } = await import("@/lib/stripe");
  if (!stripe) throw new Error("Stripe not available");

  const product = await stripe.products.create({ name });

  const priceData: {
    product: string;
    unit_amount: number;
    currency: string;
    recurring?: { interval: "month" | "year" | "week" | "day" };
  } = {
    product: product.id,
    unit_amount: amount,
    currency: "usd",
  };

  if (recurring) {
    priceData.recurring = {
      interval: interval as "month" | "year" | "week" | "day",
    };
  }

  const price = await stripe.prices.create(priceData);

  revalidatePath("/admin/payments");
  return { success: true, productId: product.id, priceId: price.id };
}

// ─── Booking Management ───

export async function updateBookingStatus(bookingId: string, status: string) {
  await requireAdmin();

  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const { createServiceClient } = await import("@/lib/supabase/server");
    const supabase = await createServiceClient();
    await supabase.from("bookings").update({ status }).eq("id", bookingId);
  }

  revalidatePath("/admin/bookings");
  return { success: true };
}

export async function deleteBooking(bookingId: string) {
  await requireAdmin();

  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const { createServiceClient } = await import("@/lib/supabase/server");
    const supabase = await createServiceClient();
    await supabase.from("bookings").delete().eq("id", bookingId);
  }

  revalidatePath("/admin/bookings");
  return { success: true };
}

// ─── Lead Queue Management ───

export async function generatePitchEmail(leadId: string) {
  await requireAdmin();

  if (!process.env.ANTHROPIC_API_KEY) throw new Error("ANTHROPIC_API_KEY not configured");

  const { createServiceClient } = await import("@/lib/supabase/server");
  const supabase = await createServiceClient();

  const { data: lead, error } = await supabase
    .from("leads")
    .select("*")
    .eq("id", leadId)
    .single();

  if (error || !lead) throw new Error("Lead not found");

  const { default: Anthropic } = await import("@anthropic-ai/sdk");
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `Write a short cold outreach email from Sierra-117, a small web dev team based in the NYC Tri-State area. We build websites and tech for local businesses.

Business: ${lead.business_name}
Their website: ${lead.current_website ?? "None found"}
About them: ${lead.summary}

Rules:
- Under 150 words. Shorter is better.
- Sound like a real person, not a sales team. No buzzwords ("leverage", "elevate", "empower", "in today's digital landscape").
- Be specific about one thing we noticed about their current site (or lack of one).
- Mention our free website review offer: "We'll review your site and tell you what's slowing it down, free, no strings."
- If they don't have a site, offer to show them what one could look like.
- CTA: reply to this email or book a call at sierra-117.dev/book
- Sign off as "The Sierra-117 Team"
- Plain text only. No HTML, no markdown, no formatting.
- No subject line, just the body.`,
      },
    ],
  });

  let pitchEmail = "";
  for (const block of response.content) {
    if (block.type === "text") {
      pitchEmail += block.text;
    }
  }

  await supabase
    .from("leads")
    .update({ pitch_email: pitchEmail })
    .eq("id", leadId);

  revalidatePath("/admin/leads");
  return { success: true, pitchEmail };
}

export async function sendPitchEmail(leadId: string, emailBody: string) {
  await requireAdmin();

  if (!process.env.RESEND_API_KEY) throw new Error("Resend not configured");

  const { createServiceClient } = await import("@/lib/supabase/server");
  const supabase = await createServiceClient();

  const { data: lead, error } = await supabase
    .from("leads")
    .select("*")
    .eq("id", leadId)
    .single();

  if (error || !lead) throw new Error("Lead not found");
  if (!lead.contact_email) throw new Error("No contact email for this lead");

  const { Resend } = await import("resend");
  const resend = new Resend(process.env.RESEND_API_KEY);
  const from = process.env.RESEND_FROM_EMAIL ?? "noreply@sierra-117.dev";

  const { wrapEmailTemplate, formatEmailBody } = await import("@/lib/email-template");

  await resend.emails.send({
    from: `Sierra-117 <${from}>`,
    to: lead.contact_email,
    subject: `Quick question about ${lead.business_name}'s website`,
    html: wrapEmailTemplate(formatEmailBody(emailBody)),
  });

  await supabase
    .from("leads")
    .update({
      status: "pitched",
      pitch_email: emailBody,
      pitched_at: new Date().toISOString(),
    })
    .eq("id", leadId);

  revalidatePath("/admin/leads");
  return { success: true };
}

export async function updateLeadStatus(leadId: string, status: string) {
  await requireAdmin();

  const validStatuses = ["new", "pitched", "converted", "dismissed"];
  if (!validStatuses.includes(status)) throw new Error("Invalid status");

  const { createServiceClient } = await import("@/lib/supabase/server");
  const supabase = await createServiceClient();

  await supabase.from("leads").update({ status }).eq("id", leadId);

  revalidatePath("/admin/leads");
  return { success: true };
}

export async function createLead(data: {
  business_name: string;
  contact_email?: string;
  phone?: string;
  current_website?: string;
  summary: string;
  status?: string;
}) {
  await requireAdmin();

  const validStatuses = ["new", "pitched", "converted", "dismissed"];
  const status = data.status && validStatuses.includes(data.status) ? data.status : "new";

  const { createServiceClient } = await import("@/lib/supabase/server");
  const supabase = await createServiceClient();

  const { error } = await supabase.from("leads").insert({
    business_name: data.business_name,
    contact_email: data.contact_email || null,
    phone: data.phone || null,
    current_website: data.current_website || null,
    summary: data.summary,
    status,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/admin/leads");
  return { success: true };
}

export async function updateLead(
  leadId: string,
  data: {
    business_name?: string;
    contact_email?: string | null;
    phone?: string | null;
    current_website?: string | null;
    summary?: string;
    status?: string;
  }
) {
  await requireAdmin();

  const validStatuses = ["new", "pitched", "converted", "dismissed"];
  if (data.status && !validStatuses.includes(data.status)) {
    throw new Error("Invalid status");
  }

  const { createServiceClient } = await import("@/lib/supabase/server");
  const supabase = await createServiceClient();

  const { error } = await supabase.from("leads").update(data).eq("id", leadId);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/leads");
  return { success: true };
}

// ── Email Dashboard Actions ──────────────────────────────────

export interface ResendEmail {
  id: string;
  from: string;
  to: string[];
  subject: string;
  html: string;
  text: string | null;
  created_at: string;
  last_event: string;
}

export async function getEmails(): Promise<ResendEmail[]> {
  await requireAdmin();

  if (!process.env.RESEND_API_KEY) return [];

  try {
    const res = await fetch("https://api.resend.com/emails", {
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}` },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return (json.data ?? []) as ResendEmail[];
  } catch {
    return [];
  }
}

export async function getEmailDetail(emailId: string): Promise<ResendEmail | null> {
  await requireAdmin();

  if (!process.env.RESEND_API_KEY) return null;

  try {
    const res = await fetch(`https://api.resend.com/emails/${emailId}`, {
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}` },
    });
    if (!res.ok) return null;
    return (await res.json()) as ResendEmail;
  } catch {
    return null;
  }
}

export async function sendNewEmail(to: string, subject: string, body: string) {
  await requireAdmin();

  if (!process.env.RESEND_API_KEY) throw new Error("Resend not configured");

  const { Resend } = await import("resend");
  const resend = new Resend(process.env.RESEND_API_KEY);
  const from = process.env.RESEND_FROM_EMAIL ?? "noreply@sierra-117.dev";

  const { wrapEmailTemplate, formatEmailBody } = await import("@/lib/email-template");

  const { error } = await resend.emails.send({
    from: `Sierra-117 <${from}>`,
    to,
    subject,
    html: wrapEmailTemplate(formatEmailBody(body)),
  });

  if (error) throw new Error(error.message);

  return { success: true };
}
