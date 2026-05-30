import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";

type ReviewStatus = "pending" | "approved" | "rejected";

type ExtractedOpportunity = {
  title: string;
  organization: string;
  category: string;
  status: string;
  description: string;
  location: string;
  tags: string[];
  deadline: string | null;
  external_link: string | null;
};

type IngestionPayload = ExtractedOpportunity & {
  source_name: "GSSoC";
  source_url: typeof sourceUrl;
  scraped_at: string;
  review_status: ReviewStatus;
  is_automated: boolean;
};

type DuplicateRow = {
  id: string;
  title: string;
  review_status: ReviewStatus;
};

const sourceUrl = "https://gssoc.girlscript.org/";
const sourceName = "GSSoC";

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

function isInsertMode() {
  return process.argv.includes("--insert");
}

function isDryRunMode() {
  return !isInsertMode();
}

function normalizeDeadline(value: unknown) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();

  if (!trimmed || /unspecified|unknown|rolling/i.test(trimmed)) {
    return null;
  }

  return trimmed;
}

function normalizeExternalLink(value: unknown) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();

  if (!/^https?:\/\//i.test(trimmed)) {
    return null;
  }

  return trimmed;
}

function validatePayload(payload: IngestionPayload) {
  const missing = ["title", "organization", "category", "status"].filter((field) => {
    const value = payload[field as keyof IngestionPayload];
    return typeof value !== "string" || value.trim() === "";
  });

  if (missing.length > 0) {
    throw new Error(`Missing required extracted fields: ${missing.join(", ")}`);
  }
}

function fallbackExtraction(): ExtractedOpportunity {
  console.log("Using fallback extraction");

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
    external_link: sourceUrl
  };
}

async function extractWithFirecrawlApi() {
  const apiKey = process.env.FIRECRAWL_API_KEY;

  if (!apiKey) {
    return null;
  }

  console.log("Using Firecrawl API extraction");

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
    external_link: normalizeExternalLink(extracted.external_link) ?? sourceUrl
  } satisfies ExtractedOpportunity;
}

async function extractOpportunity() {
  try {
    const firecrawlExtraction = await extractWithFirecrawlApi();

    if (firecrawlExtraction) {
      return firecrawlExtraction;
    }
  } catch (error) {
    console.warn(error instanceof Error ? error.message : error);
    console.log("Falling back to manual extraction");
  }

  return fallbackExtraction();
}

function createPayload(extracted: ExtractedOpportunity): IngestionPayload {
  return {
    ...extracted,
    deadline: normalizeDeadline(extracted.deadline),
    external_link: normalizeExternalLink(extracted.external_link) ?? sourceUrl,
    source_name: sourceName,
    source_url: sourceUrl,
    scraped_at: new Date().toISOString(),
    review_status: "pending",
    is_automated: true
  };
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

  const mode = isDryRunMode() ? "dry-run" : "insert";
  console.log(`GSSoC ingestion mode: ${mode}`);

  const supabaseUrl = rawSupabaseUrl.replace(/\/rest\/v1\/?$/, "");
  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });

  const extracted = await extractOpportunity();
  const payload = createPayload(extracted);
  validatePayload(payload);

  console.log("");
  console.log("Final payload:");
  console.log(JSON.stringify(payload, null, 2));

  if (isDryRunMode()) {
    console.log("");
    console.log("Dry run only. No Supabase insert performed.");
    return;
  }

  const { data: duplicateRows, error: duplicateError } = await supabase
    .from("opportunities")
    .select("id, title, review_status")
    .eq("source_url", sourceUrl)
    .limit(1);

  if (duplicateError) {
    throw new Error(`Unable to check duplicate source_url: ${duplicateError.message}`);
  }

  const duplicate = (duplicateRows?.[0] ?? null) as DuplicateRow | null;

  if (duplicate) {
    console.log("");
    console.log("Skipped duplicate source_url.");
    console.log(`Duplicate row: ${duplicate.id} | ${duplicate.title} | ${duplicate.review_status}`);
    return;
  }

  const { data: insertedRow, error: insertError } = await supabase
    .from("opportunities")
    .insert(payload)
    .select("id, title, review_status")
    .single();

  if (insertError) {
    throw new Error(`Unable to insert GSSoC opportunity: ${insertError.message}`);
  }

  console.log("");
  console.log("Inserted row:");
  console.log(`${insertedRow.id} | ${insertedRow.title} | ${insertedRow.review_status}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
