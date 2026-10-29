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
assert.equal(reports.length, 427);
assert.equal(unique.length, 412);
assert.equal(merged.length, 412);
assert.deepEqual(groups.map((g) => [g.cause, g.reports.length]), [['parser', 379], ['hint', 33]]);
assert.equal(readAs(groups[0], notes.oneDayMove), 5);
assert.equal(readAs(groups[1], notes.oneDayMove), 0);
assert.equal(deskRef('Codex'), 'DR-FA5E-A16R');
const snapshot = fs.readFileSync('rendered/4471-reassessment.html', 'utf8');
for (const value of ['412', '379', '33', deskRef('Codex')]) assert.ok(snapshot.includes(value), `snapshot missing ${value}`);
assert.ok(!snapshot.includes('no desk ref'));
console.log('Export counts, desk ref and snapshot verified.');
