# BuildNest Review Workflow QA Results

Run marker: `QA-REVIEW-1780150656291`
Environment: local app at http://localhost:3001 with Supabase project from .env.local
Result: PASS

Passed: 31
Failed: 0

## Test Results

- PASS - Home page only shows approved rows
  Evidence: Pending/rejected QA titles absent
  Screenshot: C:\Users\PRANAV\OneDrive\Documents\New project\docs\screenshots\review-workflow-qa\home-public-approved-only.png
- PASS - Home page hides pending row
  Evidence: QA-REVIEW-1780150656291 Pending Main
  Screenshot: C:\Users\PRANAV\OneDrive\Documents\New project\docs\screenshots\review-workflow-qa\home-public-approved-only.png
- PASS - Home page hides rejected row
  Evidence: QA-REVIEW-1780150656291 Rejected Main
  Screenshot: C:\Users\PRANAV\OneDrive\Documents\New project\docs\screenshots\review-workflow-qa\home-public-approved-only.png
- PASS - /opportunities only shows approved rows
  Evidence: Pending/rejected QA titles absent
  Screenshot: C:\Users\PRANAV\OneDrive\Documents\New project\docs\screenshots\review-workflow-qa\opportunities-public-approved-only.png
- PASS - /opportunities hides pending row
  Evidence: QA-REVIEW-1780150656291 Pending Main
  Screenshot: C:\Users\PRANAV\OneDrive\Documents\New project\docs\screenshots\review-workflow-qa\opportunities-public-approved-only.png
- PASS - /opportunities hides rejected row
  Evidence: QA-REVIEW-1780150656291 Rejected Main
  Screenshot: C:\Users\PRANAV\OneDrive\Documents\New project\docs\screenshots\review-workflow-qa\opportunities-public-approved-only.png
- PASS - Pending detail page returns not-found state
  Evidence: /opportunity/5ea1b487-ade7-4156-9c13-e727102c6460
  Screenshot: C:\Users\PRANAV\OneDrive\Documents\New project\docs\screenshots\review-workflow-qa\pending-detail-not-found.png
- PASS - Rejected detail page returns not-found state
  Evidence: /opportunity/f488734c-3d00-4472-8161-73f9976ed21f
  Screenshot: C:\Users\PRANAV\OneDrive\Documents\New project\docs\screenshots\review-workflow-qa\rejected-detail-not-found.png
- PASS - Approved detail page loads
  Evidence: MLH Fellowship Summer 2026
  Screenshot: C:\Users\PRANAV\OneDrive\Documents\New project\docs\screenshots\review-workflow-qa\approved-detail-loads.png
- PASS - Related opportunities only show approved rows
  Evidence: QA pending/rejected absent
  Screenshot: C:\Users\PRANAV\OneDrive\Documents\New project\docs\screenshots\review-workflow-qa\approved-detail-loads.png
- PASS - Add form required-field validation works
  Evidence: Submitted empty form
  Screenshot: C:\Users\PRANAV\OneDrive\Documents\New project\docs\screenshots\review-workflow-qa\add-validation-required-fields.png
- PASS - Manual Add creates review_status approved
  Evidence: review_status=approved
  Screenshot: C:\Users\PRANAV\OneDrive\Documents\New project\docs\screenshots\review-workflow-qa\manual-add-approved-visible.png
- PASS - Manual Add creates is_automated false
  Evidence: is_automated=false
  Screenshot: C:\Users\PRANAV\OneDrive\Documents\New project\docs\screenshots\review-workflow-qa\manual-add-approved-visible.png
- PASS - Manual Add row appears on public opportunities
  Evidence: QA-REVIEW-1780150656291 Manual Approved
  Screenshot: C:\Users\PRANAV\OneDrive\Documents\New project\docs\screenshots\review-workflow-qa\manual-add-approved-visible.png
- PASS - Dashboard loads approved, pending, and rejected rows for admin
  Evidence: http://localhost:3001/dashboard?qa=QA-REVIEW-1780150656291
  Screenshot: C:\Users\PRANAV\OneDrive\Documents\New project\docs\screenshots\review-workflow-qa\dashboard-approved-tab.png
- PASS - Approved tab count matches database
  Evidence: {"approved":11,"pending":2,"rejected":1}
  Screenshot: C:\Users\PRANAV\OneDrive\Documents\New project\docs\screenshots\review-workflow-qa\dashboard-approved-tab.png
- PASS - Pending tab shows only pending rows
  Evidence: QA rows checked
  Screenshot: C:\Users\PRANAV\OneDrive\Documents\New project\docs\screenshots\review-workflow-qa\dashboard-pending-tab.png
- PASS - Pending tab count matches database
  Evidence: {"approved":11,"pending":2,"rejected":1}
  Screenshot: C:\Users\PRANAV\OneDrive\Documents\New project\docs\screenshots\review-workflow-qa\dashboard-pending-tab.png
- PASS - Edit works for pending rows
  Evidence: title=QA-REVIEW-1780150656291 Pending Edited
  Screenshot: C:\Users\PRANAV\OneDrive\Documents\New project\docs\screenshots\review-workflow-qa\dashboard-edit-pending-modal.png
- PASS - Approve action works
  Evidence: review_status=approved
  Screenshot: C:\Users\PRANAV\OneDrive\Documents\New project\docs\screenshots\review-workflow-qa\dashboard-after-approve.png
- PASS - Approved row moves to Approved tab
  Evidence: QA-REVIEW-1780150656291 Pending Main
  Screenshot: C:\Users\PRANAV\OneDrive\Documents\New project\docs\screenshots\review-workflow-qa\dashboard-approved-after-approve.png
- PASS - Approved pending row appears on public pages after approval
  Evidence: QA-REVIEW-1780150656291 Pending Main
  Screenshot: C:\Users\PRANAV\OneDrive\Documents\New project\docs\screenshots\review-workflow-qa\approved-row-public-after-approve.png
- PASS - Reject action works
  Evidence: review_status=rejected
  Screenshot: C:\Users\PRANAV\OneDrive\Documents\New project\docs\screenshots\review-workflow-qa\dashboard-after-reject.png
- PASS - Rejected tab shows rejected rows
  Evidence: QA rejected rows checked
  Screenshot: C:\Users\PRANAV\OneDrive\Documents\New project\docs\screenshots\review-workflow-qa\dashboard-rejected-tab.png
- PASS - Rejected tab count matches database
  Evidence: {"approved":12,"pending":0,"rejected":2}
  Screenshot: C:\Users\PRANAV\OneDrive\Documents\New project\docs\screenshots\review-workflow-qa\dashboard-rejected-tab.png
- PASS - Edit works for rejected rows
  Evidence: title=QA-REVIEW-1780150656291 Rejected Edited
  Screenshot: C:\Users\PRANAV\OneDrive\Documents\New project\docs\screenshots\review-workflow-qa\dashboard-edit-rejected-modal.png
- PASS - Rejected row remains hidden from public pages
  Evidence: Rejected QA titles absent
  Screenshot: C:\Users\PRANAV\OneDrive\Documents\New project\docs\screenshots\review-workflow-qa\rejected-row-hidden-after-reject.png
- PASS - Edit works for approved rows
  Evidence: title=QA-REVIEW-1780150656291 Manual Edited
  Screenshot: C:\Users\PRANAV\OneDrive\Documents\New project\docs\screenshots\review-workflow-qa\dashboard-edit-approved-modal.png
- PASS - Delete works
  Evidence: Row deleted
  Screenshot: C:\Users\PRANAV\OneDrive\Documents\New project\docs\screenshots\review-workflow-qa\dashboard-delete-modal.png
- PASS - Dashboard tab counts match database counts
  Evidence: {"approved":11,"pending":0,"rejected":2}
  Screenshot: C:\Users\PRANAV\OneDrive\Documents\New project\docs\screenshots\review-workflow-qa\dashboard-final-counts.png
- PASS - Temporary QA rows cleaned up
  Evidence: Remaining rows: 0

## Bugs Found

- None found during this QA run.

## Recommended Fixes

- No fixes required from this run.

## Screenshots

- Home page only shows approved rows: C:\Users\PRANAV\OneDrive\Documents\New project\docs\screenshots\review-workflow-qa\home-public-approved-only.png
- Home page hides pending row: C:\Users\PRANAV\OneDrive\Documents\New project\docs\screenshots\review-workflow-qa\home-public-approved-only.png
- Home page hides rejected row: C:\Users\PRANAV\OneDrive\Documents\New project\docs\screenshots\review-workflow-qa\home-public-approved-only.png
- /opportunities only shows approved rows: C:\Users\PRANAV\OneDrive\Documents\New project\docs\screenshots\review-workflow-qa\opportunities-public-approved-only.png
- /opportunities hides pending row: C:\Users\PRANAV\OneDrive\Documents\New project\docs\screenshots\review-workflow-qa\opportunities-public-approved-only.png
- /opportunities hides rejected row: C:\Users\PRANAV\OneDrive\Documents\New project\docs\screenshots\review-workflow-qa\opportunities-public-approved-only.png
- Pending detail page returns not-found state: C:\Users\PRANAV\OneDrive\Documents\New project\docs\screenshots\review-workflow-qa\pending-detail-not-found.png
- Rejected detail page returns not-found state: C:\Users\PRANAV\OneDrive\Documents\New project\docs\screenshots\review-workflow-qa\rejected-detail-not-found.png
- Approved detail page loads: C:\Users\PRANAV\OneDrive\Documents\New project\docs\screenshots\review-workflow-qa\approved-detail-loads.png
- Related opportunities only show approved rows: C:\Users\PRANAV\OneDrive\Documents\New project\docs\screenshots\review-workflow-qa\approved-detail-loads.png
- Add form required-field validation works: C:\Users\PRANAV\OneDrive\Documents\New project\docs\screenshots\review-workflow-qa\add-validation-required-fields.png
- Manual Add creates review_status approved: C:\Users\PRANAV\OneDrive\Documents\New project\docs\screenshots\review-workflow-qa\manual-add-approved-visible.png
- Manual Add creates is_automated false: C:\Users\PRANAV\OneDrive\Documents\New project\docs\screenshots\review-workflow-qa\manual-add-approved-visible.png
- Manual Add row appears on public opportunities: C:\Users\PRANAV\OneDrive\Documents\New project\docs\screenshots\review-workflow-qa\manual-add-approved-visible.png
- Dashboard loads approved, pending, and rejected rows for admin: C:\Users\PRANAV\OneDrive\Documents\New project\docs\screenshots\review-workflow-qa\dashboard-approved-tab.png
- Approved tab count matches database: C:\Users\PRANAV\OneDrive\Documents\New project\docs\screenshots\review-workflow-qa\dashboard-approved-tab.png
- Pending tab shows only pending rows: C:\Users\PRANAV\OneDrive\Documents\New project\docs\screenshots\review-workflow-qa\dashboard-pending-tab.png
- Pending tab count matches database: C:\Users\PRANAV\OneDrive\Documents\New project\docs\screenshots\review-workflow-qa\dashboard-pending-tab.png
- Edit works for pending rows: C:\Users\PRANAV\OneDrive\Documents\New project\docs\screenshots\review-workflow-qa\dashboard-edit-pending-modal.png
- Approve action works: C:\Users\PRANAV\OneDrive\Documents\New project\docs\screenshots\review-workflow-qa\dashboard-after-approve.png
- Approved row moves to Approved tab: C:\Users\PRANAV\OneDrive\Documents\New project\docs\screenshots\review-workflow-qa\dashboard-approved-after-approve.png
- Approved pending row appears on public pages after approval: C:\Users\PRANAV\OneDrive\Documents\New project\docs\screenshots\review-workflow-qa\approved-row-public-after-approve.png
- Reject action works: C:\Users\PRANAV\OneDrive\Documents\New project\docs\screenshots\review-workflow-qa\dashboard-after-reject.png
- Rejected tab shows rejected rows: C:\Users\PRANAV\OneDrive\Documents\New project\docs\screenshots\review-workflow-qa\dashboard-rejected-tab.png
- Rejected tab count matches database: C:\Users\PRANAV\OneDrive\Documents\New project\docs\screenshots\review-workflow-qa\dashboard-rejected-tab.png
- Edit works for rejected rows: C:\Users\PRANAV\OneDrive\Documents\New project\docs\screenshots\review-workflow-qa\dashboard-edit-rejected-modal.png
- Rejected row remains hidden from public pages: C:\Users\PRANAV\OneDrive\Documents\New project\docs\screenshots\review-workflow-qa\rejected-row-hidden-after-reject.png
- Edit works for approved rows: C:\Users\PRANAV\OneDrive\Documents\New project\docs\screenshots\review-workflow-qa\dashboard-edit-approved-modal.png
- Delete works: C:\Users\PRANAV\OneDrive\Documents\New project\docs\screenshots\review-workflow-qa\dashboard-delete-modal.png
- Dashboard tab counts match database counts: C:\Users\PRANAV\OneDrive\Documents\New project\docs\screenshots\review-workflow-qa\dashboard-final-counts.png