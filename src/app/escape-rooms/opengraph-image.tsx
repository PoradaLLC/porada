import { ImageResponse } from "next/og";

export const alt = "Escape-room websites that fill more slots — Porada Solutions";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function EscapeRoomsOgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 88px",
          fontFamily: "serif",
          color: "#edeae3",
          background: "linear-gradient(150deg, #16161d, #0a0a0c)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 13,
              height: 13,
              borderRadius: 999,
              background: "#e6a23c",
              boxShadow: "0 0 18px #e6a23c",
              display: "flex",
            }}
          />
          <div style={{ display: "flex", fontSize: 26, letterSpacing: 5, color: "#e6a23c" }}>
            PORADA SOLUTIONS
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              fontSize: 84,
              lineHeight: 1.05,
              maxWidth: 1010,
              color: "#edeae3",
            }}
          >
            Escape-room websites that{" "}
            <span style={{ color: "#e6a23c" }}>&nbsp;fill more slots.</span>
          </div>
          <div style={{ display: "flex", fontSize: 27, color: "#a7a299", maxWidth: 940, lineHeight: 1.4 }}>
            On-brand embedded booking, a hosted leaderboard, gift cards, and local SEO. Free,
            hand-built preview of your venue — don&apos;t pay until it&apos;s live.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 21,
            color: "#6f6a61",
            borderTop: "1px solid rgba(255,255,255,0.12)",
            paddingTop: 22,
          }}
        >
          <div style={{ display: "flex" }}>poradasolutions.com/escape-rooms</div>
          <div style={{ display: "flex", color: "#a7a299" }}>See the live demo</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
