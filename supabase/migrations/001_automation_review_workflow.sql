-- BuildNest automation review workflow migration.
--
-- Purpose:
-- Add review-first automation metadata to opportunities without changing
-- the current manual admin flow. Defaults are intentionally safe for
-- existing rows and manual Add form inserts:
--
-- - review_status defaults to 'approved' so existing/manual opportunities
--   remain publicly visible after the migration.
-- - is_automated defaults to false so manual rows are not treated as scraped.
--
-- Automated ingestion jobs must explicitly insert:
-- review_status = 'pending'
-- is_automated = true
-- source_url = the trusted source page

alter table public.opportunities
  add column if not exists source_url text,
  add column if not exists source_name text,
  add column if not exists scraped_at timestamptz,
  add column if not exists review_status text not null default 'approved',
  add column if not exists is_automated boolean not null default false;

alter table public.opportunities
  add constraint opportunities_review_status_check
  check (review_status in ('pending', 'approved', 'rejected'));

-- Backfill is defensive. The new columns are not nullable and have defaults,
-- but this keeps existing rows explicitly approved and non-automated if the
-- table was ever partially migrated or imported.
update public.opportunities
set
  review_status = 'approved',
  is_automated = false
where review_status is distinct from 'approved'
   or is_automated is distinct from false;

-- Supports public filtering, dashboard review tabs, and automation dedupe.
create index if not exists opportunities_review_status_idx
  on public.opportunities (review_status);

create index if not exists opportunities_external_link_idx
  on public.opportunities (external_link);

create index if not exists opportunities_source_url_idx
  on public.opportunities (source_url);

-- Rollback SQL draft only. Do not run unless intentionally reverting this
-- migration and after confirming app queries no longer depend on these fields.
--
-- drop index if exists opportunities_review_status_idx;
-- drop index if exists opportunities_external_link_idx;
-- drop index if exists opportunities_source_url_idx;
--
-- alter table public.opportunities
--   drop constraint if exists opportunities_review_status_check;
--
-- alter table public.opportunities
--   drop column if exists source_url,
--   drop column if exists source_name,
--   drop column if exists scraped_at,
--   drop column if exists review_status,
--   drop column if exists is_automated;
