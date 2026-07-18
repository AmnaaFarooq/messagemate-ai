// Google Analytics 4 integration. Completely inert unless
// VITE_GA_MEASUREMENT_ID is set, so local dev never sends data anywhere.
//
// GA4 gives you: visit counts, geography, device/browser, referrer (i.e.
// where the click came from — Twitter, LinkedIn, direct link, etc.), and
// which pages/buttons people interact with, all in a free dashboard at
// https://analytics.google.com.

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

const MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

let initialized = false;

export function initAnalytics(): void {
  if (!MEASUREMENT_ID || initialized) return;
  initialized = true;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer.push(args);
  };
  window.gtag("js", new Date());
  // anonymize_ip keeps this reasonably privacy-friendly / GDPR-lighter.
  window.gtag("config", MEASUREMENT_ID, { anonymize_ip: true });
}

export function trackPageView(path: string): void {
  if (!MEASUREMENT_ID || !window.gtag) return;
  window.gtag("event", "page_view", { page_path: path });
}

export function trackEvent(name: string, params?: Record<string, unknown>): void {
  if (!MEASUREMENT_ID || !window.gtag) return;
  window.gtag("event", name, params);
}
