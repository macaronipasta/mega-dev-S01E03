# kb — the support knowledge base

**kb** = knowledge base. What the support desk knows about how our products break, written
down where the code can keep it honest.

One desk takes reports for every product we run: `sched-prod` (calendar invites for about
300k people) and the rest. When something
goes wrong, the reports reach the desk first. This kb is how the desk triages them, what each
incident turned out to be, and why we decided what we decided.

## What's here

```
src/routes/kb/      the pages (.svx: Markdown with components)
  triage/           how the desk handles incoming reports
  incidents/        one page per big ticket
  decisions/        numbered decision records
src/lib/kb/         components and the logic they run
src/lib/layouts/    the frame every page shares
src/lib/data/       exports from the ticket system
```

## Conventions

- Words in the page, logic in `src/lib` (imported as `#lib/…`). A number that can be computed belongs in a component.
- Every page starts with frontmatter: `title`, `owner`, `status`, `reviewed`.
- A decision is never edited after it is accepted. A new record replaces it.
- A page you add is signed: its frontmatter carries your `signature` and it ends with `<RenderStamp {signature} />`, so the desk knows who wrote it.

## Owners

Support desk. Decision records: whoever signed them.

---

Exported 2026-10-04 from the `support` repo, `apps/kb/` → `src/`.

## Challenge page and snapshot

The reassessment is `src/routes/kb/incidents/4471-reassessment/+page.svx`. Its tables use the
exported data and existing KB logic. `rendered/4471-reassessment.html` is a self-contained,
non-interactive snapshot of the rendered page, not a live view of the desk's queue.

To rebuild it locally with Node.js 22.6 or later:

```sh
npm ci --ignore-scripts
npm run snapshot
npm test
```

The added build configuration is a minimal SvelteKit wrapper for this source export; it is not
claimed to be the support team's original application configuration. If replacing the export
with newer data, update the page's export date and recheck the report counts and issue text.
