import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";

type OpportunityRow = {
  id: string;
  title: string;
  description: string | null;
  external_link: string | null;
};

type UpdateExample = {
  id: string;
  title: string;
  externalLink: string;
  beforeDescription: string;
  afterDescription: string;
};

const urlPattern = /https?:\/\/[^\s)]+/i;

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

function cleanDescription(description: string) {
  return description
    .split(/\r?\n/)
    .filter((line) => !/^\s*(link|deadline)\s*:/i.test(line))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function extractExternalLink(description: string) {
  return description.match(urlPattern)?.[0] ?? null;
}

function preview(value: string) {
  return value.length > 220 ? `${value.slice(0, 217)}...` : value;
}

async function main() {
  loadEnvFile(resolve(process.cwd(), ".env.local"));

  const rawSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!rawSupabaseUrl) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
  }

  if (!supabaseKey) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  const supabaseUrl = rawSupabaseUrl.replace(/\/rest\/v1\/?$/, "");
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data, error } = await supabase
    .from("opportunities")
    .select("id, title, description, external_link")
    .is("external_link", null);

  if (error) {
    throw new Error(`Unable to fetch opportunities: ${error.message}`);
  }

  const rows = (data ?? []) as OpportunityRow[];
  const examples: UpdateExample[] = [];
  let skippedWithoutUrl = 0;

  for (const row of rows) {
    const description = row.description ?? "";
    const externalLink = extractExternalLink(description);

    if (!externalLink) {
      skippedWithoutUrl += 1;
      continue;
    }

    const cleanedDescription = cleanDescription(description);
    const { data: updatedRows, error: updateError } = await supabase
      .from("opportunities")
      .update({
        external_link: externalLink,
        description: cleanedDescription
      })
      .eq("id", row.id)
      .is("external_link", null)
      .select("id, external_link, description");

    if (updateError) {
      throw new Error(`Unable to update ${row.id} (${row.title}): ${updateError.message}`);
    }

    if (!updatedRows || updatedRows.length === 0) {
      throw new Error(
        `Update matched no rows for ${row.id} (${row.title}). If this is production, provide SUPABASE_SERVICE_ROLE_KEY or run with an authenticated update policy.`
      );
    }

    examples.push({
      id: row.id,
      title: row.title,
      externalLink,
      beforeDescription: description,
      afterDescription: cleanedDescription
    });

    console.log(`Updated: ${row.title} -> ${externalLink}`);
  }

  console.log("");
  console.log(`Rows scanned with empty external_link: ${rows.length}`);
  console.log(`Rows updated: ${examples.length}`);
  console.log(`Rows skipped without URL: ${skippedWithoutUrl}`);

  if (examples.length > 0) {
    console.log("");
    console.log("Examples before/after:");
    examples.slice(0, 3).forEach((example, index) => {
      console.log(`\n${index + 1}. ${example.title}`);
      console.log(`external_link: ${example.externalLink}`);
      console.log(`before: ${preview(example.beforeDescription)}`);
      console.log(`after: ${preview(example.afterDescription)}`);
    });
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
