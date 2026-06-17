"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, User, X } from "lucide-react";
import { navLinks, venue } from "./venue";
import { useBooking } from "./booking/BookingProvider";
import { useAccount } from "./account/AccountProvider";

export function SiteNav() {
  const { openBooking } = useBooking();
  const { user, openSignIn } = useAccount();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="sticky top-0 z-50 transition-colors"
      style={{
        background: scrolled ? "rgba(11,13,18,0.82)" : "transparent",
        backdropFilter: scrolled ? "blur(10px)" : "none",
        borderBottom: scrolled ? "1px solid var(--line)" : "1px solid transparent",
      }}
    >
      <nav className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <Link
          href="/demo"
          data-tour="nav-home"
          className="flex items-center gap-2 font-display text-lg shrink-0"
          style={{ color: "var(--parchment)" }}
        >
          <span
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-base"
            style={{ background: "var(--accent-soft)", border: "1px solid var(--brass)" }}
          >
            🔑
          </span>
          {venue.name}
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              data-tour={l.tour}
              className="text-sm transition-colors"
              style={{ color: "var(--muted)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--brass-bright)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {user ? (
            <Link
              href="/demo/account"
              data-tour="nav-account"
              className="hidden sm:inline-flex demo-btn demo-btn-ghost px-3 py-2 text-sm"
            >
              <User size={15} /> {user.name.split(" ")[0]}
            </Link>
          ) : (
            <button
              onClick={openSignIn}
              data-tour="nav-signin"
              className="hidden sm:inline-flex demo-btn demo-btn-ghost px-3 py-2 text-sm"
            >
              <User size={15} /> Sign in
            </button>
          )}
          <button
            onClick={() => openBooking(null)}
            data-tour="nav-book"
            className="demo-btn demo-btn-primary px-4 py-2 text-sm"
          >
            Book now
          </button>
          <button
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
            className="md:hidden demo-btn demo-btn-ghost h-9 w-9 !p-0 rounded-lg"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {open && (
        <div
          className="md:hidden px-4 pb-4 pt-1"
          style={{ background: "rgba(11,13,18,0.95)", borderBottom: "1px solid var(--line)" }}
        >
          <div className="grid gap-1">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="py-2.5 px-2 rounded-lg text-sm"
                style={{ color: "var(--parchment)" }}
              >
                {l.label}
              </Link>
            ))}
            {user ? (
              <Link
                href="/demo/account"
                onClick={() => setOpen(false)}
                className="py-2.5 px-2 rounded-lg text-sm inline-flex items-center gap-2"
                style={{ color: "var(--parchment)" }}
              >
                <User size={15} /> {user.name.split(" ")[0]}&apos;s account
              </Link>
            ) : (
              <button
                onClick={() => {
                  setOpen(false);
                  openSignIn();
                }}
                className="py-2.5 px-2 rounded-lg text-sm inline-flex items-center gap-2 text-left"
                style={{ color: "var(--parchment)" }}
              >
                <User size={15} /> Sign in
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
