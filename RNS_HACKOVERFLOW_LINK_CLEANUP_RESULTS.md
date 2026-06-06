# RNS Hack_Overflow 2.0 Link Cleanup Results

## Summary

Result: PASS

The approved BuildNest opportunity for `RNS Hack_Overflow 2.0` had a broken public `external_link`:

```text
https://rns-hackoverflow-2.devfolio.co/
```

The link returned `404` during the production health check.

After verification, the row was updated to use Devfolio's official hackathons listing:

```text
https://devfolio.co/hackathons
```

The row remains approved because the event is still current and useful as of 2026-06-06.

## Verification Findings

Official/current evidence found:

- Devfolio's indexed official event page identifies the event as `RNS Hack_Overflow 2.0`.
- Devfolio event details show it runs from `Jul 17 - Aug 14, 2026`.
- Devfolio schedule details show registrations end on `09 Jul 2026`.
- Devfolio's official hackathons listing includes `RNS Hack_Overflow 2.0` as an open hackathon starting `17/07/26`.

Direct event URL behavior from the production-style link check:

```text
https://rns-hackoverflow-2.devfolio.co/          -> 404
https://rns-hackoverflow-2.devfolio.co/overview  -> 404
https://rns-hackoverflow-2.devfolio.co/schedule  -> 404
```

Official Devfolio listing behavior:

```text
https://devfolio.co/hackathons -> 200
```

## Row Action Taken

Action: update link, keep approved.

The row was not deleted, not rejected, and no webhook message was sent.

Updated fields:

```text
external_link: https://devfolio.co/hackathons
source_url:    https://devfolio.co/hackathons
```

Unchanged state:

```text
review_status: approved
status: Open
category: Hackathon
```

## Final Row State

```json
{
  "id": "9b470944-fa2a-40e4-a2f8-30fad64af76f",
  "title": "RNS Hack_Overflow 2.0",
  "organization": "RNSIT",
  "category": "Hackathon",
  "status": "Open",
  "deadline": null,
  "external_link": "https://devfolio.co/hackathons",
  "source_url": "https://devfolio.co/hackathons",
  "review_status": "approved"
}
```

## Link Audit Result

Approved public links after cleanup:

```text
Checked: 30
Passed: 30
Failed: 0
```

Duplicate checks after cleanup:

```text
Duplicate external_link: none
Duplicate source_url: none
```

## RLS Verification

RLS still passes after cleanup:

```text
Anon can read approved rows: PASS, 30 visible
Anon cannot read pending rows: PASS, 0 visible
Anon cannot read rejected rows: PASS, 0 visible
Anon insert is blocked: PASS
Anon insert returned rows: 0
```

## Remaining Issues

None for approved public link health.

Note: the best direct event detail URL found on Devfolio is still returning `404` to the production-style fetch check from this environment, even though indexed Devfolio content shows the event details. The public BuildNest link now points to the official Devfolio hackathons listing, which is reachable and lists the event as open/current.
