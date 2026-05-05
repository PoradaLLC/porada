"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";
import { ArrowIcon } from "./ArrowIcon";

const links: { href: string; label: string; match: (p: string) => boolean }[] = [
  { href: "/", label: "Home", match: (p) => p === "/" },
  { href: "/services", label: "Services", match: (p) => p.startsWith("/services") },
  { href: "/work", label: "Work", match: (p) => p.startsWith("/work") },
  { href: "/pricing", label: "Pricing", match: (p) => p.startsWith("/pricing") },
  { href: "/about", label: "About", match: (p) => p.startsWith("/about") },
];

export function SiteNav() {
  const pathname = usePathname() ?? "/";

  return (
    <header className="nav">
      <div className="nav-inner">
        <Link href="/" className="brand">
          <Logo size={44} />
          <b>PORADA SOLUTIONS</b>
        </Link>
        <nav className="nav-links">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={l.match(pathname) ? "active" : ""}>
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="nav-cta">
          <Link href="/contact" className="btn btn-ghost">
            Say hi
          </Link>
          <Link href="/quote" className="btn btn-primary">
            Get a quote <ArrowIcon />
          </Link>
        </div>
      </div>
    </header>
  );
}
