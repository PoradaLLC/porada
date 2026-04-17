"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CASES, type CaseStudy } from "./cases";

function CaseArt({ theme, seed }: { theme: "warm" | "cool"; seed: number }) {
  const hues = {
    warm: ["#c6623a", "#e8a88a", "#f0d8b8", "#ede8dd"],
    cool: ["#5a6c7a", "#9ab0bd", "#d5dfe6", "#edf0f2"],
  } as const;
  const p = hues[theme];
  const s = seed * 13;
  return (
    <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
      <rect width="400" height="300" fill={p[3]} />
      <circle cx={120 + (s % 80)} cy={150 + (s % 40)} r={110} fill={p[1]} opacity={0.9} />
      <circle cx={280 - (s % 60)} cy={110 + (s % 60)} r={70} fill={p[0]} />
      <rect x={40 + (s % 40)} y={30 + (s % 30)} width={60} height={240} fill={p[2]} opacity={0.55} />
      <circle cx={320} cy={250} r={24} fill="none" stroke={p[0]} strokeWidth={2} />
      <path d={`M 20 260 Q 200 ${180 + (s % 60)} 380 260`} fill="none" stroke={p[0]} strokeWidth={1.5} opacity={0.6} />
    </svg>
  );
}

export function WorkGrid() {
  const [activeId, setActiveId] = useState<string | null>(null);

  const active = useMemo(() => CASES.find((c) => c.id === activeId) ?? null, [activeId]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    function open(id: string | null) {
      if (!id) return;
      if (CASES.find((c) => c.id === id)) setActiveId(id);
    }
    const h = window.location.hash.replace("#", "");
    if (h) open(h);
    function onHash() {
      const h2 = window.location.hash.replace("#", "");
      open(h2 || null);
    }
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    if (activeId) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeId]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setActiveId(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <div className="case-grid" id="caseGrid" style={{ marginTop: 48 }}>
        {CASES.map((c) => (
          <button
            key={c.id}
            type="button"
            className="case"
            id={c.id}
            onClick={() => setActiveId(c.id)}
          >
            <div className="thumb">
              <CaseArt theme={c.art} seed={CASES.indexOf(c) + 1} />
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
                  <span key={t} className="chip">
                    {t}
                  </span>
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
            </div>
          </button>
        ))}
      </div>

      <CaseModal case_={active} onClose={() => setActiveId(null)} />
    </>
  );
}

function CaseModal({ case_, onClose }: { case_: CaseStudy | null; onClose: () => void }) {
  if (!case_) return null;
  const q = case_.body.quote;
  return (
    <div
      className="modal-backdrop open"
      role="dialog"
      aria-modal="true"
      aria-label={`${case_.title} case study`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal">
        <button type="button" className="modal-close" aria-label="Close" onClick={onClose}>
          ✕
        </button>
        <div className="thumb">
          <CaseArt theme={case_.art} seed={CASES.indexOf(case_) + 1} />
        </div>
        <div className="case-body">
          <div className="mono" style={{ fontSize: 12, color: "var(--ink-faint)", letterSpacing: "0.08em" }}>
            {case_.year} · {case_.kind.toUpperCase()}
          </div>
          <h2 style={{ marginTop: 8 }}>{case_.title}</h2>
          {case_.url && (
            <div style={{ marginTop: 8 }}>
              <a
                href={case_.url}
                target="_blank"
                rel="noreferrer"
                className="inline"
                style={{ fontFamily: "var(--font-mono-family)", fontSize: 13 }}
              >
                {case_.url.replace(/^https?:\/\//, "")} ↗
              </a>
            </div>
          )}
          <div style={{ marginTop: 14, display: "flex", gap: 8, flexWrap: "wrap" }}>
            {case_.tags.map((t) => (
              <span key={t} className="chip">
                {t}
              </span>
            ))}
          </div>
          <h4>The challenge</h4>
          <p>{case_.body.challenge}</p>
          <h4>How we approached it</h4>
          <p>{case_.body.approach}</p>
          <h4>What happened</h4>
          <p>{case_.body.outcome}</p>
          {q && (
            <div className="quote">
              &quot;{q.text}&quot;
              <div
                style={{
                  marginTop: 12,
                  fontFamily: "var(--font-mono-family)",
                  fontSize: 12,
                  color: "var(--ink-soft)",
                  letterSpacing: "0.04em",
                }}
              >
                — {q.who}
              </div>
            </div>
          )}
          <div style={{ marginTop: 32 }}>
            <Link href="/quote" className="btn btn-primary">
              Start a similar project →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
