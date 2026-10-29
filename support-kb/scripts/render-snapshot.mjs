import fs from 'node:fs';
import path from 'node:path';

let html = fs.readFileSync('build/kb/incidents/4471-review.html', 'utf8');
html = html.replace(/<link href="([^"]+)" rel="modulepreload">\s*/g, '');
html = html.replace(/<link href="\.\.\/\.\.\/([^\"]+)" rel="stylesheet">/g, (_, asset) =>
  `<style>\n${fs.readFileSync(path.join('build', asset), 'utf8')}\n</style>`);
html = html.replace(/\s*<script>\s*\{\s*__sveltekit_[\s\S]*?<\/script>/, '');
html = html.replace('href="/kb/incidents/4471"', 'href="../src/routes/kb/incidents/4471/+page.svx"')
  .replace('href="/kb"', 'href="../src/routes/kb/+page.svx"');
if (html.includes('no desk ref') || !html.includes('desk ref <b') || html.includes('rel="stylesheet"')) {
  throw new Error('Snapshot is unsigned or requires external styles');
}
fs.mkdirSync('rendered', { recursive: true });
fs.writeFileSync('rendered/4471-review.html', html);
