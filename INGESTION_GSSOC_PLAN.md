# GSSoC Ingestion Script Plan

## Goal

Create a standalone ingestion script for:

```text
https://gssoc.girlscript.org/
```

The script should extract the GirlScript Summer of Code opportunity and insert it into Supabase as a pending review record.

This script must not change public pages, dashboard UI, auth, CRUD behavior, or database schema.

## Extraction Approach

Use Firecrawl to scrape the GSSoC source page and extract a structured opportunity payload.

Target source:

```text
https://gssoc.girlscript.org/
```

Recommended extraction fields:

- title
- organization
- category
- deadline
- location
- description
- external_link
- source_url

The script should treat Firecrawl output as draft data. Even if extraction succeeds, the inserted row must remain pending until an admin approves it.

## Fields Mapped

Map extracted data into the existing `opportunities` table shape:

| Supabase Field | Value |
| --- | --- |
| `title` | Extracted title, expected: `GirlScript Summer of Code 2026` |
| `organization` | Extracted organization, expected: `GirlScript Foundation` |
| `category` | Extracted category, expected: `Open Source` |
| `status` | Use `Open` if applications are active, otherwise `Upcoming` if uncertain |
| `description` | Short extracted program summary |
| `location` | Extracted location, expected: `India` or `Online` depending source wording |
| `tags` | Suggested: `["Open Source", "GSSoC", "Student Program"]` |
| `deadline` | Extracted deadline if reliable, otherwise `null` |
| `external_link` | Extracted application or source link |
| `review_status` | Always `pending` |
| `is_automated` | Always `true` |
| `source_name` | Always `GSSoC` |
| `source_url` | Always `https://gssoc.girlscript.org/` |
| `scraped_at` | Current timestamp |

Important deadline rule:

If the deadline is missing, ambiguous, invalid, or one of several program dates, store `deadline = null`. Do not create placeholder dates.

## Dedupe Strategy

Primary duplicate check:

```text
source_url exact match
```

Before inserting, query Supabase for:

```sql
select id, title, review_status
from opportunities
where source_url = 'https://gssoc.girlscript.org/'
limit 1;
```

If a row exists, skip insert and log:

```text
Skipped: source_url already exists
```

This prevents duplicate pending records from repeated runs.

Optional future fallback:

- `external_link` exact match
- normalized `title + organization`

For the first version, only `source_url` exact match is required by scope.

## Insert Rules

The script must always insert automated rows with:

```text
review_status = 'pending'
is_automated = true
source_name = 'GSSoC'
source_url = 'https://gssoc.girlscript.org/'
scraped_at = current timestamp
```

The script must never insert:

```text
review_status = 'approved'
```

The script must not publish anything directly. Admin approval remains required.

## Risks

### Deadline Ambiguity

GSSoC pages may include multiple dates, such as contributor applications, mentor applications, project submissions, or program milestones.

Mitigation:

- Only store a deadline if extraction clearly identifies the application deadline.
- Otherwise store `deadline = null` and let the app display `Rolling`.

### Application Link Drift

The visible apply link may be a page anchor, external form, or time-sensitive destination.

Mitigation:

- Store the best extracted `external_link`.
- Keep `source_url` as the original page for admin verification.
- Leave the row pending until an admin confirms the link.

### Source Layout Changes

The page may change structure and cause extraction to become incomplete.

Mitigation:

- Validate required fields before insert.
- If title, organization, category, or status is missing, log failure and do not insert.

### Duplicate Pending Spam

Repeated script runs could create duplicate GSSoC opportunities.

Mitigation:

- Enforce source URL dedupe before insert.
- Log skipped rows clearly.

### Accidental Auto-Publish

The manual Add form defaults to approved, but automation must not use that default.

Mitigation:

- Explicitly set `review_status = 'pending'`.
- Explicitly set `is_automated = true`.
- Include test assertions for those values.

## Test Strategy

### Dry Run Test

Run the script in dry-run mode first.

Expected output:

- Extracted title
- Extracted organization
- Extracted category
- Extracted deadline or `null`
- Extracted external link
- Final payload preview
- No Supabase insert

### Insert Test

Run the script with insert enabled.

Expected behavior:

- One row inserted.
- Row has `review_status = 'pending'`.
- Row has `is_automated = true`.
- Row has `source_name = 'GSSoC'`.
- Row has `source_url = 'https://gssoc.girlscript.org/'`.
- Row has `scraped_at` set.

### Duplicate Test

Run the script a second time.

Expected behavior:

- No new row inserted.
- Script logs that the source URL already exists.

### App Visibility Test

After insert:

- Home page should not show the GSSoC pending row.
- `/opportunities` should not show the pending row.
- Dashboard Pending tab should show the row.
- Approving from dashboard should publish it.

### Cleanup Test

If running against production during QA:

- Delete the test row after verification unless the admin intentionally wants to keep it for review.

## Recommended Script Shape

Future implementation file:

```text
scripts/ingest-gssoc.ts
```

Recommended npm script:

```json
"ingest:gssoc": "tsx scripts/ingest-gssoc.ts"
```

Recommended flags:

```text
--dry-run
--insert
```

Default should be dry-run unless the user explicitly runs insert mode.
