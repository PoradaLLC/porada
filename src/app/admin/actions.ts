"use server";

import { revalidatePath } from "next/cache";
import { after } from "next/server";

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

  // Mark as in-progress immediately
  await supabase.from("leads").update({ job_status: "enriching" }).eq("id", leadId);
  revalidatePath("/admin/leads");

  after(async () => {
    try {
      const { createServiceClient: createSC } = await import("@/lib/supabase/server");
      const sb = await createSC();

      const { data: lead } = await sb
        .from("leads")
        .select("*")
        .eq("id", leadId)
        .single();

      if (!lead) return;

      const { default: Anthropic } = await import("@anthropic-ai/sdk");
      const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

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

      const updates: Record<string, string | null> = { job_status: null };
      if (!lead.contact_email && enriched.contact_email && enriched.contact_email !== "null") {
        updates.contact_email = enriched.contact_email;
      }
      if (!lead.phone && enriched.phone && enriched.phone !== "null") {
        updates.phone = enriched.phone;
      }

      await sb.from("leads").update(updates).eq("id", leadId);
    } catch (err) {
      console.error("Enrich background job failed:", err);
      const { createServiceClient: createSC } = await import("@/lib/supabase/server");
      const sb = await createSC();
      await sb.from("leads").update({ job_status: "failed" }).eq("id", leadId);
    }
    revalidatePath("/admin/leads");
  });

  return { success: true, started: true };
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
        content: `Write a short cold outreach email from Sierra-117, a small web dev team based in the NYC Tri-State area. We build websites and tech for local businesses.

Business: ${lead.business_name}
Their website: ${lead.current_website ?? "None found"}
About them: ${lead.summary}

SCENARIO (pick the one that fits and tailor the email accordingly):
1. NO WEBSITE: They have no online presence. Lead with "I looked you up and couldn't find a site." Offer to show them what one could look like. Emphasize that most customers Google before they visit or call.
2. OUTDATED/STATIC SITE: They have a basic, old, or template site (e.g. not mobile-friendly, looks dated, generic Wix/Squarespace template). Point out ONE specific thing that's holding them back (slow load time, not mobile-friendly, no clear call-to-action, etc). Offer a free review.
3. DECENT SITE: They have a reasonable website but there's room to improve. Find ONE specific improvement opportunity (SEO, page speed, conversion rate, missing feature). Position us as a specialist upgrade, not a full replacement.

Rules:
- Under 150 words. Shorter is better.
- Sound like a real person, not a sales team. No buzzwords ("leverage", "elevate", "empower", "in today's digital landscape").
- Be specific — reference something real about their business from the summary.
- Include a personalized line about what we'd specifically do for them based on the scenario above.
- CTA: reply to this email or book a call at sierra-117.dev/book
- Sign off as "Marcin" (from Sierra-117)
- Plain text only. No HTML, no markdown, no formatting.
- No subject line, just the body.${demoLine}`,
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

// Internal helper — does the actual demo site generation work
async function _doGenerateDemoSite(leadId: string) {
  const { createServiceClient } = await import("@/lib/supabase/server");
  const sb = await createServiceClient();

  const { data: lead } = await sb
    .from("leads")
    .select("*")
    .eq("id", leadId)
    .single();

  if (!lead) throw new Error("Lead not found");

  const { default: Anthropic } = await import("@anthropic-ai/sdk");
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 16384,
    messages: [
      {
        role: "user",
        content: `You are a world-class web designer. Create a stunning, modern single-page landing website for the following business. The site must look like a $10,000+ custom build from a premium agency — the kind that makes the business owner immediately want to hire you.

Business: ${lead.business_name}
Industry/Description: ${lead.summary}
Current Website: ${lead.current_website ?? "None"}

DESIGN VISION:
- Study what the top agencies (Apple, Stripe, Linear) do: generous whitespace, bold typography hierarchy, subtle micro-interactions
- Pick a sophisticated color palette that fits the industry — use 1 bold accent color with neutral backgrounds. Avoid generic blue.
- Use large, bold section headings (48-72px) with lighter subtext. Mix font weights dramatically.
- Every section should have visual breathing room — generous padding (80-120px vertical)

REQUIRED SECTIONS (in order):
1. HERO: Full-viewport height. Business name in large bold type, a compelling one-line tagline below, and a prominent CTA button. Use a relevant hero background image from picsum.photos (e.g., https://picsum.photos/1600/900 for a random high-quality photo). Add a dark overlay gradient so text is readable over the image.
2. ABOUT/INTRO: Brief value proposition. 2-3 short paragraphs max. Include a side image from picsum.photos (e.g., https://picsum.photos/600/400).
3. SERVICES/FEATURES: Card-based grid layout (3 columns on desktop, 1 on mobile). Each card has an icon (use Unicode/emoji), title, and short description. Cards should have subtle shadows and hover lift effects.
4. GALLERY/SHOWCASE: Image grid with 3-6 photos from picsum.photos. Use different seed values for variety: https://picsum.photos/seed/{unique-word}/600/400 — use business-related words as seeds (e.g., seed/office, seed/team, seed/workshop). Add subtle hover zoom effect.
5. TESTIMONIALS: 2-3 realistic placeholder reviews with star ratings, customer names, and short quotes. Style as elegant cards.
6. CONTACT CTA: Eye-catching section with contrasting background. Include a styled placeholder form (name, email, message, submit button) or business contact details. Make the submit button match the accent color.
7. FOOTER: Business name, placeholder address, phone, email. Navigation links. Small "Demo by Sierra-117 LLC" credit linking to https://www.sierra-117.net

TECHNICAL REQUIREMENTS:
- Mobile-first responsive CSS with breakpoints at 768px and 1024px
- Smooth scroll behavior (scroll-behavior: smooth in CSS)
- CSS animations: fade-in on scroll (use IntersectionObserver in JS), hover transitions on all interactive elements, subtle parallax on hero
- Images: use <img> tags with src from picsum.photos. For variety use seeded URLs: https://picsum.photos/seed/{word}/WIDTH/HEIGHT — pick different seed words per image
- All images must have object-fit: cover and appropriate aspect ratios
- Use CSS Grid and Flexbox for layouts — no floats
- The HTML links to ./styles.css and ./script.js
- NO external dependencies, CDNs, fonts, or frameworks — vanilla HTML, CSS, JS only
- Use system font stack: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif

QUALITY BAR:
- This should NOT look like a template. It should feel custom, intentional, and high-end.
- Pay attention to micro-details: button border-radius, input styling, link hover states, image aspect ratios
- Use CSS custom properties (variables) for colors so the palette is consistent
- Add a smooth scroll-to-top button

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

  await sb
    .from("leads")
    .update({ demo_url: demoUrl })
    .eq("id", leadId);

  return demoUrl;
}

export async function generateDemoSite(leadId: string) {
  await requireAdmin();

  if (!process.env.ANTHROPIC_API_KEY) throw new Error("ANTHROPIC_API_KEY not configured");
  if (!process.env.GITHUB_TOKEN) throw new Error("GITHUB_TOKEN not configured");

  const { createServiceClient } = await import("@/lib/supabase/server");
  const supabase = await createServiceClient();

  // Mark as in-progress immediately
  await supabase.from("leads").update({ job_status: "generating_demo" }).eq("id", leadId);
  revalidatePath("/admin/leads");

  after(async () => {
    try {
      await _doGenerateDemoSite(leadId);
      const { createServiceClient: createSC } = await import("@/lib/supabase/server");
      const sb = await createSC();
      await sb.from("leads").update({ job_status: null }).eq("id", leadId);
    } catch (err) {
      console.error("Demo generation background job failed:", err);
      const { createServiceClient: createSC } = await import("@/lib/supabase/server");
      const sb = await createSC();
      await sb.from("leads").update({ job_status: "failed" }).eq("id", leadId);
    }
    revalidatePath("/admin/leads");
  });

  return { success: true, started: true };
}

export async function generateDemoAndPitch(leadId: string) {
  await requireAdmin();

  if (!process.env.ANTHROPIC_API_KEY) throw new Error("ANTHROPIC_API_KEY not configured");
  if (!process.env.GITHUB_TOKEN) throw new Error("GITHUB_TOKEN not configured");

  const { createServiceClient } = await import("@/lib/supabase/server");
  const supabase = await createServiceClient();

  // Mark as in-progress immediately
  await supabase.from("leads").update({ job_status: "launching" }).eq("id", leadId);
  revalidatePath("/admin/leads");

  after(async () => {
    try {
      const { createServiceClient: createSC } = await import("@/lib/supabase/server");
      const sb = await createSC();

      // Step 1: Generate demo site
      await _doGenerateDemoSite(leadId);

      // Step 2: Generate pitch email (references the demo URL)
      const pitchResult = await generatePitchEmail(leadId);

      // Step 3: Send the pitch if we have an email
      const { data: lead } = await sb
        .from("leads")
        .select("contact_email")
        .eq("id", leadId)
        .single();

      if (lead?.contact_email) {
        await sendPitchEmail(leadId, pitchResult.pitchEmail);
      }

      await sb.from("leads").update({ job_status: null }).eq("id", leadId);
    } catch (err) {
      console.error("Launch background job failed:", err);
      const { createServiceClient: createSC } = await import("@/lib/supabase/server");
      const sb = await createSC();
      await sb.from("leads").update({ job_status: "failed" }).eq("id", leadId);
    }
    revalidatePath("/admin/leads");
  });

  return { success: true, started: true };
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

  const { wrapEmailTemplate, formatEmailBody } = await import("@/lib/email-template");

  await resend.emails.send({
    from: `Marcin from Sierra-117 <${from}>`,
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
