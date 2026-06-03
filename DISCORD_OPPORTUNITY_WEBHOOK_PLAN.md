# Discord Opportunity Webhook Plan

Date: 2026-06-03

## Goal

When an opportunity is approved in BuildNest, BuildNest should be able to post a clean message to the Discord `#opportunities` channel using a Discord webhook.

This plan does not implement the integration yet. No app code, database schema, or bot behavior is changed.

## Recommended Architecture

Use a Discord webhook first, not a full Discord bot.

Recommended flow:

1. Admin reviews an opportunity in the BuildNest dashboard.
2. Admin approves the opportunity.
3. A separate manual script is run with the approved opportunity ID.
4. The script fetches the opportunity from Supabase.
5. The script verifies `review_status = 'approved'`.
6. The script formats a Discord message.
7. The script sends the message to `DISCORD_OPPORTUNITIES_WEBHOOK_URL`.
8. Discord members see the opportunity title, category, location, status, deadline, and application link in `#opportunities`.

This keeps publishing separate from approval until the posting flow has been tested and trusted.

## User Flow

### Admin Approval

- Admin opens the dashboard.
- Admin reviews a pending opportunity.
- Admin approves the opportunity only after checking title, organization, source, deadline, description, and external link.

### Discord Posting

- Admin runs the posting script with the approved opportunity ID.
- Script fetches the approved row.
- Script sends a Discord webhook message.
- Members see a polished opportunity announcement.

### Discord Reader Experience

Members should immediately understand:

- What the opportunity is.
- Who runs it.
- What type it is.
- Whether it is open, upcoming, or expired.
- Where it is located.
- Whether there is a deadline.
- Where to apply.

## Proposed Message Format

Use Discord embeds for clarity.

Example:

```text
New BuildNest opportunity

Title: Sentry Software Engineer Intern - Fall 2026
Organization: Sentry
Category: Internship
Status: Open
Location: San Francisco, CA / Hybrid
Deadline: Rolling

Apply: https://jobs.ashbyhq.com/sentry/...
View on BuildNest: https://buildnest-v2.vercel.app/opportunity/{id}
```

Recommended Discord embed payload:

```json
{
  "username": "BuildNest",
  "content": "New opportunity approved on BuildNest.",
  "embeds": [
    {
      "title": "Sentry Software Engineer Intern - Fall 2026",
      "url": "https://buildnest-v2.vercel.app/opportunity/{id}",
      "description": "Direct Sentry Fall 2026 software engineering internship where interns write production code on real projects.",
      "color": 3447003,
      "fields": [
        { "name": "Organization", "value": "Sentry", "inline": true },
        { "name": "Category", "value": "Internship", "inline": true },
        { "name": "Status", "value": "Open", "inline": true },
        { "name": "Location", "value": "San Francisco, CA / Hybrid", "inline": true },
        { "name": "Deadline", "value": "Rolling", "inline": true },
        { "name": "Apply", "value": "https://jobs.ashbyhq.com/sentry/...", "inline": false }
      ],
      "footer": {
        "text": "BuildNest opportunity radar"
      }
    }
  ]
}
```

Formatting rules:

- Use `formatDeadline()` behavior conceptually: null, empty, invalid, or placeholder deadlines should display as `Rolling`.
- Keep descriptions short enough for Discord embeds.
- Prefer the BuildNest detail page as the embed title URL.
- Include the external application link as a separate field.
- Do not include admin-only metadata such as `review_status`, `source_url`, `is_automated`, or internal notes.

## Manual First vs Automatic

Recommendation: start manually.

Reasons:

- It avoids accidental spam while the review workflow is still young.
- It lets the admin choose which approved opportunities deserve Discord posting.
- It avoids posting old approved records in bulk.
- It gives a simple place to test message formatting before adding automation.

Automation should come later after duplicate-post protection exists.

## Phase 1: Manual Script

Create a script later, for example:

```text
scripts/post-opportunity-to-discord.ts
```

Expected command:

```powershell
npm run discord:opportunity -- --id <opportunity-id>
```

Script responsibilities:

1. Read `NEXT_PUBLIC_SUPABASE_URL`.
2. Read `SUPABASE_SERVICE_ROLE_KEY`.
3. Read `DISCORD_OPPORTUNITIES_WEBHOOK_URL`.
4. Accept an opportunity ID.
5. Fetch the opportunity by ID from Supabase.
6. Fail if the row does not exist.
7. Fail if `review_status !== 'approved'`.
8. Fail if `external_link` is missing.
9. Format a Discord embed.
10. Send the webhook request.
11. Print success or failure.

Required environment variable:

```text
DISCORD_OPPORTUNITIES_WEBHOOK_URL=
```

Failure behavior:

- If webhook URL is missing, print a clear error and exit without posting.
- If opportunity is pending or rejected, exit without posting.
- If Discord returns an error, print a sanitized response and exit non-zero.
- Never print secrets.

## Phase 2: Automation Later

After Phase 1 is tested, add automation.

Possible automation flow:

1. Admin approves opportunity.
2. Automation detects newly approved opportunity.
3. Automation checks whether it was already posted to Discord.
4. Automation posts the Discord message.
5. Automation records that the post succeeded.

Duplicate-post prevention options:

- Add a future DB field such as `discord_posted_at timestamptz`.
- Add a future DB field such as `discord_message_id text`.
- Create a separate `opportunity_discord_posts` table.
- For the earliest automation version, use a conservative script that only posts a given explicit ID once after checking a stored marker.

Recommended future table:

```text
opportunity_discord_posts
- id uuid primary key
- opportunity_id uuid not null
- discord_channel text
- discord_message_id text
- posted_at timestamptz default now()
- created_at timestamptz default now()
```

Phase 2 should not auto-post every approved row until existing approved opportunities are backfilled or intentionally marked as already handled.

## Safety Rules

- Never post pending opportunities.
- Never post rejected opportunities.
- Never post rows with missing or invalid application links.
- Do not expose private/admin data.
- Do not expose Supabase keys or Discord webhook URLs.
- Avoid duplicate Discord posts.
- Fail safely if the webhook URL is missing.
- Keep Discord message content factual and source-backed.
- Do not claim sponsorship unless the opportunity is explicitly marked sponsored in a future system.
- Do not post expired opportunities unless there is a deliberate admin action for an archive/recap channel.

## Test Plan

Phase 1 test:

1. Add `DISCORD_OPPORTUNITIES_WEBHOOK_URL` locally.
2. Pick one approved opportunity ID.
3. Run the manual script in dry-run or preview mode first, if implemented.
4. Verify the formatted title, category, location, status, deadline, and links.
5. Run the real webhook send.
6. Confirm the message appears in Discord `#opportunities`.
7. Click the BuildNest detail link.
8. Click the external application link.
9. Verify no pending/rejected opportunity can be posted.
10. Re-run the script for the same ID and confirm duplicate-post behavior before enabling automation.

## Risks

- Duplicate posting if the same opportunity is posted manually more than once.
- Accidental posting of stale or expired opportunities.
- Webhook URL leaking in logs or commits.
- Discord message becoming too long if full descriptions are used.
- Discord webhook failure after approval causing inconsistent state.
- Future automation may post old approved opportunities unless it has a cutoff or explicit marker.

## Recommended Next Action

Implement Phase 1 only:

1. Add `DISCORD_OPPORTUNITIES_WEBHOOK_URL` to local and deployment environment variables.
2. Create a manual script that takes `--id`.
3. Add a preview/dry-run mode.
4. Test with one approved opportunity.
5. Only after manual posting works, plan duplicate-post storage for Phase 2 automation.
