import type { Metadata } from "next";
import { AccountView } from "@/components/demo/account/AccountView";

export const metadata: Metadata = {
  title: "Your account — Lantern & Lock Escape Co.",
  description: "Your completionist passport, best times, and gift-card balance at Lantern & Lock.",
  robots: { index: false, follow: false },
};

export default function AccountPage() {
  return <AccountView />;
}
