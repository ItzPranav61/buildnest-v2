import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";

type OpportunityRow = {
  id: string;
  title: string;
  organization: string;
  category: string;
  status: string;
  description: string;
  location: string;
  deadline: string | null;
  external_link: string | null;
  review_status: string;
};

type DiscordEmbedField = {
  name: string;
  value: string;
  inline?: boolean;
};

type DiscordWebhookPayload = {
  username: string;
  content: string;
  embeds: Array<{
    title: string;
    url: string;
    description: string;
    color: number;
    fields: DiscordEmbedField[];
    footer: {
      text: string;
    };
  }>;
};

const BUILDNEST_BASE_URL = "https://buildnest-v2.vercel.app";
const DISCORD_EMBED_BLUE = 3447003;

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

function getArgValue(name: string) {
  const equalsArg = process.argv.find((arg) => arg.startsWith(`${name}=`));

  if (equalsArg) {
    return equalsArg.slice(name.length + 1).trim();
  }

  const index = process.argv.indexOf(name);

  if (index !== -1) {
    return process.argv[index + 1]?.trim();
  }

  return undefined;
}

function normalizeSupabaseUrl(rawUrl: string) {
  return rawUrl.replace(/\/rest\/v1\/?$/, "");
}

function formatDeadline(deadline: string | null) {
  if (!deadline || deadline.trim() === "" || deadline.startsWith("0001-01-01")) {
    return "Rolling";
  }

  const date = new Date(`${deadline}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return "Rolling";
  }

  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric"
  }).format(date);
}

function truncate(value: string, maxLength: number) {
  const normalized = value.replace(/\s+/g, " ").trim();

  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, Math.max(0, maxLength - 1)).trimEnd()}…`;
}

function buildDiscordPayload(opportunity: OpportunityRow): DiscordWebhookPayload {
  const detailUrl = `${BUILDNEST_BASE_URL}/opportunity/${opportunity.id}`;

  return {
    username: "BuildNest",
    content: "New opportunity approved on BuildNest.",
    embeds: [
      {
        title: opportunity.title,
        url: detailUrl,
        description: truncate(opportunity.description, 280),
        color: DISCORD_EMBED_BLUE,
        fields: [
          { name: "Organization", value: opportunity.organization, inline: true },
          { name: "Category", value: opportunity.category, inline: true },
          { name: "Status", value: opportunity.status, inline: true },
          { name: "Location", value: opportunity.location || "Remote / Flexible", inline: true },
          { name: "Deadline", value: formatDeadline(opportunity.deadline), inline: true },
          { name: "Apply", value: opportunity.external_link ?? "", inline: false },
          { name: "View on BuildNest", value: detailUrl, inline: false }
        ],
        footer: {
          text: "BuildNest opportunity radar"
        }
      }
    ]
  };
}

function sanitizeError(error: unknown) {
  if (error instanceof Error) {
    return error.message.replace(/https:\/\/discord\.com\/api\/webhooks\/\S+/gi, "[discord-webhook-url]");
  }

  return String(error).replace(/https:\/\/discord\.com\/api\/webhooks\/\S+/gi, "[discord-webhook-url]");
}

async function main() {
  loadEnvFile(resolve(process.cwd(), ".env.local"));

  const opportunityId = getArgValue("--id");
  const dryRun = process.argv.includes("--dry-run");
  const rawSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const discordWebhookUrl = process.env.DISCORD_OPPORTUNITIES_WEBHOOK_URL;

  if (!opportunityId) {
    throw new Error("Missing required --id <opportunity-id>");
  }

  if (!rawSupabaseUrl) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
  }

  if (!supabaseServiceRoleKey) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");
  }

  if (!dryRun && !discordWebhookUrl) {
    throw new Error("Missing DISCORD_OPPORTUNITIES_WEBHOOK_URL");
  }

  const supabase = createClient(normalizeSupabaseUrl(rawSupabaseUrl), supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });

  const { data, error } = await supabase
    .from("opportunities")
    .select("id, title, organization, category, status, description, location, deadline, external_link, review_status")
    .eq("id", opportunityId)
    .maybeSingle();

  if (error) {
    throw new Error(`Unable to fetch opportunity: ${error.message}`);
  }

  if (!data) {
    throw new Error(`Opportunity not found: ${opportunityId}`);
  }

  const opportunity = data as OpportunityRow;

  if (opportunity.review_status !== "approved") {
    throw new Error(`Opportunity must be approved before posting. Current review_status: ${opportunity.review_status}`);
  }

  if (!opportunity.external_link) {
    throw new Error("Opportunity is missing external_link");
  }

  const payload = buildDiscordPayload(opportunity);

  if (dryRun) {
    console.log("Discord opportunity dry-run");
    console.log(`Opportunity: ${opportunity.id} | ${opportunity.title}`);
    console.log("Sanitized webhook payload:");
    console.log(JSON.stringify(payload, null, 2));
    console.log("Dry-run complete. No Discord request sent.");
    return;
  }

  const response = await fetch(discordWebhookUrl as string, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const responseBody = await response.text();
    throw new Error(`Discord webhook failed: ${response.status} ${response.statusText} ${truncate(responseBody, 240)}`);
  }

  console.log(`Posted opportunity to Discord: ${opportunity.id} | ${opportunity.title}`);
}

main().catch((error) => {
  console.error(`Error: ${sanitizeError(error)}`);
  process.exitCode = 1;
});
