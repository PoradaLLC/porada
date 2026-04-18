import { NextResponse } from "next/server";
import { BookingSchema } from "@/lib/validators";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = BookingSchema.parse(body);

    // Store in Supabase if configured
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const { createServiceClient } = await import("@/lib/supabase/server");
      const supabase = await createServiceClient();
      await supabase.from("bookings").insert({
        name: data.name,
        email: data.email,
        phone: data.phone ?? null,
        company: data.company ?? null,
        service: data.service,
        date: data.date,
        time: data.time,
        message: data.message ?? null,
        status: "pending",
      });
    }

    // Send confirmation email via Resend if configured
    if (process.env.RESEND_API_KEY) {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);
      const from = process.env.RESEND_FROM_EMAIL ?? "noreply@sierra-117.dev";

      await Promise.allSettled([
        // Notify admin
        resend.emails.send({
          from: `Sierra-117 <${from}>`,
          to: from,
          subject: `New Booking: ${data.service} - ${data.name}`,
          html: `
            <h2>New Consultation Booking</h2>
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Service:</strong> ${data.service}</p>
            <p><strong>Date:</strong> ${data.date}</p>
            <p><strong>Time:</strong> ${data.time}</p>
            <p><strong>Message:</strong> ${data.message ?? "N/A"}</p>
          `,
        }),
        // Confirm to customer
        resend.emails.send({
          from: `Sierra-117 <${from}>`,
          to: data.email,
          subject: "Consultation confirmed | Sierra-117",
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; color: #1a1815; background: #f3efe7;">
              <h1 style="font-family: Georgia, serif; font-size: 28px; font-weight: 400; color: #1a1815; margin: 0 0 20px 0;">Consultation confirmed</h1>
              <p style="margin: 12px 0; line-height: 1.55; font-size: 15px;">Hey ${data.name},</p>
              <p style="margin: 12px 0; line-height: 1.55; font-size: 15px;">Your consultation has been booked. Here are the details:</p>
              <div style="background: #ede8dd; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 3px solid #c6623a;">
                <p style="margin: 6px 0; font-size: 14px;"><strong>Service:</strong> ${data.service}</p>
                <p style="margin: 6px 0; font-size: 14px;"><strong>Date:</strong> ${data.date}</p>
                <p style="margin: 6px 0; font-size: 14px;"><strong>Time:</strong> ${data.time} EST</p>
              </div>
              <p style="margin: 12px 0; line-height: 1.55; font-size: 15px;">We'll send you a meeting link before your scheduled time.</p>
              <p style="margin: 24px 0 0 0; font-size: 13px; color: #5a554c;">- The Sierra-117 team</p>
            </div>
          `,
        }),
      ]);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
