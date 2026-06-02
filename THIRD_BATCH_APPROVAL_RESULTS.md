# Third Batch Approval Results

QA date: 2026-06-02

## Summary

Result: PASS

Dev Weekends Fellowship 2026 was reviewed, approved, and verified publicly. No app code was modified. No new rows were inserted during approval QA. Campus Mitra, CareEco, Earthonoid AI, and DiagnoX were not inserted or approved.

## Approved Row

| ID | Title | Final review_status |
| --- | --- | --- |
| `fa6dc3f0-ca3f-491c-b93a-391bcc9c5d8c` | Dev Weekends Fellowship 2026 | approved |

## Pre-Approval Pending Check

Result: PASS

The row existed and had `review_status = pending` before approval.

## Field Review

| Field | Value | Result |
| --- | --- | --- |
| Title | Dev Weekends Fellowship 2026 | Clean |
| Organization | Dev Weekends | Clean |
| Category | Fellowship | Clean |
| Status | Open | Clean |
| Deadline | null | Clean |
| Location | Online / Remote | Clean |
| External link | `https://www.devweekends.com/fellowship` | Clean |
| Source URL | `https://www.devweekends.com/fellowship` | Clean |
| Source name | Manual Verification | Clean |
| is_automated | false | Clean |

Tags:

- Fellowship
- Mentorship
- Full Stack
- AI Engineering
- Data Engineering
- DSA
- Open Source
- Projects
- Interview Prep
- Remote

Description:

```text
Dev Weekends Fellowship 2026 is a 3-month online mentorship and project-building program for developers focused on full stack AI engineering, data engineering, DSA, open source contributions, portfolio projects, and interview readiness.
```

Result: PASS

## External Link Verification

Result: PASS

| URL | Status | Final URL | Page title | Application signal |
| --- | --- | --- | --- | --- |
| `https://www.devweekends.com/fellowship` | 200 | `https://www.devweekends.com/fellowship` | Dev Weekends - Your Gateway to becoming a better Software Engineer | Applications Open |

## Approval Action

Updated only:

```text
fa6dc3f0-ca3f-491c-b93a-391bcc9c5d8c
```

Change:

```text
review_status: pending -> approved
```

## Public Opportunities Verification

Result: PASS

Production `/opportunities`:

- Status: 200
- `Dev Weekends Fellowship 2026` visible: Yes

## Detail Page Verification

Result: PASS

Detail URL:

```text
https://buildnest-v2.vercel.app/opportunity/fa6dc3f0-ca3f-491c-b93a-391bcc9c5d8c
```

Checks:

- Status 200: PASS
- Title visible: PASS
- `Open Opportunity` CTA visible: PASS
- External link present and correct: PASS

## Duplicate Check

Result: PASS

Duplicate check by `external_link` / `source_url` returned exactly one row:

| ID | Title | Review status |
| --- | --- | --- |
| `fa6dc3f0-ca3f-491c-b93a-391bcc9c5d8c` | Dev Weekends Fellowship 2026 | approved |

## Excluded Candidate Check

Result: PASS

No rows were found for:

- Campus Mitra
- CareEco
- Earthonoid AI
- DiagnoX / Diagnox

## Bugs Found

None.

## Final Result

Dev Weekends Fellowship 2026 is approved and live. The third batch remains conservative: only the official direct-source fellowship was approved; aggregator-only or unpaid/closed internship candidates remain excluded.
