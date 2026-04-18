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
        content: `Write a short cold outreach email from Sierra-117, a small web dev team based in the NY/NJ/PA area. We build websites and tech for local businesses.

Business: ${lead.business_name}
Their website: ${lead.current_website ?? "None found"}
About them: ${lead.summary}

Rules:
- Under 150 words. Shorter is better.
- Sound like a real person, not a sales team. No buzzwords ("leverage", "elevate", "empower", "in today's digital landscape").
- Be specific about one thing we noticed about their current site (or lack of one).
- Mention our free website review offer: "We'll review your site and tell you what's slowing it down, free, no strings."
- If they don't have a site, offer to show them what one could look like.
- CTA: reply to this email or book a call at sierra-117.net/book
- Sign off as "Marcin" (from Sierra-117)
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
