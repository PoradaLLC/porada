import Link from "next/link";
import { ArrowRight, Clock, Mail, MapPin, Phone, Sparkles } from "lucide-react";
import { rooms, venue } from "./venue";
import { EmailCapture } from "./EmailCapture";
import { PhotoSlot } from "./bits";

export function SiteFooter() {
  return (
    <footer
      className="mt-24 border-t"
      style={{ borderColor: "var(--line)", background: "var(--ink-800)" }}
    >
      {/* Email capture + map */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 grid gap-10 lg:grid-cols-2 items-center border-b" style={{ borderColor: "var(--line)" }}>
        <EmailCapture />
        <PhotoSlot
          label="Your location map here"
          hint={`${venue.address.line1}, ${venue.address.city}`}
          iconSize={20}
          className="aspect-[16/7] rounded-2xl"
        />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-14 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-1">
          <div className="flex items-center gap-2 font-display text-lg" style={{ color: "var(--parchment)" }}>
            <span
              className="inline-flex h-8 w-8 items-center justify-center rounded-md"
              style={{ background: "var(--glow)", border: "1px solid var(--brass)" }}
            >
              🔑
            </span>
            {venue.fullName}
          </div>
          <p className="mt-3 text-sm" style={{ color: "var(--muted)" }}>
            {venue.tagline}
          </p>
          <Link href="/escape-rooms#preview" className="demo-footer-porada mt-4">
            <Sparkles size={13} strokeWidth={1.75} aria-hidden />
            This is a Porada demo — get a site like this for your venue
            <ArrowRight size={13} strokeWidth={2} aria-hidden />
          </Link>
          <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1 text-sm" style={{ color: "var(--muted)" }}>
            <a
              href={`https://instagram.com/${venue.social.instagram.replace(/^@/, "")}`}
              target="_blank"
              rel="noreferrer noopener"
              className="demo-social-link"
            >
              {venue.social.instagram}
            </a>
            <span aria-hidden>·</span>
            <a
              href={`https://facebook.com${venue.social.facebook}`}
              target="_blank"
              rel="noreferrer noopener"
              className="demo-social-link"
            >
              {venue.social.facebook}
            </a>
            <span aria-hidden>·</span>
            <a
              href={`https://tiktok.com/${venue.social.tiktok.startsWith("@") ? venue.social.tiktok : "@" + venue.social.tiktok}`}
              target="_blank"
              rel="noreferrer noopener"
              className="demo-social-link"
            >
              {venue.social.tiktok} (TikTok)
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--brass)" }}>
            Rooms
          </h4>
          <ul className="grid gap-2 text-sm">
            {rooms.map((r) => (
              <li key={r.slug}>
                <Link href={`/demo/rooms/${r.slug}`} style={{ color: "var(--muted)" }}>
                  {r.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--brass)" }}>
            Explore
          </h4>
          <ul className="grid gap-2 text-sm" style={{ color: "var(--muted)" }}>
            <li>
              <Link href="/demo/leaderboard" style={{ color: "var(--muted)" }}>
                Leaderboard
              </Link>
            </li>
            <li>
              <Link href="/demo/gift-cards" style={{ color: "var(--muted)" }}>
                Gift cards
              </Link>
            </li>
            <li>
              <Link href="/demo#faq" style={{ color: "var(--muted)" }}>
                FAQ
              </Link>
            </li>
            <li>
              <Link href="/demo#groups" style={{ color: "var(--muted)" }}>
                Groups &amp; events
              </Link>
            </li>
            <li>
              <Link href="/demo/account" style={{ color: "var(--muted)" }}>
                My account
              </Link>
            </li>
            <li>
              <Link href="/demo/policies" style={{ color: "var(--muted)" }}>
                Policies &amp; waiver
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--brass)" }}>
            Visit
          </h4>
          <ul className="grid gap-3 text-sm" style={{ color: "var(--muted)" }}>
            <li className="flex gap-2">
              <MapPin size={16} className="shrink-0 mt-0.5" style={{ color: "var(--brass)" }} />
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(
                  `${venue.address.line1}, ${venue.address.city}, ${venue.address.region} ${venue.address.zip}`,
                )}`}
                target="_blank"
                rel="noreferrer noopener"
                className="demo-social-link"
              >
                {venue.address.line1}, {venue.address.line2}
                <br />
                {venue.address.city}, {venue.address.region} {venue.address.zip}
              </a>
            </li>
            <li className="flex gap-2 items-center">
              <Phone size={16} style={{ color: "var(--brass)" }} />
              <a href={`tel:${venue.phone.replace(/[^\d+]/g, "")}`} className="demo-social-link">
                {venue.phone}
              </a>
            </li>
            <li className="flex gap-2 items-center">
              <Mail size={16} style={{ color: "var(--brass)" }} />
              <a href={`mailto:${venue.email}`} className="demo-social-link">
                {venue.email}
              </a>
            </li>
            <li className="pt-2 grid gap-1.5">
              {venue.hours.map((h) => (
                <span key={h.days} className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2">
                    <Clock size={13} style={{ color: "var(--brass)" }} />
                    {h.days}
                  </span>
                  <span style={{ color: "var(--parchment)" }}>{h.time}</span>
                </span>
              ))}
            </li>
          </ul>
        </div>
      </div>

      <div
        className="border-t py-5 text-center text-xs"
        style={{ borderColor: "var(--line)", color: "var(--muted-2)" }}
      >
        © 2026 {venue.fullName} · A fictional venue{" "}
        <Link href="/escape-rooms#preview" className="demo-social-link" style={{ color: "var(--brass)" }}>
          built for demonstration by Porada
        </Link>{" "}
        · Private games only
      </div>
    </footer>
  );
}
