import { NextResponse } from "next/server";
import { ContactSchema } from "@/lib/validators";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = ContactSchema.parse(body);

    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SECRET_KEY) {
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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
