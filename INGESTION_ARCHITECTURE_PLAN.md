# BuildNest Ingestion Architecture Plan

## Goal

Generalize BuildNest opportunity ingestion beyond the first GSSoC script into a reusable, review-first automation pipeline.

Initial sources:

- GSSoC
- Google Summer of Code
- MLH Fellowship

The system should make it easier to add sources without changing public pages, dashboard CRUD, or Supabase schema for each new source.

## 1. Source Adapter Architecture

Each source should have its own adapter. An adapter is responsible for knowing how to fetch and interpret one source.

Recommended adapter contract:

```text
SourceAdapter
  id
  source_name
  source_url
  fetch()
  extract()
  map()
```

### Adapter Responsibilities

- Define the canonical `source_url`.
- Fetch source content through Firecrawl or a safe fallback.
- Extract raw opportunity fields.
- Map source-specific wording into BuildNest fields.
- Return a shared normalized opportunity draft.

### Initial Adapters

| Adapter | Source URL | Strategy |
| --- | --- | --- |
| `gssoc` | `https://gssoc.girlscript.org/` | Direct page scrape with fallback extraction |
| `gsoc` | `https://summerofcode.withgoogle.com/` | Prefer official program or timeline page |
| `mlh` | `https://fellowship.mlh.io/` | Manual-review-first because deadline extraction is uncertain |

Adapters should not insert directly into Supabase. They should only return normalized drafts to the shared pipeline.

## 2. Shared Opportunity Schema

All adapters should output the same internal draft shape before insertion:

```text
title
organization
category
status
description
location
tags
deadline
external_link
source_name
source_url
scraped_at
review_status
is_automated
```

Required fields:

- `title`
- `organization`
- `category`
- `status`
- `source_name`
- `source_url`

Automation defaults:

```text
review_status = "pending"
is_automated = true
scraped_at = current timestamp
```

Unknown deadlines should remain `null`. The pipeline must never write fake dates for unknown deadlines.

## 3. Normalization Layer

The normalization layer converts source-specific data into BuildNest-safe values.

Responsibilities:

- Trim strings.
- Normalize empty values to `null`.
- Ensure `external_link` starts with `http://` or `https://`.
- Convert tags into a clean string array.
- Map categories into BuildNest categories.
- Validate status values.
- Normalize deadline values.

### Deadline Normalization

Rules:

- Valid clear deadline: store the date.
- Missing deadline: `null`.
- Ambiguous deadline: `null`.
- Invalid date: `null`.
- Placeholder values like `0001-01-01`: `null`.

The app already displays `null` deadlines as `Rolling`, so ingestion should preserve uncertainty.

### Category Normalization

Suggested mappings:

| Source Term | BuildNest Category |
| --- | --- |
| Open source program | Open Source |
| Fellowship | Fellowship |
| Internship alternative | Fellowship |
| Hackathon | Hackathon |
| Student program | Open Source or Fellowship, depending source |

## 4. Duplicate Detection Layer

Deduplication should happen before pending insertion.

Primary checks:

1. `source_url` exact match
2. `external_link` exact match

Fallback check:

```text
normalized title + normalized organization
```

Normalization for duplicate comparison:

- lowercase
- trim whitespace
- collapse repeated spaces
- remove minor punctuation

Duplicate behavior:

- If a duplicate exists, skip insertion.
- Log the duplicate row id, title, and review status.
- Do not overwrite approved rows automatically.
- Do not create a second pending row for the same source.

Future enhancement:

- Allow adapters to update an existing pending row if the source changed and the row is still pending.

## 5. Pending-Review Insertion Layer

Only the shared insertion layer should write to Supabase.

Insert rules:

```text
review_status = "pending"
is_automated = true
source_url required
source_name required
scraped_at required
```

The insertion layer should reject drafts if:

- required fields are missing
- `source_url` is empty
- `external_link` is present but invalid
- duplicate detection finds an existing row

The insertion layer must never publish directly. Admin approval is always required before public visibility.

## 6. Error Handling

Errors should be clear, source-specific, and non-destructive.

Error categories:

- Fetch error
- Extraction error
- Normalization error
- Validation error
- Duplicate skip
- Supabase insert error

Recommended behavior:

- One source failing should not block other sources.
- Failed sources should return a structured result.
- Insert failures should not retry endlessly.
- Partial or low-confidence extraction should not insert.

Example result shape:

```text
source_name
source_url
status: inserted | skipped_duplicate | failed | dry_run
message
row_id
errors
```

## 7. Logging

Logs should be readable in local terminal output and future scheduled jobs.

Each run should log:

- run id
- source name
- source URL
- extraction strategy used
- dry-run or insert mode
- dedupe result
- inserted row id, if inserted
- skipped duplicate row id, if skipped
- validation errors, if failed

Avoid logging secrets:

- Do not print Supabase service role key.
- Do not print Firecrawl API key.
- Do not dump full environment variables.

Recommended log examples:

```text
[gssoc] Using Firecrawl extraction
[gssoc] Normalized payload ready
[gssoc] Skipped duplicate: e3af8ac9... GirlScript Summer of Code 2026 pending
[gsoc] Inserted pending row: <id> Google Summer of Code pending
[mlh] Failed validation: deadline uncertain, manual review required
```

## 8. Future Scheduling Support

The architecture should be ready for scheduled ingestion later.

Scheduling options:

- Local/manual command
- GitHub Actions
- Vercel Cron
- Supabase Edge Function
- External worker

Recommended first scheduled flow:

```text
daily schedule
  -> run selected source adapters
  -> deduplicate
  -> insert pending records only
  -> send admin summary
```

Scheduled runs should still obey:

- no auto-publish
- no duplicate spam
- source URL required
- low-confidence rows skipped or marked for manual review

## Source-Specific Notes

### GSSoC

Recommended strategy:

- Direct scrape official page.
- Use fallback extraction if Firecrawl API is unavailable.
- Insert pending only.
- Dedupe by `source_url`.

Reliability:

- Good for title, organization, category, description, and link.
- Deadline may need admin verification.

### Google Summer of Code

Recommended strategy:

- Prefer official GSoC program page or timeline page.
- Extract title, organization, deadline, location, and external link.
- Insert pending only.

Reliability:

- Good official source.
- Multiple dates exist, so deadline extraction should prefer application deadline only.

### MLH Fellowship

Recommended strategy:

- Scrape official fellowship page.
- Treat deadline as uncertain unless cohort-specific deadline is clearly present.
- Insert pending only if required fields are clear.

Reliability:

- Good for title, organization, remote location, and description.
- Deadline and cohort timing are less reliable.

## Recommended Implementation Order

1. Extract shared helpers from the GSSoC script.
2. Create a source adapter interface.
3. Convert GSSoC into the first adapter.
4. Add GSoC adapter.
5. Add MLH adapter with stricter validation.
6. Add a multi-source runner with dry-run default.
7. Add structured logging.
8. Add scheduled execution only after manual runs are stable.

This keeps BuildNest automation practical, review-first, and safe as sources expand.
