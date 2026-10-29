<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import { groupByCause, uniqueById, type Report } from '#lib/kb/causes';
  import { tenantOf } from '#lib/kb/locales';

  const merged = uniqueById(reports as Report[]).filter((report) => report.mergedInto === 4471);
  const groups = groupByCause(merged, tenantOf);
  const count = (cause: string) => groups.find((group) => group.cause === cause)?.reports.length ?? 0;
  const flagged = groups.find((group) => group.cause === 'parser')?.reports
    .filter((report) => notes.oneDayMove.includes(report.id)).length ?? 0;
</script>

<p>
  <strong>{merged.length}</strong> unique reports in the 4 October export;
  classified by the desk's cause logic.
</p>

<table>
  <thead>
    <tr><th>Classification</th><th>Reports</th><th>Basis</th></tr>
  </thead>
  <tbody>
    <tr><td>Parser</td><td>{count('parser')}</td><td>Includes the reports noted below</td></tr>
    <tr><td>Hint</td><td>{count('hint')}</td><td>booking-v3 form reports for day-first tenants</td></tr>
    {#if count('unplaced')}
      <tr><td>Unplaced</td><td>{count('unplaced')}</td><td>No desk classification</td></tr>
    {/if}
  </tbody>
</table>

<p>{flagged} parser reports were read differently by the desk; they remain in the parser count.</p>
