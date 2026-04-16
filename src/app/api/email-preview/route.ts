import { NextResponse } from "next/server";
import { wrapEmailTemplate, formatEmailBody } from "@/lib/email-template";

const samplePitch = `Hi there,

I came across Example Business while looking at local companies in the area. I noticed your current site takes a while to load and isn't fully mobile-friendly, which could be turning away potential customers.

We're Sierra-117, a small web dev team based in the Tri-State area. We build fast, modern websites for local businesses.

We'd be happy to review your site and tell you what's slowing it down. Free, no strings.

If that sounds useful, just reply to this email or book a call at sierra-117.dev/book.

The Sierra-117 Team`;

const sampleBooking = `
  <h1 style="font-family: 'Courier New', monospace; font-size: 24px; font-weight: bold; color: #22d3ee; margin: 0 0 16px 0;">Consultation Confirmed</h1>
  <p style="margin: 8px 0; line-height: 1.6; font-size: 14px; color: #cbd5e1;">Hey John,</p>
  <p style="margin: 8px 0; line-height: 1.6; font-size: 14px; color: #cbd5e1;">Your consultation has been booked. Here are the details:</p>
  <div style="background: #161e27; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 3px solid #22d3ee;">
    <p style="margin: 6px 0; font-size: 14px; color: #cbd5e1;"><strong style="color: #dce4ec;">Service:</strong> Web Development Consultation</p>
    <p style="margin: 6px 0; font-size: 14px; color: #cbd5e1;"><strong style="color: #dce4ec;">Date:</strong> April 20, 2026</p>
    <p style="margin: 6px 0; font-size: 14px; color: #cbd5e1;"><strong style="color: #dce4ec;">Time:</strong> 10:00 AM EST</p>
  </div>
  <p style="margin: 8px 0; line-height: 1.6; font-size: 14px; color: #cbd5e1;">We'll send you a meeting link before your scheduled time.</p>
`;

export async function GET(req: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available" }, { status: 404 });
  }

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") ?? "pitch";

  const html =
    type === "booking"
      ? wrapEmailTemplate(sampleBooking)
      : wrapEmailTemplate(formatEmailBody(samplePitch));

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
