# Opportunity RLS Fix Plan

Date: 2026-06-02

## Goal

Enforce opportunity review visibility at the database layer, not only in app queries.

Public pages already filter opportunities with:

```sql
review_status = 'approved'
```

But a raw Supabase anon query can currently read pending rows. That means the app is behaving correctly, but Supabase Row Level Security is not yet protecting pending/rejected opportunity rows from direct public API access.

## Current RLS Issue

Observed with `NEXT_PUBLIC_SUPABASE_ANON_KEY`:

```ts
await anon
  .from("opportunities")
  .select("id,title,review_status")
  .eq("review_status", "pending");
```

Result:

```text
3 pending rows returned
```

Rows returned:

- `88e64c99-8440-46e4-bd62-145924a622a4` - DSU DEVHACK 3.0
- `40135ec1-68a2-45f6-8644-591199069d77` - HexaFalls 2
- `45a4f07d-47fa-4d2d-a118-d131c87f8e61` - CodeStorm 2026 #2

Local migration inspection:

- `001_automation_review_workflow.sql` adds `review_status`, `is_automated`, and source fields.
- It does not enable or update RLS for `public.opportunities`.
- No local migration currently defines `opportunities` policies.
- `002_automation_runs.sql` enables RLS only for `public.automation_runs`.

Live policy catalog inspection through the Supabase REST client was attempted, but `pg_policies` is not exposed through the public REST schema cache:

```text
Could not find the table 'public.pg_policies' in the schema cache
```

So the final live policy names should be inspected in the Supabase SQL Editor before executing the migration.

## Likely Cause

One of these is true:

1. RLS is disabled on `public.opportunities`.
2. RLS is enabled, but there is a broad anon/public select policy such as `using (true)`.
3. RLS is enabled, but public read access was granted before the review workflow existed and was never narrowed to approved rows.

Any of these allows anon users to read rows that should stay in admin review.

## Proposed Fix

Database-level visibility should match the product review model:

- `anon` can select only rows where `review_status = 'approved'`.
- `authenticated` admins can select all rows.
- `authenticated` admins can insert, update, and delete rows.
- `service_role` scripts continue to work because Supabase service role bypasses RLS.

Important current assumption:

BuildNest currently treats authenticated dashboard users as admins. If the product later supports non-admin authenticated users, replace the broad `authenticated` policies with an admin role check through a profile/roles table or custom JWT claim.

## Policy Design

| Role | Action | Policy |
| --- | --- | --- |
| `anon` | `select` | `review_status = 'approved'` |
| `authenticated` | `select` | `true` |
| `authenticated` | `insert` | `true` |
| `authenticated` | `update` | `true` |
| `authenticated` | `delete` | `true` |
| `service_role` | all | bypasses RLS |

## Pre-Migration Inspection SQL

Run this in Supabase SQL Editor before applying the fix:

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

Expected current finding:

- Either `rowsecurity = false`, or a permissive public/anon select policy allows pending rows.

## SQL Migration Draft

Do not run this until the current policies have been inspected.

Suggested file name:

```text
supabase/migrations/003_opportunities_rls_review_visibility.sql
```

```sql
-- BuildNest opportunities RLS review visibility migration.
--
-- Purpose:
-- Enforce review workflow visibility at the database layer.
-- Public anon users may only read approved opportunities.
-- Authenticated dashboard users may manage all opportunities.
-- Service role scripts continue to bypass RLS.

alter table public.opportunities enable row level security;

-- Remove existing opportunities policies so legacy broad public-read
-- policies cannot continue exposing pending/rejected rows.
--
-- Review the output of pg_policies before running this block.
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
```

## Safer Alternative If Existing Policy Names Must Be Preserved

If the Supabase SQL Editor shows unrelated custom policies that should not be removed, do not use the `do $$ ... drop policy ... $$` block. Instead, drop only the broad public read policy by name and create the approved-only anon policy.

Example:

```sql
drop policy if exists "Public can read opportunities"
on public.opportunities;

drop policy if exists "Enable read access for all users"
on public.opportunities;
```

Then create the policies from the draft above.

## Rollback SQL Draft

Rollback should only be used if the dashboard or public app breaks after migration.

```sql
drop policy if exists "Public can read approved opportunities"
on public.opportunities;

drop policy if exists "Authenticated admins can read all opportunities"
on public.opportunities;

drop policy if exists "Authenticated admins can insert opportunities"
on public.opportunities;

drop policy if exists "Authenticated admins can update opportunities"
on public.opportunities;

drop policy if exists "Authenticated admins can delete opportunities"
on public.opportunities;

-- Optional emergency rollback only.
-- This restores pre-fix public readability behavior but reopens pending rows.
-- Prefer creating a narrower replacement policy instead of using this long-term.
create policy "Public can read all opportunities emergency rollback"
on public.opportunities
for select
to anon
using (true);
```

Do not disable RLS as the default rollback. Disabling RLS would restore the data exposure.

## Verification SQL

Run after the migration in Supabase SQL Editor.

### Verify RLS Is Enabled

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

### Verify Policies

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

- Public can read approved opportunities
- Authenticated admins can read all opportunities
- Authenticated admins can insert opportunities
- Authenticated admins can update opportunities
- Authenticated admins can delete opportunities

### Verify Approved/Pending Counts With Service Role

```sql
select
  review_status,
  count(*) as row_count
from public.opportunities
group by review_status
order by review_status;
```

This confirms the rows still exist. It does not test anon visibility because SQL Editor runs with elevated privileges.

## Verification JS Checks

Run these locally after applying the SQL migration.

### 1. Anon Cannot Read Pending Rows

```ts
import { createClient } from "@supabase/supabase-js";

const anon = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!.replace(/\/rest\/v1\/?$/, ""),
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const { data, error } = await anon
  .from("opportunities")
  .select("id,title,review_status")
  .eq("review_status", "pending");

console.log({ error, data });
```

Expected:

```text
error = null
data = []
```

### 2. Anon Can Read Approved Rows

```ts
const { data, error } = await anon
  .from("opportunities")
  .select("id,title,review_status")
  .eq("review_status", "approved")
  .limit(5);

console.log({ error, data });
```

Expected:

```text
error = null
data contains approved opportunities
```

### 3. Authenticated Admin Can Read Pending Rows

Use the app login flow or a temporary authenticated Supabase client session. Then run:

```ts
const { data, error } = await authenticatedClient
  .from("opportunities")
  .select("id,title,review_status")
  .eq("review_status", "pending");

console.log({ error, data });
```

Expected:

```text
error = null
data contains pending opportunities
```

At minimum, verify the dashboard Pending tab still shows:

- DSU DEVHACK 3.0
- HexaFalls 2
- CodeStorm 2026 #2

### 4. Public App Still Works

Check:

- Home page loads approved opportunities.
- `/opportunities` loads approved opportunities.
- Approved opportunity detail pages load.
- Pending second-batch rows do not appear publicly.

Production/public check:

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

## Service Role Script Impact

No changes are needed for ingestion or manual service-role maintenance scripts.

Supabase service role bypasses RLS, so these should continue to work:

- `scripts/ingest.ts`
- `scripts/ingest-gssoc.ts`
- `scripts/backfill-external-links.ts`
- one-off manual verification inserts using `SUPABASE_SERVICE_ROLE_KEY`

Still, post-migration smoke test service-role access with a read-only select before running inserts:

```ts
const { data, error } = await service
  .from("opportunities")
  .select("id,title,review_status")
  .eq("review_status", "pending")
  .limit(5);
```

Expected:

```text
service role can read pending rows
```

## Rollout Order

1. Inspect current live policies with `pg_policies`.
2. Confirm no custom admin-role policy exists that should be preserved.
3. Run the RLS migration in Supabase SQL Editor.
4. Run anon JS checks.
5. Run authenticated dashboard check.
6. Verify public app still shows approved opportunities.
7. Keep the second-batch opportunities pending until separate approval QA.

## Risks

- Dropping all existing `opportunities` policies could remove a custom policy if one exists outside local migrations.
- Broad `authenticated` policies assume every authenticated user is an admin.
- If the dashboard uses anon instead of authenticated Supabase access, it may lose pending-row access after the fix.
- If public app queries accidentally omit `review_status = 'approved'`, RLS will still protect pending rows, but UI expectations should remain aligned.
- If RLS is enabled without insert/update/delete policies, dashboard CRUD could break.

## Recommendation

Proceed with an RLS migration, but first inspect live policy names in Supabase SQL Editor. The safest immediate production fix is:

1. Enable RLS on `public.opportunities`.
2. Replace broad anon/public select with approved-only anon select.
3. Add explicit authenticated dashboard CRUD policies.
4. Verify anon cannot read the three pending second-batch opportunities.

Do not approve the second-batch opportunities until this RLS fix is applied and verified.
