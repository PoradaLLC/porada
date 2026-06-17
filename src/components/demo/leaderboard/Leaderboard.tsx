"use client";

import { useMemo, useRef, useState } from "react";
import { Crown, Medal, PartyPopper, Plug, Target, Timer, Trophy } from "lucide-react";
import {
  escapeClock,
  getRoom,
  leaderboardSeed,
  rooms,
  type LeaderboardRow,
  type RoomSlug,
} from "../venue";

interface Entry extends LeaderboardRow {
  id: string;
  mine?: boolean;
}

const seeded: Entry[] = leaderboardSeed.map((r, i) => ({ ...r, id: `seed-${i}` }));

function rankIcon(rank: number, size = 16) {
  if (rank === 1) return <Crown size={size} style={{ color: "#e4c078" }} />;
  if (rank === 2) return <Medal size={size} style={{ color: "#cbd2dc" }} />;
  if (rank === 3) return <Medal size={size} style={{ color: "#c8915a" }} />;
  return null;
}

const PODIUM_ORDER = [1, 0, 2]; // visual order: 2nd, 1st, 3rd

export function Leaderboard() {
  const [entries, setEntries] = useState<Entry[]>(seeded);
  const [roomFilter, setRoomFilter] = useState<RoomSlug>("the-vault");
  const [team, setTeam] = useState("");
  const [minutes, setMinutes] = useState("");
  const [seconds, setSeconds] = useState("");
  const [justPlaced, setJustPlaced] = useState<{ rank: number; total: number } | null>(null);
  const newRowRef = useRef<HTMLTableRowElement>(null);

  const ranked = useMemo(() => {
    return entries
      .filter((e) => e.room === roomFilter)
      .sort((a, b) => b.timeRemaining - a.timeRemaining);
  }, [entries, roomFilter]);

  const room = getRoom(roomFilter);
  const podium = ranked.slice(0, 3);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const m = parseInt(minutes || "0", 10);
    const s = parseInt(seconds || "0", 10);
    const used = m * 60 + s;
    const remaining = 60 * 60 - used;
    if (!team.trim() || used <= 0 || used >= 60 * 60 || s > 59) return;

    const id = `mine-${team}-${used}`;
    const next = entries
      .filter((x) => !x.mine) // only one "mine" highlighted at a time
      .concat({
        id,
        team: team.trim(),
        room: roomFilter,
        timeRemaining: remaining,
        date: "Just now",
        mine: true,
      });
    setEntries(next);

    const placedList = next
      .filter((x) => x.room === roomFilter)
      .sort((a, b) => b.timeRemaining - a.timeRemaining);
    const rank = placedList.findIndex((x) => x.id === id) + 1;
    setJustPlaced({ rank, total: placedList.length });

    setTeam("");
    setMinutes("");
    setSeconds("");
    requestAnimationFrame(() => {
      newRowRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  const roomName = room?.name ?? "";

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
      <div className="text-center">
        <Trophy size={32} style={{ color: "var(--brass-bright)" }} className="mx-auto" />
        <h1 className="font-display text-3xl sm:text-4xl mt-3" style={{ color: "var(--parchment)" }}>
          Wall of Fame
        </h1>
        <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
          The fastest crews to beat each room. Escape the clock and you&apos;ll join them.
        </p>
      </div>

      {/* Honest plug-in stand-in — same family as the booking flow's payment /
          availability panels. The seeded standings below are illustrative; a real
          board posts from the venue's game-master / scoring system on a live build. */}
      <div className="demo-availability-note mt-6 max-w-2xl mx-auto" data-tour="leaderboard-plugin">
        <span className="demo-availability-badge">
          <Plug size={15} strokeWidth={1.5} aria-hidden />
        </span>
        <span className="demo-availability-text">
          <strong>Live scores plug in here.</strong>
          These standings are sample data. On your live site, real escape times post from your
          game-master or timer system and submissions are moderated — nothing on this demo is saved.
        </span>
      </div>

      {/* Room filter */}
      <div className="mt-8 flex flex-wrap gap-2 justify-center" role="tablist">
        {rooms.map((r) => {
          const active = r.slug === roomFilter;
          return (
            <button
              key={r.slug}
              role="tab"
              aria-selected={active}
              onClick={() => {
                setRoomFilter(r.slug);
                setJustPlaced(null);
              }}
              data-tour={`leaderboard-tab-${r.slug}`}
              className="demo-btn px-3.5 py-2 text-sm rounded-full"
              style={{
                ["--accent" as string]: r.accent,
                ["--accent-soft" as string]: r.accentSoft,
                background: active ? "var(--brass)" : "var(--surface-2)",
                color: active ? "#221a06" : "var(--muted)",
                border: "1px solid var(--line)",
              }}
            >
              {r.name}
            </button>
          );
        })}
      </div>

      {/* Room context */}
      {room && (
        <div
          className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm"
          style={{
            ["--accent" as string]: room.accent,
            ["--accent-soft" as string]: room.accentSoft,
          }}
        >
          <span className="inline-flex items-center gap-2" style={{ color: "var(--muted)" }}>
            <Timer size={15} style={{ color: "var(--brass)" }} />
            House record{" "}
            <strong className="font-display" style={{ color: "var(--brass-bright)" }}>
              {room.bestTime}
            </strong>
          </span>
          <span className="inline-flex items-center gap-2" style={{ color: "var(--muted)" }}>
            <Target size={15} style={{ color: "var(--brass)" }} />
            Escape rate{" "}
            <strong style={{ color: "var(--parchment)" }}>{room.escapeRate}%</strong>
          </span>
          <span className="inline-flex items-center gap-2" style={{ color: "var(--muted)" }}>
            <Trophy size={15} style={{ color: "var(--brass)" }} />
            <strong style={{ color: "var(--parchment)" }}>{ranked.length}</strong> crews on the board
          </span>
        </div>
      )}

      {/* "You placed" banner */}
      {justPlaced && (
        <div
          className="demo-pop mt-6 demo-card p-4 flex items-center gap-3"
          style={{ borderColor: "var(--brass)" }}
        >
          <PartyPopper size={22} style={{ color: "var(--brass-bright)" }} className="shrink-0" />
          <div className="text-sm" style={{ color: "var(--parchment)" }}>
            You placed{" "}
            <span className="font-display text-base" style={{ color: "var(--brass-bright)" }}>
              #{justPlaced.rank}
            </span>{" "}
            of {justPlaced.total} on {roomName}.{" "}
            {justPlaced.rank <= 3 ? (
              <span>Podium finish — incredible run!</span>
            ) : (
              <span style={{ color: "var(--muted)" }}>Come back and climb the wall.</span>
            )}
          </div>
        </div>
      )}

      {/* Podium — top 3 */}
      {podium.length >= 3 && (
        <div
          className="mt-7 grid grid-cols-3 gap-2 sm:gap-3 items-end"
          style={{
            ["--accent" as string]: room?.accent,
            ["--accent-soft" as string]: room?.accentSoft,
          }}
        >
          {PODIUM_ORDER.map((idx) => {
            const row = podium[idx];
            const rank = idx + 1;
            return (
              <div
                key={row.id}
                className={`demo-card text-center px-2 py-4 ${row.mine ? "demo-flash" : ""}`}
                style={{
                  borderColor: rank === 1 ? "var(--brass)" : "var(--line)",
                  background:
                    rank === 1
                      ? "linear-gradient(180deg, var(--surface-2), var(--surface))"
                      : undefined,
                  transform: rank === 1 ? "translateY(-8px)" : undefined,
                }}
              >
                <div className="flex justify-center mb-1.5">{rankIcon(rank, rank === 1 ? 24 : 18)}</div>
                <div
                  className="font-display truncate px-1"
                  style={{ color: "var(--parchment)", fontSize: rank === 1 ? "1rem" : "0.88rem" }}
                >
                  {row.team}
                </div>
                {row.mine && (
                  <div className="text-[0.6rem] uppercase tracking-wide" style={{ color: "var(--brass)" }}>
                    you
                  </div>
                )}
                <div
                  className="font-display mt-1"
                  style={{ color: "var(--brass-bright)", fontSize: rank === 1 ? "1.4rem" : "1.1rem" }}
                >
                  {escapeClock(row.timeRemaining)}
                </div>
                <div className="text-[0.62rem] uppercase tracking-wide" style={{ color: "var(--muted-2)" }}>
                  {rank === 1 ? "Champions" : `#${rank}`}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Full standings */}
      <div className="demo-card mt-6 overflow-hidden">
        <div
          className="px-5 py-3 text-[0.7rem] uppercase tracking-wider border-b"
          style={{ color: "var(--muted)", borderColor: "var(--line)" }}
        >
          Full standings · {roomName}
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ color: "var(--muted)" }} className="text-left text-xs uppercase tracking-wide">
              <th className="py-3 pl-5 pr-2 font-semibold">#</th>
              <th className="py-3 px-2 font-semibold">Team</th>
              <th className="py-3 px-2 font-semibold text-right">Escape time</th>
              <th className="py-3 pl-2 pr-5 font-semibold text-right hidden sm:table-cell">When</th>
            </tr>
          </thead>
          <tbody>
            {ranked.map((row, i) => {
              const rank = i + 1;
              return (
                <tr
                  key={row.id}
                  ref={row.mine ? newRowRef : undefined}
                  className={`border-t ${row.mine ? "demo-flash" : ""}`}
                  style={{
                    borderColor: "var(--line)",
                    background: row.mine ? "var(--accent-soft)" : "transparent",
                  }}
                >
                  <td className="py-3 pl-5 pr-2">
                    <span className="inline-flex items-center gap-1.5" style={{ color: "var(--parchment)" }}>
                      {rankIcon(rank)}
                      {rank}
                    </span>
                  </td>
                  <td className="py-3 px-2" style={{ color: "var(--parchment)" }}>
                    {row.team}
                    {row.mine && (
                      <span className="ml-2 text-[0.65rem] uppercase tracking-wide" style={{ color: "var(--brass)" }}>
                        you
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-2 text-right font-display" style={{ color: "var(--brass-bright)" }}>
                    {escapeClock(row.timeRemaining)}
                  </td>
                  <td className="py-3 pl-2 pr-5 text-right hidden sm:table-cell" style={{ color: "var(--muted)" }}>
                    {row.date}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Submit your run */}
      <form onSubmit={submit} className="demo-card mt-6 p-5" data-tour="leaderboard-form">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="font-display text-lg" style={{ color: "var(--parchment)" }}>
            Beat {roomName}? Log your run
          </h2>
          <span className="demo-badge">Demo — not saved</span>
        </div>
        <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
          Enter your team name and the time on the clock when you escaped. This is an illustration of
          how players add a run — on a live build it posts to your real leaderboard.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto_auto]">
          <input
            className="demo-input"
            placeholder="Team name"
            value={team}
            onChange={(e) => setTeam(e.target.value)}
            aria-label="Team name"
          />
          <div className="flex items-center gap-2">
            <input
              className="demo-input w-16 text-center"
              placeholder="MM"
              inputMode="numeric"
              value={minutes}
              onChange={(e) => setMinutes(e.target.value.replace(/\D/g, "").slice(0, 2))}
              aria-label="Minutes used"
            />
            <span style={{ color: "var(--muted)" }}>:</span>
            <input
              className="demo-input w-16 text-center"
              placeholder="SS"
              inputMode="numeric"
              value={seconds}
              onChange={(e) => setSeconds(e.target.value.replace(/\D/g, "").slice(0, 2))}
              aria-label="Seconds used"
            />
          </div>
          <button type="submit" className="demo-btn demo-btn-primary px-5 py-2.5" data-tour="leaderboard-submit">
            Add my run
          </button>
        </div>
        <p className="text-[0.7rem] mt-2" style={{ color: "var(--muted-2)" }}>
          Faster escapes (less time used) rank higher.
        </p>
      </form>
    </div>
  );
}
