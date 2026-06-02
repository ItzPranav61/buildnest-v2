# Data Hygiene Fix Plan

Date: 2026-06-02

Source: `POST_BATCH_PRODUCTION_QA_RESULTS.md`

## Goal

Clean broken and stale approved opportunity data before adding more opportunities.

This is a data-only plan. Do not modify app code and do not update the database until each row has been reviewed.

## Issue Summary

Production QA found five approved rows that need cleanup:

| Row | ID | Current issue |
| --- | --- | --- |
| Impact Labs Fellowship | `2e91e20d-1d15-4a39-ae8d-c0fd7e777600` | External link fails DNS. |
| Neo Scholar Program | `8275a9e7-b702-418c-af90-dce3c5e9cf12` | External link fails TLS trust validation. |
| MLH Fellowship Summer 2026 | `67e99217-fa05-4320-b793-aa80fa724e11` | Expired row is still approved and public. |
| HackOrbit 2026 | `4f924247-98b3-472a-89a6-4517030c2427` | Expired row is still approved and public. |
| GirlScript Summer of Code (GSSoC) 2026 | `3f36d845-724c-4367-9f07-1baaaa081736` | Deadline `2026-06-01` is past, but status is still `Open`. |

## Recommended Action Per Row

### 1. Impact Labs Fellowship

Current row:

- ID: `2e91e20d-1d15-4a39-ae8d-c0fd7e777600`
- Current status: `Upcoming`
- Current review_status: `approved`
- Current external_link: `https://impactlabs.fellowship`
- Current deadline: null

QA finding:

- DNS resolution failed for `https://impactlabs.fellowship`.

Recommendation:

- Hold for manual verification first.
- If an official working URL is found, replace `external_link`, set `source_url` to the official source, and keep `review_status = approved`.
- If no official working URL is found, move to `review_status = rejected`.

Preferred action:

```text
hold for manual verification
```

Do not keep this public with the current broken link.

### 2. Neo Scholar Program

Current row:

- ID: `8275a9e7-b702-418c-af90-dce3c5e9cf12`
- Current status: `Open`
- Current review_status: `approved`
- Current external_link: `https://neoscholar.com`
- Current deadline: null

QA finding:

- TLS trust validation failed for `https://neoscholar.com`.

Recommendation:

- Hold for manual verification first.
- Check whether there is an official canonical URL, for example a `www` version, a current application page, or a partner-hosted official page.
- If a trusted URL is found, replace `external_link` and keep approved.
- If the program cannot be verified from a working official source, move to `review_status = rejected`.

Preferred action:

```text
hold for manual verification
```

Do not keep this public with a TLS-broken link unless the failure is proven to be a local/client-specific false positive and the page works reliably in browsers.

### 3. MLH Fellowship Summer 2026

Current row:

- ID: `67e99217-fa05-4320-b793-aa80fa724e11`
- Current status: `Expired`
- Current review_status: `approved`
- Current external_link: `https://fellowship.mlh.io/`
- Current deadline: `2026-04-30`

QA finding:

- The row is expired and still public.
- Link redirects to `https://fellowship.mlh.com/`.

Recommendation:

- Keep status as `Expired`.
- Replace `external_link` with the final canonical URL `https://fellowship.mlh.com/`.
- Move `review_status` to `rejected` if BuildNest should not publicly show expired opportunities.
- Keep approved only if the product intentionally shows expired opportunities for archive/history.

Preferred action:

```text
move to rejected
replace external_link with https://fellowship.mlh.com/ only if keeping as archive
```

Reason:

- The deadline is well in the past as of 2026-06-02.
- Earlier MLH verification already found current-cycle uncertainty.

### 4. HackOrbit 2026

Current row:

- ID: `4f924247-98b3-472a-89a6-4517030c2427`
- Current status: `Expired`
- Current review_status: `approved`
- Current external_link: `https://hackorbit26.droidecks.sbs/`
- Current deadline: `2026-05-04`

QA finding:

- The row is expired and still public.
- Link returned 200, but the domain is less institutionally recognizable.

Recommendation:

- Move `review_status` to `rejected` if public pages should focus on active/upcoming opportunities.
- Keep `status = Expired`.
- Do not replace the link unless an official event archive/source is needed.

Preferred action:

```text
move to rejected
```

Reason:

- Deadline is expired as of 2026-06-02.
- Publicly showing expired hackathons reduces trust while BuildNest is building a fresh opportunity board.

### 5. GirlScript Summer of Code (GSSoC) 2026

Current row:

- ID: `3f36d845-724c-4367-9f07-1baaaa081736`
- Current status: `Open`
- Current review_status: `approved`
- Current external_link: `https://gssoc.girlscript.org/`
- Current source_url: `https://gssoc.girlscript.org/`
- Current deadline: `2026-06-01`

QA finding:

- Deadline is past as of 2026-06-02, but status is still `Open`.
- Link is official and reachable.

Recommendation:

- Update `status` to `Expired`.
- Keep `review_status = approved` only if expired opportunities remain visible by design.
- If BuildNest wants only active/upcoming public opportunities, move `review_status` to `rejected` after status correction.

Preferred action:

```text
update status to Expired
keep approved for now
```

Reason:

- The source is official and already handled.
- This is a stale status issue, not a trust/link issue.

## Safest Cleanup Order

1. Verify replacement URLs for `Impact Labs Fellowship` and `Neo Scholar Program`.
2. If no trusted working URL is found, move those two rows to `review_status = rejected`.
3. Move clearly expired, lower-value public rows to rejected:
   - `MLH Fellowship Summer 2026`
   - `HackOrbit 2026`
4. Update GSSoC status from `Open` to `Expired`.
5. Re-run public QA:
   - `/opportunities`
   - affected detail pages
   - anon-approved Supabase reads
   - link audit
6. Only after cleanup passes, continue adding more opportunities.

## Proposed Data-Only SQL Draft

Do not run until manual URL verification is complete.

### If Impact Labs Has No Verified Replacement URL

```sql
update public.opportunities
set review_status = 'rejected'
where id = '2e91e20d-1d15-4a39-ae8d-c0fd7e777600';
```

### If Neo Scholar Has No Verified Replacement URL

```sql
update public.opportunities
set review_status = 'rejected'
where id = '8275a9e7-b702-418c-af90-dce3c5e9cf12';
```

### MLH Fellowship Cleanup

```sql
update public.opportunities
set
  review_status = 'rejected',
  status = 'Expired',
  external_link = 'https://fellowship.mlh.com/'
where id = '67e99217-fa05-4320-b793-aa80fa724e11';
```

### HackOrbit Cleanup

```sql
update public.opportunities
set
  review_status = 'rejected',
  status = 'Expired'
where id = '4f924247-98b3-472a-89a6-4517030c2427';
```

### GSSoC Status Correction

```sql
update public.opportunities
set status = 'Expired'
where id = '3f36d845-724c-4367-9f07-1baaaa081736';
```

## Verification Steps After Cleanup

### 1. Verify Row State

```sql
select
  id,
  title,
  status,
  deadline,
  review_status,
  external_link,
  source_url
from public.opportunities
where id in (
  '2e91e20d-1d15-4a39-ae8d-c0fd7e777600',
  '8275a9e7-b702-418c-af90-dce3c5e9cf12',
  '67e99217-fa05-4320-b793-aa80fa724e11',
  '4f924247-98b3-472a-89a6-4517030c2427',
  '3f36d845-724c-4367-9f07-1baaaa081736'
)
order by title;
```

### 2. Verify Rejected Rows Are Hidden Publicly

Use anon Supabase client:

```ts
const { data, error } = await anon
  .from("opportunities")
  .select("id,title,review_status")
  .in("id", [
    "2e91e20d-1d15-4a39-ae8d-c0fd7e777600",
    "8275a9e7-b702-418c-af90-dce3c5e9cf12",
    "67e99217-fa05-4320-b793-aa80fa724e11",
    "4f924247-98b3-472a-89a6-4517030c2427"
  ]);
```

Expected:

```text
data = []
```

### 3. Verify GSSoC Remains Public But Shows Expired

Use anon Supabase client:

```ts
const { data, error } = await anon
  .from("opportunities")
  .select("id,title,status,review_status")
  .eq("id", "3f36d845-724c-4367-9f07-1baaaa081736")
  .single();
```

Expected:

```text
title = GirlScript Summer of Code (GSSoC) 2026
status = Expired
review_status = approved
```

### 4. Verify Public Pages

Check production:

- `/`
- `/opportunities`
- GSSoC detail page

Expected:

- Broken-link rows no longer appear publicly if moved to rejected.
- GSSoC appears with corrected `Expired` status if still approved.
- No RLS regression.

### 5. Re-run Link Audit

Expected:

- No DNS-failed public links.
- No TLS-failed public links.
- Redirects are acceptable if intentional, but final canonical URLs should be preferred.

## Rollback Notes

Before any cleanup, record the current row values:

| ID | Restore status | Restore review_status | Restore external_link |
| --- | --- | --- | --- |
| `2e91e20d-1d15-4a39-ae8d-c0fd7e777600` | Upcoming | approved | `https://impactlabs.fellowship` |
| `8275a9e7-b702-418c-af90-dce3c5e9cf12` | Open | approved | `https://neoscholar.com` |
| `67e99217-fa05-4320-b793-aa80fa724e11` | Expired | approved | `https://fellowship.mlh.io/` |
| `4f924247-98b3-472a-89a6-4517030c2427` | Expired | approved | `https://hackorbit26.droidecks.sbs/` |
| `3f36d845-724c-4367-9f07-1baaaa081736` | Open | approved | `https://gssoc.girlscript.org/` |

Rollback SQL draft:

```sql
update public.opportunities
set
  status = 'Upcoming',
  review_status = 'approved',
  external_link = 'https://impactlabs.fellowship'
where id = '2e91e20d-1d15-4a39-ae8d-c0fd7e777600';

update public.opportunities
set
  status = 'Open',
  review_status = 'approved',
  external_link = 'https://neoscholar.com'
where id = '8275a9e7-b702-418c-af90-dce3c5e9cf12';

update public.opportunities
set
  status = 'Expired',
  review_status = 'approved',
  external_link = 'https://fellowship.mlh.io/'
where id = '67e99217-fa05-4320-b793-aa80fa724e11';

update public.opportunities
set
  status = 'Expired',
  review_status = 'approved',
  external_link = 'https://hackorbit26.droidecks.sbs/'
where id = '4f924247-98b3-472a-89a6-4517030c2427';

update public.opportunities
set
  status = 'Open',
  review_status = 'approved',
  external_link = 'https://gssoc.girlscript.org/'
where id = '3f36d845-724c-4367-9f07-1baaaa081736';
```

## Recommendation

Clean data before adding more opportunities.

Minimum safe cleanup:

1. Reject rows with broken external links if no verified replacement is found.
2. Hide expired rows that do not provide current value.
3. Correct stale statuses for official/trusted rows.

This keeps BuildNest's public board credible while preserving the rows in the admin dashboard for future review.
