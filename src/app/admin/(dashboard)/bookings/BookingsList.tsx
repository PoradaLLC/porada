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

  if (bookings.length === 0) {
    return (
      <div
        className="admin-panel"
        style={{ textAlign: "center", padding: "60px 24px", color: "var(--ink-soft)" }}
      >
        No bookings yet.
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {bookings.map((booking) => {
        const badgeKind =
          booking.status === "confirmed" ? "ok" : booking.status === "cancelled" ? "danger" : "warn";
        return (
          <div
            key={booking.id}
            className="admin-panel"
            style={{ marginTop: 0, padding: 22 }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-between",
                gap: 16,
                alignItems: "flex-start",
              }}
            >
              <div style={{ flex: 1, minWidth: 240 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <h3
                    style={{
                      fontFamily: "var(--font-display-family)",
                      fontSize: 20,
                      letterSpacing: "-0.015em",
                      color: "var(--ink)",
                      fontWeight: 400,
                    }}
                  >
                    {booking.name}
                  </h3>
                  <span className={`admin-badge ${badgeKind}`}>{booking.status}</span>
                </div>
                <dl
                  style={{
                    display: "grid",
                    gridTemplateColumns: "auto 1fr",
                    gap: "6px 14px",
                    fontFamily: "var(--font-mono-family)",
                    fontSize: 12,
                    color: "var(--ink-soft)",
                    margin: 0,
                  }}
                >
                  <dt style={{ color: "var(--ink-faint)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    Email
                  </dt>
                  <dd style={{ margin: 0 }}>{booking.email}</dd>
                  <dt style={{ color: "var(--ink-faint)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    Service
                  </dt>
                  <dd style={{ margin: 0 }}>{booking.service}</dd>
                  <dt style={{ color: "var(--ink-faint)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    When
                  </dt>
                  <dd style={{ margin: 0 }}>
                    {booking.date} at {booking.time}
                  </dd>
                  {booking.message && (
                    <>
                      <dt style={{ color: "var(--ink-faint)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                        Note
                      </dt>
                      <dd style={{ margin: 0 }}>{booking.message}</dd>
                    </>
                  )}
                </dl>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {booking.status === "pending" && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleConfirm(booking.id)}
                      className="admin-btn admin-btn-ghost"
                      title="Confirm"
                      style={{ padding: "8px 10px" }}
                    >
                      <Check aria-hidden="true" style={{ width: 14, height: 14 }} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCancel(booking.id)}
                      className="admin-btn admin-btn-danger"
                      title="Cancel"
                      style={{ padding: "8px 10px" }}
                    >
                      <X aria-hidden="true" style={{ width: 14, height: 14 }} />
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => handleDelete(booking.id)}
                  className="admin-btn admin-btn-ghost"
                  title="Delete"
                  style={{ padding: "8px 10px" }}
                >
                  <Trash2 aria-hidden="true" style={{ width: 14, height: 14 }} />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
