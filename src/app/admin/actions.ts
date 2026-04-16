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

export async function enrichLeadContact(leadId: string) {
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
    tools: [{ type: "web_search_20250305", name: "web_search", max_uses: 10 }],
    messages: [
      {
        role: "user",
        content: `Find the contact email address and phone number for the following business.

Business Name: ${lead.business_name}
Location: PA, NJ, or NY area
Current Website: ${lead.current_website ?? "Unknown"}

Search their website contact page, Google Maps listing, Yelp page, Facebook page, and any business directories. Be thorough — check multiple sources.

Return ONLY a JSON object (no markdown, no code fences):
{"contact_email": "email@example.com or null", "phone": "(201) 555-1234 or null"}`,
      },
    ],
  });

  let jsonText = "";
  for (const block of response.content) {
    if (block.type === "text") {
      jsonText += block.text;
    }
  }

  const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Failed to parse enrichment response");

  const enriched = JSON.parse(jsonMatch[0]) as {
    contact_email: string | null;
    phone: string | null;
  };

  // Only update null fields — don't overwrite existing data
  const updates: Record<string, string> = {};
  if (!lead.contact_email && enriched.contact_email && enriched.contact_email !== "null") {
    updates.contact_email = enriched.contact_email;
  }
  if (!lead.phone && enriched.phone && enriched.phone !== "null") {
    updates.phone = enriched.phone;
  }

  if (Object.keys(updates).length > 0) {
    await supabase.from("leads").update(updates).eq("id", leadId);
  }

  revalidatePath("/admin/leads");
  return {
    success: true,
    found: Object.keys(updates).length > 0,
    contact_email: updates.contact_email ?? lead.contact_email,
    phone: updates.phone ?? lead.phone,
  };
}

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

  const demoLine = lead.demo_url
    ? `\n- Mention that we built a quick preview of what their site could look like and include this link: ${lead.demo_url}`
    : "";

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `Write a professional cold outreach email from Sierra-117 LLC, a web development and software engineering company, to the following business. The email should be concise, friendly, and focused on how we can help them improve their online presence.

Business Name: ${lead.business_name}
Current Website: ${lead.current_website ?? "None"}
Business Summary: ${lead.summary}

Guidelines:
- Keep it under 200 words
- Be specific about what we noticed about their current web presence
- Mention one or two concrete benefits of a modern website
- Include a clear call to action (schedule a free consultation)
- Sign off as "Marcin" (from Sierra-117 LLC)
- Do NOT include a subject line, just the email body
- Write in plain text, no HTML or markdown formatting${demoLine}`,
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

export async function generateDemoSite(leadId: string) {
  await requireAdmin();

  if (!process.env.ANTHROPIC_API_KEY) throw new Error("ANTHROPIC_API_KEY not configured");
  if (!process.env.GITHUB_TOKEN) throw new Error("GITHUB_TOKEN not configured");

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
    max_tokens: 16384,
    messages: [
      {
        role: "user",
        content: `Create a professional, modern single-page landing website for the following business. The site should look like it was built by a premium web agency and should make the business owner think "I want my website to look like this."

Business: ${lead.business_name}
Industry/Description: ${lead.summary}
Location: Fair Lawn, NJ area

Design requirements:
- Mobile-first responsive design with a polished, modern aesthetic
- Choose an appropriate color palette for the industry (avoid generic blue — be creative)
- Smooth scroll behavior and subtle CSS animations (transitions, hover effects)
- Hero section with business name, a compelling tagline, and a call-to-action button
- Services or features section with icons (use Unicode/emoji icons, no external icon libraries)
- A testimonials placeholder section with realistic-looking placeholder quotes
- Contact call-to-action section with a placeholder form or contact details
- Professional footer with business name, address placeholder, and a small "Demo by Sierra-117 LLC" credit linking to https://sierra-117.net
- Use only vanilla HTML, CSS, and JavaScript — NO external dependencies, CDNs, or frameworks
- CSS must be in a separate styles.css file, JS in a separate script.js file
- The HTML must link to ./styles.css and ./script.js
- Ensure the design looks complete and polished, not like a template — add visual depth with gradients, shadows, and spacing

Return ONLY a JSON object with three keys (no markdown, no code fences, just raw JSON):
{"index_html": "<full HTML content>", "styles_css": "<full CSS content>", "script_js": "<full JS content>"}`,
      },
    ],
  });

  let jsonText = "";
  for (const block of response.content) {
    if (block.type === "text") {
      jsonText += block.text;
    }
  }

  const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Failed to parse demo site response");

  const site = JSON.parse(jsonMatch[0]) as {
    index_html: string;
    styles_css: string;
    script_js: string;
  };

  const { slugify } = await import("@/lib/utils");
  const slug = slugify(lead.business_name);

  const { pushDemoSite } = await import("@/lib/github");
  const demoUrl = await pushDemoSite(slug, [
    { path: "index.html", content: site.index_html },
    { path: "styles.css", content: site.styles_css },
    { path: "script.js", content: site.script_js },
  ]);

  await supabase
    .from("leads")
    .update({ demo_url: demoUrl })
    .eq("id", leadId);

  revalidatePath("/admin/leads");
  return { success: true, demoUrl };
}

export async function generateDemoAndPitch(leadId: string) {
  await requireAdmin();

  // Step 1: Generate demo site
  const demoResult = await generateDemoSite(leadId);

  // Step 2: Generate pitch email (will reference the demo URL)
  const pitchResult = await generatePitchEmail(leadId);

  // Step 3: Send the pitch email via Resend
  const { createServiceClient } = await import("@/lib/supabase/server");
  const supabase = await createServiceClient();

  const { data: lead } = await supabase
    .from("leads")
    .select("contact_email")
    .eq("id", leadId)
    .single();

  if (!lead?.contact_email) {
    // Demo + pitch generated but can't send without an email
    revalidatePath("/admin/leads");
    return {
      success: true,
      demoUrl: demoResult.demoUrl,
      pitchGenerated: true,
      emailSent: false,
      reason: "No contact email — pitch saved but not sent",
    };
  }

  await sendPitchEmail(leadId, pitchResult.pitchEmail);

  revalidatePath("/admin/leads");
  return {
    success: true,
    demoUrl: demoResult.demoUrl,
    pitchGenerated: true,
    emailSent: true,
  };
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
  const from = process.env.RESEND_FROM_EMAIL ?? "noreply@schtubbs.dev";

  await resend.emails.send({
    from: `Marcin from Sierra-117 <${from}>`,
    to: lead.contact_email,
    subject: `Elevate ${lead.business_name}'s Online Presence`,
    html: `
      <div style="font-family: 'Courier New', monospace; background-color: #080c10; color: #e2e8f0; padding: 40px; max-width: 600px; margin: 0 auto;">
        <div style="border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 32px; background-color: rgba(255,255,255,0.02);">
          ${emailBody.split("\n").map((line) => `<p style="margin: 8px 0; line-height: 1.6; color: #cbd5e1;">${line || "&nbsp;"}</p>`).join("")}
        </div>
        <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.05); text-align: center;">
          <p style="font-size: 11px; color: rgba(255,255,255,0.2);">Sierra-117 LLC &mdash; Web Development & Software Engineering</p>
          <p style="font-size: 11px; color: rgba(255,255,255,0.2);">If you no longer wish to receive emails, reply with "unsubscribe"</p>
        </div>
      </div>
    `,
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
