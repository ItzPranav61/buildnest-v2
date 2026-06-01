# BuildNest Automation Metrics Plan

## Goal

Plan observability for the BuildNest ingestion system.

BuildNest already has:

- GSSoC adapter
- GSoC adapter
- reusable ingestion architecture
- duplicate protection
- review workflow
- pending / approved / rejected moderation
- GA4 analytics

The ingestion system works, but automation runs are not measurable yet.

Today, it is hard to answer:

- when did a source last run?
- did it succeed?
- how many rows were inserted?
- how many duplicates were skipped?
- which source is failing?
- how many pending opportunities are waiting for review?

This document plans metrics and observability only. It does not change code, database, or app files.

## 1. Why Automation Needs Observability

Automation without metrics becomes a black box.

When a manual admin adds an opportunity, the result is visible immediately. With automation, work happens in scripts, scheduled jobs, or background runs. If those runs are not logged, BuildNest cannot tell whether a source is healthy, stale, failing silently, or repeatedly skipping duplicates.

Observability gives admins confidence that automation is helping rather than quietly drifting.

Good automation metrics should answer:

- Did the source run?
- Did the run produce anything useful?
- Did it fail safely?
- Did it create pending records for review?
- Is a source stale or broken?
- Are pending opportunities piling up?

The goal is not heavy analytics. The goal is enough operational visibility to trust the ingestion pipeline.

## 2. Metrics To Track

Track these ingestion metrics:

- total runs
- successful runs
- failed runs
- skipped runs
- partial runs
- duplicates skipped
- inserted pending opportunities
- average run duration
- last run time
- last successful run
- source health
- pending review count
- approved count
- rejected count

Useful rollups:

- runs by source
- runs by status
- inserted rows by source
- duplicate skips by source
- failures by source
- current moderation queue size

## 3. Proposed Database Table

Table name:

```text
automation_runs
```

Fields:

```text
id uuid primary key
source_name text
source_url text
status text: success | failed | skipped | partial
mode text: dry_run | insert
inserted_count int
duplicate_count int
failed_count int
message text
error_message text
started_at timestamptz
finished_at timestamptz
duration_ms int
created_at timestamptz default now()
```

Suggested constraints:

```text
status in ('success', 'failed', 'skipped', 'partial')
mode in ('dry_run', 'insert')
inserted_count >= 0
duplicate_count >= 0
failed_count >= 0
```

Suggested indexes:

```text
source_name
status
mode
started_at desc
created_at desc
```

## 4. Status Meaning

### success

The source completed and inserted or validated successfully.

Examples:

- insert mode inserted one pending opportunity
- dry-run mode validated a payload successfully
- source fetched, normalized, deduped, and completed as expected

### skipped

The source ran but skipped due to duplicate or no new data.

Examples:

- duplicate found by `source_url`
- duplicate found by `external_link`
- duplicate found by normalized `title + organization`
- source was healthy but produced no new opportunity

### partial

Some work succeeded and some failed.

Examples:

- multi-source run where GSSoC succeeded but GSoC failed
- source extracted data but failed one optional validation
- one row inserted but another candidate failed validation

### failed

The source could not fetch, normalize, validate, dedupe, or insert.

Examples:

- Firecrawl request failed
- source page was unreachable
- required fields were missing
- Supabase dedupe query failed
- Supabase insert failed

Failed runs should not create pending opportunities.

## 5. Source Health Rules

### Healthy

The last insert-mode run succeeded.

### Warning

The last run was a skipped duplicate or partial.

This can be acceptable, especially when a source has no new data, but it should still be visible.

### Failing

The last run failed.

This needs admin or developer attention.

### Unknown

The source has no run history.

This is expected for newly added adapters before their first insert-mode run.

## 6. Dashboard Metrics

Plan dashboard cards:

- Total sources
- Last successful run
- Pending review count
- Duplicates skipped
- Failed runs
- Automation health

Suggested card behavior:

- Total sources: count configured adapters or distinct sources with run history.
- Last successful run: latest `finished_at` where `status = success`.
- Pending review count: count opportunities where `review_status = pending`.
- Duplicates skipped: sum `duplicate_count` for recent runs.
- Failed runs: count recent runs where `status = failed`.
- Automation health: aggregate source health into Healthy / Warning / Failing / Unknown.

Keep the first dashboard version simple. It should make source health scannable, not become a full observability product.

## 7. Source Health Table

Plan dashboard table columns:

- Source
- Last run
- Status
- Inserted
- Duplicates
- Duration
- Message

Optional later columns:

- Mode
- Last successful run
- Last error
- Source URL
- Run history link

Recommended first table:

```text
Source | Last run | Status | Inserted | Duplicates | Duration | Message
```

This is enough for an admin to understand whether automation is working.

## 8. Ingestion Runner Logging

`scripts/ingest.ts` should create run logs around each source adapter run.

Each run should capture:

- start timestamp
- finish timestamp
- duration
- source name
- source URL
- mode
- result status
- inserted count
- duplicate count
- failed count
- safe message
- safe error message

Recommended flow:

```text
start run
  -> record started_at
  -> run adapter
  -> normalize
  -> dedupe
  -> insert or skip
  -> compute status
  -> record finished_at
  -> compute duration_ms
  -> insert automation_runs row
```

For multi-source runs, log one row per source. A later rollup can summarize the full run if needed.

Safe messages should be short and operational:

```text
Inserted pending opportunity
Duplicate found by source_url
Validation failed: missing title
Fetch failed
Dry run completed
```

Do not store full scraped page content in `automation_runs`.

## 9. Safety Rules

Automation logging must follow these rules:

- do not log secrets
- do not print service role key
- do not print Firecrawl API key
- do not dump full environment variables
- dry-run logs should be clearly marked
- failed runs should not create pending opportunities
- error messages should be useful but not leak tokens, headers, or raw API responses

### Should Dry-Runs Be Stored?

There are two options.

Option 1: do not store dry-runs.

Pros:

- avoids noisy logs
- keeps dashboard focused on real automation behavior
- prevents local testing from polluting production metrics

Cons:

- harder to audit dry-run validation
- less visibility during development

Option 2: store dry-runs with `mode = dry_run`.

Pros:

- useful during adapter development
- easy to compare dry-run and insert behavior
- creates an audit trail for testing

Cons:

- can pollute metrics
- dashboard must filter dry-runs carefully

Recommendation:

Start by logging insert-mode runs only. Add dry-run logging later behind a flag, such as:

```text
--log-dry-run
```

This keeps production metrics clean while preserving the option to audit dry-runs when needed.

## 10. Rollout Plan

1. Create `automation_runs` table.
2. Add run logging to ingestion runner.
3. Test dry-run logging, either locally only or behind `--log-dry-run`.
4. Test insert logging with one source.
5. Add dashboard metrics cards.
6. Add source health table.
7. Later add scheduled ingestion.

Recommended sequencing:

- First, log insert-mode runs.
- Then, expose basic dashboard metrics.
- Then, add source health table.
- Finally, schedule ingestion once manual runs are observable.

## 11. Risks

### Noisy Logs

Risk:

Frequent dry-runs or scheduled jobs can create too many rows.

Mitigation:

- log insert-mode runs first
- add retention later if needed
- filter dashboard to recent runs

### Misleading Success State

Risk:

A run could be marked successful even though it skipped all useful work.

Mitigation:

- use `skipped` for duplicate-only runs
- use `partial` when mixed outcomes happen
- define status meanings clearly

### Dry-Run Pollution

Risk:

Development dry-runs can pollute production metrics.

Mitigation:

- do not store dry-runs by default
- require `--log-dry-run` if dry-run persistence is desired
- dashboard should distinguish `mode = dry_run`

### Stale Source Health

Risk:

A source may look healthy because its last run succeeded long ago.

Mitigation:

- show last run time
- later add stale thresholds, such as warning if no run in 7 days

### Logging Sensitive Data

Risk:

Errors or debug logs could expose secrets.

Mitigation:

- sanitize error messages
- never store API keys
- never store request headers
- avoid raw API response bodies in the database

### Duplicate Records If Logging Fails After Insert

Risk:

The opportunity insert succeeds, but logging fails. This could make the run look missing even though it created data.

Mitigation:

- log after insert, but make logs best-effort
- print console output even if DB logging fails
- consider a transaction only if the insertion and logging need strict atomicity later

## 12. Recommended First Implementation

Start small.

Recommended first implementation:

1. Create `automation_runs` table.
2. Log insert-mode runs only.
3. Record one log row per source.
4. Store counts: inserted, duplicate, failed.
5. Store safe message and error message.
6. Add simple dashboard cards:
   - Pending review count
   - Last successful run
   - Failed runs
   - Duplicates skipped
7. Add source health table after the cards are stable.

Avoid overbuilding:

- no complex tracing
- no external observability vendor
- no full scrape archives
- no raw response storage
- no dry-run persistence by default

This gives BuildNest enough operational visibility to trust automation without turning the product into an internal monitoring platform.
