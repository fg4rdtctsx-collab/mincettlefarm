// Produce an explicit release manifest. Never export the whole workspace,
// private agent context, Replit settings, secrets, or database backups.
import { readdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';

const roots = ['artifacts/mini-cattle-farm', 'artifacts/api-server', 'lib', 'scripts', 'supabase'];
const omit = new Set(['node_modules', 'dist', '.replit-artifact', '.git', '.local', '.agents', 'backups']);
const files = [];
async function walk(directory, destination = directory, built = false) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (omit.has(entry.name) && !built) continue;
    if (entry.name.startsWith('.env') && entry.name !== '.env.example') continue;
    if (entry.name.endsWith('.tsbuildinfo') || entry.name.endsWith('.dump')) continue;
    const source = path.join(directory, entry.name);
    const remote = path.posix.join(destination, entry.name);
    if (entry.isDirectory()) await walk(source, remote, built);
    else if (entry.isFile()) files.push({ source, remote, bytes: (await stat(source)).size });
    // Symlinks are deliberately excluded.
  }
}
for (const root of roots) await walk(root);
for (const source of ['README.md', '.gitignore', 'package.json', 'pnpm-lock.yaml', 'pnpm-workspace.yaml', 'tsconfig.json', 'tsconfig.base.json', 'docs/oxapay-checkout.md', 'docs/github-supabase-deployment.md']) {
  files.push({ source, remote: source, bytes: (await stat(source)).size });
}
await walk('artifacts/mini-cattle-farm/dist/public', 'docs', true);
// Keep both supported Pages publishing folders on the same verified build.
await walk('artifacts/mini-cattle-farm/dist/public', '', true);
await writeFile('/tmp/minicattle-github-manifest.json', JSON.stringify(files));
console.log(JSON.stringify({ files: files.length, bytes: files.reduce((n, f) => n + f.bytes, 0), manifest: '/tmp/minicattle-github-manifest.json' }));