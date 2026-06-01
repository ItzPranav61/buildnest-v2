import type { SupabaseClient } from "@supabase/supabase-js";

export type AutomationRunStatus = "success" | "failed" | "skipped" | "partial";

export type AutomationRunInput = {
  source_name: string;
  source_url: string;
  status: AutomationRunStatus;
  mode: "insert";
  inserted_count: number;
  duplicate_count: number;
  failed_count: number;
  message: string;
  error_message?: string | null;
  started_at: string;
  finished_at: string;
  duration_ms: number;
};

function redactKnownSecret(value: string, secret: string | undefined) {
  if (!secret) {
    return value;
  }

  return value.split(secret).join("[redacted]");
}

export function sanitizeAutomationLogMessage(value: unknown) {
  const raw = value instanceof Error ? value.message : String(value ?? "");
  const secrets = [process.env.SUPABASE_SERVICE_ROLE_KEY, process.env.FIRECRAWL_API_KEY].filter(
    (secret): secret is string => Boolean(secret)
  );
  const redacted = secrets.reduce((message, secret) => redactKnownSecret(message, secret), raw);

  return redacted
    .replace(/Bearer\s+[A-Za-z0-9._-]+/gi, "Bearer [redacted]")
    .replace(/(apikey|api_key|service_role_key)=([^&\s]+)/gi, "$1=[redacted]")
    .slice(0, 1000);
}

export async function logAutomationRun(supabase: SupabaseClient, run: AutomationRunInput) {
  const { data, error } = await supabase
    .from("automation_runs")
    .insert({
      source_name: run.source_name,
      source_url: run.source_url,
      status: run.status,
      mode: run.mode,
      inserted_count: run.inserted_count,
      duplicate_count: run.duplicate_count,
      failed_count: run.failed_count,
      message: sanitizeAutomationLogMessage(run.message),
      error_message: run.error_message ? sanitizeAutomationLogMessage(run.error_message) : null,
      started_at: run.started_at,
      finished_at: run.finished_at,
      duration_ms: run.duration_ms
    })
    .select("id, source_name, status, inserted_count, duplicate_count, failed_count, created_at")
    .single();

  if (error) {
    throw error;
  }

  return data;
}
