import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";
import { findDuplicateOpportunity } from "./lib/dedupe-opportunity";
import { insertPendingOpportunity } from "./lib/insert-pending-opportunity";
import { normalizeOpportunityDraft, validateOpportunityPayload } from "./lib/normalize-opportunity";
import type { IngestionMode, SourceAdapter } from "./lib/types";
import { gssocAdapter } from "./sources/gssoc";

const adapters = new Map<string, SourceAdapter>([[gssocAdapter.id, gssocAdapter]]);

function loadEnvFile(path: string) {
  if (!existsSync(path)) {
    return;
  }

  const contents = readFileSync(path, "utf8");

  contents.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      return;
    }

    const separatorIndex = trimmed.indexOf("=");

    if (separatorIndex === -1) {
      return;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim().replace(/^["']|["']$/g, "");

    if (!process.env[key]) {
      process.env[key] = value;
    }
  });
}

function getMode(): IngestionMode {
  return process.argv.includes("--insert") ? "insert" : "dry-run";
}

function getSelectedSourceIds() {
  const sourceArg = process.argv.find((arg) => arg.startsWith("--source="));
  const sourceList = sourceArg?.split("=")[1] ?? "gssoc";

  return sourceList
    .split(",")
    .map((source) => source.trim())
    .filter(Boolean);
}

async function runAdapter(adapter: SourceAdapter, mode: IngestionMode, supabase: SupabaseClient) {
  console.log("");
  console.log(`[${adapter.id}] Source: ${adapter.source_name}`);
  console.log(`[${adapter.id}] URL: ${adapter.source_url}`);
  console.log(`[${adapter.id}] Mode: ${mode}`);

  try {
    const draft = await adapter.extract();
    const payload = normalizeOpportunityDraft(draft);
    const validationErrors = validateOpportunityPayload(payload);

    if (validationErrors.length > 0) {
      console.log(`[${adapter.id}] Validation failed: ${validationErrors.join("; ")}`);
      return {
        source_name: adapter.source_name,
        source_url: adapter.source_url,
        status: "failed" as const,
        message: "Validation failed",
        errors: validationErrors
      };
    }

    console.log(`[${adapter.id}] Normalized payload ready`);
    console.log("Final payload:");
    console.log(JSON.stringify(payload, null, 2));

    const duplicate = await findDuplicateOpportunity(supabase, payload);

    if (duplicate) {
      console.log(
        `[${adapter.id}] Skipped duplicate (${duplicate.reason}): ${duplicate.row.id} | ${duplicate.row.title} | ${duplicate.row.review_status}`
      );
      return {
        source_name: adapter.source_name,
        source_url: adapter.source_url,
        status: "skipped_duplicate" as const,
        message: `Duplicate found by ${duplicate.reason}`,
        row_id: duplicate.row.id
      };
    }

    console.log(`[${adapter.id}] No duplicate found`);

    if (mode === "dry-run") {
      console.log(`[${adapter.id}] Dry run only. No Supabase insert performed.`);
      return {
        source_name: adapter.source_name,
        source_url: adapter.source_url,
        status: "dry_run" as const,
        message: "Dry run completed"
      };
    }

    const insertedRow = await insertPendingOpportunity(supabase, payload);
    console.log(`[${adapter.id}] Inserted pending row: ${insertedRow.id} | ${insertedRow.title} | ${insertedRow.review_status}`);

    return {
      source_name: adapter.source_name,
      source_url: adapter.source_url,
      status: "inserted" as const,
      message: "Inserted pending opportunity",
      row_id: insertedRow.id
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.log(`[${adapter.id}] Failed: ${message}`);
    return {
      source_name: adapter.source_name,
      source_url: adapter.source_url,
      status: "failed" as const,
      message,
      errors: [message]
    };
  }
}

async function main() {
  loadEnvFile(resolve(process.cwd(), ".env.local"));

  const rawSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!rawSupabaseUrl) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
  }

  if (!supabaseServiceRoleKey) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");
  }

  const mode = getMode();
  const selectedSourceIds = getSelectedSourceIds();
  const supabaseUrl = rawSupabaseUrl.replace(/\/rest\/v1\/?$/, "");
  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });

  console.log(`BuildNest ingestion mode: ${mode}`);
  console.log(`Selected sources: ${selectedSourceIds.join(", ")}`);

  const results = [];

  for (const sourceId of selectedSourceIds) {
    const adapter = adapters.get(sourceId);

    if (!adapter) {
      console.log(`[${sourceId}] Failed: unknown source adapter`);
      results.push({
        source_name: sourceId,
        source_url: "",
        status: "failed" as const,
        message: "Unknown source adapter",
        errors: ["Unknown source adapter"]
      });
      continue;
    }

    results.push(await runAdapter(adapter, mode, supabase));
  }

  console.log("");
  console.log("Ingestion summary:");
  results.forEach((result) => {
    console.log(`${result.status}: ${result.source_name} - ${result.message}${result.row_id ? ` (${result.row_id})` : ""}`);
  });

  if (results.some((result) => result.status === "failed")) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
