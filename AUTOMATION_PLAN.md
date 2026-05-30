# BuildNest Automation Plan

## Goal

Move BuildNest from fully manual opportunity entry to a semi-automated ingestion workflow that helps admins find and prepare opportunities faster while keeping publishing under human control.

The core principle: automation can collect, normalize, and suggest opportunities, but admins decide what becomes public.

## 1. Current Manual Flow

Today, BuildNest relies on manual entry:

1. Admin finds an opportunity from a website, community post, or shared link.
2. Admin opens the Add Opportunity form.
3. Admin manually enters title, organization, category, status, deadline, location, tags, description, and external link.
4. The opportunity is immediately available in the app after submission.
5. Admin edits or removes the opportunity later if details change.

This is simple and safe, but it does not scale well. Every opportunity requires manual discovery, formatting, cleanup, and deduplication.

## 2. Target Automation Flow

The target flow should reduce manual research while preserving admin review:

```text
Source
  -> Firecrawl
  -> Normalize
  -> Deduplicate
  -> Pending Review
  -> Admin Approves
  -> Published
```

In this model, BuildNest can ingest opportunities from trusted sources, extract useful details, and create draft records for review. Admins then approve, reject, or edit those records before they appear publicly.

## 3. Why Auto-Publishing Is Dangerous

Auto-publishing scraped opportunities should be avoided.

Risks include:

- Scraped pages may contain outdated or incorrect deadlines.
- Pages may include promotional, spammy, or irrelevant content.
- Automation can misread eligibility, location, stipend, or category.
- Duplicate opportunities can quickly clutter the product.
- Some sources may change layout and produce broken descriptions.
- Unknown deadlines should not be converted into fake dates.
- Publishing without review can damage trust with student builders.

BuildNest should optimize for credibility over volume. A smaller set of reviewed opportunities is more valuable than a large feed of uncertain data.

## 4. Review-First Pipeline

The recommended pipeline is:

```text
Source -> Firecrawl -> Normalize -> Deduplicate -> Pending Review -> Admin Approves -> Published
```

### Source

A source is a trusted page, feed, or website where opportunities are commonly posted.

Examples:

- Open source program pages
- Fellowship pages
- Hackathon listing pages
- University or community opportunity boards
- Organization career or student program pages

Each automated opportunity should keep the original `source_url` so admins can verify details quickly.

### Firecrawl

Firecrawl can fetch and extract page content from source URLs. The ingestion job should capture page text and links, then pass only relevant opportunity data into the normalization step.

### Normalize

Normalization converts scraped content into BuildNest's opportunity shape:

- title
- organization
- category
- status
- deadline
- location
- tags
- description
- external_link
- source metadata

Unknown deadlines should remain empty or rolling. They should never become placeholder dates like `0001-01-01`.

### Deduplicate

Before creating a pending record, the system checks whether the opportunity already exists.

Primary rule:

- Match by exact `external_link`.

Fallback rule:

- Match by normalized `title + organization`.

If a likely duplicate exists, the ingestion job should skip it or flag it for review instead of creating another public card.

### Pending Review

Automated records should enter the database with:

- `review_status = "pending"`
- `is_automated = true`

Pending opportunities should not appear on the public home page or opportunities page.

### Admin Approves

Admins review pending opportunities, edit details if needed, and approve them. Approval changes the opportunity to:

- `review_status = "approved"`

Only approved records should be visible publicly.

### Published

Once approved, the opportunity becomes visible across:

- Home page radar preview
- Featured opportunities
- Opportunities page
- Opportunity detail page
- Dashboard approved list

## 5. Proposed Database Fields

Add the following fields when the schema is ready for automation:

```text
source_url text
source_name text
scraped_at timestamp
review_status text: pending | approved | rejected
is_automated boolean
```

Suggested behavior:

- `source_url` should be required for automated records.
- `source_name` should identify the source, such as `GirlScript`, `MLH`, or `Devfolio`.
- `scraped_at` should record when the opportunity was last collected.
- `review_status` should default to `approved` for manually created opportunities and `pending` for automated opportunities.
- `is_automated` should be `false` for manual admin entries and `true` for scraped entries.

## 6. Admin Dashboard Changes

The dashboard should support review workflows without disrupting current CRUD behavior.

Recommended additions:

- Pending tab
- Approved tab
- Rejected tab, optional but useful for audit history
- Approve button
- Reject button
- Edit before approve

Pending cards should clearly show:

- Source name
- Source URL
- Scraped time
- Extracted deadline
- External link
- Any fields that look incomplete

Admins should be able to edit a pending opportunity before approving it. This keeps automation useful without forcing scraped content directly into the product.

## 7. Duplicate Detection Strategy

Deduplication should happen before inserting pending records.

### Exact Link Match

First, compare `external_link` exactly.

If an existing opportunity has the same external link, skip the new record or update the existing pending record if it is still under review.

### Title And Organization Fallback

If no external link match exists, compare normalized title and organization.

Normalization should include:

- lowercase text
- trim whitespace
- collapse repeated spaces
- remove common punctuation differences

Example:

```text
GirlScript Summer of Code + GirlScript Foundation
```

should match minor formatting variations of the same title and organization.

## 8. Safety Rules

The automation pipeline should follow these rules:

- No auto-publish.
- No duplicate spam.
- No unknown deadlines as fake dates.
- Source URL required for automated records.
- Public pages only show approved opportunities.
- Admins can edit before approving.
- Failed or partial scrapes should not create public records.
- Rejected records should not reappear repeatedly unless the source changes meaningfully.

These rules protect product quality and prevent automation from eroding trust.

## 9. Future Improvements

Once the review-first pipeline is stable, BuildNest can add more automation:

- Scheduled ingestion from trusted sources
- AI summarization for cleaner descriptions
- AI category and tag suggestions
- Change detection for updated deadlines or statuses
- Discord posting after approval
- Source health checks
- Admin notifications when new pending opportunities arrive

Discord posting should happen only after admin approval, not immediately after scraping.

## Recommended First Version

Start with a narrow implementation:

1. Add review metadata fields.
2. Add a Pending tab in the dashboard.
3. Build one ingestion script for one trusted source.
4. Insert scraped opportunities as pending only.
5. Require admin approval before public visibility.

This keeps the first automation version useful, testable, and safe.
