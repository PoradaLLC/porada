import Link from "next/link";

/**
 * Footer — Porada Solutions branding + contact + links to real shipped work,
 * signaling a registered business behind the named person an operator may have
 * met in person. Real NAP/contact pulled from the main site's data.
 */
export function EscapeFooter() {
  return (
    <footer className="er-footer">
      <div className="er-wrap">
        <div className="er-footer-word">Porada Solutions</div>
        <div className="er-footer-grid">
          <div>
            <h4>Who you’re talking to</h4>
            <p style={{ color: "var(--er-ink-soft)", fontSize: 14, lineHeight: 1.7, maxWidth: "40ch" }}>
              A small, registered tech studio (Porada LLC) building websites and untangling tech for small businesses in
              the NY / NJ / PA area. Real people, shipped work, around in a year.
            </p>
            <address style={{ color: "var(--er-ink-soft)", fontSize: 14, lineHeight: 1.7, fontStyle: "normal", marginTop: 14 }}>
              1960 PA-611, Swiftwater, PA 18370
              <br />
              <a href="tel:+12019695875">(201) 969-5875</a>
              {" · "}
              <a href="mailto:team@poradasolutions.com">team@poradasolutions.com</a>
            </address>
          </div>

          <div>
            <h4>Shipped work</h4>
            <ul>
              {/* Real case studies from the main site. */}
              <li><Link href="/work#church-of-saint-luke">Church of Saint Luke</Link></li>
              <li><Link href="/work#forteca-estate">Forteca Estate</Link></li>
              <li><Link href="/work#pocono-property-care">Pocono Property Care</Link></li>
              <li><Link href="/work">All case studies →</Link></li>
            </ul>
          </div>

          <div>
            <h4>Talk to us</h4>
            <ul>
              <li><a href="#preview">Get my free preview</a></li>
              <li><Link href="/contact">Contact</Link></li>
              <li><Link href="/about">About the studio</Link></li>
              <li><Link href="/">poradasolutions.com</Link></li>
            </ul>
          </div>
        </div>

        <div className="er-footer-bottom">
          <span>© {new Date().getFullYear()} Porada LLC · Made by humans</span>
          <span>For independent escape rooms · This is a live demo of what we build</span>
        </div>
      </div>
    </footer>
  );
}
