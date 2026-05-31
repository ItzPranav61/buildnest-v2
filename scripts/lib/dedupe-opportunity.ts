import type { SupabaseClient } from "@supabase/supabase-js";
import type { DuplicateRow, PendingOpportunityPayload } from "./types";

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

  return null;
}
