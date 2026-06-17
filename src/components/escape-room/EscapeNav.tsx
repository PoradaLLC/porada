/**
 * Minimal, dark, on-brand nav for the escape-room landing page. One job: keep
 * the single primary CTA in reach. Anchor link smooth-scrolls (html has
 * scroll-behavior: smooth) to the capture form.
 */
export function EscapeNav() {
  return (
    <header className="er-nav">
      <div className="er-nav-inner">
        <a href="#top" className="er-brand">
          <span className="er-dot" aria-hidden="true" />
          <b>PORADA</b> <span style={{ color: "var(--er-ink-faint)" }}>× escape rooms</span>
        </a>
        <span className="er-nav-meta">Websites for independent escape rooms · NY / NJ / PA</span>
        <a href="#preview" className="er-btn er-btn-primary">
          Get my free preview
        </a>
      </div>
    </header>
  );
}
