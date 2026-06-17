"use client";

import type { ReactNode } from "react";
import { Ticket } from "lucide-react";
import { useBooking } from "./booking/BookingProvider";
import type { RoomSlug } from "./venue";

/**
 * Opens the on-brand, embedded booking flow (NOT a clashing third-party popup).
 * Pre-selects `room` when provided so the user never re-picks the room they're viewing.
 */
export function BookButton({
  room = null,
  children,
  variant = "primary",
  className = "",
  tour,
  withIcon = false,
}: {
  room?: RoomSlug | null;
  children: ReactNode;
  variant?: "primary" | "ghost";
  className?: string;
  tour?: string;
  withIcon?: boolean;
}) {
  const { openBooking } = useBooking();
  return (
    <button
      type="button"
      onClick={() => openBooking(room)}
      data-tour={tour}
      className={`demo-btn ${variant === "primary" ? "demo-btn-primary" : "demo-btn-ghost"} ${className}`}
    >
      {withIcon && <Ticket size={16} />}
      {children}
    </button>
  );
}
