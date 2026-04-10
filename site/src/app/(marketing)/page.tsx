import Link from "next/link";
import {
  Code2,
  Cloud,
  Palette,
  Cpu,
  ArrowRight,
  Terminal,
  Zap,
  Shield,
  Globe,
  ChevronRight,
} from "lucide-react";

const services = [
  {
    icon: Code2,
    title: "Web Development",
    description:
      "Custom websites and web applications built with modern frameworks. Fast, responsive, and scalable.",
  },
  {
    icon: Cloud,
    title: "Cloud Solutions",
    description:
      "Infrastructure design, deployment, and management. AWS, GCP, Vercel — we optimize your stack.",
  },
  {
    icon: Palette,
    title: "UI/UX Design",
    description:
      "Interfaces that convert. Data-driven design systems tailored to your brand and audience.",
  },
  {
    icon: Cpu,
    title: "Tech Consulting",
    description:
      "Strategic technology guidance. Architecture reviews, stack audits, and digital transformation roadmaps.",
  },
];

const stats = [
  { value: "50+", label: "Projects Delivered" },
  { value: "99.9%", label: "Uptime Guarantee" },
  { value: "< 1s", label: "Avg Load Time" },
  { value: "24/7", label: "Support Available" },
];

const techStack = [
  "Next.js",
  "React",
  "TypeScript",
  "Node.js",
  "PostgreSQL",
  "AWS",
  "Vercel",
  "Tailwind CSS",
  "Supabase",
  "Stripe",
  "Docker",
  "GraphQL",
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden grid-bg">
        {/* Glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-accent/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-brand-accent/3 rounded-full blur-[100px]" />

        <div className="relative mx-auto max-w-7xl px-6 py-32">
          <div className="max-w-3xl">
            <div className="animate-fade-up mb-6 inline-flex items-center gap-2 rounded-full border border-brand-accent/20 bg-brand-accent/5 px-4 py-1.5">
              <span className="h-2 w-2 rounded-full bg-brand-accent animate-glow-pulse" />
              <span className="font-mono text-xs text-brand-accent">
                Systems Online — Ready to Deploy
              </span>
            </div>

            <h1 className="animate-fade-up delay-100 font-mono text-5xl font-bold leading-tight tracking-tight md:text-7xl">
              We Build
              <br />
              <span className="text-glow text-brand-accent">
                Digital Weapons
              </span>
            </h1>

            <p className="animate-fade-up delay-200 mt-6 max-w-xl text-lg text-brand-text leading-relaxed">
              Sierra-117 is a web development and technology firm that
              engineers high-performance digital solutions. From concept to
              deployment, we deliver code that conquers.
            </p>

            <div className="animate-fade-up delay-300 mt-10 flex flex-wrap gap-4">
              <Link
                href="/book"
                className="inline-flex items-center gap-2 rounded-lg bg-brand-accent px-8 py-3.5 font-mono text-sm font-bold text-brand-bg hover:bg-brand-accent-light transition-all hover:shadow-[0_0_30px_rgba(0,255,65,0.3)]"
              >
                Book a Consultation
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 rounded-lg border border-brand-accent/20 px-8 py-3.5 font-mono text-sm font-bold text-brand-accent hover:bg-brand-accent/5 transition-all"
              >
                View Services
              </Link>
            </div>

            {/* Terminal Preview */}
            <div className="animate-fade-up delay-400 mt-16 rounded-xl border border-brand-accent/10 bg-brand-primary/80 p-1 backdrop-blur">
              <div className="flex items-center gap-2 px-4 py-2 border-b border-brand-accent/10">
                <div className="h-3 w-3 rounded-full bg-red-500/60" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/60" />
                <div className="h-3 w-3 rounded-full bg-green-500/60" />
                <span className="ml-2 font-mono text-xs text-brand-text/60">
                  sierra-117 — bash
                </span>
              </div>
              <div className="p-4 font-mono text-sm">
                <p className="text-brand-text/60">
                  $ <span className="text-brand-accent">sierra</span> deploy
                  --target production
                </p>
                <p className="mt-1 text-brand-text/40">
                  ✓ Building optimized bundle...
                </p>
                <p className="text-brand-text/40">
                  ✓ Running security audit...
                </p>
                <p className="text-brand-text/40">
                  ✓ Performance benchmarks passed
                </p>
                <p className="text-brand-accent mt-1">
                  ✓ Deployed successfully to production
                </p>
                <p className="mt-2 text-brand-text/60">
                  ${" "}
                  <span className="animate-blink text-brand-accent">_</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-brand-accent/10 bg-brand-primary/50">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-mono text-3xl font-bold text-brand-accent text-glow">
                  {stat.value}
                </p>
                <p className="mt-1 font-mono text-xs uppercase tracking-widest text-brand-text">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="grain bg-brand-bg px-6 py-24">
        <div className="relative z-10 mx-auto max-w-7xl">
          <p className="font-mono text-xs font-semibold uppercase tracking-widest text-brand-accent mb-2">
            // What We Do
          </p>
          <h2 className="font-mono text-3xl font-bold text-foreground md:text-4xl">
            Our Services
          </h2>
          <p className="mt-4 max-w-2xl text-brand-text">
            End-to-end technology solutions designed for performance,
            scalability, and impact.
          </p>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {services.map((service) => (
              <div
                key={service.title}
                className="group glow-border rounded-xl bg-brand-primary/40 p-8 backdrop-blur hover:bg-brand-primary/60 transition-all hover:border-brand-accent/30"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-brand-accent/10 border border-brand-accent/20 group-hover:bg-brand-accent/20 transition-colors">
                  <service.icon className="h-6 w-6 text-brand-accent" />
                </div>
                <h3 className="font-mono text-lg font-bold text-foreground">
                  {service.title}
                </h3>
                <p className="mt-2 text-sm text-brand-text leading-relaxed">
                  {service.description}
                </p>
                <Link
                  href="/services"
                  className="mt-4 inline-flex items-center gap-1 font-mono text-xs text-brand-accent hover:text-brand-accent-light transition-colors"
                >
                  Learn more <ChevronRight className="h-3 w-3" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Sierra-117 */}
      <section className="border-y border-brand-accent/10 bg-brand-bg-alt px-6 py-24 grid-bg">
        <div className="mx-auto max-w-7xl">
          <p className="font-mono text-xs font-semibold uppercase tracking-widest text-brand-accent mb-2">
            // Why Us
          </p>
          <h2 className="font-mono text-3xl font-bold text-foreground md:text-4xl">
            Built Different
          </h2>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              {
                icon: Zap,
                title: "Blazing Fast",
                text: "Sub-second load times. Optimized bundles. Edge-deployed globally for instant delivery.",
              },
              {
                icon: Shield,
                title: "Secure by Default",
                text: "Security-first architecture. OWASP compliant. Regular audits and penetration testing.",
              },
              {
                icon: Globe,
                title: "Scale Without Limits",
                text: "Cloud-native infrastructure that grows with you. Auto-scaling, redundancy, zero downtime.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-brand-accent/10 bg-brand-bg/50 p-8 backdrop-blur"
              >
                <item.icon className="h-8 w-8 text-brand-accent mb-4" />
                <h3 className="font-mono text-lg font-bold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-brand-text leading-relaxed">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="bg-brand-bg px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <p className="font-mono text-xs font-semibold uppercase tracking-widest text-brand-accent mb-2">
            // Our Stack
          </p>
          <h2 className="font-mono text-3xl font-bold text-foreground md:text-4xl">
            Technology Arsenal
          </h2>

          <div className="mt-12 flex flex-wrap gap-3">
            {techStack.map((tech) => (
              <span
                key={tech}
                className="rounded-lg border border-brand-accent/10 bg-brand-primary/40 px-5 py-2.5 font-mono text-sm text-brand-text hover:border-brand-accent/30 hover:text-brand-accent transition-all cursor-default"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="grain bg-brand-primary px-6 py-24">
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 mb-6">
            <Terminal className="h-5 w-5 text-brand-accent" />
            <span className="font-mono text-xs text-brand-accent">
              Ready to launch?
            </span>
          </div>
          <h2 className="font-mono text-3xl font-bold text-white md:text-5xl">
            Let&apos;s Build Something
            <br />
            <span className="text-brand-accent text-glow">Extraordinary</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-brand-text">
            Book a free consultation and let&apos;s discuss how Sierra-117 can
            transform your digital presence.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/book"
              className="inline-flex items-center gap-2 rounded-lg bg-brand-accent px-10 py-4 font-mono text-sm font-bold text-brand-bg hover:bg-brand-accent-light transition-all hover:shadow-[0_0_30px_rgba(0,255,65,0.3)]"
            >
              Book a Consultation
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-10 py-4 font-mono text-sm font-bold text-white hover:bg-white/5 transition-all"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
