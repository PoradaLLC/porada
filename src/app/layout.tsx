import type { Metadata } from "next";
import { JetBrains_Mono, Inter } from "next/font/google";
import "./globals.css";

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Schtubbs | Web Development & Tech Solutions", template: "%s | Schtubbs" },
  description:
    "Schtubbs builds cutting-edge websites and delivers tech solutions that drive results. Custom development, cloud infrastructure, and digital transformation.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${mono.variable} ${inter.variable} h-full`}>
      <body className="flex min-h-full flex-col font-sans bg-brand-bg text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
