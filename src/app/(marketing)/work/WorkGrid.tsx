import Image from "next/image";
import { CASES } from "./cases";

function SitePreview({ thumb, title, url }: { thumb?: string; title: string; url?: string }) {
  if (thumb) {
    return (
      <Image
        src={thumb}
        alt={`${title} preview`}
        fill
        sizes="(max-width: 720px) 100vw, (max-width: 1240px) 50vw, 600px"
        style={{ objectFit: "cover", objectPosition: "top" }}
      />
    );
  }
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg-elev)",
        color: "var(--ink-faint)",
        fontFamily: "var(--font-mono-family)",
        fontSize: 12,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
      }}
    >
      {url ? url.replace(/^https?:\/\//, "") : "Preview"}
    </div>
  );
}

export function WorkGrid() {
  return (
    <div className="case-grid" id="caseGrid" style={{ marginTop: 48 }}>
      {CASES.map((c) => (
        <div key={c.id} className="case" id={c.id}>
          <div className="thumb">
            <SitePreview thumb={c.thumb} title={c.title} url={c.url} />
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
