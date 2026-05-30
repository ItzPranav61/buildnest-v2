"use client";

import { ReactNode, useEffect } from "react";
import { trackEvent, trackPageView } from "@/lib/analytics";

type PageViewTrackerProps = {
  eventName: string;
};

type TrackedExternalLinkProps = {
  href: string;
  title: string;
  category: string;
  organization: string;
  className: string;
  children: ReactNode;
};

export function PageViewTracker({ eventName }: PageViewTrackerProps) {
  useEffect(() => {
    trackPageView(eventName);
  }, [eventName]);

  return null;
}

export function TrackedExternalLink({
  href,
  title,
  category,
  organization,
  className,
  children
}: TrackedExternalLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() =>
        trackEvent("open_opportunity_click", {
          title,
          category,
          organization
        })
      }
    >
      {children}
    </a>
  );
}
