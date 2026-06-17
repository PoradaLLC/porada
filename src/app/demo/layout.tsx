import type { Metadata } from "next";
import "./demo.css";
import { AccountProvider } from "@/components/demo/account/AccountProvider";
import { BookingProvider } from "@/components/demo/booking/BookingProvider";
import { SiteNav } from "@/components/demo/SiteNav";
import { SiteFooter } from "@/components/demo/SiteFooter";
import { PoradaRibbon } from "@/components/demo/PoradaRibbon";

export const metadata: Metadata = {
  title: "Lantern & Lock Escape Co. — Four doors. Sixty minutes. One way out.",
  description:
    "Four hand-built private escape rooms in Harbor City's Old Mill District. Book online in under a minute. A fictional venue built to demonstrate a polished escape-room website.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/demo" },
  openGraph: {
    type: "website",
    url: "/demo",
    title: "Lantern & Lock Escape Co. — a Porada demo",
    description:
      "A polished, fully interactive escape-room website demo — booking, room pages, leaderboard, and gift cards. Built by Porada Solutions.",
  },
};

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="demo-root">
      <AccountProvider>
        <BookingProvider>
          <div className="demo-bg min-h-screen flex flex-col">
            <SiteNav />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </div>
          <PoradaRibbon />
        </BookingProvider>
      </AccountProvider>
    </div>
  );
}
