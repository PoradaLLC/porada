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

export interface LeadInput {
  business_name: string;
  contact_email: string | null;
  phone: string | null;
  current_website: string | null;
  summary: string;
  status?: string;
}

function normalize(input: LeadInput) {
  const clean = (v: string | null | undefined) => {
    const trimmed = (v ?? "").trim();
    return trimmed.length > 0 ? trimmed : null;
  };
  return {
    business_name: (input.business_name ?? "").trim(),
    contact_email: clean(input.contact_email),
    phone: clean(input.phone),
    current_website: clean(input.current_website),
    summary: (input.summary ?? "").trim(),
    status: input.status && ["new", "pitched", "converted", "dismissed"].includes(input.status)
      ? input.status
      : undefined,
  };
}

export async function createLead(input: LeadInput) {
  await requireAdmin();

  const row = normalize(input);
  if (!row.business_name) throw new Error("Business name is required");
  if (!row.summary) throw new Error("Summary is required");

  const { createServiceClient } = await import("@/lib/supabase/server");
  const supabase = await createServiceClient();

  const { error } = await supabase.from("leads").insert({
    business_name: row.business_name,
    contact_email: row.contact_email,
    phone: row.phone,
    current_website: row.current_website,
    summary: row.summary,
    status: row.status ?? "new",
  });

  if (error) throw new Error(error.message);

  revalidatePath("/admin/leads");
  return { success: true };
}

export async function updateLead(id: string, input: LeadInput) {
  await requireAdmin();

  const row = normalize(input);
  if (!row.business_name) throw new Error("Business name is required");
  if (!row.summary) throw new Error("Summary is required");

  const { createServiceClient } = await import("@/lib/supabase/server");
  const supabase = await createServiceClient();

  const { error } = await supabase
    .from("leads")
    .update({
      business_name: row.business_name,
      contact_email: row.contact_email,
      phone: row.phone,
      current_website: row.current_website,
      summary: row.summary,
      ...(row.status ? { status: row.status } : {}),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/leads");
  return { success: true };
}

export async function deleteLead(id: string) {
  await requireAdmin();

  const { createServiceClient } = await import("@/lib/supabase/server");
  const supabase = await createServiceClient();

  const { error } = await supabase.from("leads").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/leads");
  return { success: true };
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

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `Write a short cold outreach email from Porada, a small web dev team based in the NY/NJ/PA area. We build websites and tech for local businesses.

Business: ${lead.business_name}
Their website: ${lead.current_website ?? "None found"}
About them: ${lead.summary}

Rules:
- Under 150 words. Shorter is better.
- Sound like a real person, not a sales team. No buzzwords ("leverage", "elevate", "empower", "in today's digital landscape").
- Be specific about one thing we noticed about their current site (or lack of one).
- Mention our free website review offer: "We'll review your site and tell you what's slowing it down, free, no strings."
- If they don't have a site, offer to show them what one could look like.
- CTA: reply to this email or book a call at poradasolutions.com/book
- Sign off as "Marcin" (from Porada)
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
