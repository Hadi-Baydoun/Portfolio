export const GA_MEASUREMENT_ID = "G-DR7Q2NQSZF";

const GTAG_SRC = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;

let initialized = false;

/**
 * Loads GA4 via gtag.js once. Safe to call multiple times (e.g. React StrictMode / HMR).
 */
export function initAnalytics() {
  if (initialized) return;
  if (document.querySelector(`script[src="${GTAG_SRC}"]`)) {
    initialized = true;
    return;
  }

  initialized = true;

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;

  gtag("js", new Date());
  gtag("config", GA_MEASUREMENT_ID);

  const script = document.createElement("script");
  script.async = true;
  script.src = GTAG_SRC;
  document.head.appendChild(script);
}
