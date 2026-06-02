# Opportunity Research Review

Source: Gemini opportunity research report pasted by user

Review date: 2026-06-02

## Ground Rules

This document is a review checklist only.

- Do not insert anything into Supabase from this report.
- Do not run ingestion from this report.
- Do not trust Gemini as source of truth.
- Treat every entry as a candidate lead until independently verified.
- Prefer official source pages over aggregators.
- Any candidate with unclear deadline, missing tags, questionable source, or status/date conflict must stay pending or held.

## Review Summary

The report claims a curated set of 40 opportunities, but the pasted data is not import-ready.

Observed candidate count:

- 39 explicit `title` fields extracted
- 1 damaged leading Microsoft Explore record without a visible title field in the pasted JSON fragment

The strongest candidates for BuildNest are likely Devfolio hackathons with direct event pages, official fellowship/open-source programs with stable pages, and a small subset of internships that match student-builder skills. The weakest candidates are aggregator-only internships, expired listings, and entries with unsupported claims such as high `quality_score` despite expired status, missing tags, null deadlines, or non-official source URLs.

## Invalid Data Issues

Global issues found:

- Broken JSON: the report begins mid-object with a Microsoft Explore record and no visible `title`.
- Missing tags: most records use `tags: ,`, which is invalid JSON and not importable.
- Null deadlines: many records have `deadline: null`; acceptable only after verification that the opportunity is rolling or deadline is unavailable.
- Expired deadlines: several records are already expired as of 2026-06-02.
- Unofficial source URLs: multiple entries rely on Unstop, Opportunities for Youth, GrantedAI, or generic Devfolio directory pages instead of official opportunity pages.
- Aggregator-only sources: most internships are Unstop-only and require employer/source validation.
- Questionable `quality_score`: several expired or aggregator-only entries still claim `quality_score` 9-10.
- Status/date conflicts: MLH marked `Open` despite our source check finding the visible Summer 2026 deadline was expired; GSoC marked expired but already handled; LFX has a specific deadline in Gemini that conflicts with our portal verification caution.

## Already Handled / Duplicate

These should not be re-added without checking existing BuildNest rows:

| Candidate | Reason |
| --- | --- |
| Google Summer of Code 2026 | Already handled through GSoC adapter/source planning. Duplicate risk. |
| GirlScript Summer of Code 2026 | Already handled through GSSoC ingestion workflow. Duplicate risk. |
| MLH Fellowship - Software Engineering | Already parked due to expired/current-cycle uncertainty from `MLH_SOURCE_VERIFICATION.md`. |
| LFX Mentorship - Fall Term 2026 | Already marked manual-only until portal data shape is verified in `LFX_SOURCE_VERIFICATION.md`. |

## Likely Approve After Verification

These look promising if direct source pages confirm status, deadline, and application link:

- RNS Hack_Overflow 2.0
- SheBuilds Chennai Hack - Code & Challenge 3.0
- HACKER HOUSE GOA 2026
- Hack4Brahma 2.0
- DSU DEVHACK 3.0
- HexaFalls 2
- CodeStorm 2026 #2
- HackGenome
- Outreachy December 2026 Cohort
- Processing Foundation Fellowship
- Dev Weekends Fellowship 2026
- AI App Developer Internship (React Native)
- AI Automation Developer Internship
- Machine Learning Engineer Internship
- React UI Engineering Internship

## Needs Manual Verification

These may be useful but need stricter checks before approval:

- Junior Fullstack Developer Internship
- Software Development Engineer Internship
- Python Programming Internship
- Software Testing Intern
- Front End (React) Developer Internship
- Data Analyst Internship
- Full Stack Developer Internship, Venura Tech
- Software Engineer Intern, GEOMATIK AI
- Full Stack Developer Internship, Skydro Aqua
- DeerHack 2026
- Devlynix Buildathon 2.0
- HackPrix Season 3
- ccuhacks
- InnoFusion 3.0
- Citadel Hackathon - Season 1
- HackNex Season 2

Manual checks needed:

- Confirm the listing still exists.
- Confirm whether application is still open.
- Confirm official organizer identity.
- Confirm no pay-to-apply or training-disguised-as-internship behavior.
- Confirm stipend or mentorship value, especially for unpaid internships.
- Replace generic directory URLs with direct event/listing URLs.

## Expired / Recurring Only

These should not be shown as active public opportunities:

- Microsoft Software Engineering Explore Internship: broken leading record; likely recurring benchmark only.
- Software Development Internship - Batch of 2026, Myntra: expired on 2026-05-07.
- Microsoft Research India Research Fellows: expired on 2026-02-15.
- Gates Foundation AI Fellowship 2026: expired on 2026-04-13 and uses aggregator/grant portal sources.
- Google Summer of Code 2026: expired for applications and already handled.
- Social Summer of Code Season 5: expired on 2026-05-30.
- DeerHack 2026: deadline is 2026-06-02, so treat as same-day/likely stale unless verified immediately.

## Reject / Suspicious

Reject or hold unless a strong official source proves quality:

- Gates Foundation AI Fellowship 2026: aggregator-only external/source links, expired, and title/date mismatch in URL text.
- Venura Tech Full Stack Web Developer Internship: described as unpaid training/internship hybrid; high exploitation risk.
- Any listing with missing tags and only aggregator source after verification fails.
- Any unpaid internship without clear mentorship, portfolio output, or stipend.
- Any listing requiring payment, deposits, training fees, or “guaranteed internship” claims.

## Top 15 Verification Queue

| # | Title | Organization | Category | Source link | Reason to verify | Risk | Recommended action |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | RNS Hack_Overflow 2.0 | RNSIT | Hackathon | `https://rns-hackoverflow-2.devfolio.co/` | High-value offline hackathon lead with direct Devfolio page. | Low | Verify now |
| 2 | SheBuilds Chennai Hack - Code & Challenge 3.0 | Rajalakshmi Engineering College | Hackathon | `https://shebuilds-chennai-hack.devfolio.co/` | Strong diversity/community event with direct event page and future deadline claim. | Low | Verify now |
| 3 | HACKER HOUSE GOA 2026 | 2:47PM Studio | Hackathon | `https://hacker-house-goa-2026.devfolio.co/` | Premium builder event with direct Devfolio page; likely strong engagement if real. | Medium | Verify now |
| 4 | Hack4Brahma 2.0 | Guwahati University | Hackathon | `https://hack4brahmaputra.devfolio.co/` | Regional Northeast India event with official/Devfolio routing claim. | Medium | Verify now |
| 5 | DSU DEVHACK 3.0 | Dayananda Sagar University | Hackathon | `https://dsudevhack3.devfolio.co/` | Future September event; useful if application status is clear. | Medium | Verify now |
| 6 | HexaFalls 2 | JIS University | Hackathon | `https://hexafalls2.devfolio.co/` | Near-term direct Devfolio listing; good regional value. | Low | Verify now |
| 7 | CodeStorm 2026 #2 | Devfolio Hosted | Hackathon | `https://codestorm-week2-2026.devfolio.co/` | Remote June hackathon; useful for non-local users if still open. | Medium | Verify now |
| 8 | HackGenome | Devfolio Hosted | Hackathon | `https://hackgenome2026.devfolio.co/` | Near-term deadline and claimed IIT Delhi presentation; verify before expiry. | Medium | Verify now |
| 9 | Outreachy December 2026 Cohort | Software Freedom Conservancy | Open Source | `https://www.outreachy.org/` | Official, high-trust, paid program; upcoming window needs current timeline check. | Low | Verify now |
| 10 | Processing Foundation Fellowship | Processing Foundation | Fellowship | `https://processingfoundation.org/fellowships` | Official page; good creative/open-source fit if relaunch timing is confirmed. | Medium | Verify now |
| 11 | Dev Weekends Fellowship 2026 | Dev Weekends | Fellowship | `https://www.devweekends.com/fellowship` | India-focused mentorship lead; needs official current status and quality check. | Medium | Verify now |
| 12 | AI App Developer Internship (React Native) | Campus Mitra | Internship | `https://unstop.com/internships/ai-app-developer-internship-react-native-expo-typescript-campus-mitra-1693163` | Strong modern builder fit; verify employer and internship quality. | Medium | Verify now |
| 13 | AI Automation Developer Internship | Earthonoid AI | Internship | `https://unstop.com/internships/ai-automation-developer-internship-earthonoid-ai-1692664` | AI automation/RAG fit; needs unpaid/stipend and employer legitimacy check. | Medium | Verify now |
| 14 | Machine Learning Engineer Internship | DiagnoX Technologies LLP | Internship | `https://unstop.com/internships/machine-learning-engineer-internship-diagnox-tecnologies-llp-1693172` | Interesting IoT/ML role; verify real organization and application status. | Medium | Verify now |
| 15 | React UI Engineering Internship | CareEco Technologies | Internship | `https://unstop.com/internships/react-ui-engineering-internship-careeco-technologies-private-limited-1690721` | Paid frontend role claim; verify stipend, deadline, and employer quality. | Medium | Verify now |

## Held Items

Hold these for later or verify only after the top queue:

- Junior Fullstack Developer Internship, SmaranAI.in: deadline 2026-06-03, unpaid claim, urgent and riskier.
- Software Development Engineer Internship, Confluent Solutions: null deadline and aggregator-only.
- Python Programming Internship, Srivensy Technologies: in-office; verify relevance and quality.
- Software Testing Intern, 1XL.com: likely useful but less BuildNest-builder focused.
- Front End (React) Developer Internship, Kovon: paid claim, but aggregator-only.
- Data Analyst Internship, FlatUIUX: category fit is weaker for BuildNest’s builder/developer board.
- Full Stack Developer Internship, Skydro Aqua: possible fit, but aggregator-only.
- GEOMATIK AI Software Engineer Intern: deadline was “calculated” from days-left marker; verify date.
- ccuhacks: interesting youth/community event, but age targeting may not match BuildNest’s core user.
- InnoFusion 3.0: direct Devfolio page, but lower priority than stronger hackathons.
- Citadel Hackathon - Season 1: direct Devfolio page, but limited signal in report.
- Devlynix Buildathon 2.0: potential duplicate/recurring lineage; verify active direct listing.
- HackPrix Season 3: generic Devfolio directory link only, not enough detail.
- HackNex Season 2: generic Devfolio directory link only, low detail.

## Rejected / Do Not Import From Report

- Gates Foundation AI Fellowship 2026: expired, aggregator-only, source quality mismatch.
- Venura Tech Full Stack Web Developer Internship: unpaid training/internship hybrid risk.
- Microsoft Explore leading record: broken JSON and expired/recurring; only add after official Microsoft verification.
- Any opportunity with malformed `tags` and no official source after manual verification.

## Safe Path To 50 Quality Opportunities

Recommended mix for 50 published opportunities:

- Internships: 18
- Hackathons: 16
- Fellowships: 6
- Open-source/mentorship programs: 10

Rationale:

- Internships drive immediate utility and frequent visits.
- Hackathons create fresh, deadline-driven momentum.
- Fellowships add prestige but should be fewer because many are recurring or expired.
- Open-source/mentorship programs are high-trust, but require careful deadline handling and often need official-source verification.

Suggested sourcing plan:

1. Verify 8-10 direct Devfolio hackathons first.
2. Verify 5-7 official open-source/mentorship programs.
3. Verify 8-10 internships from Unstop only after employer legitimacy and pay/mentorship checks.
4. Keep expired prestige programs as hidden/recurring planning notes unless BuildNest adds a dedicated recurring-opportunities view.
5. Never import aggregator-only opportunities without a working external application link and quality review.

## Next Action

Start with the top 15 verification queue.

Immediate first batch:

1. RNS Hack_Overflow 2.0
2. SheBuilds Chennai Hack - Code & Challenge 3.0
3. HACKER HOUSE GOA 2026
4. Hack4Brahma 2.0
5. Outreachy December 2026 Cohort

For each, verify:

- Page loads
- Final URL
- Official/source trust
- Application status
- Deadline or rolling status
- Tags
- External application link
- Whether it should be approved, held, or rejected
