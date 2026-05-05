import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const SITE_URL = "https://poradasolutions.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Porada Solutions — Web design, development & fractional CTO (NY/NJ/PA)",
    template: "%s | Porada Solutions",
  },
  description:
    "Porada Solutions is a small studio building websites and untangling tech for small businesses, mid-market teams, and agency partners. Based in the NY/NJ/PA area; remote by default.",
  applicationName: "Porada Solutions",
  authors: [{ name: "Porada Solutions" }],
  creator: "Porada Solutions",
  publisher: "Porada LLC",
  keywords: [
    "Porada",
    "Porada Solutions",
    "web design",
    "web development",
    "Next.js developer",
    "fractional CTO",
    "small business website",
    "website agency NJ",
    "website agency NY",
    "website agency Pennsylvania",
    "tech consulting",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Porada Solutions",
    title: "Porada Solutions — Web design, development & fractional CTO",
    description:
      "A small studio building careful websites and untangling tech for small businesses and agency partners. NY/NJ/PA — remote by default.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Porada Solutions",
    description:
      "Web design, development, and fractional CTO services for small businesses and agency partners.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Porada Solutions",
  legalName: "Porada LLC",
  url: SITE_URL,
  logo: `${SITE_URL}/porada-logo@2x.png`,
  email: "team@poradasolutions.com",
  description:
    "A small studio building websites and untangling tech for small businesses, mid-market teams, and agency partners.",
  foundingDate: "2026",
  areaServed: [
    { "@type": "AdministrativeArea", name: "New York" },
    { "@type": "AdministrativeArea", name: "New Jersey" },
    { "@type": "AdministrativeArea", name: "Pennsylvania" },
    { "@type": "Country", name: "United States" },
  ],
  knowsAbout: [
    "Web design",
    "Web development",
    "Next.js",
    "Fractional CTO services",
    "Tech advisory",
    "Website hosting and maintenance",
    "Platform migrations",
  ],
  founder: [
    { "@type": "Person", name: "Michal Bienias" },
    { "@type": "Person", name: "Marcin Bienias" },
    { "@type": "Person", name: "Daniel Bzura" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${playfair.variable} h-full`}>
      <head>
        <meta name="theme-color" content="#f3efe7" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body suppressHydrationWarning className="flex min-h-full flex-col antialiased">
        {children}
      </body>
    </html>
  );
}
