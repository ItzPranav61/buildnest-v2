"use client";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (command: "config" | "event" | "js", targetId: string | Date, params?: Record<string, unknown>) => void;
  }
}

export const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export function trackEvent(name: string, params?: Record<string, unknown>) {
  if (!gaMeasurementId || typeof window === "undefined" || !window.gtag) {
    if (gaMeasurementId && typeof window !== "undefined") {
      window.dataLayer = window.dataLayer ?? [];
      window.dataLayer.push(["event", name, params]);
    }

    return;
  }

  window.gtag("event", name, params);
}

export function trackPageView(path: string) {
  if (typeof window === "undefined") {
    return;
  }

  trackEvent(path, {
    page_path: window.location.pathname,
    page_location: window.location.href,
    page_title: document.title
  });
}
