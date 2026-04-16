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
  LayoutDashboard,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Web development, cloud solutions, UI/UX design, and tech consulting. Sierra-117 delivers full-spectrum technology services.",
};

const services = [
  {
    icon: Code2,
    title: "Custom Web Development",
    description:
      "Your business needs a site that loads fast, looks professional, and actually brings in customers. We build that with modern tools and clean code.",
    features: [
      "Marketing sites & landing pages",
      "Online booking & scheduling",
      "E-commerce with Stripe payments",
      "Contact forms & lead capture",
      "Mobile-friendly on every device",
    ],
  },
  {
    icon: LayoutDashboard,
    title: "CRM Development",
    description:
      "Custom dashboards and tools to manage your clients, leads, and day-to-day operations. Built around how you actually work.",
    features: [
      "Client & lead management",
      "Custom admin dashboards",
      "Automated email & follow-ups",
      "Reporting & analytics",
      "Integration with your existing tools",
    ],
  },
  {
    icon: Cloud,
    title: "Cloud Infrastructure",
    description:
      "We set up, deploy, and manage the servers and databases behind your site so you never have to think about it.",
    features: [
      "AWS, Vercel & cloud deployments",
      "Database setup & management",
      "Automated backups & monitoring",
      "Domain & DNS configuration",
      "Performance optimization",
    ],
  },
  {
    icon: Palette,
    title: "UI/UX Design",
    description:
      "Design that converts visitors into customers. Clean layouts, clear calls to action, and a look that builds trust.",
    features: [
      "Custom designs tailored to your brand",
      "Wireframes & prototypes before we build",
      "Responsive design for all screen sizes",
      "Built with accessibility in mind",
      "Modern animations & interactions",
    ],
  },
  {
    icon: Cpu,
    title: "Tech Consulting",
    description:
      "Not sure what you need? We can review your current setup, recommend the right tools, and help you make smart technical decisions.",
    features: [
      "Website & tech stack audits",
      "Performance reviews",
      "Security best practices",
      "Tool & platform recommendations",
      "Ongoing technical guidance",
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
          <p className="mt-6 max-w-2xl text-lg text-brand-text leading-relaxed">
            Websites, apps, and infrastructure for businesses that need things
            done right. Every project includes hosting and ongoing maintenance.
          </p>
        </div>
      </section>

      {/* Services Detail */}
      <section className="border-t border-white/5 bg-brand-bg px-6 py-24">
        <div className="mx-auto max-w-7xl space-y-16">
          {services.map((service, i) => (
            <div
              key={service.title}
              data-reveal
              data-reveal-delay={String(i + 1)}
              data-spotlight
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
      <section className="border-y border-white/5 bg-brand-bg-alt px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div data-reveal>
            <p className="font-mono text-xs font-semibold uppercase tracking-widest text-brand-accent mb-2">
              // Standards
            </p>
            <h2 className="font-mono text-3xl font-bold text-foreground">
              Every Project Includes
            </h2>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
            {capabilities.map((cap, i) => (
              <div
                key={cap.label}
                data-reveal
                data-reveal-delay={String(i + 1)}
                className="flex flex-col items-center gap-3 rounded-xl border border-white/[0.08] bg-brand-bg/50 p-6 text-center hover:border-white/[0.15] hover:-translate-y-0.5 transition-all hover:shadow-[0_0_15px_rgba(34,211,238,0.06)]"
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
      <section className="grain border-t border-white/5 bg-brand-primary px-6 py-24">
        <div className="relative z-10 mx-auto max-w-4xl text-center" data-reveal>
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
              className="inline-flex items-center gap-2 rounded-lg bg-brand-accent px-8 py-3.5 font-mono text-sm font-bold text-brand-bg hover:bg-brand-accent-light transition-all hover:shadow-[0_0_20px_rgba(34,211,238,0.2)]"
            >
              Book a Consultation
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-lg border border-brand-accent/30 px-8 py-3.5 font-mono text-sm font-bold text-brand-accent hover:bg-brand-accent/5 transition-all"
            >
              Send a Message
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
