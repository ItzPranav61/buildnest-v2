# Third Batch Opportunity Verification

Verification date: 2026-06-02

Source checklist: `OPPORTUNITY_RESEARCH_REVIEW.md`

Priority: internships, open-source, mentorship, and fellowship candidates before more hackathons.

## Ground Rules

- No Supabase rows were inserted.
- No app code was modified.
- No ingestion scripts were run.
- Internship listings were reviewed with stricter trust rules.
- Aggregator-only listings were treated as medium/high risk unless employer legitimacy and opportunity quality were strong.
- Deadlines were not guessed from relative countdowns.
- Pay-to-apply, training fees, deposits, or certificate-fee signals would trigger rejection.

## Verification Summary

| Candidate | Page loaded | Source type | Application status | Pay / stipend signal | Risk | Recommendation |
| --- | --- | --- | --- | --- | --- | --- |
| AI App Developer Internship (React Native) - Campus Mitra | Yes | Unstop aggregator | Open | Unpaid | High | Hold |
| AI Automation Developer Internship - Earthonoid AI | Yes | Unstop aggregator + official company site | Closed | Unpaid | High | Reject |
| Machine Learning Engineer Internship - DiagnoX Technologies LLP | Yes | Unstop aggregator | Open, near expiry | Unpaid | High | Reject |
| React UI Engineering Internship - CareEco Technologies | Yes | Unstop aggregator + official company/product site | Open | Not visible in current listing text; older Unstop AMP/source snippet claims paid | Medium | Hold |
| Dev Weekends Fellowship 2026 | Yes | Official direct page | Open | Free-access benefits visible; no stipend | Medium | Approve |

## Approved Candidates

### 1. Dev Weekends Fellowship 2026

- Page loads: Yes
- Final URL: `https://www.devweekends.com/fellowship`
- Source trust: Medium-high. Official Dev Weekends page, not an aggregator.
- Organizer legitimacy: Medium-high. Site has community, resources, GitHub, YouTube, LinkedIn, Discord, and fellowship-specific content.
- Application status: Open. Page says "Fellowship 2026 - Applications Open" and "Fellowship 2026 is now live."
- Deadline: null
- Stipend/free/unpaid status: No stipend visible. Page shows free access to expert training, paid courses, mentor network, recommendations, referrals, events, guidance, and mock interviews.
- Location: Online / Remote
- Category: Fellowship
- Tags: Fellowship, Mentorship, Full Stack, AI Engineering, Data Engineering, DSA, Open Source, Projects, Interview Prep, Remote
- External application link: `https://www.devweekends.com/fellowship`
- Risk level: Medium
- Recommendation: Approve
- Notes: This is more of a mentorship/project-based fellowship than a paid internship. It is acceptable for BuildNest because the source is direct, the application status is current, and the program value is clearly project/mentor oriented. Keep `deadline = null`.

## Held Candidates

### 2. AI App Developer Internship (React Native, Expo & TypeScript) - Campus Mitra

- Page loads: Yes
- Final URL: `https://unstop.com/internships/ai-app-developer-internship-react-native-expo-typescript-campus-mitra-1693163`
- Source trust: Medium-low. Unstop listing only; no official employer application/source page verified.
- Employer legitimacy: Uncertain. Listing describes Campus Mitra app/product work, but no trusted official Campus Mitra employer page was verified during this pass.
- Application status: Open. Page shows "11 Days Left" and "Quick Apply".
- Deadline: null
- Stipend/free/unpaid status: Unpaid
- Location: Work from Home
- Category: Internship
- Tags: Internship, React Native, Expo, TypeScript, Mobile App Development, PostgreSQL, AI Tools, Remote, Part Time
- External application link: `https://unstop.com/internships/ai-app-developer-internship-react-native-expo-typescript-campus-mitra-1693163`
- Risk level: High
- Recommendation: Hold
- Notes: The role has useful project value: mobile app features, APIs, backend services, PostgreSQL, AI coding tools, and code review. However, it is unpaid and aggregator-only. Hold until an official employer page or strong legitimacy signal is verified.

### 3. React UI Engineering Internship - CareEco Technologies Private Limited

- Page loads: Yes
- Final URL: `https://unstop.com/internships/react-ui-engineering-internship-careeco-technologies-private-limited-1690721`
- Source trust: Medium. Unstop listing, with an official product/company site found at `https://elixire.in/`.
- Employer legitimacy: Medium. `elixire.in` says Elixire is brought by CareEco Technologies Private Limited and describes a healthcare-focused technology/data company.
- Application status: Open. Page shows live recruitment rounds and "5 Days Left".
- Deadline: null
- Stipend/free/unpaid status: Current page text did not expose a clear stipend amount. An older Unstop AMP/search result for a similar CareEco React UI Engineering listing mentioned ₹11,000/month, but that was not treated as source of truth for this current listing.
- Location: Work from Home
- Category: Internship
- Tags: Internship, React, Frontend Development, UI Engineering, JavaScript, Performance Optimization, APIs, Remote, Full Time
- External application link: `https://unstop.com/internships/react-ui-engineering-internship-careeco-technologies-private-limited-1690721`
- Risk level: Medium
- Recommendation: Hold
- Notes: The work looks technically strong and the employer has a reachable official product site. Hold because the application source is still aggregator-only and current compensation was not clearly visible. This could be approved after manually confirming stipend/pay status and official employer legitimacy.

## Rejected Candidates

### 4. AI Automation Developer Internship - Earthonoid AI

- Page loads: Yes
- Final URL: `https://unstop.com/internships/ai-automation-developer-internship-earthonoid-ai-1692664`
- Source trust: Medium. Unstop listing plus official company site `https://earthonoidai.com/`.
- Employer legitimacy: Medium. Official site loads and describes WhatsApp API, voice AI, and lead automation services with contact details.
- Application status: Closed. Page shows "Application Closed" and application deadline `01 Jun 26, 12:54 AM CUT`.
- Deadline: `2026-06-01`
- Stipend/free/unpaid status: Unpaid
- Location: Work from Home
- Category: Internship
- Tags: Internship, AI Automation, n8n, Make.com, APIs, Webhooks, AI Agents, Chatbots, Voice AI, Cloud, Remote
- External application link: `https://unstop.com/internships/ai-automation-developer-internship-earthonoid-ai-1692664`
- Risk level: High
- Recommendation: Reject
- Notes: Even though the company appears to have an official site and the work is relevant, the listing is closed and unpaid. Do not add as an active opportunity.

### 5. Machine Learning Engineer Internship - DiagnoX Technologies LLP

- Page loads: Yes
- Final URL: `https://unstop.com/internships/machine-learning-engineer-internship-diagnox-tecnologies-llp-1693172`
- Source trust: Medium-low. Unstop listing only; no direct official DiagnoX Technologies LLP opportunity page was verified.
- Employer legitimacy: Uncertain. Listing describes vehicle diagnostics, IoT, AI, GPS tracking, and fleet analytics, but source verification outside Unstop was weak.
- Application status: Open but near expiry. Page shows "2 Days Left" and "Quick Apply".
- Deadline: null
- Stipend/free/unpaid status: Unpaid
- Location: Work from Home
- Category: Internship
- Tags: Internship, Machine Learning, IoT, Vehicle Diagnostics, Fleet Analytics, AI, Remote
- External application link: `https://unstop.com/internships/machine-learning-engineer-internship-diagnox-tecnologies-llp-1693172`
- Risk level: High
- Recommendation: Reject
- Notes: The listing is unpaid, only 4 weeks long, aggregator-only, and source legitimacy could not be strongly verified. It does not meet the quality bar for public BuildNest approval.

## Fee / Pay-To-Apply Review

No explicit training fee, deposit, certificate fee, or pay-to-apply requirement was found in the verified page text.

However, Unstop itself includes this warning on internship pages:

```text
If an employer asks you to pay any kind of fee, please notify us immediately.
```

This warning is not evidence of a fee, but it reinforces why aggregator-only unpaid internships should stay held or rejected unless employer legitimacy is strong.

## Data Issues Found

- Campus Mitra: unpaid and aggregator-only; employer source not independently verified.
- Earthonoid AI: closed and unpaid despite relevant AI automation work.
- DiagnoX: unpaid, short duration, aggregator-only, and weak external legitimacy signal.
- CareEco: technically strong role and official product site found, but compensation was not clearly visible on the current listing text.
- Dev Weekends: strong official source and open application, but no deadline and no stipend visible.

## Recommended Next Action

Create a pending row only for:

1. Dev Weekends Fellowship 2026

Do not insert the internships yet.

Follow-up verification queue:

1. CareEco Technologies React UI Engineering Internship: manually confirm current stipend/pay status and employer legitimacy.
2. Campus Mitra AI App Developer Internship: verify official employer/product page and mentorship/project value before reconsidering.

Do not add Earthonoid AI or DiagnoX from this batch.
