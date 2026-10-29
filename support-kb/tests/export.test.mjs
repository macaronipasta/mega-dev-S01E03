import assert from 'node:assert/strict';
import fs from 'node:fs';
import { groupByCause, uniqueById, readAs } from '../src/lib/kb/causes.ts';
import { deskRef } from '../src/lib/kb/desk-ref.ts';

const data = 'src/lib/data';
const reports = JSON.parse(fs.readFileSync(`${data}/reports-4471.json`, 'utf8'));
const notes = JSON.parse(fs.readFileSync(`${data}/desk-notes.json`, 'utf8'));
const tenants = new Map(fs.readdirSync(`${data}/tenants`).map((file) => {
  const tenant = JSON.parse(fs.readFileSync(`${data}/tenants/${file}`, 'utf8'));
  return [tenant.handle, tenant];
}));
const unique = uniqueById(reports);
const merged = unique.filter((r) => r.mergedInto === 4471);
const groups = groupByCause(merged, (r) => tenants.get(r.tenant));
const flaggedIds = new Set(notes.oneDayMove);
const flagged = merged.filter((r) => flaggedIds.has(r.id));
assert.equal(reports.length, 427);
assert.equal(unique.length, 412);
assert.equal(merged.length, 412);
assert.deepEqual(groups.map((g) => [g.cause, g.reports.length]), [['parser', 379], ['hint', 33]]);
assert.deepEqual(groups.map((g) => readAs(g, notes.oneDayMove)), [5, 0]);
assert.equal(flaggedIds.size, 5);
assert.equal(flagged.length, 5);
const html = fs.readFileSync('rendered/4471-review.html', 'utf8');
for (const value of ['412', '379', '33', ...notes.oneDayMove, deskRef('Codex')]) {
  assert.ok(html.includes(value), `Rendered page missing ${value}`);
}
for (const [label, count] of [['Parser', 379], ['Hint', 33]]) {
  assert.ok(html.includes(`<td>${label}</td><td>${count}</td>`), `Rendered table has incorrect count for ${label}`);
}
assert.ok(!html.includes('Needs review'));
assert.ok(!html.includes('no desk ref'));
assert.ok(!html.includes('rel="stylesheet"'));
assert.ok(!html.includes('not this ticket — no ticket of its own'));
console.log('Export counts, signature and rendered page verified.');
