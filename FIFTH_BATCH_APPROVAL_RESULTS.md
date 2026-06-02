# Fifth Batch Approval Results

Date: 2026-06-02

## Summary

PASS. All 5 pending Batch 5 opportunities were reviewed, link-checked, approved, and verified on production.

No app code was changed. No new rows were inserted during this approval step. C4GT, Outreachy, Zoox, Summer of Bitcoin, and Igalia Coding Experience were not approved.

## Approved Rows

| Title | Row ID | Final review_status | Production detail |
| --- | --- | --- | --- |
| MATS Autumn 2026 Fellowship | `aea7323c-9cc7-49c8-a87c-055356222496` | `approved` | `https://buildnest-v2.vercel.app/opportunity/aea7323c-9cc7-49c8-a87c-055356222496` |
| Google Student Researcher, BS/MS, Winter/Summer 2026 | `c2df8b78-f5a6-4370-aeff-9f51faa76d5d` | `approved` | `https://buildnest-v2.vercel.app/opportunity/c2df8b78-f5a6-4370-aeff-9f51faa76d5d` |
| WeRide 2026 Summer Intern - Software Engineer | `785d3ce7-d138-40b5-8fb5-8f7da096ff96` | `approved` | `https://buildnest-v2.vercel.app/opportunity/785d3ce7-d138-40b5-8fb5-8f7da096ff96` |
| Wintermute Ventures Summer 2026 Internship | `4f056641-0d2a-4bb5-bcda-0d8f492b6e21` | `approved` | `https://buildnest-v2.vercel.app/opportunity/4f056641-0d2a-4bb5-bcda-0d8f492b6e21` |
| ShopBack Software Engineer Intern - Backend H2 2026 | `7b0d07e1-cc72-4aed-97f7-55a5659ebb96` | `approved` | `https://buildnest-v2.vercel.app/opportunity/7b0d07e1-cc72-4aed-97f7-55a5659ebb96` |

## Pending Row Verification Before Approval

All 5 target rows existed with `review_status = pending` before approval.

| Title | Organization | Category | Status | Deadline | Location | Source |
| --- | --- | --- | --- | --- | --- | --- |
| MATS Autumn 2026 Fellowship | MATS Program | Fellowship | Open | `2026-06-07` | Berkeley, CA / London, UK | `https://www.matsprogram.org/apply` |
| Google Student Researcher, BS/MS, Winter/Summer 2026 | Google | Internship | Open | `2026-07-17` | United States | `https://www.google.com/about/careers/applications/jobs/results/140245524367188678-student-researcher-bsms-wintersummer-2026?page=6` |
| WeRide 2026 Summer Intern - Software Engineer | WeRide | Internship | Open | null | San Jose, CA | `https://jobs.lever.co/weride/8f84c602-8a79-43f6-b662-74a92ef761f5` |
| Wintermute Ventures Summer 2026 Internship | Wintermute | Internship | Open | null | New York / Singapore / Remote | `https://jobs.lever.co/wintermute-trading/bc6834fe-e3ad-4c09-a4db-2fce3b13ee8f` |
| ShopBack Software Engineer Intern - Backend H2 2026 | ShopBack | Internship | Open | null | Singapore | `https://jobs.lever.co/shopback-2/4e119b8f-3c8d-47e6-9dde-f232930e752c` |

Field review result: PASS.

- Titles were clear and matched verified sources.
- Organizations were trusted and direct-source.
- Categories and statuses were appropriate.
- Deadlines were not guessed.
- Tags were relevant and non-empty.
- Descriptions were concise and did not contain pasted raw URL blocks.
- `source_name = Manual Verification`.
- `is_automated = false`.

## Constraint Wording Review

PASS. Required eligibility and location constraints were clearly included in descriptions.

| Opportunity | Constraint requirement | Result |
| --- | --- | --- |
| Google Student Researcher, BS/MS, Winter/Summer 2026 | United States / BS-MS eligibility | Description states Bachelor's or Master's Computer Science eligibility and United States location requirement. |
| WeRide 2026 Summer Intern - Software Engineer | San Jose, CA / on-site | Description states five-days-per-week on-site availability in San Jose, CA. |
| Wintermute Ventures Summer 2026 Internship | New York or Singapore / work permit constraints | Description states valid work permit in New York or Singapore. |
| ShopBack Software Engineer Intern - Backend H2 2026 | Singapore / 6-month full-time commitment | Description states Singapore-based and minimum 6-month full-time commitment. |

## External Link Checks

All external links returned `200 OK`.

| Title | External link | Result |
| --- | --- | --- |
| MATS Autumn 2026 Fellowship | `https://www.matsprogram.org/apply` | 200 OK |
| Google Student Researcher, BS/MS, Winter/Summer 2026 | `https://www.google.com/about/careers/applications/jobs/results/140245524367188678-student-researcher-bsms-wintersummer-2026?page=6` | 200 OK |
| WeRide 2026 Summer Intern - Software Engineer | `https://jobs.lever.co/weride/8f84c602-8a79-43f6-b662-74a92ef761f5` | 200 OK |
| Wintermute Ventures Summer 2026 Internship | `https://jobs.lever.co/wintermute-trading/bc6834fe-e3ad-4c09-a4db-2fce3b13ee8f` | 200 OK |
| ShopBack Software Engineer Intern - Backend H2 2026 | `https://jobs.lever.co/shopback-2/4e119b8f-3c8d-47e6-9dde-f232930e752c` | 200 OK |

## Approval Action

Approved exactly these 5 rows:

- `aea7323c-9cc7-49c8-a87c-055356222496`
- `c2df8b78-f5a6-4370-aeff-9f51faa76d5d`
- `785d3ce7-d138-40b5-8fb5-8f7da096ff96`
- `4f056641-0d2a-4bb5-bcda-0d8f492b6e21`
- `7b0d07e1-cc72-4aed-97f7-55a5659ebb96`

No held or rejected Batch 5 candidates were approved.

## Production Public Visibility

Production URL checked: `https://buildnest-v2.vercel.app/opportunities`

Result: PASS.

All 5 approved opportunities appeared on production `/opportunities` after approval:

- MATS Autumn 2026 Fellowship
- Google Student Researcher, BS/MS, Winter/Summer 2026
- WeRide 2026 Summer Intern - Software Engineer
- Wintermute Ventures Summer 2026 Internship
- ShopBack Software Engineer Intern - Backend H2 2026

## Production Detail Page Verification

Result: PASS.

Each detail page returned `200` and showed the correct title.

| Title | Detail page status | Title visible |
| --- | --- | --- |
| MATS Autumn 2026 Fellowship | 200 | Yes |
| Google Student Researcher, BS/MS, Winter/Summer 2026 | 200 | Yes |
| WeRide 2026 Summer Intern - Software Engineer | 200 | Yes |
| Wintermute Ventures Summer 2026 Internship | 200 | Yes |
| ShopBack Software Engineer Intern - Backend H2 2026 | 200 | Yes |

## Duplicate Check

Result: PASS.

Each approved opportunity returned exactly one row by `source_url` and exactly one row by `external_link`.

| Title | source_url matches | external_link matches |
| --- | ---: | ---: |
| MATS Autumn 2026 Fellowship | 1 | 1 |
| Google Student Researcher, BS/MS, Winter/Summer 2026 | 1 | 1 |
| WeRide 2026 Summer Intern - Software Engineer | 1 | 1 |
| Wintermute Ventures Summer 2026 Internship | 1 | 1 |
| ShopBack Software Engineer Intern - Backend H2 2026 | 1 | 1 |

## Bugs Found

None.

## Recommendation

The 5 Batch 5 opportunities are ready to remain public. Because several are geographically constrained, keep prioritizing clear location and eligibility wording during future manual verification. Next batch should continue looking for official paid internships and fellowships, while holding C4GT until its direct application URL is verified.
