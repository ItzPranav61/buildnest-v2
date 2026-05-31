import type { SupabaseClient } from "@supabase/supabase-js";

export type ReviewStatus = "pending" | "approved" | "rejected";
export type IngestionMode = "dry-run" | "insert";

export type OpportunityDraft = {
  title: string;
  organization: string;
  category: string;
  status: string;
  description: string;
  location: string;
  tags: string[];
  deadline: string | null;
  external_link: string | null;
  source_name: string;
  source_url: string;
};

export type PendingOpportunityPayload = OpportunityDraft & {
  scraped_at: string;
  review_status: "pending";
  is_automated: true;
};

export type DuplicateRow = {
  id: string;
  title: string;
  review_status: ReviewStatus;
  source_url: string | null;
  external_link: string | null;
};

export type SourceAdapter = {
  id: string;
  source_name: string;
  source_url: string;
  extract(): Promise<OpportunityDraft>;
};

export type IngestionContext = {
  mode: IngestionMode;
  supabase: SupabaseClient;
};

export type IngestionResult = {
  source_name: string;
  source_url: string;
  status: "dry_run" | "inserted" | "skipped_duplicate" | "failed";
  message: string;
  row_id?: string;
  errors?: string[];
};
