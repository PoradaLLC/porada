import type { Metadata } from "next";
import type React from "react";
import Link from "next/link";
import { ArrowRight, Code2, Shield, GraduationCap, Terminal } from "lucide-react";

export const metadata: Metadata = {
  title: "About",
  description:
    "Meet the Sierra-117 team. Engineers and builders based in the NYC Tri-State area.",
};

const team: { name: string; role: string; icon: React.ElementType }[] = [
  {
    name: "Michal Bienias",
    role: "Software Engineer",
    icon: Code2,
  },
  {
    name: "Daniel Bzura",
    role: "Cybersecurity Engineer",
    icon: Shield,
  },
  {
    name: "Marcin Bienias",
    role: "Software Engineer",
    icon: GraduationCap,
  },
];

const timeline = [
  { phase: "01", title: "Discovery", text: "We learn your business, audience, and goals. Deep dive into requirements and competitive landscape." },
  { phase: "02", title: "Architecture", text: "Design the technical blueprint. Stack selection, database schema, API design, and infrastructure planning." },
  { phase: "03", title: "Build", text: "Agile development with weekly demos. You see progress in real-time and can adjust priorities as we go." },
  { phase: "04", title: "Launch & Scale", text: "Deployment, monitoring, and optimization. We don't disappear after launch. We make sure your product thrives." },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative grid-bg px-6 py-24">
        <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-brand-accent/5 rounded-full blur-[120px]" />
        <div className="relative mx-auto max-w-7xl">
          <p className="font-mono text-xs font-semibold uppercase tracking-widest text-brand-accent mb-2">
            // About
          </p>
          <h1 className="font-mono text-4xl font-bold text-foreground md:text-6xl">
            The <span className="text-brand-accent text-glow">Team</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-brand-text leading-relaxed">
            Three engineers based in the NYC Tri-State area. We build
            websites and tech for local businesses that need things done
            right.
          </p>
        </div>
      </section>

      {/* Team */}
      <section className="border-y border-white/5 bg-brand-primary/50 px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div data-reveal>
            <p className="font-mono text-xs font-semibold uppercase tracking-widest text-brand-accent mb-2">
              // Who We Are
            </p>
            <h2 className="font-mono text-3xl font-bold text-foreground md:text-4xl">
              Engineers First
            </h2>
            <p className="mt-4 max-w-2xl text-brand-text leading-relaxed">
              We all have day jobs in software and cybersecurity. Sierra-117
              is how we put that experience to work for businesses that need
              reliable, well-built websites without the agency markup.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {team.map((member, i) => (
              <div
                key={member.name}
                data-reveal
                data-reveal-delay={String(i + 1)}
                data-spotlight
                className="glow-border rounded-xl bg-brand-primary/30 p-8 hover:-translate-y-0.5 transition-all"
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-brand-accent/10 border border-brand-accent/20 mb-4">
                  <member.icon className="h-6 w-6 text-brand-accent" />
                </div>
                <h3 className="font-mono text-lg font-bold text-foreground">
                  {member.name}
                </h3>
                <p className="mt-1 font-mono text-sm text-brand-accent">
                  {member.role}
                </p>
              </div>
            ))}
          </div>

          {/* Terminal decoration */}
          <div data-reveal data-reveal-delay="4" className="mt-12 max-w-md rounded-xl border border-white/[0.08] bg-brand-bg/50 p-8">
            <div className="flex items-center gap-2 mb-4">
              <Terminal className="h-5 w-5 text-brand-accent" />
              <span className="font-mono text-xs text-brand-accent">
                team.log
              </span>
            </div>
            <div className="font-mono text-sm space-y-2">
              <p className="text-brand-text/80">
                <span className="text-brand-accent">&gt;</span> location: &quot;NYC Tri-State Area&quot;
              </p>
              <p className="text-brand-text/80">
                <span className="text-brand-accent">&gt;</span> stack: &quot;Next.js, React, TypeScript&quot;
              </p>
              <p className="text-brand-text/80">
                <span className="text-brand-accent">&gt;</span> delivery: &quot;2-4 weeks, hosting included&quot;
              </p>
              <p className="text-brand-text/80">
                <span className="text-brand-accent">&gt;</span> status: &quot;accepting new projects&quot;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Process Timeline */}
      <section className="border-y border-white/5 bg-brand-bg-alt px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div data-reveal>
            <p className="font-mono text-xs font-semibold uppercase tracking-widest text-brand-accent mb-2">
              // Process
            </p>
            <h2 className="font-mono text-3xl font-bold text-foreground">
              How We Work
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-4">
            {timeline.map((step, i) => (
              <div key={step.phase} data-reveal data-reveal-delay={String(i + 1)} className="relative">
                <div className="font-mono text-4xl font-bold text-brand-accent/20 mb-2">
                  {step.phase}
                </div>
                <h3 className="font-mono text-lg font-bold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-brand-text leading-relaxed">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="grain border-t border-white/5 bg-brand-primary px-6 py-24">
        <div className="relative z-10 mx-auto max-w-4xl text-center" data-reveal>
          <h2 className="font-mono text-3xl font-bold text-white md:text-4xl">
            Want to Work{" "}
            <span className="text-brand-accent text-glow">Together</span>?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-brand-text">
            We take on a handful of projects at a time so we can give each
            one our full attention. Let&apos;s talk.
          </p>
          <Link
            href="/book"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-brand-accent px-10 py-4 font-mono text-sm font-bold text-brand-bg hover:bg-brand-accent-light transition-all hover:shadow-[0_0_20px_rgba(34,211,238,0.2)]"
          >
            Book a Consultation
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
