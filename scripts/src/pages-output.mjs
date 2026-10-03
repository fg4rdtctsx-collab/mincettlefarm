import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const base = process.env.BASE_PATH || '/';
if (!/^\/(?:[\w.-]+\/)*$/.test(base) || base.includes('..')) throw new Error('Invalid BASE_PATH.');
const output = fileURLToPath(new URL('../../artifacts/mini-cattle-farm/dist/public/', import.meta.url));
await mkdir(output, { recursive: true });
await writeFile(`${output}/.nojekyll`, '');
await writeFile(`${output}/404.html`, `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex">
<meta name="referrer" content="no-referrer"><title>Mini Cattle Farm</title></head>
<body><p>Opening your page…</p><script>
const base = ${JSON.stringify(base)};
const relative = location.pathname.startsWith(base) ? '/' + location.pathname.slice(base.length) : '/';
// Never put the private receipt fragment into the query string.
location.replace(base + '?__mcf_path=' + encodeURIComponent(relative + location.search) + location.hash);
</script><noscript>Please enable JavaScript to open this page.</noscript></body></html>`);