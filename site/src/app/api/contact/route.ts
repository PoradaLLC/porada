import { NextResponse } from "next/server";
import { ContactSchema } from "@/lib/validators";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = ContactSchema.parse(body);

    // Store in Supabase if configured
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const { createServiceClient } = await import("@/lib/supabase/server");
      const supabase = await createServiceClient();
      await supabase.from("contact_submissions").insert({
        name: data.name,
        email: data.email,
        phone: data.phone ?? null,
        subject: data.subject,
        message: data.message,
      });
    }

    // Send email via Resend if configured
    if (process.env.RESEND_API_KEY) {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);
      const from = process.env.RESEND_FROM_EMAIL ?? "noreply@sierra-117.dev";
      await resend.emails.send({
        from: `Sierra-117 <${from}>`,
        to: from,
        subject: `New Contact: ${data.subject} from ${data.name}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Phone:</strong> ${data.phone ?? "N/A"}</p>
          <p><strong>Company:</strong> ${data.company ?? "N/A"}</p>
          <p><strong>Subject:</strong> ${data.subject}</p>
          <p><strong>Message:</strong></p>
          <p>${data.message.replace(/\n/g, "<br>")}</p>
        `,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
