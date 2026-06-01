# MLH Source Verification

Verification date: 2026-06-01

Source requested: `https://fellowship.mlh.io/`

## Method

- Firecrawl MCP was available and used for search/extraction.
- Direct browser/web inspection was also used for the main page.
- Direct browser fetch of the apply page returned `403 Forbidden` in this environment, but Firecrawl extracted the apply page content from official MLH URLs.

## Page Load

Page loaded: yes

Initial URL:

`https://fellowship.mlh.io/`

Final URL:

`https://fellowship.mlh.com/`

Redirect observed: yes

The `.io` source redirects to the canonical `.com` Fellowship site.

## Active Status

Active status: partially active / needs review

The main Fellowship page is live, describes the MLH Fellowship, includes program tracks, and contains an `Apply Now` link. The page presents the program as an ongoing Fellowship with upcoming start dates.

However, the apply page content extracted by Firecrawl references:

- Summer 2026 Software Engineering
- Start date: May 18, 2026
- Applicant deadline: April 30, 2026

Because the current date is 2026-06-01, that deadline is already past. The program appears real and maintained, but the currently extractable application cycle is not safely publishable as a new active opportunity without admin review.

## Current Application Link

Application button/link found: yes

Official application URL:

`https://fellowship.mlh.com/apply`

Notes:

- The main page links to this apply URL.
- Firecrawl extracted application content from the official apply page.
- Direct browser fetch returned `403 Forbidden`, likely due to form/app protection or environment blocking.

## Deadline

Deadline found: yes

Extracted deadline:

`2026-04-30`

Deadline confidence: medium-high

Reason:

- Firecrawl extracted a clear applicant deadline from the official apply page content.
- The deadline appears tied to the Summer 2026 batch.
- The deadline is already expired as of this verification date.

## Extracted Summary

MLH Fellowship is a remote 12-week internship alternative from Major League Hacking. It helps early-career technologists gain practical software experience through tracks such as Software Engineering, Production Engineering/SRE, and Web3 Engineering. The program includes mentorship, real-world projects, community learning, and an educational stipend for select programs.

## Recommended URLs

Recommended `source_url`:

`https://fellowship.mlh.com/`

Reason:

- This is the canonical final URL after redirect.
- It is stable for source attribution and program overview.

Recommended `external_link`:

`https://fellowship.mlh.com/apply`

Reason:

- This is the official application link exposed by the Fellowship site.
- It should be used only with review because the currently extracted batch deadline is expired.

## Recommended Payload

```json
{
  "title": "MLH Fellowship",
  "organization": "Major League Hacking",
  "category": "Fellowship",
  "status": "Expired",
  "deadline": "2026-04-30",
  "location": "Remote / Global",
  "description": "MLH Fellowship is a remote 12-week internship alternative where technologists gain practical experience through mentorship, real-world projects, and structured tracks such as Software Engineering, Production Engineering, and Web3 Engineering.",
  "tags": ["Fellowship", "Open Source", "Remote", "Software Engineering"],
  "external_link": "https://fellowship.mlh.com/apply",
  "source_name": "MLH",
  "source_url": "https://fellowship.mlh.com/",
  "review_status": "pending",
  "is_automated": true
}
```

Alternative safer payload if BuildNest should avoid expired automated opportunities:

```json
{
  "title": "MLH Fellowship",
  "organization": "Major League Hacking",
  "category": "Fellowship",
  "status": "Upcoming",
  "deadline": null,
  "location": "Remote / Global",
  "description": "MLH Fellowship is a remote 12-week internship alternative where technologists gain practical experience through mentorship, real-world projects, and structured tracks such as Software Engineering, Production Engineering, and Web3 Engineering.",
  "tags": ["Fellowship", "Open Source", "Remote", "Software Engineering"],
  "external_link": "https://fellowship.mlh.com/",
  "source_name": "MLH",
  "source_url": "https://fellowship.mlh.com/",
  "review_status": "pending",
  "is_automated": true
}
```

## Confidence

Confidence: medium

Why not high:

- The page and apply link are official.
- The application deadline is clearly extractable.
- But the extracted application deadline is already past.
- The apply page may be protected or blocked in normal browser environments.
- It is unclear whether MLH is currently accepting applications for a future batch beyond Summer 2026.

## Recommendation

Recommendation: wait before implementing the adapter as an active opportunity source.

MLH is a good BuildNest source, but the current source state is not clean enough for a confident active adapter. The best next step is to wait until MLH publishes a future/current cohort deadline or application cycle, then implement the adapter.

If implemented now, the adapter should:

- Insert only as `pending`.
- Use `status = "Expired"` if it stores the April 30, 2026 deadline.
- Or use `deadline = null` and `external_link = "https://fellowship.mlh.com/"` if avoiding an expired apply link.
- Add a clear log warning that the current extracted deadline is expired and requires admin review.

Do not auto-publish this source.
