import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export const maxDuration = 120;

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY not configured" },
        { status: 500 }
      );
    }

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { error: "Supabase not configured" },
        { status: 500 }
      );
    }

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      tools: [{ type: "web_search_20250305", name: "web_search", max_uses: 20 }],
      messages: [
        {
          role: "user",
          content: `You are a lead generation assistant for Schtubbs LLC, a web development and software engineering company.

Search the web for 10 local businesses near zipcode 07407 (Fair Lawn, NJ area) that appear to need a new or better website. Look for businesses that:
- Have no website at all
- Have an outdated or poorly designed website
- Have a website that is not mobile-friendly
- Are small/local businesses that could benefit from a modern web presence

For each business, find:
1. Business Name
2. Contact Email (if publicly available, otherwise null)
3. Phone Number (if publicly available, otherwise null)
4. Current Website URL (if they have one, otherwise null)
5. A brief summary (2-3 sentences) of what the business does and why they could benefit from web development services

Return your findings as a JSON array with exactly this structure (no markdown, no code fences, just raw JSON):
[
  {
    "business_name": "Example Business",
    "contact_email": "info@example.com",
    "phone": "(201) 555-1234",
    "current_website": "http://example.com",
    "summary": "A local plumbing company serving Fair Lawn and surrounding areas. Their current website appears outdated with no mobile responsiveness and could benefit from a modern redesign."
  }
]

Return ONLY the JSON array, nothing else.`,
        },
      ],
    });

    // Extract the text response
    let jsonText = "";
    for (const block of response.content) {
      if (block.type === "text") {
        jsonText += block.text;
      }
    }

    // Parse the JSON array from the response
    const jsonMatch = jsonText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.error("Failed to parse leads JSON from Claude response:", jsonText);
      return NextResponse.json(
        { error: "Failed to parse leads from AI response" },
        { status: 500 }
      );
    }

    const leads = JSON.parse(jsonMatch[0]) as Array<{
      business_name: string;
      contact_email: string | null;
      phone: string | null;
      current_website: string | null;
      summary: string;
    }>;

    // Insert into Supabase, skipping duplicates
    const { createServiceClient } = await import("@/lib/supabase/server");
    const supabase = await createServiceClient();

    let inserted = 0;
    for (const lead of leads) {
      // Check for existing lead with same business name
      const { data: existing } = await supabase
        .from("leads")
        .select("id")
        .eq("business_name", lead.business_name)
        .limit(1);

      if (existing && existing.length > 0) continue;

      const { error } = await supabase.from("leads").insert({
        business_name: lead.business_name,
        contact_email: lead.contact_email || null,
        phone: lead.phone || null,
        current_website: lead.current_website || null,
        summary: lead.summary,
      });

      if (!error) inserted++;
    }

    return NextResponse.json({
      success: true,
      found: leads.length,
      inserted,
    });
  } catch (error) {
    console.error("Lead scrape cron error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
