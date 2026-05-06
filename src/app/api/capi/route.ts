import { NextResponse } from "next/server";
import { createHash } from "crypto";

const PIXEL_ID = "1456728696136491";
const CAPI_URL = `https://graph.facebook.com/v18.0/${PIXEL_ID}/events`;

function sha256(value: string) {
  return createHash("sha256").update(value.toLowerCase().trim()).digest("hex");
}

export async function POST(req: Request) {
  if (!process.env.META_CAPI_TOKEN) {
    return NextResponse.json({ error: "CAPI not configured" }, { status: 503 });
  }

  const { event_name, event_id, event_source_url, user_data } = await req.json();

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "";
  const ua = req.headers.get("user-agent") ?? "";

  const payload = {
    data: [
      {
        event_name,
        event_time: Math.floor(Date.now() / 1000),
        event_id,
        action_source: "website",
        event_source_url,
        user_data: {
          client_ip_address: ip,
          client_user_agent: ua,
          ...(user_data?.em ? { em: [sha256(user_data.em)] } : {}),
          ...(user_data?.fn ? { fn: [sha256(user_data.fn)] } : {}),
        },
      },
    ],
    access_token: process.env.META_CAPI_TOKEN,
  };

  const res = await fetch(CAPI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("CAPI error:", text);
    return NextResponse.json({ error: "CAPI request failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
