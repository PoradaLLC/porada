"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Terminal } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/pay", label: "Pay" },
  { href: "/book", label: "Book a Call" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 z-50 w-full border-b border-brand-accent/10 bg-brand-bg/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-accent/10 border border-brand-accent/20 group-hover:bg-brand-accent/20 transition-colors">
            <Terminal className="h-5 w-5 text-brand-accent" />
          </div>
          <span className="font-mono text-lg font-bold tracking-tight text-foreground">
            SIERRA<span className="text-brand-accent">-117</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 py-2 text-sm font-mono text-brand-text hover:text-brand-accent transition-colors rounded-lg hover:bg-brand-accent/5"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/book"
            className="ml-4 inline-flex items-center gap-2 rounded-lg bg-brand-accent px-5 py-2.5 text-sm font-mono font-bold text-brand-bg hover:bg-brand-accent-light transition-colors"
          >
            Get Started
          </Link>
        </nav>

        {/* Mobile Toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 text-brand-text hover:text-brand-accent"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {open && (
        <nav className="md:hidden border-t border-brand-accent/10 bg-brand-bg/95 backdrop-blur-xl">
          <div className="px-6 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block px-4 py-3 text-sm font-mono text-brand-text hover:text-brand-accent hover:bg-brand-accent/5 rounded-lg transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/book"
              onClick={() => setOpen(false)}
              className="mt-2 block text-center rounded-lg bg-brand-accent px-5 py-3 text-sm font-mono font-bold text-brand-bg"
            >
              Get Started
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
