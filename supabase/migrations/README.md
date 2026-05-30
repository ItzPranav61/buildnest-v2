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
