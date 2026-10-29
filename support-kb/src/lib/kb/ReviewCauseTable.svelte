<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import { groupByCause, uniqueById, type Report } from '#lib/kb/causes';
  import { tenantOf } from '#lib/kb/locales';

  const merged = uniqueById(reports as Report[]).filter((report) => report.mergedInto === 4471);
  const flaggedIds = new Set(notes.oneDayMove);
  const flagged = merged.filter((report) => flaggedIds.has(report.id));
  const remaining = merged.filter((report) => !flaggedIds.has(report.id));
  const groups = groupByCause(remaining, tenantOf);
  const count = (cause: string) => groups.find((group) => group.cause === cause)?.reports.length ?? 0;
</script>

<p>
  <strong>{merged.length}</strong> unique reports in the 4 October export;
  the counts below are a triage starting point, not confirmed root causes.
</p>

<table>
  <thead>
    <tr><th>Classification</th><th>Reports</th><th>Basis</th></tr>
  </thead>
  <tbody>
    <tr><td>Parser candidates</td><td>{count('parser')}</td><td>Desk classification, excluding flagged reports</td></tr>
    <tr><td>Hint candidates</td><td>{count('hint')}</td><td>Desk classification, excluding flagged reports</td></tr>
    <tr><td>Needs review</td><td>{flagged.length}</td><td>Flagged by desk notes; cause not established</td></tr>
    {#if count('unplaced')}
      <tr><td>Unplaced</td><td>{count('unplaced')}</td><td>No desk classification</td></tr>
    {/if}
  </tbody>
</table>
