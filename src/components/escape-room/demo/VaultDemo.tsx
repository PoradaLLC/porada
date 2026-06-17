"use client";

/**
 * VaultDemo — a small but real, clickable demo of a full escape-room website
 * for the fictional venue "The Vault". Self-contained so it can be lifted out
 * and reused as a standalone showcase.
 *
 * Two modes:
 *  - Autoplay "film" (default): a CSS-keyframe walkthrough cross-fades the four
 *    screens and drifts a fake cursor through the whole customer journey
 *    (nav → room → booking → confirm → leaderboard). Pure transform/opacity,
 *    ~12s loop, only under `prefers-reduced-motion: no-preference`. With motion
 *    reduced it degrades to a static, fully-readable first frame.
 *  - Interactive (after "Try it yourself"): pauses the film and hands the real
 *    stateful site to the visitor — home → room → on-brand booking → post-game
 *    leaderboard, with their run inserted and ranked live.
 */

import { useMemo, useState } from "react";
import {
  ROOMS,
  SEED_LEADERBOARD,
  TIME_SLOTS,
  type Room,
  type LeaderboardEntry,
  formatTime,
  difficultyLabel,
  nextDates,
} from "./demoData";

type Screen = "home" | "room" | "booking" | "postgame";

const SCREEN_URL: Record<Screen, string> = {
  home: "thevault.example",
  room: "thevault.example/rooms/the-vault",
  booking: "thevault.example/book",
  postgame: "thevault.example/results",
};

const SCREEN_LABEL: Record<Screen, string> = {
  home: "Home · room list",
  room: "Room detail",
  booking: "Reservation",
  postgame: "Post-game leaderboard",
};

function Arrow() {
  return (
    <svg className="er-arrow" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function Cursor() {
  return (
    <div className="er-cursor" aria-hidden="true">
      <svg className="er-cursor-icon" viewBox="0 0 24 24" fill="none">
        <path d="M5 3l14 8-6 1.5L10 19 5 3z" fill="#fff" stroke="#14110a" strokeWidth="1.2" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function StatStrip({ room }: { room: Room }) {
  return (
    <div className="er-stat-strip">
      <div className="stat">
        <div className="k">Players</div>
        <div className="v">{room.minPlayers}–{room.maxPlayers}</div>
      </div>
      <div className="stat">
        <div className="k">Ages</div>
        <div className="v">{room.minAge}+</div>
      </div>
      <div className="stat">
        <div className="k">Difficulty</div>
        <div className="v">{difficultyLabel(room.difficulty)}</div>
      </div>
      <div className="stat">
        <div className="k">Time</div>
        <div className="v">{room.durationMin} min</div>
      </div>
      <div className="stat">
        <div className="k">Per player</div>
        <div className="v">${room.pricePerPlayer}</div>
      </div>
    </div>
  );
}

function RoomCard({ room, onOpen }: { room: Room; onOpen?: () => void }) {
  const inner = (
    <>
      <div className="er-room-art" style={{ background: room.art }}>
        <span aria-hidden="true">{room.emoji}</span>
        <div className="er-room-veil" />
      </div>
      <div className="er-room-meta">
        <h4>{room.name}</h4>
        <div className="er-room-stats">
          <span>{room.minPlayers}–{room.maxPlayers} players</span>
          <span>{room.minAge}+</span>
          <span>{difficultyLabel(room.difficulty)}</span>
        </div>
      </div>
    </>
  );
  if (onOpen) {
    return (
      <button type="button" className="er-room-card" onClick={onOpen}>
        {inner}
      </button>
    );
  }
  return <div className="er-room-card">{inner}</div>;
}

function Leaderboard({ rows, roomName }: { rows: LeaderboardEntry[]; roomName: string }) {
  return (
    <table className="er-board">
      <thead>
        <tr>
          <th>#</th>
          <th>Team · {roomName}</th>
          <th style={{ textAlign: "right" }}>Time</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={`${r.team}-${i}`} className={r.you ? "you" : ""}>
            <td className="rank">{i === 0 ? <span className="er-badge-1">①</span> : i + 1}</td>
            <td>
              {r.team}
              {r.you ? " · you" : ""}
            </td>
            <td className="time">{formatTime(r.seconds)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/* ---------------- autoplay film (non-interactive, CSS-driven) ---------------- */

function Film() {
  const vault = ROOMS[0];
  const board = SEED_LEADERBOARD[vault.id].slice(0, 5);
  // Pose a "you" row so the leaderboard frame reads as a real result.
  const posed: LeaderboardEntry[] = [...board];
  posed.splice(2, 0, { team: "Your crew", seconds: 45 * 60 + 30, playedOn: "2026-06-15", you: true });

  return (
    <div className="er-film playing" aria-hidden="true">
      <Cursor />

      {/* HOME */}
      <div className="er-vault er-vault-screen er-film-home">
        <VaultChrome screen="home" />
        <div className="er-vault-body">
          <div className="er-vault-kicker">Now booking · Downtown</div>
          <h2 className="er-vault-h">Three rooms. One hour each. Pick your team’s fight.</h2>
          <div className="er-rooms">
            {ROOMS.map((r) => (
              <RoomCard key={r.id} room={r} />
            ))}
          </div>
        </div>
      </div>

      {/* ROOM */}
      <div className="er-vault er-vault-screen er-film-room">
        <VaultChrome screen="room" />
        <div className="er-vault-body">
          <div className="er-detail-hero" style={{ background: vault.art }}>
            <span aria-hidden="true">{vault.emoji}</span>
            <div className="er-room-veil" />
          </div>
          <h2 className="er-vault-h" style={{ marginTop: 14 }}>{vault.name}</h2>
          <p className="er-vault-sub">{vault.tagline}</p>
          <StatStrip room={vault} />
        </div>
      </div>

      {/* BOOKING */}
      <div className="er-vault er-vault-screen er-film-book">
        <VaultChrome screen="booking" />
        <div className="er-vault-body">
          <div className="er-vault-kicker">Reserve · {vault.name}</div>
          <h2 className="er-vault-h" style={{ fontSize: "clamp(18px,3vw,30px)" }}>Pick a date &amp; time</h2>
          <BookingPreview />
        </div>
      </div>

      {/* POST-GAME */}
      <div className="er-vault er-vault-screen er-film-post">
        <VaultChrome screen="postgame" />
        <div className="er-vault-body">
          <div className="er-vault-kicker">You escaped · 45:30</div>
          <h2 className="er-vault-h" style={{ fontSize: "clamp(18px,3vw,30px)" }}>3rd on the board — come back and climb.</h2>
          <div className="er-postgame-head" style={{ marginTop: 14 }}>
            <div className="er-team-photo">TODO: team photo</div>
            <p className="er-vault-sub" style={{ marginTop: 0 }}>
              Beat your time, challenge a faster crew, or take on the next room.
            </p>
          </div>
          <Leaderboard rows={posed} roomName={vault.name} />
        </div>
      </div>

      <div className="er-playhint">▶ Auto-tour — press “Try it yourself” to take over</div>
    </div>
  );
}

function VaultChrome({ screen }: { screen: Screen }) {
  return (
    <div className="er-vault-nav">
      <div className="er-vault-logo">
        THE <b>VAULT</b>
      </div>
      <div className="er-vault-navlinks">
        <span className={screen === "home" ? "on" : ""}>Rooms</span>
        <span className={screen === "booking" ? "on" : ""}>Book</span>
        <span>Gift cards</span>
        <span className={screen === "postgame" ? "on" : ""}>Leaderboard</span>
      </div>
    </div>
  );
}

function BookingPreview() {
  const dates = ["Fri Jun 19", "Sat Jun 20", "Sun Jun 21"];
  return (
    <div className="er-booking" style={{ marginTop: 14 }}>
      <div>
        <div className="er-booking-label">Date</div>
        <div className="er-chips">
          {dates.map((d, i) => (
            <span key={d} className={`er-chip-btn${i === 1 ? " on" : ""}`}>{d}</span>
          ))}
        </div>
        <div className="er-booking-label" style={{ marginTop: 16 }}>Time</div>
        <div className="er-chips">
          {TIME_SLOTS.map((t, i) => (
            <span key={t} className={`er-chip-btn${i === 2 ? " on" : ""}`}>{t}</span>
          ))}
        </div>
        <div className="er-booking-label" style={{ marginTop: 16 }}>Players</div>
        <span className="er-counter">
          <span className="n">4</span>
        </span>
      </div>
      <div className="er-booking-aside">
        <div className="row"><span>The Vault · Sat 6:00 PM</span></div>
        <div className="row"><span>4 players × $34</span><span className="v">$136</span></div>
        <div className="total">
          <span className="er-booking-label" style={{ margin: 0 }}>Total</span>
          <span className="amt">$136</span>
        </div>
        <span className="er-chip-btn on" style={{ marginTop: 14, display: "inline-block" }}>Confirm reservation →</span>
      </div>
    </div>
  );
}

/* ---------------- interactive demo (real React state) ---------------- */

function Interactive() {
  const [screen, setScreen] = useState<Screen>("home");
  const [roomId, setRoomId] = useState<string>(ROOMS[0].id);
  const room = useMemo(() => ROOMS.find((r) => r.id === roomId) ?? ROOMS[0], [roomId]);

  const dates = useMemo(() => nextDates(5), []);
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [players, setPlayers] = useState<number>(room.minPlayers + 1);

  // Your result, computed once on confirm.
  const [yourSeconds, setYourSeconds] = useState<number | null>(null);

  function openRoom(id: string) {
    setRoomId(id);
    const r = ROOMS.find((x) => x.id === id) ?? ROOMS[0];
    setPlayers(Math.min(Math.max(r.minPlayers + 1, r.minPlayers), r.maxPlayers));
    setScreen("room");
  }

  function confirmBooking() {
    // Simulate a fresh escape time for the post-game screen (40:00–57:59).
    const seconds = 40 * 60 + Math.floor(Math.random() * (18 * 60));
    setYourSeconds(seconds);
    setScreen("postgame");
  }

  const board: LeaderboardEntry[] = useMemo(() => {
    const base = SEED_LEADERBOARD[room.id] ?? [];
    if (yourSeconds == null) return base.slice(0, 6);
    const withYou = [...base, { team: "Your crew", seconds: yourSeconds, playedOn: "2026-06-17", you: true }];
    withYou.sort((a, b) => a.seconds - b.seconds);
    return withYou.slice(0, 8);
  }, [room.id, yourSeconds]);

  const yourRank = useMemo(() => board.findIndex((r) => r.you) + 1, [board]);
  const total = players * room.pricePerPlayer;
  const dateLabel = dates.find((d) => d.iso === date)?.label ?? "—";

  return (
    <div className="er-vault">
      <div className="er-vault-nav">
        <button
          type="button"
          className="er-vault-logo"
          onClick={() => setScreen("home")}
          style={{ background: "none", border: 0, padding: 0 }}
        >
          THE <b>VAULT</b>
        </button>
        <div className="er-vault-navlinks">
          <button type="button" className={screen === "home" ? "on" : ""} onClick={() => setScreen("home")} style={navBtn}>
            Rooms
          </button>
          <button
            type="button"
            className={screen === "booking" ? "on" : ""}
            onClick={() => setScreen("booking")}
            style={navBtn}
          >
            Book
          </button>
          <span style={{ opacity: 0.5 }}>Gift cards</span>
          <button
            type="button"
            className={screen === "postgame" ? "on" : ""}
            onClick={() => setScreen("postgame")}
            style={navBtn}
          >
            Leaderboard
          </button>
        </div>
      </div>

      <div className="er-vault-body">
        {/* HOME */}
        <div className={`er-vault-screen${screen === "home" ? " show" : ""}`}>
          <div className="er-vault-kicker">Now booking · Downtown</div>
          <h2 className="er-vault-h">Three rooms. One hour each. Pick your team’s fight.</h2>
          <p className="er-vault-sub">Tap a room to see what you’re walking into — then reserve in a few taps, right here.</p>
          <div className="er-rooms">
            {ROOMS.map((r) => (
              <RoomCard key={r.id} room={r} onOpen={() => openRoom(r.id)} />
            ))}
          </div>
        </div>

        {/* ROOM DETAIL */}
        <div className={`er-vault-screen${screen === "room" ? " show" : ""}`}>
          <div className="er-detail-hero" style={{ background: room.art }}>
            <span aria-hidden="true">{room.emoji}</span>
            <div className="er-room-veil" />
          </div>
          <h2 className="er-vault-h" style={{ marginTop: 14 }}>{room.name}</h2>
          <p className="er-vault-sub">{room.blurb}</p>
          <StatStrip room={room} />
          <div style={{ marginTop: 18, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button type="button" className="er-btn er-btn-primary" onClick={() => setScreen("booking")}>
              Reserve this room <Arrow />
            </button>
            <button type="button" className="er-btn er-btn-ghost" onClick={() => setScreen("home")}>
              ← All rooms
            </button>
          </div>
        </div>

        {/* BOOKING */}
        <div className={`er-vault-screen${screen === "booking" ? " show" : ""}`}>
          <div className="er-vault-kicker">Reserve · {room.name}</div>
          <h2 className="er-vault-h" style={{ fontSize: "clamp(18px,3vw,30px)" }}>Pick a date, time &amp; team size</h2>
          <div className="er-booking" style={{ marginTop: 16 }}>
            <div>
              <div className="er-booking-label">Date</div>
              <div className="er-chips">
                {dates.map((d) => (
                  <button
                    key={d.iso}
                    type="button"
                    className={`er-chip-btn${date === d.iso ? " on" : ""}`}
                    onClick={() => setDate(d.iso)}
                  >
                    {d.label}
                  </button>
                ))}
              </div>

              <div className="er-booking-label" style={{ marginTop: 18 }}>Time</div>
              <div className="er-chips">
                {TIME_SLOTS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    className={`er-chip-btn${time === t ? " on" : ""}`}
                    onClick={() => setTime(t)}
                    disabled={!date}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <div className="er-booking-label" style={{ marginTop: 18 }}>Players</div>
              <span className="er-counter">
                <button
                  type="button"
                  aria-label="Fewer players"
                  onClick={() => setPlayers((p) => Math.max(room.minPlayers, p - 1))}
                >
                  −
                </button>
                <span className="n">{players}</span>
                <button
                  type="button"
                  aria-label="More players"
                  onClick={() => setPlayers((p) => Math.min(room.maxPlayers, p + 1))}
                >
                  +
                </button>
              </span>
              <span className="er-mono" style={{ marginLeft: 12, fontSize: 11, color: "var(--er-ink-faint)" }}>
                {room.minPlayers}–{room.maxPlayers} allowed
              </span>
            </div>

            <div className="er-booking-aside">
              <div className="row">
                <span>{room.name}</span>
                <span className="v">{dateLabel}{time ? ` · ${time}` : ""}</span>
              </div>
              <div className="row">
                <span>{players} players × ${room.pricePerPlayer}</span>
                <span className="v">${total}</span>
              </div>
              <div className="total">
                <span className="er-booking-label" style={{ margin: 0 }}>Total</span>
                <span className="amt">${total}</span>
              </div>
              <button
                type="button"
                className="er-btn er-btn-primary"
                style={{ marginTop: 16, width: "100%", justifyContent: "center" }}
                onClick={confirmBooking}
                disabled={!date || !time}
              >
                {!date || !time ? "Pick a date & time" : "Confirm reservation →"}
              </button>
              <p className="er-mono" style={{ fontSize: 10, color: "var(--er-ink-faint)", marginTop: 10, lineHeight: 1.5 }}>
                No third-party popup — this whole flow lives inside the site.
              </p>
            </div>
          </div>
        </div>

        {/* POST-GAME */}
        <div className={`er-vault-screen${screen === "postgame" ? " show" : ""}`}>
          <div className="er-vault-kicker">
            {yourSeconds != null ? `You escaped · ${formatTime(yourSeconds)}` : "Leaderboard"}
          </div>
          <h2 className="er-vault-h" style={{ fontSize: "clamp(18px,3vw,30px)" }}>
            {yourSeconds != null
              ? yourRank === 1
                ? "New record. The whole board is chasing you now."
                : `${ordinal(yourRank)} on the board — come back and climb.`
              : `${room.name} — fastest crews`}
          </h2>
          <div className="er-postgame-head" style={{ marginTop: 14 }}>
            <div className="er-team-photo">TODO: team photo upload</div>
            <p className="er-vault-sub" style={{ marginTop: 0 }}>
              Beat your time, challenge a faster crew, or take on the next room. This is why players come back.
            </p>
          </div>
          <Leaderboard rows={board} roomName={room.name} />
          <div style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button type="button" className="er-btn er-btn-ghost" onClick={() => setScreen("home")}>
              ← Book another room
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const navBtn: React.CSSProperties = {
  background: "none",
  border: 0,
  padding: 0,
  font: "inherit",
  letterSpacing: "inherit",
  textTransform: "uppercase",
};

function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] ?? s[v] ?? s[0]);
}

/* ---------------- shell ---------------- */

export function VaultDemo() {
  const [interactive, setInteractive] = useState(false);

  return (
    <div className="er-frame">
      <div className="er-frame-bar">
        <div className="er-frame-dots">
          <span />
          <span />
          <span />
        </div>
        <div className="er-frame-url">
          {interactive ? "thevault.example" : SCREEN_URL.home} <span style={{ opacity: 0.5 }}>· demo</span>
        </div>
      </div>

      <div className="er-frame-stage">
        {interactive ? <Interactive key="interactive" /> : <Film />}
      </div>

      <div className="er-frame-controls">
        <div className="er-step-label">
          {interactive ? (
            <>
              <b>Live demo</b> — click anything. This is a real, working site.
            </>
          ) : (
            <>
              <b>Auto-tour</b> — {SCREEN_LABEL.home} → {SCREEN_LABEL.room} → {SCREEN_LABEL.booking} →{" "}
              {SCREEN_LABEL.postgame}
            </>
          )}
        </div>
        <button
          type="button"
          className={`er-btn ${interactive ? "er-btn-ghost" : "er-btn-primary"}`}
          onClick={() => setInteractive((v) => !v)}
        >
          {interactive ? "↺ Watch the tour" : "Try it yourself →"}
        </button>
      </div>
    </div>
  );
}
