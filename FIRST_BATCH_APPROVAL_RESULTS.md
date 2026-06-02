# First Batch Approval Results

Verification date: 2026-06-02

Rows reviewed:

- `9b470944-fa2a-40e4-a2f8-30fad64af76f` - RNS Hack_Overflow 2.0
- `77a1915e-40ba-435e-b28e-22a848ce2df8` - SheBuilds Chennai Hack - Code & Challenge 3.0
- `ba246c4a-baf6-4ed3-a32d-a5b80721c6cb` - HACKER HOUSE GOA 2026

## Summary

Result: PASS

All three manually verified pending opportunities had clean required fields, valid external/source URLs, and no duplicate rows by verified URL. All three were approved.

No app code was modified.
No new rows were inserted.
Hack4Brahma and Outreachy were not approved or inserted.

## Dashboard Pending Check

Attempted browser check:

- `http://localhost:3000/dashboard`
- `http://127.0.0.1:3000/dashboard`

Result:

- The in-app browser blocked local dashboard navigation with `net::ERR_BLOCKED_BY_CLIENT`.

Fallback verification:

- Supabase service-role read confirmed all three rows were in `review_status = pending` before approval.
- This matches the dashboard Pending tab data source.

## Field Review

### RNS Hack_Overflow 2.0

- Title: clean
- Organization: `RNSIT`
- Category: `Hackathon`
- Status: `Open`
- Deadline: `null`
- Location: `Bengaluru, India`
- Tags: `Hackathon`, `Offline`, `Bengaluru`, `Web3`, `Student Builders`
- External link: `https://rns-hackoverflow-2.devfolio.co/`
- Source URL: `https://rns-hackoverflow-2.devfolio.co/`
- Source name: `Manual Verification`
- `is_automated`: `false`

Decision: approve

### SheBuilds Chennai Hack - Code & Challenge 3.0

- Title: clean
- Organization: `Rajalakshmi Engineering College`
- Category: `Hackathon`
- Status: `Open`
- Deadline: `2026-06-30`
- Location: `Thandalam, India`
- Tags: `Hackathon`, `Women in Tech`, `Offline Finale`, `Chennai`, `Social Impact`
- External link: `https://shebuilds-chennai-hack.devfolio.co/`
- Source URL: `https://shebuilds-chennai-hack.devfolio.co/`
- Source name: `Manual Verification`
- `is_automated`: `false`

Decision: approve

### HACKER HOUSE GOA 2026

- Title: clean
- Organization: `2:47PM Studio`
- Category: `Hackathon`
- Status: `Open`
- Deadline: `null`
- Location: `Goa, India`
- Tags: `Hackathon`, `Hacker House`, `AI`, `Crypto`, `Goa`, `Builder Residency`
- External link: `https://hacker-house-goa-2026.devfolio.co/`
- Source URL: `https://hacker-house-goa-2026.devfolio.co/`
- Source name: `Manual Verification`
- `is_automated`: `false`

Decision: approve

## External Link Verification

| Opportunity | URL | Status | Page title |
| --- | --- | --- | --- |
| RNS Hack_Overflow 2.0 | `https://rns-hackoverflow-2.devfolio.co/` | 200 | RNS Hack_Overflow 2.0 \| Devfolio |
| SheBuilds Chennai Hack | `https://shebuilds-chennai-hack.devfolio.co/` | 200 | SheBuilds Chennai Hack \| Devfolio |
| HACKER HOUSE GOA 2026 | `https://hacker-house-goa-2026.devfolio.co/` | 200 | HACKER HOUSE GOA 2026 \| Devfolio |

## Approval Results

Approved rows:

| ID | Title | Final status |
| --- | --- | --- |
| `9b470944-fa2a-40e4-a2f8-30fad64af76f` | RNS Hack_Overflow 2.0 | approved |
| `77a1915e-40ba-435e-b28e-22a848ce2df8` | SheBuilds Chennai Hack - Code & Challenge 3.0 | approved |
| `ba246c4a-baf6-4ed3-a32d-a5b80721c6cb` | HACKER HOUSE GOA 2026 | approved |

## Duplicate Check

Duplicate check by `external_link` / `source_url` returned exactly one row per verified URL:

- RNS Hack_Overflow 2.0: one approved row
- SheBuilds Chennai Hack - Code & Challenge 3.0: one approved row
- HACKER HOUSE GOA 2026: one approved row

Result: PASS

## Public Opportunities Verification

Production URL checked:

`https://buildnest-v2.vercel.app/opportunities`

Result:

- HTTP status: 200
- RNS Hack_Overflow 2.0 found: yes
- SheBuilds Chennai Hack found: yes
- HACKER HOUSE GOA 2026 found: yes

Result: PASS

## Detail Page Verification

| Opportunity | Detail URL | Status | Title present |
| --- | --- | --- | --- |
| RNS Hack_Overflow 2.0 | `https://buildnest-v2.vercel.app/opportunity/9b470944-fa2a-40e4-a2f8-30fad64af76f` | 200 | yes |
| SheBuilds Chennai Hack - Code & Challenge 3.0 | `https://buildnest-v2.vercel.app/opportunity/77a1915e-40ba-435e-b28e-22a848ce2df8` | 200 | yes |
| HACKER HOUSE GOA 2026 | `https://buildnest-v2.vercel.app/opportunity/ba246c4a-baf6-4ed3-a32d-a5b80721c6cb` | 200 | yes |

Result: PASS

## Final Recommendation

Keep all three approved.

Recommended next action:

- Verify the next 5 candidates from `OPPORTUNITY_RESEARCH_REVIEW.md`.
- Re-check Hack4Brahma when its Devfolio page changes from `Remind me` to `Apply now`.
- Re-check Outreachy when exact December 2026 application dates are published.
