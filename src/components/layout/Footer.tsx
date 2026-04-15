import Link from "next/link";
import { Terminal, GitBranch, Globe, ExternalLink, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-brand-accent/10 bg-brand-bg">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-accent/10 border border-brand-accent/20">
                <Terminal className="h-4 w-4 text-brand-accent" />
              </div>
              <span className="font-mono text-base font-bold text-foreground">
                SIERRA-117
              </span>
            </Link>
            <p className="text-sm text-brand-text leading-relaxed">
              Web development and tech solutions for businesses that need reliable, well-built software.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-brand-accent mb-4">
              Services
            </h4>
            <ul className="space-y-3 text-sm text-brand-text">
              <li><Link href="/services" className="hover:text-brand-accent transition-colors">Web Development</Link></li>
              <li><Link href="/services" className="hover:text-brand-accent transition-colors">Cloud Solutions</Link></li>
              <li><Link href="/services" className="hover:text-brand-accent transition-colors">UI/UX Design</Link></li>
              <li><Link href="/services" className="hover:text-brand-accent transition-colors">Tech Consulting</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-brand-accent mb-4">
              Company
            </h4>
            <ul className="space-y-3 text-sm text-brand-text">
              <li><Link href="/about" className="hover:text-brand-accent transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-brand-accent transition-colors">Contact</Link></li>
              <li><Link href="/book" className="hover:text-brand-accent transition-colors">Book a Call</Link></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-brand-accent mb-4">
              Connect
            </h4>
            <div className="flex gap-3">
              {[
                { icon: GitBranch, href: "#", label: "GitHub" },
                { icon: Globe, href: "#", label: "Twitter" },
                { icon: ExternalLink, href: "#", label: "LinkedIn" },
                { icon: Mail, href: "mailto:hello@sierra-117.dev", label: "Email" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-brand-accent/10 text-brand-text hover:text-brand-accent hover:border-brand-accent/30 hover:bg-brand-accent/5 transition-all"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-brand-accent/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-mono text-xs text-brand-text/60">
            &copy; {new Date().getFullYear()} Sierra-117. All rights reserved.
          </p>
          <p className="font-mono text-xs text-brand-text/30">
            A product of Sierra-117 LLC
          </p>
        </div>
      </div>
    </footer>
  );
}
