# Post-Batch Production QA Results

QA date: 2026-06-02

Production URL: `https://buildnest-v2.vercel.app`

## PASS / FAIL Summary

Overall result: PASS with link/data cleanup recommended.

| Area | Result | Notes |
| --- | --- | --- |
| Public routes | PASS | Home, opportunities, login load. Add/dashboard redirect unauthenticated users to login. |
| Newly approved opportunities | PASS | All 6 approved batch opportunities are public. |
| Held/rejected opportunities | PASS | Hack4Brahma, HackGenome, and Processing Foundation Fellowship are not public. Outreachy cohort title is not public, but an older Outreachy Internship Round row is approved and visible. |
| Detail pages | PASS | All 6 newly approved detail pages load with title, CTA, and correct external link. |
| Link audit | PARTIAL | 14 of 16 public external links reachable. 2 problematic links found. |
| Duplicate audit | PASS | No duplicates by `external_link`, `source_url`, or normalized `title + organization`. |
| RLS behavior | PASS | Anon cannot read pending rows or insert rows; anon can read approved rows. |
| Mobile QA | PASS | No horizontal overflow at 320, 375, or 390 px on tested pages. Mobile nav opens and links appear. |
| Analytics sanity | PASS | GA4 script, measurement ID, and `dataLayer` are present in production HTML. |

## 1. Public Pages

| Route | Result | Status / redirect |
| --- | --- | --- |
| `/` | PASS | 200 |
| `/opportunities` | PASS | 200 |
| `/login` | PASS | 200 |
| `/add` | PASS | 307 to `/login?next=%2Fadd` |
| `/dashboard` | PASS | 307 to `/login?next=%2Fdashboard` |

Note: `/add` uses URL-encoded `/add` as `%2Fadd`, which is equivalent to the expected `next=/add`.

## 2. Newly Approved Opportunities Visible Publicly

All six newly approved opportunities are visible through anon-approved reads and production `/opportunities`.

| Opportunity | Public visibility |
| --- | --- |
| RNS Hack_Overflow 2.0 | PASS |
| SheBuilds Chennai Hack - Code & Challenge 3.0 | PASS |
| HACKER HOUSE GOA 2026 | PASS |
| DSU DEVHACK 3.0 | PASS |
| HexaFalls 2 | PASS |
| CodeStorm 2026 #2 | PASS |

Note: the SheBuilds title appears in HTML with `&` escaped as `&amp;`, which is expected.

## 3. Held / Rejected Opportunities Not Visible

| Opportunity | Public visibility result |
| --- | --- |
| Hack4Brahma 2.0 | PASS - not visible |
| Outreachy December 2026 Cohort | PASS - exact held candidate title not visible |
| HackGenome | PASS - not visible |
| Processing Foundation Fellowship | PASS - not visible |

Important note: an older approved row named `Outreachy December 2026 Internship Round` is visible publicly. This appears to be existing data, not the held candidate title `Outreachy December 2026 Cohort`.

## 4. Detail Pages

| Opportunity | Detail status | Title visible | CTA exists | External link correct |
| --- | --- | --- | --- | --- |
| RNS Hack_Overflow 2.0 | 200 | PASS | PASS | PASS |
| SheBuilds Chennai Hack - Code & Challenge 3.0 | 200 | PASS | PASS | PASS |
| HACKER HOUSE GOA 2026 | 200 | PASS | PASS | PASS |
| DSU DEVHACK 3.0 | 200 | PASS | PASS | PASS |
| HexaFalls 2 | 200 | PASS | PASS | PASS |
| CodeStorm 2026 #2 | 200 | PASS | PASS | PASS |

Detail URLs checked:

- `https://buildnest-v2.vercel.app/opportunity/9b470944-fa2a-40e4-a2f8-30fad64af76f`
- `https://buildnest-v2.vercel.app/opportunity/77a1915e-40ba-435e-b28e-22a848ce2df8`
- `https://buildnest-v2.vercel.app/opportunity/ba246c4a-baf6-4ed3-a32d-a5b80721c6cb`
- `https://buildnest-v2.vercel.app/opportunity/88e64c99-8440-46e4-bd62-145924a622a4`
- `https://buildnest-v2.vercel.app/opportunity/40135ec1-68a2-45f6-8644-591199069d77`
- `https://buildnest-v2.vercel.app/opportunity/45a4f07d-47fa-4d2d-a118-d131c87f8e61`

## 5. Link Audit Summary

Total public opportunity external links checked: 16

| Result | Count |
| --- | --- |
| Reachable | 14 |
| Failed | 2 |
| Redirects | 2 |
| Suspicious / cleanup recommended | 4 |

### Failed Links

| Opportunity | URL | Issue |
| --- | --- | --- |
| Impact Labs Fellowship | `https://impactlabs.fellowship` | DNS resolution failed. |
| Neo Scholar Program | `https://neoscholar.com` | TLS trust failure. |

### Redirects

| Opportunity | URL | Final URL |
| --- | --- | --- |
| MLH Fellowship Summer 2026 | `https://fellowship.mlh.io/` | `https://fellowship.mlh.com/` |
| Outreachy December 2026 Internship Round | `https://www.outreachy.org` | `https://www.outreachy.org/` |

### Reachable Batch Links

All six newly approved batch links returned 200.

| Opportunity | External link | Status |
| --- | --- | --- |
| RNS Hack_Overflow 2.0 | `https://rns-hackoverflow-2.devfolio.co/` | 200 |
| SheBuilds Chennai Hack - Code & Challenge 3.0 | `https://shebuilds-chennai-hack.devfolio.co/` | 200 |
| HACKER HOUSE GOA 2026 | `https://hacker-house-goa-2026.devfolio.co/` | 200 |
| DSU DEVHACK 3.0 | `https://dsudevhack3.devfolio.co/` | 200 |
| HexaFalls 2 | `https://hexafalls2.devfolio.co/` | 200 |
| CodeStorm 2026 #2 | `https://codestorm-week2-2026.devfolio.co/` | 200 |

## 6. Duplicate Audit Summary

Result: PASS

No duplicates found by:

- `external_link`
- `source_url`
- normalized `title + organization`

## 7. RLS Verification

Result: PASS

| Check | Result |
| --- | --- |
| Anon cannot read pending rows | PASS - returned `[]` |
| Anon can read approved rows | PASS - returned approved opportunities |
| Anon cannot insert rows | PASS - insert blocked by RLS |

Anon insert error:

```text
new row violates row-level security policy for table "opportunities"
```

No accidental QA insert row was created.

## 8. Mobile QA

Result: PASS

Pages checked:

- `/`
- `/opportunities`
- `/opportunity/88e64c99-8440-46e4-bd62-145924a622a4`
- `/login`

Viewports checked:

- 320 px
- 375 px
- 390 px

Findings:

- No horizontal overflow at any tested viewport.
- Opportunity cards are readable.
- Detail page CTA is usable.
- Login form is readable and usable.
- Mobile hamburger opens successfully at 320, 375, and 390 px.
- Mobile menu exposes Home, Opportunities, Add, and Dashboard.
- Opening the mobile menu does not create horizontal overflow.

## 9. Analytics Sanity

Result: PASS

Checked production HTML for:

- `googletagmanager.com/gtag/js`
- `G-P4TRV9TQJX`
- `dataLayer`

Pages checked:

- `/`
- `/opportunities`
- `/login`
- `/opportunity/88e64c99-8440-46e4-bd62-145924a622a4`

All passed.

## Bugs Found

### Medium: Two Public External Links Are Broken

1. `Impact Labs Fellowship` uses `https://impactlabs.fellowship`, which does not resolve.
2. `Neo Scholar Program` uses `https://neoscholar.com`, which failed TLS trust validation during QA.

### Polish / Data Quality: Stale Approved Rows

Some approved rows appear stale or deserve review:

- `MLH Fellowship Summer 2026` has `status = Expired` and deadline `2026-04-30`, but remains publicly visible.
- `HackOrbit 2026` has `status = Expired` and deadline `2026-05-04`, but remains publicly visible.
- `GirlScript Summer of Code (GSSoC) 2026` has deadline `2026-06-01`, which is past as of 2026-06-02, while status is still `Open`.

These are not regressions from the RLS fix or second-batch approval, but they should be cleaned up for trust.

## Recommended Fixes

1. Replace or reject the broken `Impact Labs Fellowship` link.
2. Verify `Neo Scholar Program` with an official reachable source before keeping it public.
3. Decide whether expired approved opportunities should be hidden by default or moved behind an Expired filter.
4. Update stale statuses where deadline has passed, especially GSSoC.
5. Consider a recurring scheduled link audit for approved opportunities.

## Final Result

Production is stable after the RLS fix and two opportunity batches.

No critical bugs found. Public security behavior is correct. The newly approved opportunities are live and working. The main follow-up is data hygiene for broken/stale older links.
