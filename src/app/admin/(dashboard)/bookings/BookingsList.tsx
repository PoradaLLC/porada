"use client";

import { Check, X, Trash2 } from "lucide-react";
import { updateBookingStatus, deleteBooking } from "@/app/admin/actions";

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

export function BookingsList({ bookings }: { bookings: Booking[] }) {
  async function handleConfirm(id: string) {
    await updateBookingStatus(id, "confirmed");
  }

  async function handleCancel(id: string) {
    await updateBookingStatus(id, "cancelled");
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this booking?")) return;
    await deleteBooking(id);
  }

  return (
    <div className="space-y-4">
      {bookings.length === 0 ? (
        <div className="rounded-xl border border-white/5 bg-white/5 p-12 text-center">
          <p className="font-mono text-sm text-white/20">No bookings yet.</p>
        </div>
      ) : (
        bookings.map((booking) => (
          <div
            key={booking.id}
            className="rounded-xl border border-white/5 bg-white/5 p-6 hover:bg-white/8 transition-colors"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-mono text-sm font-bold text-white">{booking.name}</h3>
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 font-mono text-[10px] ${
                      booking.status === "confirmed"
                        ? "bg-brand-accent/10 text-brand-accent"
                        : booking.status === "cancelled"
                          ? "bg-red-500/10 text-red-400"
                          : "bg-yellow-500/10 text-yellow-400"
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>
                <div className="grid gap-1 font-mono text-xs text-white/40">
                  <p>
                    <span className="text-white/20">email:</span> {booking.email}
                  </p>
                  <p>
                    <span className="text-white/20">service:</span> {booking.service}
                  </p>
                  <p>
                    <span className="text-white/20">date:</span> {booking.date} at {booking.time}
                  </p>
                  {booking.message && (
                    <p>
                      <span className="text-white/20">note:</span> {booking.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {booking.status === "pending" && (
                  <>
                    <button
                      onClick={() => handleConfirm(booking.id)}
                      className="rounded-lg border border-brand-accent/20 bg-brand-accent/10 p-2 text-brand-accent hover:bg-brand-accent/20 transition-colors"
                      title="Confirm"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleCancel(booking.id)}
                      className="rounded-lg border border-red-500/20 bg-red-500/10 p-2 text-red-400 hover:bg-red-500/20 transition-colors"
                      title="Cancel"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </>
                )}
                <button
                  onClick={() => handleDelete(booking.id)}
                  className="rounded-lg border border-white/5 p-2 text-white/20 hover:text-red-400 hover:border-red-400/20 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
