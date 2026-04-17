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
    <div className="admin-page">
      <header className="admin-page-head">
        <div>
          <h1>Bookings</h1>
          <div className="sub">§ consultation schedule · {bookings.length} total</div>
        </div>
      </header>
      <BookingsList bookings={bookings} />
    </div>
  );
}
