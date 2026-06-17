import { ImageResponse } from "next/og";

export const alt = "Lantern & Lock Escape Co. — Four doors. Sixty minutes. One way out.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function DemoOgImage() {
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
          color: "#ece6d8",
          background: "linear-gradient(150deg, #161b27, #0b0d12)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 44,
              background: "rgba(199,163,90,0.18)",
              border: "1px solid #c7a35a",
            }}
          >
            🔑
          </div>
          <div style={{ display: "flex", fontSize: 26, letterSpacing: 6, color: "#c7a35a" }}>
            LANTERN &amp; LOCK ESCAPE CO.
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              fontSize: 86,
              lineHeight: 1.05,
              maxWidth: 1000,
              color: "#ece6d8",
            }}
          >
            Four doors. Sixty minutes.{" "}
            <span style={{ color: "#e4c078" }}>&nbsp;One way out.</span>
          </div>
          <div style={{ display: "flex", fontSize: 27, color: "#9aa3b2", maxWidth: 900, lineHeight: 1.4 }}>
            Four hand-built private escape rooms — book online in under a minute.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 21,
            color: "#6f7888",
            borderTop: "1px solid rgba(255,255,255,0.12)",
            paddingTop: 22,
          }}
        >
          <div style={{ display: "flex" }}>A demo website by Porada Solutions</div>
          <div style={{ display: "flex", color: "#9aa3b2" }}>poradasolutions.com</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
