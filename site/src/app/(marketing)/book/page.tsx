import type { Metadata } from "next";
import { BookingForm } from "@/components/ui/BookingForm";
import { Video, Clock, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Book a Consultation",
  description: "Schedule a free consultation with Sierra-117 to discuss your project.",
};

const benefits = [
  {
    icon: Video,
    title: "30-Minute Video Call",
    text: "A focused session to understand your goals, review your current setup, and discuss solutions.",
  },
  {
    icon: Clock,
    title: "No Commitment",
    text: "Completely free. No sales pressure. Just honest technical advice from experienced engineers.",
  },
  {
    icon: Shield,
    title: "Actionable Insights",
    text: "Walk away with a clear understanding of what to build, the right stack, and a rough timeline.",
  },
];

export default function BookPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative grid-bg px-6 py-24">
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-brand-accent/5 rounded-full blur-[100px]" />
        <div className="relative mx-auto max-w-7xl">
          <p className="font-mono text-xs font-semibold uppercase tracking-widest text-brand-accent mb-2">
            // Book a Call
          </p>
          <h1 className="font-mono text-4xl font-bold text-foreground md:text-6xl">
            Let&apos;s Talk{" "}
            <span className="text-brand-accent text-glow">Strategy</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-brand-text">
            Book a free 30-minute consultation. We&apos;ll discuss your project,
            recommend the right approach, and give you a clear path forward.
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="border-y border-brand-accent/10 bg-brand-primary/50 px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 md:grid-cols-3">
            {benefits.map((b) => (
              <div key={b.title} className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-accent/10 border border-brand-accent/20 flex-shrink-0">
                  <b.icon className="h-5 w-5 text-brand-accent" />
                </div>
                <div>
                  <h3 className="font-mono text-sm font-bold text-foreground">
                    {b.title}
                  </h3>
                  <p className="mt-1 text-xs text-brand-text">{b.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section className="bg-brand-bg px-6 py-24">
        <div className="mx-auto max-w-3xl">
          <div className="glow-border rounded-xl bg-brand-primary/30 p-8 md:p-10 backdrop-blur">
            <h2 className="font-mono text-xl font-bold text-foreground mb-2">
              Schedule Your Consultation
            </h2>
            <p className="text-sm text-brand-text mb-8">
              Pick a date and time that works for you. All times are in EST.
            </p>
            <BookingForm />
          </div>
        </div>
      </section>
    </>
  );
}
