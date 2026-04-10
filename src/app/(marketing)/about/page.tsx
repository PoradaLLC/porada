import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Target, Eye, Rocket, Terminal } from "lucide-react";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Sierra-117 — a technology firm dedicated to building high-performance digital solutions.",
};

const values = [
  {
    icon: Target,
    title: "Precision Engineering",
    text: "Every line of code is intentional. We don't ship bloat — we ship solutions that perform under pressure.",
  },
  {
    icon: Eye,
    title: "Transparent Process",
    text: "No black boxes. You get full visibility into our process, code, and infrastructure. It's your product.",
  },
  {
    icon: Rocket,
    title: "Relentless Optimization",
    text: "We iterate aggressively. Performance metrics, user feedback, and data drive every decision we make.",
  },
];

const timeline = [
  { phase: "01", title: "Discovery", text: "We learn your business, audience, and goals. Deep dive into requirements and competitive landscape." },
  { phase: "02", title: "Architecture", text: "Design the technical blueprint. Stack selection, database schema, API design, and infrastructure planning." },
  { phase: "03", title: "Build", text: "Agile development with weekly demos. You see progress in real-time and can adjust priorities as we go." },
  { phase: "04", title: "Launch & Scale", text: "Deployment, monitoring, and optimization. We don't disappear after launch — we ensure your product thrives." },
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
            The Team Behind
            <br />
            <span className="text-brand-accent text-glow">the Code</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-brand-text leading-relaxed">
            Sierra-117 is a technology firm obsessed with building digital
            products that perform. We combine deep technical expertise with a
            relentless focus on results.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="border-y border-brand-accent/10 bg-brand-primary/50 px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="font-mono text-xs font-semibold uppercase tracking-widest text-brand-accent mb-2">
                // Our Mission
              </p>
              <h2 className="font-mono text-3xl font-bold text-foreground md:text-4xl">
                Building Technology That Matters
              </h2>
              <p className="mt-6 text-brand-text leading-relaxed">
                We started Sierra-117 because we saw too many businesses
                struggling with technology that held them back instead of
                propelling them forward. Slow sites, fragile infrastructure,
                and outdated stacks were costing companies real revenue.
              </p>
              <p className="mt-4 text-brand-text leading-relaxed">
                Our mission is simple: deliver technology solutions that are
                fast, secure, and built to scale. No unnecessary complexity.
                No vendor lock-in. Just clean, performant code that works.
              </p>
            </div>
            <div className="rounded-xl border border-brand-accent/10 bg-brand-bg/50 p-8">
              <div className="flex items-center gap-2 mb-4">
                <Terminal className="h-5 w-5 text-brand-accent" />
                <span className="font-mono text-xs text-brand-accent">
                  mission.log
                </span>
              </div>
              <div className="font-mono text-sm space-y-2">
                <p className="text-brand-text/60">
                  <span className="text-brand-accent">&gt;</span> philosophy: &quot;code with purpose&quot;
                </p>
                <p className="text-brand-text/60">
                  <span className="text-brand-accent">&gt;</span> approach: &quot;measure twice, deploy once&quot;
                </p>
                <p className="text-brand-text/60">
                  <span className="text-brand-accent">&gt;</span> stack: &quot;modern, proven, performant&quot;
                </p>
                <p className="text-brand-text/60">
                  <span className="text-brand-accent">&gt;</span> commitment: &quot;your success = our success&quot;
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-brand-bg px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <p className="font-mono text-xs font-semibold uppercase tracking-widest text-brand-accent mb-2">
            // Core Values
          </p>
          <h2 className="font-mono text-3xl font-bold text-foreground">
            What Drives Us
          </h2>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {values.map((value) => (
              <div
                key={value.title}
                className="glow-border rounded-xl bg-brand-primary/30 p-8"
              >
                <value.icon className="h-8 w-8 text-brand-accent mb-4" />
                <h3 className="font-mono text-lg font-bold text-foreground">
                  {value.title}
                </h3>
                <p className="mt-3 text-sm text-brand-text leading-relaxed">
                  {value.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Timeline */}
      <section className="border-y border-brand-accent/10 bg-brand-bg-alt px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <p className="font-mono text-xs font-semibold uppercase tracking-widest text-brand-accent mb-2">
            // Process
          </p>
          <h2 className="font-mono text-3xl font-bold text-foreground">
            How We Work
          </h2>

          <div className="mt-12 grid gap-6 md:grid-cols-4">
            {timeline.map((step) => (
              <div key={step.phase} className="relative">
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
      <section className="grain bg-brand-primary px-6 py-24">
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <h2 className="font-mono text-3xl font-bold text-white md:text-4xl">
            Want to Work{" "}
            <span className="text-brand-accent text-glow">Together</span>?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-brand-text">
            We&apos;re selective about the projects we take on — but if we take
            yours, we&apos;re all in. Let&apos;s talk.
          </p>
          <Link
            href="/book"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-brand-accent px-10 py-4 font-mono text-sm font-bold text-brand-bg hover:bg-brand-accent-light transition-all"
          >
            Book a Consultation
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
