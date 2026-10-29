# Viewing the added page

The new source is `src/routes/kb/incidents/4471-review/+page.svx`.
`rendered/4471-review.html` is a standalone, styled snapshot of that page, including
the computed table, timeline and signature stamp.

To rebuild and check the snapshot, use Node.js 22.12 or newer:

```sh
npm ci
npm run snapshot
npm test
```

The snapshot is based on the exported data, not live support-system data.
