import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getRoom, rooms } from "@/components/demo/venue";
import { RoomDetail } from "@/components/demo/RoomDetail";

export function generateStaticParams() {
  return rooms.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const room = getRoom(slug);
  if (!room) return { title: "Room not found — Lantern & Lock" };
  return {
    title: `${room.name} — Lantern & Lock Escape Co.`,
    description: room.tagline,
    robots: { index: false, follow: false },
  };
}

export default async function RoomPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const room = getRoom(slug);
  if (!room) notFound();
  return <RoomDetail room={room} />;
}
