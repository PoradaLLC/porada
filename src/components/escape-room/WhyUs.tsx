/**
 * Why us + risk-reversing guarantee. Leads with the guarantee, then the short
 * trust story: a small NY/NJ/PA studio that handles the technical integration
 * with whatever booking/game-master tools they already use, and sticks around
 * to maintain it.
 */
export function WhyUs() {
  return (
    <section className="er-section er-wrap">
      <div className="er-guarantee" data-reveal>
        <div className="er-eyebrow">The guarantee</div>
        <h2>
          Don’t pay until your site is <em>live</em> and you approve it.
        </h2>
        <p className="er-lede" style={{ marginTop: 18 }}>
          We build it, you see it working on your own venue, and only then does money change hands. If it’s not better
          than what you have, you walk away owing nothing.
        </p>

        <div className="er-why-grid">
          <div className="er-why">
            <h4>A small studio, not a factory</h4>
            <p>
              Porada Solutions is a real, registered studio in the NY/NJ/PA area with shipped work. You talk to the
              people building it — the same people a year from now.
            </p>
          </div>
          <div className="er-why">
            <h4>We handle the plumbing</h4>
            <p>
              Whatever booking system or game-master tools you already run, we handle the technical integration. You
              don’t have to think about it — and you’re not forced to rip anything out.
            </p>
          </div>
          <div className="er-why">
            <h4>We stick around</h4>
            <p>
              Hosting, edits, and the occasional “can you change this real quick” on a friendly retainer. We build
              things that still work in a year.
            </p>
          </div>
        </div>
      </div>

      {/* How it's built — the two tiers, stated on the pitch page itself so the
          #1 owner objection ("do I have to replace my booking system?") is
          answered here, not only deep inside the demo's confirmation screen. */}
      <div className="er-head" style={{ marginTop: "clamp(48px, 6vw, 88px)" }} data-reveal>
        <div className="er-eyebrow">How we build it</div>
        <h2 className="er-display">Two ways to do it — and you keep your booking system either way.</h2>
        <p className="er-lede">You’re never forced to rip out the tool you already run.</p>
      </div>
      <p className="er-reassure">
        We either cleanly embed the booking system you already use, or rebuild it custom on your platform — your call,
        sorted in your preview. <em>You keep your booking system either way.</em>
      </p>
      <p className="er-tier-note">
        A few capabilities — the hosted leaderboard, customer accounts, the completionist passport, and abandoned-booking
        recovery — depend on the custom flow or on your game-master/timer system. We’ll confirm exactly what fits your
        setup in your preview.
      </p>

      {/* What it costs / how long — answers the two questions a skeptical owner
          asks before handing over an email. Specific about the mechanism and the
          factors; the figure itself is quoted per venue. */}
      <div className="er-facts" data-reveal>
        <div className="er-fact">
          <h4>What it costs</h4>
          <p>
            Every build is quoted to your venue — the price tracks how many rooms you run and which of the features above
            you want, so you’re not paying for things you’ll never use. You get a clear, itemized quote <em>with</em> your
            free preview, and nothing changes hands until your site is live and you approve it.
          </p>
        </div>
        <div className="er-fact">
          <h4>How long until I’m live</h4>
          <p>
            Your free preview lands in a few days. From the moment you approve, most venues are live in about 2–4 weeks —
            and your side of it is small: send us your rooms and your booking details, we handle the rest.
          </p>
        </div>
      </div>
    </section>
  );
}
