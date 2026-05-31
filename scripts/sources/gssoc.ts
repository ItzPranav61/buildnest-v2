import { normalizeDeadline, normalizeExternalLink } from "../lib/normalize-opportunity";
import type { OpportunityDraft, SourceAdapter } from "../lib/types";

const sourceUrl = "https://gssoc.girlscript.org/";
const sourceName = "GSSoC";

function fallbackExtraction(): OpportunityDraft {
  console.log("[gssoc] Using fallback extraction");

  return {
    title: "GirlScript Summer of Code 2026",
    organization: "GirlScript Foundation",
    category: "Open Source",
    status: "Open",
    description:
      "GirlScript Summer of Code is an open source program for student builders and developers to contribute to real projects with community mentorship.",
    location: "India",
    tags: ["Open Source", "GSSoC", "Student Program"],
    deadline: null,
    external_link: sourceUrl,
    source_name: sourceName,
    source_url: sourceUrl
  };
}

async function extractWithFirecrawlApi() {
  const apiKey = process.env.FIRECRAWL_API_KEY;

  if (!apiKey) {
    return null;
  }

  console.log("[gssoc] Using Firecrawl API extraction");

  const response = await fetch("https://api.firecrawl.dev/v2/scrape", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      url: sourceUrl,
      formats: ["json"],
      onlyMainContent: true,
      waitFor: 5000,
      jsonOptions: {
        prompt:
          "Extract a BuildNest opportunity from this page. Return title, organization, category, deadline, location, description, external_link.",
        schema: {
          type: "object",
          properties: {
            title: { type: "string" },
            organization: { type: "string" },
            category: { type: "string" },
            deadline: { type: "string" },
            location: { type: "string" },
            description: { type: "string" },
            external_link: { type: "string" }
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

  return {
    title: String(extracted.title ?? "").trim(),
    organization: String(extracted.organization ?? "").trim(),
    category: String(extracted.category ?? "Open Source").trim(),
    status: "Open",
    description: String(extracted.description ?? "").trim(),
    location: String(extracted.location ?? "India").trim(),
    tags: ["Open Source", "GSSoC", "Student Program"],
    deadline: normalizeDeadline(extracted.deadline),
    external_link: normalizeExternalLink(extracted.external_link) ?? sourceUrl,
    source_name: sourceName,
    source_url: sourceUrl
  } satisfies OpportunityDraft;
}

export const gssocAdapter: SourceAdapter = {
  id: "gssoc",
  source_name: sourceName,
  source_url: sourceUrl,
  async extract() {
    try {
      const firecrawlExtraction = await extractWithFirecrawlApi();

      if (firecrawlExtraction) {
        return firecrawlExtraction;
      }
    } catch (error) {
      console.warn(error instanceof Error ? `[gssoc] ${error.message}` : error);
      console.log("[gssoc] Falling back to manual extraction");
    }

    return fallbackExtraction();
  }
};
