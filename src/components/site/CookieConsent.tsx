"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import Script from "next/script";

const STORAGE_KEY = "porada-cookie-consent"; // value: "accepted" | "declined"
const CONSENT_EVENT = "porada-consent-change";

// Analytics / advertising identifiers. These load on the public site ONLY after the
// visitor accepts cookies via the banner below. Until then nothing is requested and no
// data is sent to Google or Meta.
const GA_MEASUREMENT_ID = "G-BMKN0D6K7M";
const META_PIXEL_ID = "1456728696136491";

type Consent = "accepted" | "declined" | null;

// Read the stored consent as an external browser store so we never call setState in an
// effect and never produce a hydration mismatch (server always reports "no choice yet").
function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(CONSENT_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CONSENT_EVENT, onChange);
  };
}

function getSnapshot(): Consent {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === "accepted" || stored === "declined" ? stored : null;
  } catch {
    return null;
  }
}

function getServerSnapshot(): Consent {
  return null;
}

export function CookieConsent() {
  const consent = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function choose(value: "accepted" | "declined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // Ignore storage failures (e.g. privacy mode); the dispatched event still updates UI.
    }
    window.dispatchEvent(new Event(CONSENT_EVENT));
  }

  const accepted = consent === "accepted";

  return (
    <>
      {accepted && (
        <>
          {/* Google Analytics — loaded only after consent. */}
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}');`}
          </Script>

          {/* Meta Pixel — loaded only after consent. No <noscript> fallback on purpose:
              a no-JS fallback would fire without the visitor's consent. */}
          <Script id="meta-pixel" strategy="afterInteractive">
            {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${META_PIXEL_ID}');
fbq('track', 'PageView');`}
          </Script>
        </>
      )}

      {consent === null && (
        <div className="cookie-consent" role="dialog" aria-live="polite" aria-label="Cookie consent">
          <p className="cookie-consent-text">
            We use cookies to run this site and, with your permission, to measure traffic and improve our advertising.
            See our{" "}
            <Link href="/privacy" className="cookie-consent-link">
              Privacy Policy
            </Link>
            .
          </p>
          <div className="cookie-consent-actions">
            <button type="button" className="btn btn-ghost" onClick={() => choose("declined")}>
              Decline
            </button>
            <button type="button" className="btn btn-primary" onClick={() => choose("accepted")}>
              Accept
            </button>
          </div>
        </div>
      )}
    </>
  );
}
