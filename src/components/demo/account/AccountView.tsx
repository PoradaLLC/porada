"use client";

import { CheckCircle2, Gift, KeyRound, LogOut, Lock, Plug, Trophy } from "lucide-react";
import { rooms } from "../venue";
import { BookButton } from "../BookButton";
import { useAccount } from "./AccountProvider";

export function AccountView() {
  const { user, openSignIn, signOut } = useAccount();

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 sm:px-6 py-20 text-center">
        <KeyRound size={32} style={{ color: "var(--brass-bright)" }} className="mx-auto" />
        <h1 className="font-display text-3xl mt-3" style={{ color: "var(--parchment)" }}>
          Your account
        </h1>
        <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
          Sign in to see your completionist passport, best times, and gift-card balance.
        </p>
        <button onClick={openSignIn} className="demo-btn demo-btn-primary px-6 py-3 mt-6" data-tour="account-signin">
          Sign in or join
        </button>
      </div>
    );
  }

  const stampByRoom = new Map(user.passport.map((p) => [p.room, p]));
  const clearedCount = user.passport.length;

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-wide" style={{ color: "var(--brass)" }}>
            Signed in
          </div>
          <h1 className="font-display text-3xl mt-1" style={{ color: "var(--parchment)" }}>
            Welcome back, {user.name.split(" ")[0]}
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
            {user.email}
          </p>
        </div>
        <button onClick={signOut} className="demo-btn demo-btn-ghost px-4 py-2 text-sm">
          <LogOut size={15} /> Sign out
        </button>
      </div>

      {/* Honest plug-in stand-in — same family as the booking flow's payment /
          availability panels. The passport, stats, and balance below are a sample
          account; a real loyalty system plugs in on a live build. */}
      <div className="demo-availability-note mt-6" data-tour="account-plugin">
        <span className="demo-availability-badge">
          <Plug size={15} strokeWidth={1.5} aria-hidden />
        </span>
        <span className="demo-availability-text">
          <strong>Your loyalty system plugs in here.</strong>
          This is a sample account — the passport, best times, and gift-card balance shown are
          illustrative, not real earned data. On a live build these tie to your own accounts and
          loyalty platform.
        </span>
      </div>

      {/* Quick stats */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="demo-card p-5">
          <Trophy size={20} style={{ color: "var(--brass)" }} />
          <div className="font-display text-2xl mt-2" style={{ color: "var(--parchment)" }}>
            {clearedCount} / {rooms.length}
          </div>
          <div className="text-xs" style={{ color: "var(--muted)" }}>
            rooms cleared
          </div>
        </div>
        <div className="demo-card p-5">
          <Gift size={20} style={{ color: "var(--brass)" }} />
          <div className="font-display text-2xl mt-2" style={{ color: "var(--parchment)" }}>
            ${user.giftBalance}
          </div>
          <div className="text-xs" style={{ color: "var(--muted)" }}>
            gift-card balance · never expires
          </div>
        </div>
        <div className="demo-card p-5">
          <CheckCircle2 size={20} style={{ color: "var(--brass)" }} />
          <div className="font-display text-2xl mt-2" style={{ color: "var(--parchment)" }}>
            {rooms.length - clearedCount}
          </div>
          <div className="text-xs" style={{ color: "var(--muted)" }}>
            rooms left to complete
          </div>
        </div>
      </div>

      {/* Completionist passport */}
      <h2 className="font-display text-2xl mt-10 mb-1" style={{ color: "var(--parchment)" }}>
        Your passport
      </h2>
      <p className="text-sm mb-5" style={{ color: "var(--muted)" }}>
        Clear all four rooms to complete your passport. Beat a room again to set a faster time.
      </p>
      <div className="grid gap-4 sm:grid-cols-2" data-tour="passport">
        {rooms.map((room) => {
          const stamp = stampByRoom.get(room.slug);
          const cleared = Boolean(stamp);
          return (
            <div
              key={room.slug}
              className="demo-card p-5 flex items-center gap-4"
              style={{ ["--accent" as string]: room.accent, ["--accent-soft" as string]: room.accentSoft }}
            >
              {/* Stamp / lock */}
              <div
                className="h-14 w-14 rounded-full flex items-center justify-center shrink-0"
                style={{
                  border: `2px ${cleared ? "solid" : "dashed"} ${cleared ? "var(--brass)" : "var(--line-strong)"}`,
                  background: cleared ? "var(--glow)" : "transparent",
                  color: cleared ? "var(--brass-bright)" : "var(--muted-2)",
                }}
              >
                {cleared ? <CheckCircle2 size={24} /> : <Lock size={20} />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-display text-lg" style={{ color: "var(--parchment)" }}>
                  {room.name}
                </div>
                {cleared ? (
                  <div className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
                    Cleared {stamp!.clearedOn} · best time{" "}
                    <span style={{ color: "var(--brass-bright)" }}>{stamp!.bestTime}</span>
                  </div>
                ) : (
                  <div className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
                    Not cleared yet — {room.escapeRate}% of teams make it out
                  </div>
                )}
              </div>
              <BookButton
                room={room.slug}
                variant={cleared ? "ghost" : "primary"}
                className="px-3.5 py-2 text-xs shrink-0"
              >
                {cleared ? "Replay" : "Book"}
              </BookButton>
            </div>
          );
        })}
      </div>
    </div>
  );
}
