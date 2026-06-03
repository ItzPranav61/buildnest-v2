# Discord Webhook Test Results

Date: 2026-06-03

## Summary

PASS. The manual Discord opportunity webhook script successfully posted one approved BuildNest opportunity to Discord.

No app code was modified during this test. No additional webhook message was sent while creating this report.

## Tested Opportunity

- Opportunity ID: `2e5656e0-c145-420e-a27e-f597de34b8c3`
- Opportunity title: Sentry Software Engineer Intern - Fall 2026

## Command Used

```powershell
npm run discord:opportunity -- --id 2e5656e0-c145-420e-a27e-f597de34b8c3
```

## Result

Success.

Script output confirmed:

```text
Posted opportunity to Discord: 2e5656e0-c145-420e-a27e-f597de34b8c3 | Sentry Software Engineer Intern - Fall 2026
```

## Secret Safety

PASS. No secrets or webhook URL were printed.

The script output did not expose:

- `DISCORD_OPPORTUNITIES_WEBHOOK_URL`
- Supabase service role key
- Supabase anon key
- Any Discord webhook token

## Discord Message Checklist

| Item | Result |
| --- | --- |
| Title shown | PASS |
| Organization shown | PASS |
| Category shown | PASS |
| Status shown | PASS |
| Location shown | PASS |
| Deadline shown as Rolling | PASS |
| Apply link included | PASS |
| BuildNest detail link included | PASS |

## Notes

- Embed formatting is readable.
- Future polish can improve copy, emojis, and markdown link presentation.
- No duplicate post should be made unless intentionally reposting.
