/**
 * Demo checkout pricing — the tax breakdown and promo codes for the booking flow.
 *
 * This is checkout CONFIG, deliberately kept out of the presentation layer (see
 * BookingFlow.tsx) and out of the venue CONTENT module (venue.ts). Nothing here
 * touches a real payment processor — it's pure arithmetic on in-memory numbers so
 * the live order summary can show a believable subtotal → tax → total breakdown.
 */

/** Two believable tax lines for an entertainment venue. Applied after any promo discount. */
export const TAX_LINES: { label: string; rate: number }[] = [
  { label: "State sales tax (6.5%)", rate: 0.065 },
  { label: "City amusement tax (2%)", rate: 0.02 },
];

/** Demo promo codes. LANTERN10 is the one advertised in the order summary hint. */
export const PROMO_CODES: Record<string, { off: number; label: string }> = {
  LANTERN10: { off: 0.1, label: "10% off — LANTERN10" },
};

export interface QuoteLine {
  label: string;
  amount: number;
}

export interface Quote {
  perPerson: number;
  players: number;
  subtotal: number;
  /** Dollars off (>= 0). */
  discount: number;
  discountLabel: string | null;
  taxes: QuoteLine[];
  taxTotal: number;
  total: number;
}

const round2 = (n: number) => Math.round(n * 100) / 100;

/** Normalize user-typed promo input for lookup (trim + uppercase). */
export function normalizePromo(input: string): string {
  return input.trim().toUpperCase();
}

export function isValidPromo(input: string): boolean {
  return normalizePromo(input) in PROMO_CODES;
}

/** Build the full price breakdown for a room at a given party size + optional promo. */
export function quote(perPerson: number, players: number, promo: string | null): Quote {
  const subtotal = round2(perPerson * players);
  const code = promo ? PROMO_CODES[normalizePromo(promo)] : undefined;
  const discount = code ? round2(subtotal * code.off) : 0;
  const taxable = subtotal - discount;
  const taxes = TAX_LINES.map((t) => ({
    label: t.label,
    amount: round2(taxable * t.rate),
  }));
  const taxTotal = round2(taxes.reduce((sum, t) => sum + t.amount, 0));
  const total = round2(taxable + taxTotal);
  return {
    perPerson,
    players,
    subtotal,
    discount,
    discountLabel: code ? code.label : null,
    taxes,
    taxTotal,
    total,
  };
}

/** Currency formatter for the demo (USD, always two decimals). */
export function money(n: number): string {
  return `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/** Deterministic, friendly confirmation code from the booking details (no randomness). */
export function confirmationCode(seed: string): string {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const n = Math.abs(h) % 1000000;
  return `LL-${String(n).padStart(6, "0")}`;
}
