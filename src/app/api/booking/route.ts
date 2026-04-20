import { NextResponse } from "next/server";
import { BookingSchema } from "@/lib/validators";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = BookingSchema.parse(body);

    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SECRET_KEY) {
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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
