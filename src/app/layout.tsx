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
  verification: {
    // Replace with the actual content values from Google Search Console / Bing Webmaster Tools.
    // google: "google-site-verification-token-here",
    // other: { "msvalidate.01": "bing-verification-token-here" },
  },
  category: "technology",
};

const professionalServiceJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${SITE_URL}/#organization`,
  name: "Porada Solutions",
  legalName: "Porada LLC",
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/porada-logo@2x.png`,
    width: 512,
    height: 512,
  },
  image: `${SITE_URL}/opengraph-image`,
  email: "team@poradasolutions.com",
  priceRange: "$$",
  description:
    "A small studio building websites and untangling tech for small businesses, mid-market teams, and agency partners.",
  foundingDate: "2026",
  areaServed: [
    { "@type": "AdministrativeArea", name: "New York" },
    { "@type": "AdministrativeArea", name: "New Jersey" },
    { "@type": "AdministrativeArea", name: "Pennsylvania" },
    { "@type": "Country", name: "United States" },
  ],
  serviceType: [
    "Web design",
    "Web development",
    "Fractional CTO services",
    "Website hosting and maintenance",
    "Platform migrations",
    "Technical workshops",
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

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: "Porada Solutions",
  publisher: { "@id": `${SITE_URL}/#organization` },
  inLanguage: "en-US",
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(professionalServiceJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              name: "Porada Solutions",
              legalName: "Porada LLC",
              description:
                "A small tech studio that builds websites and untangles tech for small businesses, local organizations, and agency partners.",
              url: SITE_URL,
              telephone: "+12019695875",
              email: "team@poradasolutions.com",
              address: {
                "@type": "PostalAddress",
                streetAddress: "1960 PA-611",
                addressLocality: "Swiftwater",
                addressRegion: "PA",
                postalCode: "18370",
                addressCountry: "US",
              },
              sameAs: [
                "https://www.facebook.com/profile.php?id=61589297094692",
                "https://www.instagram.com/poradasolutions/",
              ],
              openingHoursSpecification: {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                opens: "09:00",
                closes: "18:00",
              },
            }),
          }}
        />
      </head>
      <body suppressHydrationWarning className="flex min-h-full flex-col antialiased">
        {/*
          Google Analytics and the Meta Pixel are intentionally NOT loaded here.
          They load only after the visitor accepts cookies — see
          src/components/site/CookieConsent.tsx, rendered in the marketing layout.
        */}
        {children}
      </body>
    </html>
  );
}
