import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import Script from "next/script";
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
        {/* Google Analytics */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-BMKN0D6K7M" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-BMKN0D6K7M');
        `}</Script>
        {/* Meta Pixel */}
        <Script id="meta-pixel" strategy="afterInteractive">{`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '1456728696136491');
          fbq('track', 'PageView');
        `}</Script>
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img height="1" width="1" style={{display:"none"}} src="https://www.facebook.com/tr?id=1456728696136491&ev=PageView&noscript=1" alt="" />
        </noscript>
      </body>
    </html>
  );
}
