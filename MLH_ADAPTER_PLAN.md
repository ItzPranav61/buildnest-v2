# MLH Adapter Plan

## Goal

Add MLH Fellowship as the third BuildNest ingestion source after GSSoC and GSoC.

This is a planning document only. Do not implement the adapter, modify scripts, or run ingestion from this plan.

## Current BuildNest Context

BuildNest already has:

- Reusable ingestion runner in `scripts/ingest.ts`
- Source adapters for GSSoC and GSoC
- Shared normalization, dedupe, and pending insert layers
- Review workflow with pending, approved, and rejected moderation
- `automation_runs` logging for insert-mode ingestion
- Dashboard automation observability

MLH should fit into the same source adapter pattern and must not bypass pending review.

## 1. Official URLs

Primary official URLs to evaluate:

- MLH Fellowship main site: `https://fellowship.mlh.io/`
- Major League Hacking main site: `https://www.mlh.com/`
- Possible application or success domain observed in current search results: `https://fellowship.mlh.com/`

Notes:

- `https://fellowship.mlh.io/` appears to be the main public Fellowship landing page.
- Search results show some `fellowship.mlh.com` pages, so the adapter should be prepared for domain redirects or canonical URL changes.
- The adapter should use the official Fellowship landing page as the default `source_url` unless a clearer current application page is verified.

## 2. Extraction Fields

The adapter should attempt to extract:

| Field | Expected extraction |
| --- | --- |
| `title` | MLH Fellowship |
| `organization` | Major League Hacking |
| `category` | Fellowship |
| `status` | Open, Upcoming, or Expired depending on clear application state |
| `deadline` | Cohort/application deadline only if clearly present |
| `location` | Remote / Global |
| `description` | Short program summary from official Fellowship copy |
| `tags` | Fellowship, Open Source, Remote |
| `external_link` | Official apply or Fellowship page URL |
| `source_name` | MLH |
| `source_url` | Official URL used for extraction |

## 3. Deadline Strategy

MLH Fellowship deadlines and cohort windows may be uncertain or vary by cycle.

Rules:

- Use a deadline only when a specific current application or cohort deadline is clearly extractable from an official page.
- If the page says applications are open but no deadline is present, store `deadline = null`.
- If multiple dates are present and the application deadline is ambiguous, store `deadline = null`.
- Never infer a deadline from cohort start dates.
- Never store fake placeholder dates.

## 4. Mapping Into BuildNest Schema

Expected normalized payload:

| BuildNest field | Value |
| --- | --- |
| `title` | MLH Fellowship |
| `organization` | Major League Hacking |
| `category` | Fellowship |
| `status` | Open or Upcoming if clearly supported; otherwise Upcoming |
| `deadline` | Clear application deadline or null |
| `location` | Remote / Global |
| `description` | Official program summary, trimmed and review-friendly |
| `tags` | Fellowship, Open Source, Remote |
| `external_link` | Official Fellowship/apply URL |
| `source_name` | MLH |
| `source_url` | Official source URL |
| `review_status` | pending |
| `is_automated` | true |

The adapter should return a draft only. The shared insert layer should add `review_status = pending`, `is_automated = true`, and `scraped_at`.

## 5. Confidence Rules

High confidence:

- Official application page is found.
- Current cohort or application window is present.
- Deadline or rolling application status is clearly stated.

Medium confidence:

- Official program page is found.
- Program details are clear.
- Deadline is unclear and stored as `null`.

Low confidence:

- Page redirects unexpectedly.
- The page lacks current application information.
- The Fellowship appears paused, archived, or materially changed.
- Only third-party or stale pages contain timeline details.

## 6. Duplicate Strategy

Check duplicates in this order:

1. `source_url` exact match
2. `external_link` exact match
3. Normalized `title + organization`

Normalization should trim whitespace, lowercase values, remove punctuation noise where appropriate, and treat equivalent MLH naming consistently.

Example normalized title and organization:

- `MLH Fellowship`
- `Major League Hacking`

## 7. Risks

- MLH cohort windows can change without a stable deadline.
- The Fellowship domain may redirect from `fellowship.mlh.io` to `fellowship.mlh.com` or another canonical page.
- There may be no clear current application deadline.
- Program tracks may change, pause, or be renamed.
- A page may describe the program but not confirm that applications are currently open.
- Third-party pages may contain outdated deadline or cohort information.

## 8. Test Plan

1. Dry-run:
   - Run `npm run ingest -- --source=mlh --dry-run`.
   - Confirm payload fields are normalized.
   - Confirm unclear deadline becomes `null`.

2. Insert:
   - Run `npm run ingest -- --source=mlh --insert`.
   - Confirm row is inserted as `review_status = pending` and `is_automated = true`.

3. Duplicate run:
   - Run insert mode again.
   - Confirm duplicate is skipped by `source_url`, `external_link`, or normalized title plus organization.

4. Pending visibility:
   - Confirm pending MLH row appears in dashboard Pending tab.
   - Confirm it does not appear on public `/opportunities`.

5. Approve flow:
   - Approve from dashboard.
   - Confirm row moves to Approved.
   - Confirm it appears publicly after approval.

6. Automation logging:
   - Confirm insert-mode run creates an `automation_runs` row.
   - Confirm duplicate run creates a skipped run with `duplicate_count = 1`.

7. Dashboard source health:
   - Confirm MLH appears in the Source Health table.
   - Confirm status maps correctly:
     - success -> Healthy
     - skipped or partial -> Warning
     - failed -> Failing

## 9. Recommendation

MLH can be added next, but it should be treated as a medium-confidence adapter unless a current official application page with clear cohort status is found.

Recommendation:

- Add MLH after one more manual verification pass of the live Fellowship page.
- Use `deadline = null` by default unless the application deadline is explicit.
- Keep the first MLH payload conservative and review-first.

This makes MLH a reasonable third source because the program is well-known and fits BuildNest, but it is less deadline-stable than GSoC or GSSoC. The adapter should prioritize safe pending review over freshness claims.
