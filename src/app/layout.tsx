import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Porada - Tech consulting & websites, built by humans",
    template: "%s | Porada",
  },
  description:
    "Porada is a small studio that builds websites and untangles tech for small businesses, mid-market teams, and agency partners.",
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
      </head>
      <body suppressHydrationWarning className="flex min-h-full flex-col antialiased">
        {children}
      </body>
    </html>
  );
}
