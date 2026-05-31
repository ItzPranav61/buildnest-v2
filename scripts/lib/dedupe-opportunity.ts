import type { SupabaseClient } from "@supabase/supabase-js";
import type { DuplicateRow, PendingOpportunityPayload } from "./types";

function normalizeDedupeText(value: string) {
  return value
    .toLowerCase()
    .replace(/\bgssoc\b/g, "girlscript summer of code")
    .replace(/\bgsoc\b/g, "google summer of code")
    .replace(/\bgirl script\b/g, "girlscript")
    .replace(/\bgirlscript summer of code\b/g, "girlscript summer of code")
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export async function findDuplicateOpportunity(supabase: SupabaseClient, payload: PendingOpportunityPayload) {
  const { data: sourceMatches, error: sourceError } = await supabase
    .from("opportunities")
    .select("id, title, review_status, source_url, external_link")
    .eq("source_url", payload.source_url)
    .limit(1);

  if (sourceError) {
    throw new Error(`Unable to check duplicate source_url: ${sourceError.message}`);
  }

  if (sourceMatches?.[0]) {
    return {
      reason: "source_url",
      row: sourceMatches[0] as DuplicateRow
    };
  }

  if (!payload.external_link) {
    return null;
  }

  const { data: linkMatches, error: linkError } = await supabase
    .from("opportunities")
    .select("id, title, review_status, source_url, external_link")
    .eq("external_link", payload.external_link)
    .limit(1);

  if (linkError) {
    throw new Error(`Unable to check duplicate external_link: ${linkError.message}`);
  }

  if (linkMatches?.[0]) {
    return {
      reason: "external_link",
      row: linkMatches[0] as DuplicateRow
    };
  }

  const { data: possibleRows, error: possibleRowsError } = await supabase
    .from("opportunities")
    .select("id, title, organization, review_status, source_url, external_link");

  if (possibleRowsError) {
    throw new Error(`Unable to check duplicate title + organization: ${possibleRowsError.message}`);
  }

  const payloadTitle = normalizeDedupeText(payload.title);
  const payloadOrganization = normalizeDedupeText(payload.organization);
  const titleOrganizationMatch = possibleRows?.find((row) => {
    const candidate = row as DuplicateRow & { organization?: string | null };
    return (
      normalizeDedupeText(candidate.title ?? "") === payloadTitle &&
      normalizeDedupeText(candidate.organization ?? "") === payloadOrganization
    );
  });

  if (titleOrganizationMatch) {
    return {
      reason: "title_organization",
      row: titleOrganizationMatch as DuplicateRow
    };
  }

  return null;
}
