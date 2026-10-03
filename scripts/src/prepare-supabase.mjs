import { mkdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
mkdirSync('supabase/functions/checkout', { recursive: true });
const result = spawnSync('pnpm', [
  '--filter', '@workspace/api-server', 'exec', 'esbuild',
  '../../scripts/src/supabase-core.mjs', '--bundle', '--format=esm',
  '--platform=neutral', '--external:@workspace/db', '--external:drizzle-orm',
  '--external:zod', '--external:node:*',
  '--banner:js=// Generated from the existing checkout engine. Do not edit.\nimport process from "node:process";',
  '--outfile=../../supabase/functions/checkout/core.generated.js',
], { stdio: 'inherit' });
if (result.status !== 0) process.exit(result.status ?? 1);