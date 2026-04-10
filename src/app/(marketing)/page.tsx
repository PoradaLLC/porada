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
import {
  Reveal,
  Stagger,
  StaggerItem,
  HoverCard,
  Counter,
  MagneticButton,
} from "@/components/ui/Motion";

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
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-accent/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-brand-accent/3 rounded-full blur-[100px]" />

        <div className="relative mx-auto max-w-7xl px-6 py-32">
          <div className="max-w-3xl">
            <Reveal>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-accent/20 bg-brand-accent/5 px-4 py-1.5">
                <span className="h-2 w-2 rounded-full bg-brand-accent animate-glow-pulse" />
                <span className="font-mono text-xs text-brand-accent">
                  Now Accepting New Projects
                </span>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <h1 className="font-mono text-5xl font-bold leading-tight tracking-tight md:text-7xl">
                Websites & Tech
                <br />
                <span className="text-glow text-brand-accent">
                  That Actually Work
                </span>
              </h1>
            </Reveal>

            <Reveal delay={0.2}>
              <p className="mt-6 max-w-xl text-lg text-brand-text leading-relaxed">
                We design, build, and ship web applications and infrastructure
                for businesses that need things done right. No fluff — just
                solid engineering.
              </p>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="mt-10 flex flex-wrap gap-4">
                <MagneticButton>
                  <Link
                    href="/book"
                    className="inline-flex items-center gap-2 rounded-lg bg-brand-accent px-8 py-3.5 font-mono text-sm font-bold text-brand-bg hover:bg-brand-accent-light transition-all hover:shadow-[0_0_20px_rgba(52,211,153,0.15)]"
                  >
                    Book a Consultation
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </MagneticButton>
                <MagneticButton>
                  <Link
                    href="/services"
                    className="inline-flex items-center gap-2 rounded-lg border border-brand-accent/20 px-8 py-3.5 font-mono text-sm font-bold text-brand-accent hover:bg-brand-accent/5 transition-all"
                  >
                    View Services
                  </Link>
                </MagneticButton>
              </div>
            </Reveal>

            <Stagger className="mt-16 grid grid-cols-3 gap-4" stagger={0.12}>
              {[
                { step: "01", label: "Discover", desc: "Understand your goals" },
                { step: "02", label: "Build", desc: "Ship production code" },
                { step: "03", label: "Scale", desc: "Grow without limits" },
              ].map((item) => (
                <StaggerItem key={item.step}>
                  <HoverCard>
                    <div className="rounded-xl border border-brand-accent/10 bg-brand-primary/50 p-5 backdrop-blur">
                      <span className="font-mono text-xs text-brand-accent/50">
                        {item.step}
                      </span>
                      <p className="mt-1 font-mono text-sm font-bold text-foreground">
                        {item.label}
                      </p>
                      <p className="mt-1 text-xs text-brand-text">
                        {item.desc}
                      </p>
                    </div>
                  </HoverCard>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-brand-accent/10 bg-brand-primary/50">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <Stagger className="grid grid-cols-2 gap-8 md:grid-cols-4" stagger={0.08}>
            {stats.map((stat) => (
              <StaggerItem key={stat.label}>
                <div className="text-center">
                  <Counter
                    value={stat.value}
                    className="font-mono text-3xl font-bold text-brand-accent text-glow"
                  />
                  <p className="mt-1 font-mono text-xs uppercase tracking-widest text-brand-text">
                    {stat.label}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Services */}
      <section className="grain bg-brand-bg px-6 py-24">
        <div className="relative z-10 mx-auto max-w-7xl">
          <Reveal>
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
          </Reveal>

          <Stagger className="mt-12 grid gap-6 md:grid-cols-2" stagger={0.1}>
            {services.map((service) => (
              <StaggerItem key={service.title}>
                <HoverCard className="h-full">
                  <div className="group glow-border rounded-xl bg-brand-primary/40 p-8 backdrop-blur hover:bg-brand-primary/60 transition-all hover:border-brand-accent/30 h-full">
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
                </HoverCard>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Why Sierra-117 */}
      <section className="border-y border-brand-accent/10 bg-brand-bg-alt px-6 py-24 grid-bg">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <p className="font-mono text-xs font-semibold uppercase tracking-widest text-brand-accent mb-2">
              // Why Us
            </p>
            <h2 className="font-mono text-3xl font-bold text-foreground md:text-4xl">
              Why Sierra-117
            </h2>
          </Reveal>

          <Stagger className="mt-12 grid gap-8 md:grid-cols-3" stagger={0.12}>
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
              <StaggerItem key={item.title}>
                <HoverCard className="h-full">
                  <div className="rounded-xl border border-brand-accent/10 bg-brand-bg/50 p-8 backdrop-blur h-full">
                    <item.icon className="h-8 w-8 text-brand-accent mb-4" />
                    <h3 className="font-mono text-lg font-bold text-foreground">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm text-brand-text leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                </HoverCard>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="bg-brand-bg px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <p className="font-mono text-xs font-semibold uppercase tracking-widest text-brand-accent mb-2">
              // Our Stack
            </p>
            <h2 className="font-mono text-3xl font-bold text-foreground md:text-4xl">
              Our Stack
            </h2>
          </Reveal>

          <Stagger className="mt-12 flex flex-wrap gap-3" stagger={0.04}>
            {techStack.map((tech) => (
              <StaggerItem key={tech}>
                <span className="inline-block rounded-lg border border-brand-accent/10 bg-brand-primary/40 px-5 py-2.5 font-mono text-sm text-brand-text hover:border-brand-accent/30 hover:text-brand-accent transition-all cursor-default">
                  {tech}
                </span>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* CTA */}
      <section className="grain bg-brand-primary px-6 py-24">
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <Reveal>
            <div className="inline-flex items-center gap-2 mb-6">
              <Terminal className="h-5 w-5 text-brand-accent" />
              <span className="font-mono text-xs text-brand-accent">
                Ready to start?
              </span>
            </div>
            <h2 className="font-mono text-3xl font-bold text-white md:text-5xl">
              Let&apos;s Build Something
              <br />
              <span className="text-brand-accent text-glow">Great</span>
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-brand-text">
              Book a free consultation and let&apos;s discuss how Sierra-117 can
              help with your next project.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <MagneticButton>
                <Link
                  href="/book"
                  className="inline-flex items-center gap-2 rounded-lg bg-brand-accent px-10 py-4 font-mono text-sm font-bold text-brand-bg hover:bg-brand-accent-light transition-all hover:shadow-[0_0_20px_rgba(52,211,153,0.15)]"
                >
                  Book a Consultation
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </MagneticButton>
              <MagneticButton>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-10 py-4 font-mono text-sm font-bold text-white hover:bg-white/5 transition-all"
                >
                  Contact Us
                </Link>
              </MagneticButton>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
