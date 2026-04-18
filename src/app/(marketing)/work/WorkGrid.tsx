"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CASES } from "./cases";

const IFRAME_W = 1440;
const IFRAME_H = 900;

function SitePreview({ url }: { url: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.3);

  const measure = useCallback(() => {
    if (wrapRef.current) setScale(wrapRef.current.offsetWidth / IFRAME_W);
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  return (
    <div ref={wrapRef} style={{ position: "absolute", inset: 0 }}>
      <iframe
        src={url}
        title={`Preview of ${url}`}
        loading="lazy"
        tabIndex={-1}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: IFRAME_W,
          height: IFRAME_H,
          border: 0,
          transformOrigin: "top left",
          transform: `scale(${scale})`,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

export function WorkGrid() {
  return (
    <div className="case-grid" id="caseGrid" style={{ marginTop: 48 }}>
      {CASES.map((c) => (
        <div key={c.id} className="case" id={c.id}>
          <div className="thumb">
            {c.url && <SitePreview url={c.url} />}
          </div>
          <div className="case-body">
            <div
              className="mono"
              style={{ fontSize: 11, color: "var(--ink-faint)", letterSpacing: "0.08em" }}
            >
              {c.year}
            </div>
            <h3 style={{ marginTop: 6 }}>{c.title}</h3>
            <div className="meta-row">
              {c.tags.map((t) => (
                <span key={t} className="chip">{t}</span>
              ))}
            </div>
            <p className="excerpt">{c.excerpt}</p>
            <div className="stats">
              {c.stats.map(([v, l], j) => (
                <div key={j} className="stat">
                  <div className="v">{v}</div>
                  <div className="l">{l}</div>
                </div>
              ))}
            </div>
            {c.url && (
              <a
                href={c.url}
                target="_blank"
                rel="noreferrer"
                className="inline"
                style={{
                  display: "inline-block",
                  marginTop: 16,
                  fontFamily: "var(--font-mono-family)",
                  fontSize: 13,
                }}
              >
                {c.url.replace(/^https?:\/\//, "")} ↗
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
