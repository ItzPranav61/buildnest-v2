-- BuildNest opportunities RLS review visibility migration.
--
-- Purpose:
-- Enforce review workflow visibility at the database layer.
--
-- Safe behavior:
-- - Public anon users can only read approved opportunities.
-- - Authenticated dashboard users can read and manage all opportunities.
-- - Service role scripts continue to bypass RLS for ingestion and maintenance.
--
-- Before running this migration, inspect existing policies with:
--
-- select policyname, permissive, roles, cmd, qual, with_check
-- from pg_policies
-- where schemaname = 'public'
--   and tablename = 'opportunities'
-- order by policyname;

alter table public.opportunities enable row level security;

-- Remove existing opportunities policies so legacy broad public-read policies
-- cannot continue exposing pending/rejected review rows. This table currently
-- has no local policy migration, so this block makes the final policy set
-- explicit and repeatable.
do $$
declare
  policy_record record;
begin
  for policy_record in
    select policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = 'opportunities'
  loop
    execute format(
      'drop policy if exists %I on public.opportunities',
      policy_record.policyname
    );
  end loop;
end $$;

create policy "Public can read approved opportunities"
on public.opportunities
for select
to anon
using (review_status = 'approved');

create policy "Authenticated admins can read all opportunities"
on public.opportunities
for select
to authenticated
using (true);

create policy "Authenticated admins can insert opportunities"
on public.opportunities
for insert
to authenticated
with check (true);

create policy "Authenticated admins can update opportunities"
on public.opportunities
for update
to authenticated
using (true)
with check (true);

create policy "Authenticated admins can delete opportunities"
on public.opportunities
for delete
to authenticated
using (true);

-- Rollback SQL draft only. Do not run unless intentionally reverting this
-- migration. Prefer a narrower replacement policy over disabling RLS.
--
-- drop policy if exists "Public can read approved opportunities"
-- on public.opportunities;
--
-- drop policy if exists "Authenticated admins can read all opportunities"
-- on public.opportunities;
--
-- drop policy if exists "Authenticated admins can insert opportunities"
-- on public.opportunities;
--
-- drop policy if exists "Authenticated admins can update opportunities"
-- on public.opportunities;
--
-- drop policy if exists "Authenticated admins can delete opportunities"
-- on public.opportunities;
--
-- Optional emergency rollback only. This restores public readability but also
-- reopens pending/rejected rows to anon users, so do not leave it in place.
--
-- create policy "Public can read all opportunities emergency rollback"
-- on public.opportunities
-- for select
-- to anon
-- using (true);
