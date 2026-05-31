import { normalizeDeadline, normalizeExternalLink } from "../lib/normalize-opportunity";
import type { OpportunityDraft, SourceAdapter } from "../lib/types";

const sourceUrl = "https://summerofcode.withgoogle.com/";
const timelineUrl = "https://summerofcode.withgoogle.com/programs/current/timeline";
const sourceName = "GSoC";

function fallbackExtraction(): OpportunityDraft {
  console.log("[gsoc] Using fallback extraction");
  console.log("[gsoc] Confidence: medium - official source is stable, deadline requires admin review");

  return {
    title: "Google Summer of Code",
    organization: "Google Open Source",
    category: "Open Source",
    status: "Upcoming",
    description:
      "Google Summer of Code is a global online program focused on bringing new contributors into open source software development.",
    location: "Online / Global",
    tags: ["Open Source", "GSoC", "Student Program"],
    deadline: null,
    external_link: sourceUrl,
    source_name: sourceName,
    source_url: sourceUrl
  };
}

function clearApplicationDeadline(value: unknown) {
  if (typeof value !== "string") {
    return null;
  }

  const cleaned = value.trim();

  if (!cleaned || /ambiguous|unknown|unspecified|not clear/i.test(cleaned)) {
    return null;
  }

  return normalizeDeadline(cleaned);
}

async function extractWithFirecrawlApi() {
  const apiKey = process.env.FIRECRAWL_API_KEY;

  if (!apiKey) {
    return null;
  }

  console.log("[gsoc] Using Firecrawl API extraction");

  const response = await fetch("https://api.firecrawl.dev/v2/scrape", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      url: timelineUrl,
      formats: ["json"],
      onlyMainContent: true,
      waitFor: 5000,
      jsonOptions: {
        prompt:
          "Extract the Google Summer of Code student opportunity. Only return the contributor/student application deadline if it is clearly labelled. If there are multiple dates or ambiguity, return deadline as null or empty. Return title, organization, category, status, deadline, location, description, external_link, confidence.",
        schema: {
          type: "object",
          properties: {
            title: { type: "string" },
            organization: { type: "string" },
            category: { type: "string" },
            status: { type: "string" },
            deadline: { type: "string" },
            location: { type: "string" },
            description: { type: "string" },
            external_link: { type: "string" },
            confidence: { type: "string" }
          }
        }
      }
    })
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Firecrawl API extraction failed (${response.status}): ${body}`);
  }

  const result = await response.json();
  const extracted = result?.data?.json ?? result?.json;

  if (!extracted || typeof extracted !== "object") {
    throw new Error("Firecrawl API response did not include a JSON extraction payload.");
  }

  console.log(`[gsoc] Confidence: ${String(extracted.confidence ?? "medium")} - deadline remains pending admin review`);

  return {
    title: String(extracted.title ?? "Google Summer of Code").trim(),
    organization: String(extracted.organization ?? "Google Open Source").trim(),
    category: String(extracted.category ?? "Open Source").trim(),
    status: String(extracted.status ?? "Upcoming").trim(),
    description: String(
      extracted.description ??
        "Google Summer of Code is a global online program focused on bringing new contributors into open source software development."
    ).trim(),
    location: String(extracted.location ?? "Online / Global").trim(),
    tags: ["Open Source", "GSoC", "Student Program"],
    deadline: clearApplicationDeadline(extracted.deadline),
    external_link: normalizeExternalLink(extracted.external_link) ?? sourceUrl,
    source_name: sourceName,
    source_url: sourceUrl
  } satisfies OpportunityDraft;
}

export const gsocAdapter: SourceAdapter = {
  id: "gsoc",
  source_name: sourceName,
  source_url: sourceUrl,
  async extract() {
    try {
      const firecrawlExtraction = await extractWithFirecrawlApi();

      if (firecrawlExtraction) {
        return firecrawlExtraction;
      }
    } catch (error) {
      console.warn(error instanceof Error ? `[gsoc] ${error.message}` : error);
      console.log("[gsoc] Falling back to manual extraction");
    }

    return fallbackExtraction();
  }
};
