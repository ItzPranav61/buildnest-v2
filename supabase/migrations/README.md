# Supabase Migrations

This folder contains SQL drafts for BuildNest database changes.

## 001 Automation Review Workflow

File:

```text
supabase/migrations/001_automation_review_workflow.sql
```

Purpose:

- Add source metadata for scraped opportunities.
- Add review status tracking: `pending`, `approved`, `rejected`.
- Keep current manual Add form behavior safe by defaulting rows to `approved` and `is_automated = false`.
- Prepare for a review-first automation pipeline where scraped rows enter as `pending`.

## How To Run Manually

1. Open the Supabase project dashboard.
2. Go to SQL Editor.
3. Open `001_automation_review_workflow.sql` locally.
4. Paste the SQL into Supabase SQL Editor.
5. Review the SQL before running.
6. Run it once.

Do not run the rollback comments unless intentionally reverting the migration.

## Verification SQL

After running the migration, verify that existing rows remain approved:

```sql
select
  review_status,
  is_automated,
  count(*) as row_count
from public.opportunities
group by review_status, is_automated
order by review_status, is_automated;
```

Expected result for the current production data immediately after migration:

```text
review_status = approved
is_automated = false
```

Verify that no existing rows were accidentally hidden:

```sql
select count(*) as total_opportunities
from public.opportunities;

select count(*) as approved_opportunities
from public.opportunities
where review_status = 'approved';
```

For the initial migration, `total_opportunities` and `approved_opportunities` should match.

Verify the new columns exist:

```sql
select
  column_name,
  data_type,
  is_nullable,
  column_default
from information_schema.columns
where table_schema = 'public'
  and table_name = 'opportunities'
  and column_name in (
    'source_url',
    'source_name',
    'scraped_at',
    'review_status',
    'is_automated'
  )
order by column_name;
```

Verify the review status constraint:

```sql
select
  conname,
  pg_get_constraintdef(oid) as definition
from pg_constraint
where conname = 'opportunities_review_status_check';
```

Verify indexes:

```sql
select indexname, indexdef
from pg_indexes
where schemaname = 'public'
  and tablename = 'opportunities'
  and indexname in (
    'opportunities_review_status_idx',
    'opportunities_external_link_idx',
    'opportunities_source_url_idx'
  )
order by indexname;
```

## What To Test After Migration

Test the product before changing app queries:

- Home page still shows existing approved opportunities.
- `/opportunities` still shows existing approved opportunities.
- Existing opportunity detail pages still load.
- Dashboard can still read, edit, and delete opportunities.
- Add form still creates visible manual opportunities.

Test automation readiness manually with a temporary SQL insert only if needed:

```sql
insert into public.opportunities (
  title,
  organization,
  category,
  status,
  review_status,
  is_automated,
  source_url,
  source_name,
  scraped_at
) values (
  'Automation Smoke Test',
  'BuildNest',
  'Test',
  'Upcoming',
  'pending',
  true,
  'https://example.com/source',
  'Example Source',
  now()
);
```

If you run this smoke test, delete the test row afterward.

Important: public app queries should later filter with:

```sql
review_status = 'approved'
```

That app change should happen after the schema migration is live.

## 002 Automation Runs

File:

```text
supabase/migrations/002_automation_runs.sql
```

Purpose:

- Create `automation_runs` for ingestion observability.
- Track source run status, mode, counts, timing, and safe messages.
- Keep automation logs private from public users.
- Allow authenticated admins to read logs for future dashboard metrics.
- Allow service role scripts to insert logs.

## How To Run 002 Manually

1. Open the Supabase project dashboard.
2. Go to SQL Editor.
3. Open `002_automation_runs.sql` locally.
4. Paste the SQL into Supabase SQL Editor.
5. Review the SQL before running.
6. Run it once.

Do not run the rollback comments unless intentionally removing automation run logging.

## 002 Verification SQL

Verify the table exists and is empty after the first migration:

```sql
select count(*) as total_runs
from public.automation_runs;
```

Expected result immediately after running the migration:

```text
total_runs = 0
```

Verify latest run by source query works:

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

Verify grouped status query works:

```sql
select
  status,
  count(*) as run_count
from public.automation_runs
group by status
order by status;
```

Verify failed runs query works:

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

Verify RLS is enabled:

```sql
select
  schemaname,
  tablename,
  rowsecurity
from pg_tables
where schemaname = 'public'
  and tablename = 'automation_runs';
```

Verify policies:

```sql
select
  policyname,
  cmd,
  roles
from pg_policies
where schemaname = 'public'
  and tablename = 'automation_runs';
```

## 003 Opportunities RLS Review Visibility

File:

```text
supabase/migrations/003_opportunities_rls_review_visibility.sql
```

Purpose:

- Enforce review visibility at the database layer.
- Allow public anon users to read only `review_status = 'approved'` opportunities.
- Allow authenticated dashboard users to read, insert, update, and delete opportunities.
- Keep service role ingestion and maintenance scripts working through RLS bypass.

## Inspect Current Opportunities Policies Before Running 003

Run this in Supabase SQL Editor before applying the migration:

```sql
select
  schemaname,
  tablename,
  rowsecurity
from pg_tables
where schemaname = 'public'
  and tablename = 'opportunities';

select
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
from pg_policies
where schemaname = 'public'
  and tablename = 'opportunities'
order by policyname;
```

Expected current issue:

- RLS may be disabled, or
- a broad public/anon select policy may allow pending rows.

If the project has custom admin-role policies that are not represented in local migrations, review them before running the policy-removal block in `003_opportunities_rls_review_visibility.sql`.

## How To Run 003 Manually

1. Open the Supabase project dashboard.
2. Go to SQL Editor.
3. Inspect current `opportunities` policies using the SQL above.
4. Open `003_opportunities_rls_review_visibility.sql` locally.
5. Paste the SQL into Supabase SQL Editor.
6. Review the SQL before running.
7. Run it once.

Do not run the rollback comments unless intentionally reverting the RLS fix.

## 003 Verification SQL

Verify RLS is enabled:

```sql
select
  schemaname,
  tablename,
  rowsecurity
from pg_tables
where schemaname = 'public'
  and tablename = 'opportunities';
```

Expected:

```text
rowsecurity = true
```

Verify policies:

```sql
select
  policyname,
  roles,
  cmd,
  qual,
  with_check
from pg_policies
where schemaname = 'public'
  and tablename = 'opportunities'
order by policyname;
```

Expected policies:

- `Public can read approved opportunities`
- `Authenticated admins can read all opportunities`
- `Authenticated admins can insert opportunities`
- `Authenticated admins can update opportunities`
- `Authenticated admins can delete opportunities`

Verify opportunity rows still exist by review status:

```sql
select
  review_status,
  count(*) as row_count
from public.opportunities
group by review_status
order by review_status;
```

## 003 JS Checks Summary

Run these after applying the migration.

Anon cannot read pending rows:

```ts
const { data, error } = await anon
  .from("opportunities")
  .select("id,title,review_status")
  .eq("review_status", "pending");
```

Expected:

```text
error = null
data = []
```

Anon can read approved rows:

```ts
const { data, error } = await anon
  .from("opportunities")
  .select("id,title,review_status")
  .eq("review_status", "approved")
  .limit(5);
```

Expected:

```text
error = null
data contains approved opportunities
```

Authenticated dashboard can read pending rows:

```ts
const { data, error } = await authenticatedClient
  .from("opportunities")
  .select("id,title,review_status")
  .eq("review_status", "pending");
```

Expected:

```text
error = null
data contains pending opportunities
```

Public app still works:

- Home page loads approved opportunities.
- `/opportunities` loads approved opportunities.
- Approved opportunity detail pages load.
- Pending rows do not appear publicly.

Production public check for the current second-batch pending rows:

```powershell
$html = Invoke-WebRequest -Uri https://buildnest-v2.vercel.app/opportunities -UseBasicParsing
$html.Content -like "*DSU DEVHACK 3.0*"
$html.Content -like "*HexaFalls 2*"
$html.Content -like "*CodeStorm 2026 #2*"
```

Expected before approval:

```text
False
False
False
```
