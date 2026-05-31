# GSoC Adapter Plan

## Goal

Add Google Summer of Code as the second BuildNest ingestion source.

BuildNest already has:

- review workflow
- pending / approved / rejected moderation
- reusable ingestion architecture
- GSSoC adapter
- shared normalizer
- dedupe layer
- pending insert layer

This document plans the GSoC adapter only. No code should be written until the plan is approved.

## 1. Official URLs

Primary official site:

```text
https://summerofcode.withgoogle.com/
```

Program timeline page:

```text
https://summerofcode.withgoogle.com/programs/current/timeline
```

If the `current` timeline route changes or redirects, the adapter should still keep the main GSoC site as the canonical fallback source.

Recommended source URLs:

- `source_url`: `https://summerofcode.withgoogle.com/`
- timeline lookup URL: `https://summerofcode.withgoogle.com/programs/current/timeline`

The adapter can use the timeline page for deadline extraction, but the canonical source should remain the main GSoC site unless the timeline page proves more stable.

## 2. Extraction Fields

The adapter should extract:

- `title`
- `organization`
- `category`
- `status`
- `deadline`
- `location`
- `description`
- `tags`
- `external_link`
- `source_name`
- `source_url`

Target extraction shape:

```text
title: Google Summer of Code
organization: Google Open Source
category: Open Source
status: Open | Upcoming | Expired
deadline: application deadline if clearly extractable, otherwise null
location: Online / Global
description: concise program summary
tags: Open Source, GSoC, Student Program
external_link: official GSoC site or application page
source_name: GSoC
source_url: https://summerofcode.withgoogle.com/
```

## 3. Deadline Strategy

GSoC has multiple dates, including:

- organization application dates
- accepted organization announcement
- contributor application period
- contributor application deadline
- bonding period
- coding period
- evaluation dates
- final results

The adapter should only store a deadline when the contributor/application deadline is clearly extractable.

Rules:

- If the contributor application deadline is clearly found, use it.
- If several dates are found and the application deadline is ambiguous, store `deadline = null`.
- If only a program timeline is found without a clear application deadline, store `deadline = null`.
- If the page is for an old program year, do not use the date without review.
- Never use fake dates.
- Never use placeholder values like `0001-01-01`.

BuildNest already displays `null` deadlines as `Rolling`, which is safer than publishing a wrong deadline.

## 4. Mapping Into BuildNest Schema

Expected values:

| BuildNest Field | Expected Value |
| --- | --- |
| `title` | `Google Summer of Code` |
| `organization` | `Google Open Source` |
| `category` | `Open Source` |
| `status` | `Open` if contributor applications are active, otherwise `Upcoming` if uncertain |
| `deadline` | Contributor/application deadline only if clearly extractable |
| `location` | `Online / Global` |
| `description` | Short official program summary |
| `tags` | `["Open Source", "GSoC", "Student Program"]` |
| `external_link` | `https://summerofcode.withgoogle.com/` |
| `source_name` | `GSoC` |
| `source_url` | `https://summerofcode.withgoogle.com/` |
| `review_status` | `pending` |
| `is_automated` | `true` |

The adapter should return a normalized draft. It should not insert into Supabase directly.

The shared insertion layer should add:

```text
review_status = pending
is_automated = true
scraped_at = current timestamp
```

## 5. Duplicate Strategy

Check duplicates in this order:

1. `source_url` exact match
2. `external_link` exact match
3. normalized `title + organization`

Expected normalized fallback key:

```text
google summer of code + google open source
```

Duplicate behavior:

- If a duplicate is found, skip insert.
- Log duplicate row id, title, review status, and matched rule.
- Do not overwrite approved rows.
- Do not create a second pending row for a new scrape of the same source.

## 6. Validation Rules

Required fields:

- `title`
- `organization`
- `category`
- `status`
- `source_name`
- `source_url`

Optional fields:

- `deadline`
- `location`
- `external_link`

Validation behavior:

- Missing required fields should fail the adapter run.
- Invalid `external_link` should be normalized to `null` or fail if no useful official link remains.
- Ambiguous deadline should become `null`, not a guessed date.
- Source URL must always be present.

## 7. Risks

### Multiple Timelines

GSoC pages may expose several program phases. The adapter could mistakenly extract a coding or evaluation deadline instead of the contributor application deadline.

Mitigation:

- Prefer timeline labels containing contributor application deadline.
- Store `deadline = null` when confidence is low.

### Outdated Program Year

Search results or archived pages may point to old GSoC years.

Mitigation:

- Prefer the official current site and current timeline route.
- Avoid archive URLs unless explicitly selected.
- Keep the row pending for admin review.

### Archived Pages

Archived pages may still contain valid-looking titles and deadlines but be stale.

Mitigation:

- Reject or flag pages whose URL or page text clearly references an old year.

### Organization List Confusion

GSoC has organization/project list pages. Those are not the same as the main student opportunity.

Mitigation:

- The first adapter should ingest the program itself, not every participating organization.
- Organization/project-level ingestion should be a separate future design.

### Deadline Ambiguity

The page may show many dates. Wrong deadlines would harm trust.

Mitigation:

- Use `null` unless contributor application deadline is obvious.
- Admin review remains mandatory.

## 8. Test Plan

### Dry Run

Run:

```text
npm run ingest -- --source=gsoc --dry-run
```

Expected:

- No Supabase insert.
- Logs source name and URL.
- Prints normalized payload.
- `review_status` would be `pending`.
- `is_automated` would be `true`.

### Insert

Run only after dry-run looks correct:

```text
npm run ingest -- --source=gsoc --insert
```

Expected:

- One pending row inserted.
- Row has `source_name = GSoC`.
- Row has `review_status = pending`.
- Row has `is_automated = true`.

### Duplicate Run

Run insert again:

```text
npm run ingest -- --source=gsoc --insert
```

Expected:

- No new row inserted.
- Duplicate is skipped by `source_url` or `external_link`.

### Pending Visibility

Before approval:

- `/opportunities` should not show Google Summer of Code.
- Home page should not show Google Summer of Code.
- Dashboard Pending tab should show the row.

### Approve Flow

In dashboard:

- Open Pending tab.
- Approve GSoC row.
- Confirm row moves to Approved tab.

### Public Visibility After Approval

After approval:

- `/opportunities` should show Google Summer of Code.
- Home page may show it if it falls into featured/radar ordering.
- `Open Opportunity` CTA should appear if `external_link` exists.

### Detail Page Check

After approval:

- Open `/opportunity/{id}`.
- Confirm title, organization, category, location, tags, description, deadline display, and external link render correctly.

## 9. Recommendation

GSoC should be added before MLH.

Reasons:

- GSoC has a highly authoritative official source.
- It maps cleanly into BuildNest as an Open Source student program.
- It has predictable canonical URLs.
- It is globally recognized and useful for the target audience.
- Its ambiguity is mostly around deadline selection, which BuildNest already handles safely with `deadline = null`.

MLH Fellowship is also valuable, but it has more cohort-specific timing uncertainty. That makes it better as a later adapter after the shared pipeline has stronger handling for source confidence, cohort pages, and manual-review warnings.

Recommended next step:

```text
Implement GSoC adapter -> dry-run -> insert pending -> approve through dashboard -> verify public/detail pages
```
