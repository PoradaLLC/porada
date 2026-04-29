export type CaseKind = "website" | "product" | "migration" | "advisory";

export type CaseStudy = {
  id: string;
  title: string;
  kind: CaseKind;
  year: string;
  url?: string;
  thumb?: string;
  excerpt: string;
  tags: string[];
  stats: [string, string][];
  art: "warm" | "cool";
  body: {
    challenge: string;
    approach: string;
    outcome: string;
    quote: { text: string; who: string } | null;
  };
};

export const CASES: CaseStudy[] = [
  {
    id: "pocono-property-care",
    title: "Pocono Property Care",
    kind: "website",
    year: "2026.03",
    url: "https://poconopropertycare.com",
    thumb: "/work/pocono-property-care.png",
    excerpt:
      "Modern marketing and inquiry site for a Poconos-based property management company. Fast mobile load, inquiries piped straight into a real inbox.",
    tags: ["Website", "Property management", "Next.js"],
    stats: [
      ["< 1s", "Mobile load"],
      ["3 wk", "Timeline"],
      ["2026", "Shipped"],
    ],
    art: "warm",
    body: {
      challenge:
        "Kacper had a property-management business that looked and ran larger than its website suggested. The prior site was a slow template with no reliable way for prospective clients or homeowners to reach him - inquiry forms went to an address that was no longer monitored.",
      approach:
        "Rebuilt the site on Next.js and Vercel with a clean inquiry flow backed by Supabase. Every form submission is stored, routed to Kacper's primary email, and visible in a lightweight admin view so nothing slips through. Pages were written around the services he actually offers, not a generic services grid.",
      outcome:
        "Site loads in under a second on mobile, the inquiry path is one tap from anywhere on the site, and Kacper has a single place to see every incoming request. We shipped in three weeks end to end.",
      quote: null,
    },
  },
  {
    id: "forteca-estate",
    title: "Forteca Estate",
    kind: "website",
    year: "2026.04",
    url: "https://fortecaestate.com",
    thumb: "/work/forteca-estate.png",
    excerpt:
      "Brand site for Forteca Estate - clear, considered presentation of what the business does, built on Next.js and Vercel with Supabase-backed contact.",
    tags: ["Website", "Real estate", "Next.js"],
    stats: [
      ["2 wk", "Timeline"],
      ["100%", "Mobile-ready"],
      ["2026", "Shipped"],
    ],
    art: "cool",
    body: {
      challenge:
        "Forteca Estate needed a site that matched the care they bring to their work. Prospective clients were finding them through word of mouth but bouncing at the web presence, which didn't communicate what the team actually does.",
      approach:
        "A quiet, editorial-style marketing site built with Next.js on Vercel. Supabase behind the contact form so inbound inquiries land in a place the team can actually see. No bloat, no stock imagery - the content does the work.",
      outcome:
        "A credible, fast web presence that reflects the business. Shipped in two weeks with a structure that's easy for the team to extend later.",
      quote: null,
    },
  },
  {
    id: "church-of-saint-luke",
    title: "Church of Saint Luke",
    kind: "website",
    year: "2026.04",
    url: "https://churchofsaintluke.vercel.app",
    thumb: "/work/church-of-saint-luke.png",
    excerpt:
      "Parish website for Church of Saint Luke - service times, announcements, and contact in one place. Easy for parishioners of any age to navigate.",
    tags: ["Website", "Non-profit", "Next.js"],
    stats: [
      ["1 wk", "Timeline"],
      ["AA", "Accessibility"],
      ["2026", "Shipped"],
    ],
    art: "warm",
    body: {
      challenge:
        "The parish needed a simple, dependable site for service times, events, and contact. Parishioners skew older, so the site had to read cleanly on a phone and be immediately usable by someone who doesn't navigate modern sites often.",
      approach:
        "Next.js on Vercel with a deliberately plain visual system - large type, high contrast, short paths to whatever a visitor needs. Built to WCAG AA so it works with screen readers and keyboard alone. Deployed to a free Vercel project so hosting is no burden on the parish.",
      outcome:
        "A calm, accessible website parishioners can actually use, deployed in a week. The parish office has a single URL to share and no monthly hosting bill.",
      quote: null,
    },
  },
];
