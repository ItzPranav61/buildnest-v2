# Second Batch Approval Results

QA date: 2026-06-02

## Summary

Result: PASS

The three approved second-batch opportunities were reviewed, external links were verified, rows were approved, public visibility was confirmed, detail pages loaded, and duplicate checks returned exactly one row per verified `external_link` / `source_url`.

No app code was modified. No new rows were inserted. HackGenome and Processing Foundation Fellowship were not approved.

## Approved Rows

| ID | Title | Final review_status |
| --- | --- | --- |
| `88e64c99-8440-46e4-bd62-145924a622a4` | DSU DEVHACK 3.0 | approved |
| `40135ec1-68a2-45f6-8644-591199069d77` | HexaFalls 2 | approved |
| `45a4f07d-47fa-4d2d-a118-d131c87f8e61` | CodeStorm 2026 #2 | approved |

## Pre-Approval Pending Check

Result: PASS

All three rows existed and had `review_status = pending` before approval.

| Title | Organization | Category | Status | Deadline | Location |
| --- | --- | --- | --- | --- | --- |
| DSU DEVHACK 3.0 | Dayananda Sagar University | Hackathon | Open | null | Ramanagara, India |
| HexaFalls 2 | JIS University | Hackathon | Open | null | Kolkata, India |
| CodeStorm 2026 #2 | Team CodeStorm | Hackathon | Open | null | Online |

## Field Review

### DSU DEVHACK 3.0

- Title: Clean
- Organization: Dayananda Sagar University
- Category: Hackathon
- Status: Open
- Deadline: null
- Location: Ramanagara, India
- Tags: Hackathon, AI/ML, Agentic AI, IoT, Sustainability, Healthcare, Blockchain, Fintech, Open Innovation
- Description: Clean, concise, and BuildNest-appropriate
- External link: `https://dsudevhack3.devfolio.co/`
- Source URL: `https://dsudevhack3.tech/`
- Decision: Approved

### HexaFalls 2

- Title: Clean
- Organization: JIS University
- Category: Hackathon
- Status: Open
- Deadline: null
- Location: Kolkata, India
- Tags: Hackathon, Offline, AI, Cybersecurity, Blockchain, Automation, Web Development, Cloud, JIS University
- Description: Clean, concise, and BuildNest-appropriate
- External link: `https://hexafalls2.devfolio.co/`
- Source URL: `https://hexafalls.org/`
- Decision: Approved

### CodeStorm 2026 #2

- Title: Clean
- Organization: Team CodeStorm
- Category: Hackathon
- Status: Open
- Deadline: null
- Location: Online
- Tags: Hackathon, Online, Web Development, Frontend, Productivity Tools, Browser Games, Real-time Apps, AI Utilities
- Description: Clean, concise, and BuildNest-appropriate
- External link: `https://codestorm-week2-2026.devfolio.co/`
- Source URL: `https://codestorm-week2-2026.devfolio.co/`
- Decision: Approved

## External Link Verification

Result: PASS

| URL | Status | Final URL | Page title |
| --- | --- | --- | --- |
| `https://dsudevhack3.devfolio.co/` | 200 | `https://dsudevhack3.devfolio.co/` | DSU DEVHACK 3.0 \| Devfolio |
| `https://hexafalls2.devfolio.co/` | 200 | `https://hexafalls2.devfolio.co/` | HexaFalls 2 \| Devfolio |
| `https://codestorm-week2-2026.devfolio.co/` | 200 | `https://codestorm-week2-2026.devfolio.co/` | CodeStorm 2026 #2 \| Devfolio |

Source pages also returned 200:

| URL | Status |
| --- | --- |
| `https://dsudevhack3.tech/` | 200 |
| `https://hexafalls.org/` | 200 |

## Public Opportunities Verification

Result: PASS

Production `/opportunities` returned HTTP 200 and contained all three approved titles:

| Title | Visible on `/opportunities` |
| --- | --- |
| DSU DEVHACK 3.0 | Yes |
| HexaFalls 2 | Yes |
| CodeStorm 2026 #2 | Yes |

## Detail Page Verification

Result: PASS

| Title | Detail URL | Status | Contains title |
| --- | --- | --- | --- |
| DSU DEVHACK 3.0 | `https://buildnest-v2.vercel.app/opportunity/88e64c99-8440-46e4-bd62-145924a622a4` | 200 | Yes |
| HexaFalls 2 | `https://buildnest-v2.vercel.app/opportunity/40135ec1-68a2-45f6-8644-591199069d77` | 200 | Yes |
| CodeStorm 2026 #2 | `https://buildnest-v2.vercel.app/opportunity/45a4f07d-47fa-4d2d-a118-d131c87f8e61` | 200 | Yes |

## Duplicate Check

Result: PASS

Each verified `source_url` and `external_link` returned exactly one matching row.

| URL | Match count | Matching row |
| --- | --- | --- |
| `https://dsudevhack3.tech/` | 1 | DSU DEVHACK 3.0 |
| `https://dsudevhack3.devfolio.co/` | 1 | DSU DEVHACK 3.0 |
| `https://hexafalls.org/` | 1 | HexaFalls 2 |
| `https://hexafalls2.devfolio.co/` | 1 | HexaFalls 2 |
| `https://codestorm-week2-2026.devfolio.co/` | 1 | CodeStorm 2026 #2 |

## Bugs Found

None.

## Notes

- HackGenome was not approved.
- Processing Foundation Fellowship was not approved.
- All three approved opportunities intentionally retain `deadline = null` because no exact application deadline was safely verified.
