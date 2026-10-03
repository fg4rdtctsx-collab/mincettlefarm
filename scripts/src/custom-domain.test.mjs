import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { runInNewContext } from 'node:vm';
import { restorePagesRoute } from '../../artifacts/mini-cattle-farm/src/lib/pages-route.ts';

const output = fileURLToPath(new URL('../../artifacts/mini-cattle-farm/dist/public/', import.meta.url));

test('custom-domain output uses root asset paths and preserves the domain', () => {
  const html = readFileSync(`${output}index.html`, 'utf8');
  assert.ok(!html.includes('/mincettlefarm/'));
  const paths = [...html.matchAll(/(?:src|href)="(\/[^"]+)"/g)].map(match => match[1]);
  assert.ok(paths.some(path => path.startsWith('/assets/')));
  for (const path of paths) assert.ok(statSync(`${output}${path.slice(1)}`).isFile());
  assert.equal(readFileSync(`${output}CNAME`, 'utf8').trim(), 'minicattlefarm.com');
  assert.ok(statSync(`${output}.nojekyll`).isFile());
  const script = paths.find(path => path.endsWith('.js'));
  assert.ok(script);
  assert.ok(!readFileSync(`${output}${script.slice(1)}`, 'utf8').includes('/mincettlefarm/'));
});

test('the built 404 page restores root routes without exposing receipt fragments', () => {
  const html = readFileSync(`${output}404.html`, 'utf8');
  const script = /<script>([\s\S]*?)<\/script>/.exec(html)?.[1];
  assert.ok(script);
  for (const route of ['/product/calf', '/order/test#access=private-fixture']) {
    const current = new URL(route, 'https://minicattlefarm.com');
    let redirected;
    runInNewContext(script, {
      location: {
        pathname: current.pathname,
        search: current.search,
        hash: current.hash,
        replace: value => { redirected = new URL(value, current.origin); },
      },
    });
    assert.equal(redirected.origin, current.origin);
    assert.equal(redirected.pathname, '/');
    assert.ok(!redirected.search.includes('private-fixture'));
    assert.equal(restorePagesRoute(redirected.href, '/'), route);
  }
});