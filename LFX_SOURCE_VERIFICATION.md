# LFX Source Verification

Verification date: 2026-06-02

Source requested: `https://lfx.linuxfoundation.org/tools/mentorship/`

## Method

- Firecrawl MCP was used to extract the official LFX Mentorship page.
- Direct HTTP checks were used to confirm page load, redirects, final URLs, and portal behavior.
- No adapter code was written.
- No ingestion was run.
- No app code was modified.

## Page Load

Page loaded: yes

Final URL:

`https://lfx.linuxfoundation.org/tools/mentorship/`

Status:

`200 OK`

The page loads successfully and returns a full Linux Foundation / LFX Tools marketing page for LFX Mentorship.

## Official Source

Official source: yes

Reason:

- The source is hosted on `lfx.linuxfoundation.org`.
- The page title is `LFX Mentorship – LFX Tools | Linux Foundation`.
- The page describes LFX Mentorship as part of the official LFX tool ecosystem.
- The page links to the official mentorship portal.

## Active Status

Active status: active platform, but not a clean public opportunity listing

The page describes LFX Mentorship as an active Linux Foundation tool for running mentorship programs and training future open source contributors. It includes an `Explore Mentorship` call to action.

However, the page itself does not list current mentorship opportunities, application windows, projects, or deadlines. It is an overview page, not a structured opportunity listing page.

## Application / Opportunity Link

Clear application/open opportunity link found: partially

The official overview page links to:

`https://mentorship.lfx.dev/`

Direct request result:

- `https://mentorship.lfx.dev/` redirects to `https://mentorship.lfx.linuxfoundation.org/`
- Final portal URL returns `200 OK`
- Page title: `Mentorship`
- The returned HTML is a small JavaScript application shell with `<app-root>`

Canonical portal URL:

`https://mentorship.lfx.linuxfoundation.org/`

This appears to be the correct place to explore mentorship programs, but listings are not exposed directly in the static HTML.

## Deadline

Deadline found: no

The official overview page does not expose a current application deadline.

No specific current mentorship cycle deadline was extractable from the source page. Because opportunities appear to be behind the portal, a future adapter would need to safely map portal data before using any deadline.

Deadline rule:

- Store `deadline = null` unless a specific mentorship opportunity exposes a clear deadline.
- Never infer deadlines from the existence of the platform.
- Never use fake placeholder dates.

## Opportunity Listing Behavior

Are opportunities listed directly: no

Opportunities appear to be behind another portal:

`https://mentorship.lfx.linuxfoundation.org/`

The portal is a JavaScript application. Static HTML inspection did not expose direct mentorship listing data, titles, deadlines, or application links. It may load data through client-side APIs after the app initializes.

This means LFX is not yet a clean direct-scrape source in the same way as a simple static opportunity page.

## Recommended URLs

Recommended `source_url`:

`https://lfx.linuxfoundation.org/tools/mentorship/`

Reason:

- Official Linux Foundation overview page.
- Stable source attribution.
- Explains what LFX Mentorship is.

Recommended `external_link`:

`https://mentorship.lfx.linuxfoundation.org/`

Reason:

- Canonical final portal URL after redirect.
- This is where users can explore mentorship opportunities.

Alternative external link:

`https://mentorship.lfx.dev/`

Reason:

- This is the link exposed by the overview page, but it redirects to the canonical portal URL.

## Extracted Summary

LFX Mentorship is an official Linux Foundation program/tool for helping open source projects train future contributors and run mentorship programs. It supports the open source community by helping projects find contributors, support aspiring developers, and manage mentorship programs through the LFX ecosystem.

The source confirms the platform is active, but it does not expose a clean current list of opportunities or deadlines on the overview page.

## Recommended Payload

This payload should be considered manual-review only, not a direct automated insert recommendation:

```json
{
  "title": "LFX Mentorship",
  "organization": "Linux Foundation",
  "category": "Open Source",
  "status": "Upcoming",
  "deadline": null,
  "location": "Online / Global",
  "description": "LFX Mentorship is an official Linux Foundation platform for open source mentorship programs, helping projects train future contributors and helping aspiring developers gain experience in open source communities.",
  "tags": ["Open Source", "Mentorship", "Linux Foundation", "LFX"],
  "external_link": "https://mentorship.lfx.linuxfoundation.org/",
  "source_name": "LFX",
  "source_url": "https://lfx.linuxfoundation.org/tools/mentorship/",
  "review_status": "pending",
  "is_automated": true
}
```

Notes:

- `deadline` should remain `null`.
- `status` should be admin-reviewed because the page confirms the platform, not a specific open opportunity.
- If BuildNest wants concrete opportunities, the adapter should target individual portal listings, not the overview page.

## Confidence

Confidence: medium

Why:

- High confidence that the source is official and the platform is active.
- Medium confidence for ingestion suitability because current opportunities and deadlines are not directly extractable from the source page.
- Low confidence for deadline extraction from this page alone.

## Suitability For Automation

Suitable for automation now: not as a direct opportunity adapter

The source is suitable for a manual-review entry or a future portal-aware adapter, but not for immediate clean automation of individual opportunities.

Reasons:

- The official overview page does not list current opportunities.
- The official overview page does not expose a deadline.
- The actual opportunity exploration happens behind a JavaScript portal.
- The portal may require API mapping, browser automation, or authenticated/session-aware handling.

## Recommendation

Recommendation: manual-only for now

Do not implement a standard LFX adapter yet.

Recommended next steps:

1. Treat LFX Mentorship as a promising source, but keep it manual-only for now.
2. If adding an entry manually, insert it as `pending` with `deadline = null`.
3. Before automation, inspect the mentorship portal APIs and confirm whether individual opportunity listings expose stable fields:
   - title
   - project or organization
   - application status
   - deadline
   - location
   - external link
4. Only implement an adapter once individual listings can be extracted reliably without guessing.

Final decision:

Manual-only now. Wait on automation until the portal data shape is verified.
