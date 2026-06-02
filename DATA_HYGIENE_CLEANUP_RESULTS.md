# Data Hygiene Cleanup Results

Cleanup date: 2026-06-02

Source plan: `DATA_HYGIENE_FIX_PLAN.md`

## Summary

Result: PASS

The broken/stale approved opportunity rows were cleaned up with data-only changes. No app code was modified. No rows were deleted. No new opportunities were inserted.

## URL Verification Before Cleanup

### Impact Labs Fellowship

- Current broken URL before cleanup: `https://impactlabs.fellowship`
- Verified official URL: `https://www.impactlabs.io/fellowship`
- Result: official page loads with HTTP 200.
- Quality note: the official page says applications for the 2025 fellowship are closed and applications are currently closed.
- Decision: move out of public approval because the source is not currently active.

### Neo Scholar Program

- Current broken URL before cleanup: `https://neoscholar.com`
- Result: TLS trust validation failed for the current URL.
- Additional checks:
  - `https://neo.com/` loads.
  - `https://www.neoschool.com/` loads and appears related to Neoscholar Education, not a clearly verified BuildNest-ready Neo Scholar opportunity application.
- Decision: move out of public approval because no trusted current application URL was verified.

## Rows Changed

| Row | ID | Changes made |
| --- | --- | --- |
| Impact Labs Fellowship | `2e91e20d-1d15-4a39-ae8d-c0fd7e777600` | `review_status` set to `rejected`; `status` set to `Expired`; `external_link` and `source_url` set to `https://www.impactlabs.io/fellowship`. |
| Neo Scholar Program | `8275a9e7-b702-418c-af90-dce3c5e9cf12` | `review_status` set to `rejected`; current broken URL retained for admin follow-up. |
| MLH Fellowship Summer 2026 | `67e99217-fa05-4320-b793-aa80fa724e11` | `review_status` set to `rejected`; `status` kept `Expired`; `external_link` updated to `https://fellowship.mlh.com/`. |
| HackOrbit 2026 | `4f924247-98b3-472a-89a6-4517030c2427` | `review_status` set to `rejected`; `status` kept `Expired`. |
| GirlScript Summer of Code (GSSoC) 2026 | `3f36d845-724c-4367-9f07-1baaaa081736` | `status` updated from `Open` to `Expired`; `review_status` kept `approved`. |

## Updated Row States

| Title | Status | Review status | External link |
| --- | --- | --- | --- |
| Impact Labs Fellowship | Expired | rejected | `https://www.impactlabs.io/fellowship` |
| Neo Scholar Program | Open | rejected | `https://neoscholar.com` |
| MLH Fellowship Summer 2026 | Expired | rejected | `https://fellowship.mlh.com/` |
| HackOrbit 2026 | Expired | rejected | `https://hackorbit26.droidecks.sbs/` |
| GirlScript Summer of Code (GSSoC) 2026 | Expired | approved | `https://gssoc.girlscript.org/` |

## Public Visibility Verification

Result: PASS

Production `/opportunities` returned HTTP 200.

| Title | Expected | Public visibility |
| --- | --- | --- |
| Impact Labs Fellowship | Hidden | PASS - not visible |
| Neo Scholar Program | Hidden | PASS - not visible |
| MLH Fellowship Summer 2026 | Hidden | PASS - not visible |
| HackOrbit 2026 | Hidden | PASS - not visible |
| GirlScript Summer of Code (GSSoC) 2026 | Visible | PASS - visible |

GSSoC detail page:

- URL: `https://buildnest-v2.vercel.app/opportunity/3f36d845-724c-4367-9f07-1baaaa081736`
- Status: 200
- Title visible: Yes
- Status visible as `Expired`: Yes

## RLS Verification

Result: PASS

| Check | Result |
| --- | --- |
| Anon cannot read rejected cleanup rows | PASS - returned `[]` |
| Anon cannot read pending rows | PASS - returned `[]` |
| Anon can read approved rows | PASS - returned approved rows |
| Anon cannot insert rows | PASS - blocked by RLS |

Anon insert error:

```text
new row violates row-level security policy for table "opportunities"
```

No accidental QA insert row was created.

## Link Audit After Cleanup

Result: PASS

Approved public opportunity links checked: 12

| Result | Count |
| --- | --- |
| Reachable | 12 |
| Failed | 0 |
| Redirects | 1 |

Remaining redirect:

| Title | URL | Final URL |
| --- | --- | --- |
| Outreachy December 2026 Internship Round | `https://www.outreachy.org` | `https://www.outreachy.org/` |

This redirect only adds a trailing slash and is low risk.

## Remaining Issues

### Neo Scholar Program Needs Manual Source Review

The row is now hidden from public users, but it still needs a trusted official application URL if it is ever restored.

Current admin-only row state:

- `review_status = rejected`
- `external_link = https://neoscholar.com`

Recommended follow-up:

- Verify whether the intended opportunity is Neo's venture/community Scholar program or Neoscholar Education.
- Restore only with a direct, official, working application page.

### GSSoC Is Still Public But Expired

GSSoC is now accurately marked `Expired`, but it remains approved and public.

Recommended follow-up:

- Decide whether expired-but-official rows should stay public.
- If BuildNest should show only active/upcoming opportunities, move GSSoC to `rejected` or add an app-level expired filter in a later product change.

### Outreachy Canonical URL

The Outreachy link works but redirects from `https://www.outreachy.org` to `https://www.outreachy.org/`.

Recommended follow-up:

- Optional: update the external link to the trailing-slash canonical URL.

## Final Result

Data hygiene cleanup is complete.

The public board no longer exposes the broken Impact Labs, Neo Scholar, MLH Fellowship, or HackOrbit rows. GSSoC remains public with the corrected `Expired` status. Approved public links now have zero failures.
