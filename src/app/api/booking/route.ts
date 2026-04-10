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
          subject: "Consultation Confirmed — Sierra-117",
          html: `
            <div style="font-family: monospace; background: #0a0f0a; color: #e0e8e0; padding: 40px;">
              <h1 style="color: #00ff41;">Consultation Confirmed</h1>
              <p>Hey ${data.name},</p>
              <p>Your consultation has been booked. Here are the details:</p>
              <div style="background: #141f14; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 3px solid #00ff41;">
                <p><strong>Service:</strong> ${data.service}</p>
                <p><strong>Date:</strong> ${data.date}</p>
                <p><strong>Time:</strong> ${data.time} EST</p>
              </div>
              <p>We'll send you a meeting link before your scheduled time.</p>
              <p style="color: #8b9a8b;">— Sierra-117 Team</p>
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
