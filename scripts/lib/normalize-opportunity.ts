import type { OpportunityDraft, PendingOpportunityPayload } from "./types";

const validStatuses = new Set(["Open", "Upcoming", "Expired"]);

function cleanString(value: unknown) {
  return typeof value === "string" ? value.trim().replace(/\s+/g, " ") : "";
}

function cleanNullableString(value: unknown) {
  const cleaned = cleanString(value);
  return cleaned.length > 0 ? cleaned : null;
}

export function normalizeDeadline(value: unknown) {
  const cleaned = cleanNullableString(value);

  if (!cleaned || /^(unspecified|unknown|rolling|null|n\/a)$/i.test(cleaned) || cleaned === "0001-01-01") {
    return null;
  }

  return cleaned;
}

export function normalizeExternalLink(value: unknown) {
  const cleaned = cleanNullableString(value);

  if (!cleaned) {
    return null;
  }

  return /^https?:\/\//i.test(cleaned) ? cleaned : null;
}

function normalizeTags(tags: unknown) {
  if (!Array.isArray(tags)) {
    return [];
  }

  return Array.from(
    new Set(
      tags
        .map((tag) => cleanString(tag))
        .filter(Boolean)
    )
  );
}

export function normalizeOpportunityDraft(draft: OpportunityDraft): PendingOpportunityPayload {
  const status = cleanString(draft.status);

  return {
    title: cleanString(draft.title),
    organization: cleanString(draft.organization),
    category: cleanString(draft.category),
    status: validStatuses.has(status) ? status : "Upcoming",
    description: cleanString(draft.description),
    location: cleanString(draft.location),
    tags: normalizeTags(draft.tags),
    deadline: normalizeDeadline(draft.deadline),
    external_link: normalizeExternalLink(draft.external_link),
    source_name: cleanString(draft.source_name),
    source_url: cleanString(draft.source_url),
    scraped_at: new Date().toISOString(),
    review_status: "pending",
    is_automated: true
  };
}

export function validateOpportunityPayload(payload: PendingOpportunityPayload) {
  const missing = ["title", "organization", "category", "status", "source_name", "source_url"].filter((field) => {
    const value = payload[field as keyof PendingOpportunityPayload];
    return typeof value !== "string" || value.trim() === "";
  });

  if (missing.length > 0) {
    return [`Missing required fields: ${missing.join(", ")}`];
  }

  if (payload.external_link && !/^https?:\/\//i.test(payload.external_link)) {
    return ["external_link must start with http:// or https://"];
  }

  return [];
}
