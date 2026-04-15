"use client";

import { useState, useCallback } from "react";
import { ChevronDown, X, ArrowRight, ExternalLink } from "lucide-react";

interface Testimonial {
  quote: string;
  name: string;
  business: string;
  role: string;
  project: string;
  url: string;
  previewImage?: string;
  stack: string[];
  description: string;
  isLive: boolean;
  challenge: string;
  solution: string;
  results: string[];
}

const testimonials: Testimonial[] = [
  {
    quote:
      "Working with Sierra-117 was seamless from start to finish. They delivered exactly what we needed, on time.",
    name: "J.M.",
    business: "Pocono Property Care",
    role: "Owner",
    project: "Pocono Property Care",
    url: "https://poconopropertycare.com",
    stack: ["Next.js", "Tailwind", "Vercel"],
    description:
      "Full website for a Pocono Mountains property maintenance company. Before/after galleries, service pages, testimonials, and a lead-generation contact flow.",
    isLive: true,
    challenge:
      "The client had no online presence and was losing leads to competitors with modern websites. They needed a fast, professional site that could showcase their work and capture inquiries.",
    solution:
      "We built a fully custom Next.js site with before/after image galleries, detailed service breakdowns, and an optimized multi-step contact form. The site was deployed on Vercel's edge network for sub-second load times across the region.",
    results: [
      "Launched in under 3 weeks from kickoff",
      "Page load time under 1 second on mobile",
      "Lead form submissions increased from 0 to 15+ per week",
    ],
  },
  {
    quote:
      "The site they built loads incredibly fast and looks great on every device. Exactly what we asked for.",
    name: "R.T.",
    business: "Placeholder Client",
    role: "Founder",
    project: "Coming Soon",
    url: "",
    previewImage: "",
    stack: ["Next.js", "Tailwind", "Supabase"],
    description: "Placeholder project description — replace when ready.",
    isLive: false,
    challenge:
      "Details coming soon — this project is currently in development.",
    solution:
      "Details coming soon — this project is currently in development.",
    results: ["Project in progress"],
  },
  {
    quote:
      "Professional, communicative, and technically excellent. Would absolutely work with them again.",
    name: "A.K.",
    business: "Placeholder Client",
    role: "Operations Manager",
    project: "Coming Soon",
    url: "",
    previewImage: "",
    stack: ["Next.js", "TypeScript", "Vercel"],
    description: "Placeholder project description — replace when ready.",
    isLive: false,
    challenge:
      "Details coming soon — this project is currently in development.",
    solution:
      "Details coming soon — this project is currently in development.",
    results: ["Project in progress"],
  },
];

function getPreviewUrl(url: string, previewImage?: string): string | null {
  if (previewImage) return previewImage;
  if (url) return `/api/screenshot?url=${encodeURIComponent(url)}`;
  return null;
}

function TestimonialCard({
  testimonial,
  index,
  isExpanded,
  onToggle,
}: {
  testimonial: Testimonial;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const t = testimonial;

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onToggle();
    },
    [onToggle]
  );

  const handleLinkClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggle();
        }
      }}
      data-spotlight
      className={`group cursor-pointer rounded-xl border bg-brand-primary/40 backdrop-blur transition-all duration-300 ease-in-out overflow-hidden select-none ${
        isExpanded
          ? "border-brand-accent/30 bg-brand-primary/60"
          : "border-brand-accent/10 hover:border-brand-accent/25"
      }`}
    >
      {/* Preview thumbnail */}
      <div className="aspect-[16/9] relative border-b border-brand-accent/10 overflow-hidden">
        {t.isLive && getPreviewUrl(t.url, t.previewImage) ? (
          <>
            <img
              src={getPreviewUrl(t.url, t.previewImage)!}
              alt={`${t.project} preview`}
              className="absolute inset-0 w-full h-full object-cover object-top opacity-60 group-hover:opacity-80 transition-opacity duration-300"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-bg/90 via-brand-bg/40 to-transparent" />
            <div className="relative h-full flex items-end p-5">
              <div>
                <p className="font-mono text-lg font-bold text-foreground group-hover:text-brand-accent transition-colors drop-shadow-lg">
                  {t.project}
                </p>
                <p className="mt-0.5 font-mono text-xs text-brand-text/70">
                  {t.url.replace("https://", "")}
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className="h-full bg-brand-bg-alt flex items-center justify-center">
            <div className="text-center px-6">
              <p className="font-mono text-lg font-bold text-foreground group-hover:text-brand-accent transition-colors">
                {t.project}
              </p>
              {t.isLive && (
                <p className="mt-1 font-mono text-xs text-brand-text/50">
                  {t.url.replace("https://", "")}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Collapsed content: quote + attribution */}
      <div className="p-6">
        <p className="text-sm text-brand-text leading-relaxed italic">
          &ldquo;{t.quote}&rdquo;
        </p>
        <div className="mt-4">
          <p className="font-mono text-sm font-bold text-foreground">
            {t.name}
          </p>
          <p className="font-mono text-xs text-brand-text/50">
            {t.business} &middot; {t.role}
          </p>
        </div>

        {/* Collapsed affordance */}
        <div
          className={`flex items-center gap-1 font-mono text-xs text-brand-accent transition-all duration-200 overflow-hidden ${
            isExpanded ? "max-h-0 opacity-0 mt-0" : "max-h-8 opacity-100 mt-4"
          }`}
        >
          See what we built
          <ChevronDown className="h-3 w-3" />
        </div>

        {/* Expanded content */}
        <div
          className={`grid transition-all duration-300 ease-in-out ${
            isExpanded ? "grid-rows-[1fr] opacity-100 mt-5" : "grid-rows-[0fr] opacity-0 mt-0"
          }`}
        >
          <div className="overflow-hidden">
            <div className="border-t border-brand-accent/10 pt-5 space-y-5">
              {/* Stack pills */}
              <div className="flex flex-wrap gap-2">
                {t.stack.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-brand-accent/5 border border-brand-accent/10 px-2.5 py-0.5 font-mono text-[10px] text-brand-accent"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Challenge */}
              <div>
                <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-brand-accent/70 mb-1.5">
                  The Challenge
                </p>
                <p className="text-sm text-brand-text leading-relaxed">
                  {t.challenge}
                </p>
              </div>

              {/* Solution */}
              <div>
                <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-brand-accent/70 mb-1.5">
                  Our Solution
                </p>
                <p className="text-sm text-brand-text leading-relaxed">
                  {t.solution}
                </p>
              </div>

              {/* Results */}
              <div>
                <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-brand-accent/70 mb-1.5">
                  Results
                </p>
                <ul className="space-y-1">
                  {t.results.map((r, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-sm text-brand-text leading-relaxed"
                    >
                      <span className="mt-1.5 h-1 w-1 rounded-full bg-brand-accent/50 shrink-0" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Visit site link */}
              {t.isLive && (
                <a
                  href={t.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleLinkClick}
                  className="inline-flex items-center gap-1.5 font-mono text-xs text-brand-accent hover:text-brand-accent-light transition-colors"
                >
                  Visit site <ArrowRight className="h-3 w-3" />
                </a>
              )}

              {/* Close */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onToggle();
                }}
                className="flex items-center gap-1 font-mono text-xs text-brand-text/40 hover:text-brand-text transition-colors ml-auto"
              >
                <X className="h-3 w-3" />
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  const [expanded, setExpanded] = useState<number | null>(null);

  const handleToggle = useCallback((index: number) => {
    setExpanded((prev) => (prev === index ? null : index));
  }, []);

  return (
    <section className="bg-brand-bg px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <p className="font-mono text-xs font-semibold uppercase tracking-widest text-brand-accent mb-2">
          // Our Work
        </p>
        <h2 className="font-mono text-3xl font-bold text-foreground md:text-4xl">
          Portfolio
        </h2>
        <p className="mt-4 max-w-2xl text-brand-text">
          A few projects we&apos;ve shipped recently.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-3 items-start">
          {testimonials.map((t, i) => (
            <TestimonialCard
              key={i}
              testimonial={t}
              index={i}
              isExpanded={expanded === i}
              onToggle={() => handleToggle(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
