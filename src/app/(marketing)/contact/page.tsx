import type { Metadata } from "next";
import { ContactForm } from "@/components/ui/ContactForm";
import { Mail, MapPin, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Sierra-117. We'd love to hear about your project.",
};

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "hello@sierra-117.dev",
    href: "mailto:hello@sierra-117.dev",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Remote-First, Global Team",
    href: null,
  },
  {
    icon: Clock,
    label: "Response Time",
    value: "Within 24 hours",
    href: null,
  },
];

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative grid-bg px-6 py-24">
        <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-brand-accent/5 rounded-full blur-[100px]" />
        <div className="relative mx-auto max-w-7xl">
          <p className="font-mono text-xs font-semibold uppercase tracking-widest text-brand-accent mb-2">
            // Contact
          </p>
          <h1 className="font-mono text-4xl font-bold text-foreground md:text-6xl">
            Get In <span className="text-brand-accent text-glow">Touch</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-brand-text">
            Have a project in mind? Need technical guidance? Drop us a line and
            we&apos;ll get back to you within 24 hours.
          </p>
        </div>
      </section>

      {/* Form + Info */}
      <section className="bg-brand-bg px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-16 lg:grid-cols-3">
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-6">
              {contactInfo.map((info) => (
                <div
                  key={info.label}
                  className="glow-border rounded-xl bg-brand-primary/30 p-6"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <info.icon className="h-5 w-5 text-brand-accent" />
                    <span className="font-mono text-xs uppercase tracking-widest text-brand-accent">
                      {info.label}
                    </span>
                  </div>
                  {info.href ? (
                    <a
                      href={info.href}
                      className="font-mono text-sm text-foreground hover:text-brand-accent transition-colors"
                    >
                      {info.value}
                    </a>
                  ) : (
                    <p className="font-mono text-sm text-foreground">
                      {info.value}
                    </p>
                  )}
                </div>
              ))}

              {/* Terminal decoration */}
              <div className="rounded-xl border border-brand-accent/10 bg-brand-primary/20 p-6">
                <div className="font-mono text-xs space-y-1.5 text-brand-text/50">
                  <p>
                    <span className="text-brand-accent">$</span> ping
                    sierra-117.dev
                  </p>
                  <p>64 bytes: time=0.42ms</p>
                  <p>64 bytes: time=0.38ms</p>
                  <p className="text-brand-accent">
                    --- connection established ---
                  </p>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              <div className="glow-border rounded-xl bg-brand-primary/30 p-8 md:p-10 backdrop-blur">
                <h2 className="font-mono text-xl font-bold text-foreground mb-8">
                  Send Us a Message
                </h2>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
