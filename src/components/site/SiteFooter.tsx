import Link from "next/link";
import { LocalClock } from "./LocalClock";

export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-wordmark">Porada Solutions</div>
        <div className="footer-grid footer-grid-3">
          <div>
            <h4>Based in</h4>
            <div style={{ color: "var(--ink-soft)", fontSize: 14, lineHeight: 1.7 }}>
              USA - NY / NJ / PA area.
              <br />
              Remote by default; local in person when it helps.
            </div>
            <LocalClock />
          </div>
          <div>
            <h4>Sitemap</h4>
            <ul>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/services">Services</Link></li>
              <li><Link href="/work">Work</Link></li>
              <li><Link href="/pricing">Pricing</Link></li>
              <li><Link href="/about">About</Link></li>
            </ul>
          </div>
          <div>
            <h4>Talk to us</h4>
            <ul>
              <li><Link href="/contact">Contact</Link></li>
              <li><Link href="/quote">Get a quote</Link></li>
              <li><Link href="/book">Book a call</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <div>© {new Date().getFullYear()} Porada LLC</div>
          <div>Made by humans · hosted on Vercel</div>
        </div>
      </div>
    </footer>
  );
}
