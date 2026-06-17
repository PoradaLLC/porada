import type { Metadata } from "next";
import "./escape-room.css";

const SITE_URL = "https://poradasolutions.com";

export const metadata: Metadata = {
  title: "Escape-room websites that fill more slots — Porada Solutions",
  description:
    "A website built for escape rooms: on-brand embedded booking, a hosted leaderboard, gift cards, and local SEO — so more of the people who find you actually book. Free, hand-built preview of your venue. Don't pay until it's live.",
  alternates: { canonical: "/escape-rooms" },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/escape-rooms`,
    title: "Escape-room websites that fill more slots — Porada Solutions",
    description:
      "On-brand embedded booking, a hosted leaderboard, gift cards, and local SEO — a site that turns lookers into bookings. Free hand-built preview of your venue.",
  },
  // TODO: add a dedicated OG image for this landing page (see src/app/opengraph-image.tsx for the pattern).
};

export default function EscapeRoomLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="er-root">{children}</div>;
}
