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

// Runs before paint: picks the stored theme, sets the data attribute,
// and injects a fresh <meta name="theme-color"> so mobile status bars
// and the notch letterbox tint the correct color from the very first
// frame. We remove-and-recreate the tag (not just mutate its content)
// because iOS Safari sometimes caches the initial theme-color and
// ignores subsequent attribute updates to the same element. Also sets
// the iOS PWA status-bar style so users who save-to-home-screen get a
// matching chrome.
const themeBootstrap = `(function(){try{var t=localStorage.getItem('s117-theme');if(t!=='atlas'&&t!=='signal')t='atlas';document.documentElement.setAttribute('data-theme',t);var c=t==='signal'?'#0c0e0d':'#f3efe7';var old=document.querySelector('meta[name="theme-color"]');if(old)old.parentNode.removeChild(old);var m=document.createElement('meta');m.setAttribute('name','theme-color');m.setAttribute('content',c);document.head.appendChild(m);var s=document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');if(s)s.parentNode.removeChild(s);var sb=document.createElement('meta');sb.setAttribute('name','apple-mobile-web-app-status-bar-style');sb.setAttribute('content',t==='signal'?'black-translucent':'default');document.head.appendChild(sb);}catch(e){document.documentElement.setAttribute('data-theme','atlas');}})();`;

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
        {/* Note: no static theme-color tag here — the bootstrap script
            below injects a fresh <meta> with the correct color based on
            the persisted theme. iOS Safari locks in the initial static
            theme-color and then ignores later mutations of the same
            tag, so we let the script create it from scratch. */}
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
      </head>
      <body className="flex min-h-full flex-col antialiased">{children}</body>
    </html>
  );
}
