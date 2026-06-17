import Link from "next/link";
import { ArrowRight, Clock, Users } from "lucide-react";
import type { Room } from "./venue";
import { PhotoSlot, RoomMeters } from "./bits";
import { BookButton } from "./BookButton";

/**
 * Room card — adopts the Escaparium card anatomy (structure only, original look/copy):
 * image slot · title · runtime | player range · teaser · three meters · dual CTA.
 */
export function RoomCard({ room }: { room: Room }) {
  return (
    <div
      className="demo-card overflow-hidden flex flex-col group transition-transform hover:-translate-y-1"
      style={{ ["--accent" as string]: room.accent, ["--accent-soft" as string]: room.accentSoft }}
      data-tour={`room-card-${room.slug}`}
    >
      <Link href={`/demo/rooms/${room.slug}`} className="block">
        <PhotoSlot label="Your room photo" hint={room.name} className="aspect-[4/3] rounded-none" />
      </Link>

      <div className="p-5 flex flex-col flex-1">
        <Link href={`/demo/rooms/${room.slug}`}>
          <h3 className="font-display text-xl leading-snug" style={{ color: "var(--parchment)" }}>
            {room.name}
          </h3>
        </Link>

        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs" style={{ color: "var(--muted)" }}>
          <span className="inline-flex items-center gap-1.5">
            <Clock size={13} style={{ color: "var(--brass)" }} /> {room.durationMin} min
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Users size={13} style={{ color: "var(--brass)" }} /> {room.players.min}–{room.players.max} players
          </span>
        </div>

        <p className="mt-3 text-sm flex-1" style={{ color: "var(--muted)" }}>
          {room.tagline}
        </p>

        <div className="mt-4 pt-4 border-t" style={{ borderColor: "var(--line)" }}>
          <RoomMeters room={room} />
        </div>

        <div className="mt-5 flex items-center gap-2">
          <BookButton
            room={room.slug}
            className="px-4 py-2 text-sm flex-1"
            tour={`book-card-${room.slug}`}
          >
            Book
          </BookButton>
          <Link
            href={`/demo/rooms/${room.slug}`}
            className="demo-btn demo-btn-ghost px-3 py-2 text-sm"
            aria-label={`Learn more about ${room.name}`}
            data-tour={`learn-${room.slug}`}
          >
            Learn more
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
}
