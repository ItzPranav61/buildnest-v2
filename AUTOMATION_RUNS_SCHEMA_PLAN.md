# Automation Runs Schema Plan

## Goal

Plan the Supabase schema for BuildNest automation run logging.

This plan uses `AUTOMATION_METRICS_PLAN.md` as the source of truth. It does not execute SQL and does not modify app code.

## 1. Table

Table name:

```text
automation_runs
```

Purpose:

Store one operational log row per ingestion source run.

## 2. Fields

```text
id uuid primary key default gen_random_uuid()
source_name text not null
source_url text
status text not null
mode text not null
inserted_count int not null default 0
duplicate_count int not null default 0
failed_count int not null default 0
message text
error_message text
started_at timestamptz not null
finished_at timestamptz
duration_ms int
created_at timestamptz default now()
```

## 3. Constraints

Required constraints:

```text
status in ('success', 'failed', 'skipped', 'partial')
mode in ('dry_run', 'insert')
inserted_count >= 0
duplicate_count >= 0
failed_count >= 0
duration_ms >= 0 when not null
```

Status meanings:

- `success`: source completed and inserted or validated successfully
- `skipped`: source ran but skipped due to duplicate or no new data
- `partial`: some work succeeded and some failed
- `failed`: source could not fetch, normalize, validate, dedupe, or insert

Mode meanings:

- `dry_run`: no opportunity insert was attempted
- `insert`: real insertion mode was requested

## 4. Indexes

Create indexes for dashboard queries and source-health lookups:

```text
source_name
status
mode
started_at desc
created_at desc
```

Optional later composite indexes:

```text
(source_name, started_at desc)
(source_name, status)
```

Start with simple indexes first.

## 5. RLS Plan

Automation run logs should not be public.

Rules:

- public users cannot read automation runs
- authenticated admins can read automation runs
- service role can insert logs from scripts

Recommended first RLS shape:

- Enable RLS on `automation_runs`.
- Do not create any `anon` select policy.
- Create an authenticated select policy for admin dashboard reads.
- Allow inserts only through service role usage in scripts.

Important note:

Supabase service role bypasses RLS. The ingestion scripts should use `SUPABASE_SERVICE_ROLE_KEY` for inserting log rows, just like pending opportunity inserts.

If BuildNest later adds explicit admin roles, replace broad authenticated read access with role-based admin checks.

## 6. Migration SQL Draft

Do not execute yet.

```sql
create table if not exists public.automation_runs (
  id uuid primary key default gen_random_uuid(),
  source_name text not null,
  source_url text,
  status text not null,
  mode text not null,
  inserted_count int not null default 0,
  duplicate_count int not null default 0,
  failed_count int not null default 0,
  message text,
  error_message text,
  started_at timestamptz not null,
  finished_at timestamptz,
  duration_ms int,
  created_at timestamptz default now(),

  constraint automation_runs_status_check
    check (status in ('success', 'failed', 'skipped', 'partial')),

  constraint automation_runs_mode_check
    check (mode in ('dry_run', 'insert')),

  constraint automation_runs_inserted_count_check
    check (inserted_count >= 0),

  constraint automation_runs_duplicate_count_check
    check (duplicate_count >= 0),

  constraint automation_runs_failed_count_check
    check (failed_count >= 0),

  constraint automation_runs_duration_ms_check
    check (duration_ms is null or duration_ms >= 0)
);

create index if not exists automation_runs_source_name_idx
  on public.automation_runs (source_name);

create index if not exists automation_runs_status_idx
  on public.automation_runs (status);

create index if not exists automation_runs_mode_idx
  on public.automation_runs (mode);

create index if not exists automation_runs_started_at_idx
  on public.automation_runs (started_at desc);

create index if not exists automation_runs_created_at_idx
  on public.automation_runs (created_at desc);

alter table public.automation_runs enable row level security;

create policy "Authenticated admins can read automation runs"
on public.automation_runs
for select
to authenticated
using (true);
```

No anon policy should be created.

Service role scripts can insert because the service role bypasses RLS.

## 7. Rollback SQL Draft

Do not execute unless intentionally removing automation run logging.

```sql
drop policy if exists "Authenticated admins can read automation runs"
on public.automation_runs;

drop index if exists automation_runs_source_name_idx;
drop index if exists automation_runs_status_idx;
drop index if exists automation_runs_mode_idx;
drop index if exists automation_runs_started_at_idx;
drop index if exists automation_runs_created_at_idx;

drop table if exists public.automation_runs;
```

If dashboard code later depends on this table, remove that dashboard code before rollback.

## 8. Verification SQL

### Count Runs

```sql
select count(*) as total_runs
from public.automation_runs;
```

### Latest Run By Source

```sql
select distinct on (source_name)
  source_name,
  source_url,
  status,
  mode,
  inserted_count,
  duplicate_count,
  failed_count,
  message,
  error_message,
  started_at,
  finished_at,
  duration_ms
from public.automation_runs
order by source_name, started_at desc;
```

### Runs Grouped By Status

```sql
select
  status,
  count(*) as run_count
from public.automation_runs
group by status
order by status;
```

### Failed Runs

```sql
select
  source_name,
  source_url,
  mode,
  message,
  error_message,
  started_at,
  finished_at,
  duration_ms
from public.automation_runs
where status = 'failed'
order by started_at desc;
```

### Recent Insert-Mode Runs

```sql
select
  source_name,
  status,
  inserted_count,
  duplicate_count,
  failed_count,
  message,
  started_at,
  duration_ms
from public.automation_runs
where mode = 'insert'
order by started_at desc
limit 20;
```

## 9. Risks

### Logging Secrets

Risk:

Error messages could accidentally include service role keys, Firecrawl API keys, headers, or raw request data.

Mitigation:

- never log environment variables
- never log request headers
- sanitize errors before writing to the database
- keep messages short and operational

### Noisy Dry-Runs

Risk:

Dry-runs during development could pollute production metrics.

Mitigation:

- do not store dry-runs by default
- add dry-run logging later behind a flag such as `--log-dry-run`
- dashboard should filter by `mode`

### Misleading Status

Risk:

A run might be marked `success` even though it only skipped duplicates.

Mitigation:

- use `skipped` for duplicate-only runs
- use `partial` for mixed outcomes
- define statuses consistently in the ingestion runner

### Logging Failure After Opportunity Insert

Risk:

An opportunity insert succeeds, but the automation log insert fails.

Mitigation:

- treat logging as best-effort in the first implementation
- still print console output
- consider transactions later only if strict atomicity becomes necessary

## Recommended First Implementation

1. Create the `automation_runs` table.
2. Log insert-mode runs only.
3. Store one row per source run.
4. Capture inserted, duplicate, and failed counts.
5. Keep `message` and `error_message` short and sanitized.
6. Add simple dashboard metrics after script logging is stable.

Avoid overbuilding the first version. The table should answer basic operational questions before adding scheduling or complex dashboards.
