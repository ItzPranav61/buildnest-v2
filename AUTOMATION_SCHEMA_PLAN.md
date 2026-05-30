# BuildNest Automation Schema Plan

## Goal

Prepare the Supabase `opportunities` table for review-first automated ingestion.

This plan supports the automation flow described in `AUTOMATION_PLAN.md`:

```text
Source -> Firecrawl -> Normalize -> Deduplicate -> Pending Review -> Admin Approves -> Published
```

The schema should allow scraped opportunities to be stored safely without making them public until an admin reviews and approves them.

## 1. New Opportunity Fields

Add these fields to the `opportunities` table:

```text
source_url text
source_name text
scraped_at timestamptz
review_status text default 'approved'
is_automated boolean default false
```

### Field Purpose

| Field | Purpose |
| --- | --- |
| `source_url` | Canonical page where the opportunity was found. Required for automated records. |
| `source_name` | Human-readable source name, such as `GirlScript`, `MLH`, or `Google Summer of Code`. |
| `scraped_at` | Timestamp for when automation last collected the opportunity. |
| `review_status` | Review state: `pending`, `approved`, or `rejected`. |
| `is_automated` | Marks whether the record was created by an automated ingestion process. |

## 2. Default Behavior

Manual opportunities and automated opportunities should behave differently.

### Manual Add Form

Opportunities created through the existing Add form should default to:

```text
review_status = 'approved'
is_automated = false
```

This preserves the current product behavior. Existing admin-created opportunities remain visible immediately after creation.

### Automated Scraped Opportunities

Opportunities created by a scraper or ingestion job should explicitly use:

```text
review_status = 'pending'
is_automated = true
source_url = required source page
scraped_at = now()
```

Scraped opportunities must not rely on database defaults because the default is intentionally optimized for manual admin entry.

## 3. Public Visibility Rule

Public pages should only show approved opportunities:

```sql
review_status = 'approved'
```

This rule should apply to:

- Home page opportunity previews
- Featured opportunities
- Opportunities listing page
- Opportunity detail page
- Related opportunities

Pending and rejected opportunities should never appear to public users.

## 4. Dashboard Visibility

The admin dashboard should show all review states:

- `approved`
- `pending`
- `rejected`

Recommended dashboard tabs:

- Approved
- Pending
- Rejected

Pending records should support:

- edit before approve
- approve
- reject
- delete

Rejected records may remain useful for audit and deduplication, especially to avoid repeatedly importing the same rejected source.

## 5. RLS Impact

The review workflow changes public read behavior.

### Public Users

Public users should only be able to select rows where:

```sql
review_status = 'approved'
```

This prevents pending and rejected scraped records from leaking into public pages.

### Authenticated Admins

Authenticated admins should be able to:

- select all opportunities
- insert opportunities
- update opportunities
- delete opportunities

This preserves dashboard management and enables review actions.

If BuildNest later adds role-based admin checks, these policies should be tightened from generic authenticated access to an explicit admin role.

## 6. Migration SQL Draft

Do not execute this yet. This is a draft for review.

```sql
alter table public.opportunities
  add column if not exists source_url text,
  add column if not exists source_name text,
  add column if not exists scraped_at timestamptz,
  add column if not exists review_status text not null default 'approved',
  add column if not exists is_automated boolean not null default false;

alter table public.opportunities
  add constraint opportunities_review_status_check
  check (review_status in ('pending', 'approved', 'rejected'));

update public.opportunities
set
  review_status = coalesce(review_status, 'approved'),
  is_automated = coalesce(is_automated, false)
where review_status is null
   or is_automated is null;

create index if not exists opportunities_review_status_idx
  on public.opportunities (review_status);

create index if not exists opportunities_external_link_idx
  on public.opportunities (external_link);

create index if not exists opportunities_source_url_idx
  on public.opportunities (source_url);
```

### Optional Automation Guard Constraint

This stricter constraint can be added after confirming the ingestion script always sends `source_url` for automated rows:

```sql
alter table public.opportunities
  add constraint opportunities_automated_source_url_check
  check (
    is_automated = false
    or nullif(trim(source_url), '') is not null
  );
```

This should not be added until the app and ingestion scripts are ready, because it can block inserts if automated records are incomplete.

## 7. RLS Policy Draft

Do not execute this yet. Policy names may need to be adjusted to match existing Supabase policies.

```sql
alter table public.opportunities enable row level security;

drop policy if exists "Public can read opportunities" on public.opportunities;
drop policy if exists "Public can read approved opportunities" on public.opportunities;
drop policy if exists "Authenticated admins can manage opportunities" on public.opportunities;

create policy "Public can read approved opportunities"
on public.opportunities
for select
to anon
using (review_status = 'approved');

create policy "Authenticated admins can manage opportunities"
on public.opportunities
for all
to authenticated
using (true)
with check (true);
```

If the current app uses authenticated reads from public pages, add an additional authenticated select policy that still restricts non-dashboard reads. The safer long-term approach is to use explicit admin roles.

## 8. Rollback SQL Draft

Do not execute this unless rolling back the automation schema.

```sql
drop policy if exists "Public can read approved opportunities" on public.opportunities;
drop policy if exists "Authenticated admins can manage opportunities" on public.opportunities;

drop index if exists opportunities_review_status_idx;
drop index if exists opportunities_external_link_idx;
drop index if exists opportunities_source_url_idx;

alter table public.opportunities
  drop constraint if exists opportunities_automated_source_url_check;

alter table public.opportunities
  drop constraint if exists opportunities_review_status_check;

alter table public.opportunities
  drop column if exists source_url,
  drop column if exists source_name,
  drop column if exists scraped_at,
  drop column if exists review_status,
  drop column if exists is_automated;
```

If existing RLS policies were replaced during migration, rollback should restore the previous policy definitions from a database backup or Supabase migration history.

## 9. Risks And Safeguards

### Existing Rows Must Remain Approved

Risk: Adding `review_status` incorrectly could hide all existing opportunities.

Safeguard:

- Use `default 'approved'`.
- Backfill existing rows to `approved`.
- Verify public pages still return the same existing opportunities after migration.

### Public Pages Must Not Accidentally Hide Old Data

Risk: Public queries may add `review_status = 'approved'` before the database field exists, or RLS may block reads unexpectedly.

Safeguard:

- Deploy schema migration before app query changes.
- Confirm all existing rows have `review_status = 'approved'`.
- Test home, opportunities, detail, and related opportunities after migration.

### Scraped Rows Must Never Auto-Publish

Risk: Automation inserts rows without setting `review_status`, causing them to inherit the manual default of `approved`.

Safeguard:

- Ingestion scripts must explicitly set `review_status = 'pending'`.
- Ingestion scripts must explicitly set `is_automated = true`.
- Add tests or dry-run logs for every ingestion job.
- Consider the optional `source_url` guard constraint after the first ingestion version is stable.

### RLS Could Block Admin Review

Risk: Admin dashboard may lose access to pending and rejected records if RLS policies are too restrictive.

Safeguard:

- Authenticated admins need select/update/delete access to all review states.
- Validate dashboard reads after policy changes.
- Move to role-based admin checks when the product has a formal admin role.

## Recommended Rollout Order

1. Add schema fields with safe defaults.
2. Backfill existing rows as approved and non-automated.
3. Add or update RLS policies so public users only read approved rows.
4. Update app queries to filter public pages by `review_status = 'approved'`.
5. Update dashboard to show approved, pending, and rejected.
6. Build ingestion script that inserts scraped rows as pending only.
7. Add approve and reject dashboard actions.

This keeps current BuildNest data visible while making the automation pipeline safe by default.
