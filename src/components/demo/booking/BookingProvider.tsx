"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { RoomSlug } from "../venue";
import { BookingFlow } from "./BookingFlow";

interface BookingContextValue {
  open: boolean;
  /** Pre-select a room (e.g. from a room card or detail page), or null to start at room choice. */
  openBooking: (room?: RoomSlug | null) => void;
  closeBooking: () => void;
  initialRoom: RoomSlug | null;
}

const BookingContext = createContext<BookingContextValue | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [initialRoom, setInitialRoom] = useState<RoomSlug | null>(null);

  const openBooking = useCallback((room: RoomSlug | null = null) => {
    setInitialRoom(room);
    setOpen(true);
  }, []);

  const closeBooking = useCallback(() => setOpen(false), []);

  const value = useMemo(
    () => ({ open, openBooking, closeBooking, initialRoom }),
    [open, openBooking, closeBooking, initialRoom],
  );

  return (
    <BookingContext.Provider value={value}>
      {children}
      {open && <BookingFlow initialRoom={initialRoom} onClose={closeBooking} />}
    </BookingContext.Provider>
  );
}

export function useBooking(): BookingContextValue {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used within <BookingProvider>");
  return ctx;
}
