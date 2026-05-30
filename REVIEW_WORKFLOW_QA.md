# BuildNest Review Workflow QA

## Scope

Verify that BuildNest only publishes approved opportunities while allowing admins to manage approved, pending, and rejected records.

## Public Page Checks

- Home page only shows opportunities where `review_status = 'approved'`.
- Featured opportunities only use approved rows.
- Radar preview only uses approved rows.
- `/opportunities` only shows approved rows.
- `/opportunity/{id}` loads for an approved row.
- `/opportunity/{id}` returns the not-found state for a pending row.
- `/opportunity/{id}` returns the not-found state for a rejected row.
- Related opportunities only show approved rows from the same category.

## Manual Add Form Checks

- Create a new opportunity from `/add`.
- Confirm the inserted row has `review_status = 'approved'`.
- Confirm the inserted row has `is_automated = false`.
- Confirm the opportunity appears on public pages after creation.
- Confirm existing validation still works for required fields and external links.

## Dashboard Checks

- Dashboard loads approved, pending, and rejected opportunities.
- Approved tab shows only approved rows.
- Pending tab shows only pending rows.
- Rejected tab shows only rejected rows.
- Tab counts match Supabase row counts by `review_status`.
- Edit still works for approved rows.
- Edit still works for pending rows.
- Edit still works for rejected rows.
- Delete still works in all tabs.

## Pending Review Checks

- Insert or identify a pending automated row.
- Confirm pending row does not appear on home page.
- Confirm pending row does not appear on `/opportunities`.
- Confirm pending row appears in the dashboard Pending tab.
- Click Approve.
- Confirm row moves to the Approved tab.
- Confirm row appears on public pages after approval.
- Create or identify another pending row.
- Click Reject.
- Confirm row moves to the Rejected tab.
- Confirm rejected row does not appear on public pages.

## Regression Checks

- Existing approved opportunities remain visible after schema migration.
- Existing opportunity detail links still work.
- Dashboard CRUD behavior remains unchanged except for the added review actions.
- External `Open Opportunity` buttons still render when `external_link` exists.
- GA tracking is not visually affected by the review workflow changes.

## Verification SQL

Use this query to verify review state counts:

```sql
select
  review_status,
  is_automated,
  count(*) as row_count
from public.opportunities
group by review_status, is_automated
order by review_status, is_automated;
```

Use this query to verify public visibility count:

```sql
select count(*) as approved_opportunities
from public.opportunities
where review_status = 'approved';
```

The public app should only render the approved count.
