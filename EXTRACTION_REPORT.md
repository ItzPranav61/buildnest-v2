# BuildNest Extraction Report

## Summary

Firecrawl MCP was available and callable for all three tested trusted sources. Each source returned structured opportunity-like data, but reliability varies depending on whether deadlines and canonical application links are clearly exposed on the page.

No code changes or database changes were made.

## 1. GirlScript Summer of Code

**Source URL tested:**  
https://gssoc.girlscript.org/

**Extraction result:** Success

**Fields extractable:**

- title: GirlScript Summer of Code 2026
- organization: GirlScript Foundation
- category: Open Source
- deadline: 24th March 2026
- location: India
- description: Program summary and positioning were extractable.
- external_link: https://gssoc.girlscript.org/#apply
- source_url: https://gssoc.girlscript.org/

**Fields missing or uncertain:**

- Deadline should still be reviewed because program pages may show multiple dates, such as contributor applications, mentor applications, project submission, or program milestones.
- The extracted `#apply` link is usable, but the final application destination may change depending on the page state.

**Reliability score:** 8/10

**Recommended ingestion strategy:** Direct scrape with manual review

GSSoC is a strong candidate for semi-automated ingestion. The page exposes enough structured metadata and visible content to create a pending opportunity, but the deadline and application link should be reviewed before publishing.

## 2. MLH Fellowship

**Source URL tested:**  
https://fellowship.mlh.io/

**Extraction result:** Partial success

**Fields extractable:**

- title: MLH Fellowship
- organization: Major League Hacking
- category: Fellowship / Internship alternative
- location: Remote
- description: Program summary was extractable.
- external_link: https://fellowship.mlh.com
- source_url: https://fellowship.mlh.com/apply

**Fields missing or uncertain:**

- deadline: Not clearly available from the tested page.
- The tested URL redirected from `fellowship.mlh.io` to `fellowship.mlh.com`.
- Application timing may depend on cohort-specific pages or changing admissions windows.
- Category could be represented as Fellowship rather than Internship depending on BuildNest taxonomy.

**Reliability score:** 6/10

**Recommended ingestion strategy:** Manual review only

MLH Fellowship can provide good title, organization, location, and description data, but deadline extraction is weak. It should enter the pipeline as a pending record only, with admin review required before publishing.

## 3. Google Summer of Code

**Source URL tested:**  
https://summerofcode.withgoogle.com/

**Extraction result:** Success

**Fields extractable:**

- title: Google Summer of Code
- organization: Google Open Source
- category: Open Source Program
- deadline: March 31, 2026 at 18:00 UTC
- location: Online
- description: Program summary was extractable.
- external_link: https://summerofcode.withgoogle.com/
- source_url: https://summerofcode.withgoogle.com/

**Fields missing or uncertain:**

- Deadline should be verified against the official timeline page because GSoC has multiple important dates.
- Some extracted context may point to related Google Open Source blog posts, so the canonical source URL should remain the main GSoC site unless a specific timeline page is used.

**Reliability score:** 8/10

**Recommended ingestion strategy:** Direct scrape of official timeline or program page with manual review

Google Summer of Code is a strong candidate for ingestion, but BuildNest should prefer the official timeline page when extracting deadlines. The public home page is reliable for title, organization, location, description, and link.

## Practical Recommendation

For the first BuildNest automation version, use a review-first pipeline:

```text
Source -> Firecrawl -> Normalize -> Deduplicate -> Pending Review -> Admin Approves -> Published
```

Suggested source strategy:

- GSSoC: direct scrape into pending review.
- MLH Fellowship: manual review only until cohort/deadline extraction is stronger.
- Google Summer of Code: direct scrape from official program or timeline page into pending review.

None of these sources should auto-publish. Deadlines and external links should always be verified before approval.
