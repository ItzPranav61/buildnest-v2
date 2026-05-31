import type { SupabaseClient } from "@supabase/supabase-js";
import type { PendingOpportunityPayload } from "./types";

export async function insertPendingOpportunity(supabase: SupabaseClient, payload: PendingOpportunityPayload) {
  const insertPayload = {
    ...payload,
    review_status: "pending" as const,
    is_automated: true as const
  };

  const { data, error } = await supabase
    .from("opportunities")
    .insert(insertPayload)
    .select("id, title, review_status")
    .single();

  if (error) {
    throw new Error(`Unable to insert pending opportunity: ${error.message}`);
  }

  return data as { id: string; title: string; review_status: "pending" };
}
