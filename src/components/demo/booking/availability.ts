/**
 * Fake, in-memory availability for the demo booking flow.
 * Deterministic (seeded by date + room) so the same day always shows the same slots —
 * no backend, no randomness drift between renders.
 */
import type { RoomSlug } from "../venue";

const ALL_TIMES = [
  "10:30am",
  "12:00pm",
  "1:30pm",
  "3:00pm",
  "4:30pm",
  "6:00pm",
  "7:30pm",
  "9:00pm",
];

function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export function dateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}

export function isPast(d: Date, today: Date): boolean {
  const a = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const b = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  return a < b;
}

/** A whole day is "sold out" roughly 1 in 7 — keeps the calendar feeling real. */
export function isDaySoldOut(d: Date, room: RoomSlug): boolean {
  return hash(`${dateKey(d)}|${room}|day`) % 7 === 0;
}

export interface Slot {
  time: string;
  available: boolean;
}

/** Returns the bookable times for a given date+room; some are marked sold out. */
export function slotsFor(d: Date, room: RoomSlug): Slot[] {
  if (isDaySoldOut(d, room)) return ALL_TIMES.map((time) => ({ time, available: false }));
  return ALL_TIMES.map((time) => {
    const taken = hash(`${dateKey(d)}|${room}|${time}`) % 3 === 0;
    return { time, available: !taken };
  });
}

export function hasAvailability(d: Date, room: RoomSlug, today: Date): boolean {
  if (isPast(d, today)) return false;
  if (isDaySoldOut(d, room)) return false;
  return slotsFor(d, room).some((s) => s.available);
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
export const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function monthLabel(year: number, month: number): string {
  return `${MONTHS[month]} ${year}`;
}

/** Calendar grid (leading blanks + days) for a given month. */
export function monthGrid(year: number, month: number): (Date | null)[] {
  const first = new Date(year, month, 1);
  const startPad = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (Date | null)[] = [];
  for (let i = 0; i < startPad; i++) cells.push(null);
  for (let day = 1; day <= daysInMonth; day++) cells.push(new Date(year, month, day));
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export function prettyDate(d: Date): string {
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}
