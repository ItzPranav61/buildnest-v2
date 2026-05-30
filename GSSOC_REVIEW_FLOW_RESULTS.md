# GSSoC Review Flow Results

Result: PASS
Source URL: https://gssoc.girlscript.org/
Detail path: /opportunity/e3af8ac9-3b76-4dea-808f-b1d10655936a

Passed: 8
Failed: 0

## Before Approval Behavior

- The ingested GSSoC row was verified as pending before approval.
- Searching `/opportunities` for `GirlScript Summer of Code 2026` did not show the row while pending.
- The dashboard Pending tab showed the row.

## After Approval Behavior

- Clicking Approve changed the row to `review_status = approved`.
- The row appeared in the dashboard Approved tab.
- Searching `/opportunities` showed the row publicly.
- The opportunity detail page loaded successfully after approval.

## Test Results

- PASS - GSSoC ingestion row exists
  Evidence: e3af8ac9-3b76-4dea-808f-b1d10655936a | GirlScript Summer of Code 2026 | pending
- PASS - Before approval: row is pending
  Evidence: review_status=pending
- PASS - Before approval: GSSoC does not appear publicly while pending
  Evidence: Searched /opportunities for GirlScript Summer of Code 2026
  Screenshot: C:\Users\PRANAV\OneDrive\Documents\New project\docs\screenshots\gssoc-review-flow\01-public-before-approval-search.png
- PASS - Pending tab shows GSSoC row
  Evidence: GirlScript Summer of Code 2026
  Screenshot: C:\Users\PRANAV\OneDrive\Documents\New project\docs\screenshots\gssoc-review-flow\02-dashboard-pending-gssoc.png
- PASS - Approve action changes row to approved
  Evidence: review_status=approved
  Screenshot: C:\Users\PRANAV\OneDrive\Documents\New project\docs\screenshots\gssoc-review-flow\03-dashboard-after-approve-click.png
- PASS - After approval: row moves to Approved tab
  Evidence: GirlScript Summer of Code 2026
  Screenshot: C:\Users\PRANAV\OneDrive\Documents\New project\docs\screenshots\gssoc-review-flow\04-dashboard-approved-gssoc.png
- PASS - After approval: GSSoC appears publicly on /opportunities
  Evidence: GirlScript Summer of Code 2026
  Screenshot: C:\Users\PRANAV\OneDrive\Documents\New project\docs\screenshots\gssoc-review-flow\05-public-after-approval-search.png
- PASS - After approval: GSSoC detail page loads
  Evidence: /opportunity/e3af8ac9-3b76-4dea-808f-b1d10655936a
  Screenshot: C:\Users\PRANAV\OneDrive\Documents\New project\docs\screenshots\gssoc-review-flow\06-public-detail-after-approval.png

## Bugs Found

- None found during this QA run.

## Screenshots

- Before approval: GSSoC does not appear publicly while pending: C:\Users\PRANAV\OneDrive\Documents\New project\docs\screenshots\gssoc-review-flow\01-public-before-approval-search.png
- Pending tab shows GSSoC row: C:\Users\PRANAV\OneDrive\Documents\New project\docs\screenshots\gssoc-review-flow\02-dashboard-pending-gssoc.png
- Approve action changes row to approved: C:\Users\PRANAV\OneDrive\Documents\New project\docs\screenshots\gssoc-review-flow\03-dashboard-after-approve-click.png
- After approval: row moves to Approved tab: C:\Users\PRANAV\OneDrive\Documents\New project\docs\screenshots\gssoc-review-flow\04-dashboard-approved-gssoc.png
- After approval: GSSoC appears publicly on /opportunities: C:\Users\PRANAV\OneDrive\Documents\New project\docs\screenshots\gssoc-review-flow\05-public-after-approval-search.png
- After approval: GSSoC detail page loads: C:\Users\PRANAV\OneDrive\Documents\New project\docs\screenshots\gssoc-review-flow\06-public-detail-after-approval.png