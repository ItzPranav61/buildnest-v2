# Fourth Batch Approval Results

Date: 2026-06-02

## Summary

PASS. All 4 pending Batch 4 opportunities were reviewed, link-checked, approved, and verified on production.

No app code was changed. No new rows were inserted during this approval step. C4GT, LF Decentralized Trust Mentorship 2026, and Season of KDE 2026 were not approved.

## Approved Rows

| Title | Row ID | Final review_status | Production detail |
| --- | --- | --- | --- |
| FOSS United Grants and Fellowships | `0196697f-31f6-493a-91c8-fcefcd7bd6ef` | `approved` | `https://buildnest-v2.vercel.app/opportunity/0196697f-31f6-493a-91c8-fcefcd7bd6ef` |
| IndiaFOSS 2026 Call for Proposals | `85be8de3-5472-46ec-b8fb-b9d194aed476` | `approved` | `https://buildnest-v2.vercel.app/opportunity/85be8de3-5472-46ec-b8fb-b9d194aed476` |
| IndiaFOSS 2026 Volunteer Program | `488532f8-d74b-439d-ba56-854d72af3ff5` | `approved` | `https://buildnest-v2.vercel.app/opportunity/488532f8-d74b-439d-ba56-854d72af3ff5` |
| Linux Foundation LFX Mentorship - Fall 2026 | `0b55aaa4-dd48-449d-9a66-70cfb9877296` | `approved` | `https://buildnest-v2.vercel.app/opportunity/0b55aaa4-dd48-449d-9a66-70cfb9877296` |

## Pending Row Verification Before Approval

All 4 target rows existed with `review_status = pending` before approval.

| Title | Organization | Category | Status | Deadline | Location | Source |
| --- | --- | --- | --- | --- | --- | --- |
| FOSS United Grants and Fellowships | FOSS United | Open Source | Open | null | India / Remote | `https://fossunited.org/grants` |
| IndiaFOSS 2026 Call for Proposals | FOSS United | Open Source | Open | `2026-06-15` | Bengaluru, India | `https://fossunited.org/indiafoss/2026` |
| IndiaFOSS 2026 Volunteer Program | FOSS United | Open Source | Open | null | India / Bengaluru | `https://fossunited.org/indiafoss/2026/volunteer/new` |
| Linux Foundation LFX Mentorship - Fall 2026 | Linux Foundation | Open Source | Upcoming | null | Remote / Global | `https://www.linuxfoundation.org/about/mentorship-programs/` |

Field review result: PASS.

- Titles were clear and matched the verified source records.
- Organizations were official and trusted.
- Categories were appropriate.
- Status values were clean.
- Deadlines were not guessed.
- Descriptions were concise and did not contain pasted raw URLs.
- Tags were relevant and non-empty.
- `source_name = Manual Verification`.
- `is_automated = false`.

## External Link Checks

All external links returned `200 OK`.

| Title | External link | Result |
| --- | --- | --- |
| FOSS United Grants and Fellowships | `https://fossunited.org/grants` | 200 OK |
| IndiaFOSS 2026 Call for Proposals | `https://fossunited.org/dashboard/cfp/apply/indiafoss/2026` | 200 OK |
| IndiaFOSS 2026 Volunteer Program | `https://fossunited.org/indiafoss/2026/volunteer/new` | 200 OK |
| Linux Foundation LFX Mentorship - Fall 2026 | `https://mentorship.lfx.linuxfoundation.org/` | 200 OK |

## Approval Action

Approved exactly these 4 rows:

- `0196697f-31f6-493a-91c8-fcefcd7bd6ef`
- `85be8de3-5472-46ec-b8fb-b9d194aed476`
- `488532f8-d74b-439d-ba56-854d72af3ff5`
- `0b55aaa4-dd48-449d-9a66-70cfb9877296`

No other Batch 4 candidates were approved.

## Production Public Visibility

Production URL checked: `https://buildnest-v2.vercel.app/opportunities`

Result: PASS.

All 4 approved opportunities appeared on production `/opportunities` after approval:

- FOSS United Grants and Fellowships
- IndiaFOSS 2026 Call for Proposals
- IndiaFOSS 2026 Volunteer Program
- Linux Foundation LFX Mentorship - Fall 2026

## Production Detail Page Verification

Result: PASS.

Each detail page returned `200` and showed the correct title.

| Title | Detail page status | Title visible |
| --- | --- | --- |
| FOSS United Grants and Fellowships | 200 | Yes |
| IndiaFOSS 2026 Call for Proposals | 200 | Yes |
| IndiaFOSS 2026 Volunteer Program | 200 | Yes |
| Linux Foundation LFX Mentorship - Fall 2026 | 200 | Yes |

## Duplicate Check

Result: PASS.

Each approved opportunity returned exactly one row by `source_url` and exactly one row by `external_link`.

| Title | source_url matches | external_link matches |
| --- | ---: | ---: |
| FOSS United Grants and Fellowships | 1 | 1 |
| IndiaFOSS 2026 Call for Proposals | 1 | 1 |
| IndiaFOSS 2026 Volunteer Program | 1 | 1 |
| Linux Foundation LFX Mentorship - Fall 2026 | 1 | 1 |

## Bugs Found

None.

## Recommendation

The 4 Batch 4 opportunities are ready to remain public. Next, run a quick production count/link audit after these approvals, then continue sourcing more official mentorship, fellowship, and open-source opportunities before adding more hackathons.
