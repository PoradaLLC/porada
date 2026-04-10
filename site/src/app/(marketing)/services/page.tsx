import type { Metadata } from "next";
import Link from "next/link";
import {
  Code2,
  Cloud,
  Palette,
  Cpu,
  ArrowRight,
  Globe,
  Database,
  Lock,
  Gauge,
  Smartphone,
  Search,
  GitBranch,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Web development, cloud solutions, UI/UX design, and tech consulting — Sierra-117 delivers full-spectrum technology services.",
};

const services = [
  {
    icon: Code2,
    title: "Custom Web Development",
    description:
      "From marketing sites to complex web applications, we build with Next.js, React, and TypeScript for maximum performance and developer experience.",
    features: [
      "Server-side rendering & static generation",
      "Progressive web apps (PWAs)",
      "E-commerce platforms with Stripe integration",
      "Custom CMS and admin dashboards",
      "API development & third-party integrations",
    ],
  },
  {
    icon: Cloud,
    title: "Cloud Infrastructure",
    description:
      "We architect, deploy, and manage cloud infrastructure that scales automatically and stays resilient under load.",
    features: [
      "AWS, GCP, and Vercel deployments",
      "CI/CD pipeline setup & optimization",
      "Database design & migration",
      "Serverless architecture",
      "Monitoring, logging & alerting",
    ],
  },
  {
    icon: Palette,
    title: "UI/UX Design",
    description:
      "Data-driven design that converts visitors into customers. We build design systems that scale with your product.",
    features: [
      "User research & journey mapping",
      "Wireframing & prototyping",
      "Design systems & component libraries",
      "Accessibility (WCAG 2.1 AA)",
      "Motion design & micro-interactions",
    ],
  },
  {
    icon: Cpu,
    title: "Tech Consulting",
    description:
      "Strategic technology guidance for businesses at any stage. From startup MVPs to enterprise modernization.",
    features: [
      "Architecture reviews & recommendations",
      "Technology stack audits",
      "Performance optimization",
      "Security assessments",
      "Digital transformation roadmaps",
    ],
  },
];

const capabilities = [
  { icon: Globe, label: "Global CDN Deployment" },
  { icon: Database, label: "Database Architecture" },
  { icon: Lock, label: "Security First" },
  { icon: Gauge, label: "Performance Optimized" },
  { icon: Smartphone, label: "Mobile Responsive" },
  { icon: Search, label: "SEO Optimized" },
  { icon: GitBranch, label: "Version Controlled" },
  { icon: Code2, label: "Clean Code" },
];

export default function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative grid-bg px-6 py-24">
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-brand-accent/5 rounded-full blur-[100px]" />
        <div className="relative mx-auto max-w-7xl">
          <p className="font-mono text-xs font-semibold uppercase tracking-widest text-brand-accent mb-2">
            // Services
          </p>
          <h1 className="font-mono text-4xl font-bold text-foreground md:text-6xl">
            What We <span className="text-brand-accent text-glow">Build</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-brand-text">
            Full-spectrum technology services from concept to deployment and
            beyond. Every solution is engineered for performance, security, and
            scale.
          </p>
        </div>
      </section>

      {/* Services Detail */}
      <section className="bg-brand-bg px-6 py-24">
        <div className="mx-auto max-w-7xl space-y-16">
          {services.map((service, i) => (
            <div
              key={service.title}
              className="glow-border rounded-2xl bg-brand-primary/30 p-8 md:p-12 backdrop-blur"
            >
              <div className="flex flex-col md:flex-row gap-8 md:gap-16">
                <div className="flex-1">
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-brand-accent/10 border border-brand-accent/20 mb-6">
                    <service.icon className="h-7 w-7 text-brand-accent" />
                  </div>
                  <div className="font-mono text-xs text-brand-accent/60 mb-2">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <h2 className="font-mono text-2xl font-bold text-foreground md:text-3xl">
                    {service.title}
                  </h2>
                  <p className="mt-4 text-brand-text leading-relaxed">
                    {service.description}
                  </p>
                </div>
                <div className="flex-1">
                  <h3 className="font-mono text-xs uppercase tracking-widest text-brand-accent mb-4">
                    Capabilities
                  </h3>
                  <ul className="space-y-3">
                    {service.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-3 text-sm text-brand-text"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-brand-accent flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Capabilities Grid */}
      <section className="border-y border-brand-accent/10 bg-brand-bg-alt px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <p className="font-mono text-xs font-semibold uppercase tracking-widest text-brand-accent mb-2">
            // Standards
          </p>
          <h2 className="font-mono text-3xl font-bold text-foreground">
            Every Project Includes
          </h2>

          <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
            {capabilities.map((cap) => (
              <div
                key={cap.label}
                className="flex flex-col items-center gap-3 rounded-xl border border-brand-accent/10 bg-brand-bg/50 p-6 text-center hover:border-brand-accent/30 transition-colors"
              >
                <cap.icon className="h-6 w-6 text-brand-accent" />
                <span className="font-mono text-xs text-brand-text">
                  {cap.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="grain bg-brand-primary px-6 py-24">
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <h2 className="font-mono text-3xl font-bold text-white md:text-4xl">
            Ready to Start Your{" "}
            <span className="text-brand-accent text-glow">Project</span>?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-brand-text">
            Book a free consultation to discuss your requirements. We&apos;ll
            scope the project, recommend a stack, and provide a timeline.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/book"
              className="inline-flex items-center gap-2 rounded-lg bg-brand-accent px-8 py-3.5 font-mono text-sm font-bold text-brand-bg hover:bg-brand-accent-light transition-all"
            >
              Book a Consultation
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-8 py-3.5 font-mono text-sm font-bold text-white hover:bg-white/5 transition-all"
            >
              Send a Message
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
