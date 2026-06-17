/**
 * Hero — the page IS the demo. Operator-facing headline focused on their
 * outcome (more bookings, a site that doesn't embarrass them). Exactly one
 * primary CTA, smooth-scrolling to the capture form. The craft of the page
 * itself is the first proof, so the hero stays restrained and fast.
 */
export function Hero() {
  return (
    <section className="er-hero er-wrap" id="top">
      <div className="er-eyebrow">For independent escape rooms</div>
      <h1 className="er-display">
        Your rooms sell out. <em>Your website</em> shouldn’t be why they don’t.
      </h1>
      <p className="er-lede">
        A fast, atmospheric site with booking that lives <em>inside</em> it — not a bolt-on popup that loses the sale.
      </p>
      <div className="er-hero-ctas">
        <a href="#preview" className="er-btn er-btn-primary">
          See your venue redesigned — free
          <svg className="er-arrow" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </a>
        <span className="er-hero-note">Hand-built · no obligation · don’t pay till it’s live</span>
      </div>

      <div className="er-trust">
        <div>
          <div className="k">What this is</div>
          <div className="v">A live demo</div>
        </div>
        <div>
          <div className="k">Booking</div>
          <div className="v">On your site<small> — not a popup</small></div>
        </div>
        <div>
          <div className="k">Leaderboard</div>
          <div className="v">We host it</div>
        </div>
        <div>
          <div className="k">Risk</div>
          <div className="v">$0<small> until you approve</small></div>
        </div>
      </div>
    </section>
  );
}
