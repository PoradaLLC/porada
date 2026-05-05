import { ImageResponse } from "next/og";

export const alt = "Porada Solutions — Web design, development & fractional CTO";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#f3efe7",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 96px",
          fontFamily: "serif",
          color: "#1a1815",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div
            style={{
              width: 96,
              height: 96,
              borderRadius: 16,
              background: "#f3efe7",
              border: "2px solid #1a1815",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 72,
              fontWeight: 700,
              lineHeight: 1,
            }}
          >
            <span style={{ display: "flex" }}>
              <span>P</span>
              <span style={{ color: "#800020" }}>o</span>
            </span>
          </div>
          <div style={{ display: "flex", fontSize: 28, letterSpacing: 4, color: "#1a1815" }}>
            PORADA SOLUTIONS
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              fontSize: 88,
              fontWeight: 700,
              lineHeight: 1.05,
              maxWidth: 1000,
            }}
          >
            <span>Web design, development &amp;&nbsp;</span>
            <span style={{ color: "#800020" }}>fractional CTO</span>
            <span>.</span>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 28,
              color: "#5a554c",
              maxWidth: 900,
              lineHeight: 1.4,
            }}
          >
            A small studio building careful websites and untangling tech for small businesses and agency partners — based in NY/NJ/PA, remote by default.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 22,
            color: "#5a554c",
            borderTop: "1px solid #1a181533",
            paddingTop: 24,
          }}
        >
          <div style={{ display: "flex" }}>poradasolutions.com</div>
          <div style={{ display: "flex" }}>team@poradasolutions.com</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
