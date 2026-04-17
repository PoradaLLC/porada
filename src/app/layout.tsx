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

const themeBootstrap = `(function(){try{var t=localStorage.getItem('s117-theme');if(t!=='atlas'&&t!=='signal')t='atlas';document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','atlas');}})();`;

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
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
      </head>
      <body className="flex min-h-full flex-col antialiased">{children}</body>
    </html>
  );
}
