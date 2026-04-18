import type { Metadata } from "next";
import { JetBrains_Mono, Inter, Fraunces, Space_Grotesk } from "next/font/google";
import "./globals.css";

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz"],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Sierra-117 — Tech consulting & websites, built by humans",
    template: "%s | Sierra-117",
  },
  description:
    "Sierra-117 is a small studio that builds websites and untangles tech for small businesses, mid-market teams, and agency partners.",
};

// Runs before paint: reads the persisted theme from localStorage and
// sets data-theme on <html>. We render two <meta name="theme-color">
// tags with prefers-color-scheme media queries; the globals.css rule
// `:root[data-theme="atlas"] { color-scheme: light; }` /
// `:root[data-theme="signal"] { color-scheme: dark; }` determines the
// effective UA color scheme, which selects which meta applies. iOS
// Safari honors color-scheme re-evaluation but ignores direct
// mutations of a theme-color tag, so we let CSS do the flipping.
// We do still need to manipulate apple-mobile-web-app-status-bar-style
// directly since iOS PWA status-bar metas don't support media queries.
const themeBootstrap = `(function(){try{var t=localStorage.getItem('s117-theme');if(t!=='atlas'&&t!=='signal')t='atlas';document.documentElement.setAttribute('data-theme',t);var s=document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');if(s)s.parentNode.removeChild(s);var sb=document.createElement('meta');sb.setAttribute('name','apple-mobile-web-app-status-bar-style');sb.setAttribute('content',t==='signal'?'black-translucent':'default');document.head.appendChild(sb);}catch(e){document.documentElement.setAttribute('data-theme','atlas');}})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-theme="atlas"
      data-scroll-behavior="smooth"
      className={`${jetbrains.variable} ${inter.variable} ${fraunces.variable} ${spaceGrotesk.variable} h-full`}
    >
      <head>
        {/* Two theme-color metas — the one whose media matches the
            current color-scheme wins. color-scheme is set by
            data-theme via CSS, so toggling Atlas/Signal re-runs the
            media evaluation and flips the browser-chrome tint without
            needing to mutate the DOM. */}
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#f3efe7" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#0c0e0d" />
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
      </head>
      <body className="flex min-h-full flex-col antialiased">{children}</body>
    </html>
  );
}
