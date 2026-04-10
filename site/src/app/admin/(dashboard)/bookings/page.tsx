import { BookingsList } from "./BookingsList";

interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  service: string;
  date: string;
  time: string;
  message: string | null;
  status: string;
  created_at: string;
}

async function getBookings(): Promise<Booking[]> {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return [];
  try {
    const { createServiceClient } = await import("@/lib/supabase/server");
    const supabase = await createServiceClient();
    const { data } = await supabase
      .from("bookings")
      .select("*")
      .order("date", { ascending: true });
    return (data ?? []) as Booking[];
  } catch {
    return [];
  }
}

export default async function BookingsPage() {
  const bookings = await getBookings();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-mono text-2xl font-bold text-white">Bookings</h1>
        <p className="mt-1 font-mono text-sm text-white/40">
          &gt; consultation schedule
        </p>
      </div>
      <BookingsList bookings={bookings} />
    </div>
  );
}
