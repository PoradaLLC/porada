import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export const maxDuration = 120;

const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const JUNK_DOMAINS = [
  "sentry.io",
  "example.com",
  "wixpress.com",
  "googleapis.com",
  "w3.org",
  "schema.org",
  "wordpress.org",
  "gravatar.com",
  "squarespace.com",
  "godaddy.com",
  "cloudflare.com",
];

async function scrapeEmailsFromUrl(url: string): Promise<string | null> {
  try {
    const base = url.replace(/\/+$/, "");
    const urls = [base, `${base}/contact`, `${base}/contact-us`];
    for (const pageUrl of urls) {
      try {
        const res = await fetch(pageUrl, {
          signal: AbortSignal.timeout(5000),
          headers: {
            "User-Agent":
              "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
          },
        });
        if (!res.ok) continue;
        const html = await res.text();
        const matches = html.match(EMAIL_REGEX);
        if (!matches) continue;
        const valid = matches.filter(
          (email) =>
            !JUNK_DOMAINS.some((junk) => email.toLowerCase().endsWith(`@${junk}`))
        );
        if (valid.length > 0) return valid[0];
      } catch {
        continue;
      }
    }
    return null;
  } catch {
    return null;
  }
}

export async function GET(req: Request) {
  try {
    // Verify cron secret when set; skip auth in development or if not configured
    const cronSecret = process.env.CRON_SECRET;
    if (cronSecret) {
      const authHeader = req.headers.get("authorization");
      if (authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY not configured" },
        { status: 500 }
      );
    }

    if (!process.env.SUPABASE_SECRET_KEY) {
      return NextResponse.json(
        { error: "Supabase not configured" },
        { status: 500 }
      );
    }

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    // --- Phase 1: Business Discovery ---
    const discoveryResponse = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      tools: [{ type: "web_search_20250305", name: "web_search", max_uses: 20 }],
      messages: [
        {
          role: "user",
          content: `You are a lead generation assistant for Porada LLC, a web development and software engineering company.

Search the web for 2 local businesses in Pennsylvania, New Jersey, or New York that appear to need a new or better website. Look for businesses that:
- Have no website at all
- Have an outdated or poorly designed website
- Have a website that is not mobile-friendly
- Are small/local businesses that could benefit from a modern web presence

For each business, find:
1. Business Name
2. Phone Number (if publicly available, otherwise null)
3. Current Website URL (if they have one, otherwise null)
4. A brief summary (2-3 sentences) of what the business does and why they could benefit from web development services

IMPORTANT: Do NOT spend searches looking for contact emails. Focus entirely on finding good business candidates and their website URLs. Emails will be researched separately.

Return your findings as a JSON array with exactly this structure (no markdown, no code fences, just raw JSON):
[
  {
    "business_name": "Example Business",
    "phone": "(201) 555-1234",
    "current_website": "http://example.com",
    "summary": "A local plumbing company serving Fair Lawn and surrounding areas. Their current website appears outdated with no mobile responsiveness and could benefit from a modern redesign."
  }
]

Return ONLY the JSON array, nothing else.`,
        },
      ],
    });

    // Extract phase 1 text response
    let discoveryText = "";
    for (const block of discoveryResponse.content) {
      if (block.type === "text") {
        discoveryText += block.text;
      }
    }

    const discoveryMatch = discoveryText.match(/\[[\s\S]*\]/);
    if (!discoveryMatch) {
      console.error("Failed to parse business discovery JSON:", discoveryText);
      return NextResponse.json(
        { error: "Failed to parse businesses from AI response" },
        { status: 500 }
      );
    }

    const businesses = JSON.parse(discoveryMatch[0]) as Array<{
      business_name: string;
      phone: string | null;
      current_website: string | null;
      summary: string;
    }>;

    // --- Phase 1.5: Direct Website Scraping ---
    const scrapedEmails = new Map<string, string>();
    const scrapeResults = await Promise.allSettled(
      businesses
        .filter((b) => b.current_website)
        .map(async (b) => {
          const email = await scrapeEmailsFromUrl(b.current_website!);
          return { business_name: b.business_name, email };
        })
    );
    for (const result of scrapeResults) {
      if (result.status === "fulfilled" && result.value.email) {
        scrapedEmails.set(result.value.business_name, result.value.email);
      }
    }

    // --- Phase 2: Dedicated Email Search (only for businesses without scraped emails) ---
    const needsEmailSearch = businesses.filter(
      (b) => !scrapedEmails.has(b.business_name)
    );

    const emailMap = new Map<string, string | null>();

    if (needsEmailSearch.length > 0) {
      const businessList = needsEmailSearch
        .map(
          (b, i) =>
            `${i + 1}. "${b.business_name}" - Website: ${b.current_website ?? "none"} - Phone: ${b.phone ?? "unknown"}`
        )
        .join("\n");

      const emailResponse = await client.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4096,
        tools: [{ type: "web_search_20250305", name: "web_search", max_uses: 30 }],
        messages: [
          {
            role: "user",
            content: `You are an email research assistant. Your ONLY job is to find contact email addresses for the businesses listed below.

BUSINESSES TO RESEARCH:
${businessList}

For EACH business, try these search strategies in order until you find an email:
1. If they have a website: search for their contact page (e.g., "[domain]/contact" or "[business name] contact email")
2. Search "[business name] Fair Lawn NJ email" or "[business name] Fair Lawn NJ contact"
3. Look for their Yelp, BBB (Better Business Bureau), or Facebook business page which often lists emails
4. Check their Google Maps / Google Business listing
5. LAST RESORT: If you found their website domain but could not find an email anywhere, suggest the most common pattern (info@domain.com) and set email_source to "pattern_guess"

Return a JSON array with exactly this structure (no markdown, no code fences, just raw JSON):
[
  {
    "business_name": "Exact Business Name From Above",
    "contact_email": "found@email.com",
    "email_source": "website"
  }
]

email_source must be one of: "website", "yelp", "bbb", "facebook", "google_maps", "pattern_guess", "not_found"
If no email was found and no domain exists to guess from, set contact_email to null and email_source to "not_found".

Return ONLY the JSON array, nothing else.`,
          },
        ],
      });

      // Extract phase 2 text response
      let emailText = "";
      for (const block of emailResponse.content) {
        if (block.type === "text") {
          emailText += block.text;
        }
      }

      const emailMatch = emailText.match(/\[[\s\S]*\]/);
      if (emailMatch) {
        const emailResults = JSON.parse(emailMatch[0]) as Array<{
          business_name: string;
          contact_email: string | null;
          email_source: string;
        }>;
        for (const result of emailResults) {
          emailMap.set(result.business_name, result.contact_email);
        }
      } else {
        console.error("Failed to parse email search JSON:", emailText);
      }
    }

    // --- Phase 3: Merge and Store ---
    // Scraped emails take priority, then Claude search results
    const leads = businesses.map((b) => ({
      ...b,
      contact_email:
        scrapedEmails.get(b.business_name) ??
        emailMap.get(b.business_name) ??
        null,
    }));

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
