"use client";

import { useState } from "react";
import { CheckCircle2, Gift, Infinity as InfinityIcon, Mail, Plug } from "lucide-react";
import { venue } from "../venue";
import { PhotoSlot } from "../bits";

export function GiftCards() {
  const { denominations } = venue.giftCard;
  const [amount, setAmount] = useState<number>(denominations[1]);
  const [to, setTo] = useState("");
  const [recipient, setRecipient] = useState("");
  const [sent, setSent] = useState<{ amount: number; to: string } | null>(null);

  function buy(e: React.FormEvent) {
    e.preventDefault();
    if (amount <= 0) return;
    setSent({ amount, to: recipient.trim() || "your recipient" });
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
      <div className="text-center">
        <Gift size={32} style={{ color: "var(--brass-bright)" }} className="mx-auto" />
        <h1 className="font-display text-3xl sm:text-4xl mt-3" style={{ color: "var(--parchment)" }}>
          {venue.giftCard.title}
        </h1>
        <p className="mt-2 text-sm max-w-xl mx-auto" style={{ color: "var(--muted)" }}>
          {venue.giftCard.body}
        </p>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2 items-start">
        {/* Card art + reassurances */}
        <div>
          <PhotoSlot
            label="Your gift-card art"
            hint={venue.giftCard.artHint}
            iconSize={24}
            className="aspect-[16/10] rounded-2xl"
          >
            <span
              className="absolute bottom-4 left-4 z-10 font-display text-lg"
              style={{ color: "var(--brass-bright)" }}
            >
              ${amount}
            </span>
          </PhotoSlot>
          <ul className="mt-5 grid gap-3 text-sm" style={{ color: "var(--muted)" }}>
            <li className="flex items-center gap-2.5">
              <InfinityIcon size={16} style={{ color: "var(--brass)" }} /> Never expires — use it whenever
            </li>
            <li className="flex items-center gap-2.5">
              <Mail size={16} style={{ color: "var(--brass)" }} /> Delivered by email in seconds
            </li>
            <li className="flex items-center gap-2.5">
              <CheckCircle2 size={16} style={{ color: "var(--brass)" }} /> Redeemable on any room, any group size
            </li>
          </ul>

          {/* Honest plug-in stand-in — same family as the booking flow's payment panel. */}
          <div className="demo-availability-note mt-5" data-tour="giftcard-plugin">
            <span className="demo-availability-badge">
              <Plug size={15} strokeWidth={1.5} aria-hidden />
            </span>
            <span className="demo-availability-text">
              <strong>Gift cards plug in here.</strong>
              This is an illustration of the purchase flow. On a live build, payment, the redeemable
              code, and email delivery run through your booking platform&apos;s gift-card module —
              nothing is charged or sent in this demo.
            </span>
          </div>
        </div>

        {/* Purchase form */}
        {sent ? (
          <div className="demo-card demo-pop p-8 text-center" data-tour="giftcard-done">
            <CheckCircle2 size={36} style={{ color: "var(--brass-bright)" }} className="mx-auto" />
            <h2 className="font-display text-2xl mt-3" style={{ color: "var(--parchment)" }}>
              Gift card on its way
            </h2>
            <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
              A <span style={{ color: "var(--brass-bright)" }}>${sent.amount}</span> gift card is headed to{" "}
              <span style={{ color: "var(--parchment)" }}>{sent.to}</span>. It never expires. (Demo — nothing was
              charged or sent.)
            </p>
            <button onClick={() => setSent(null)} className="demo-btn demo-btn-ghost px-5 py-2.5 mt-5 text-sm">
              Send another
            </button>
          </div>
        ) : (
          <form className="demo-card p-6" onSubmit={buy}>
            <h2 className="font-display text-xl" style={{ color: "var(--parchment)" }}>
              Choose an amount
            </h2>
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5" data-tour="giftcard-amount">
              {denominations.map((d) => {
                const active = d === amount;
                return (
                  <button
                    type="button"
                    key={d}
                    onClick={() => setAmount(d)}
                    className="demo-btn py-3 rounded-xl font-display text-lg"
                    style={{
                      background: active ? "var(--brass)" : "var(--surface-2)",
                      color: active ? "#221a06" : "var(--parchment)",
                      border: "1px solid var(--line)",
                    }}
                  >
                    ${d}
                  </button>
                );
              })}
            </div>

            <div className="mt-5 grid gap-3">
              <input
                className="demo-input"
                placeholder="Recipient name"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                aria-label="Recipient name"
              />
              <input
                type="email"
                className="demo-input"
                placeholder="Recipient email"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                aria-label="Recipient email"
              />
            </div>

            <button type="submit" className="demo-btn demo-btn-primary w-full py-3.5 mt-5" data-tour="giftcard-buy">
              <Gift size={16} /> Send ${amount} gift card
            </button>
            <p className="text-[0.7rem] text-center mt-2" style={{ color: "var(--muted-2)" }}>
              Demo only — no payment is taken.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
