import type { Metadata } from "next";
import { GiftCards } from "@/components/demo/giftcards/GiftCards";

export const metadata: Metadata = {
  title: "Gift cards — Lantern & Lock Escape Co.",
  description: "Give an hour they'll talk about for years. Redeemable on any room, and they never expire.",
  robots: { index: false, follow: false },
};

export default function GiftCardsPage() {
  return <GiftCards />;
}
