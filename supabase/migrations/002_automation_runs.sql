-- BuildNest automation run logging migration.
--
-- Purpose:
-- Create an internal automation_runs table for ingestion observability.
-- These logs are not public content. Public/anon users should not be able
-- to read them. Ingestion scripts insert logs with the Supabase service role.

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

drop policy if exists "Authenticated admins can read automation runs"
on public.automation_runs;

create policy "Authenticated admins can read automation runs"
on public.automation_runs
for select
to authenticated
using (true);

-- Rollback SQL draft only. Do not run unless intentionally removing
-- automation run logging and after confirming no app/dashboard code depends
-- on this table.
--
-- drop policy if exists "Authenticated admins can read automation runs"
-- on public.automation_runs;
--
-- drop index if exists automation_runs_source_name_idx;
-- drop index if exists automation_runs_status_idx;
-- drop index if exists automation_runs_mode_idx;
-- drop index if exists automation_runs_started_at_idx;
-- drop index if exists automation_runs_created_at_idx;
--
-- drop table if exists public.automation_runs;
