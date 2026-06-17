import type { Metadata } from "next";
import { Leaderboard } from "@/components/demo/leaderboard/Leaderboard";

export const metadata: Metadata = {
  title: "Wall of Fame — Lantern & Lock Escape Co.",
  description: "The fastest crews to beat each room at Lantern & Lock. Log your run and climb.",
  robots: { index: false, follow: false },
};

export default function LeaderboardPage() {
  return <Leaderboard />;
}
