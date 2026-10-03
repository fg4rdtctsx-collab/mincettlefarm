import assert from 'node:assert/strict';
import test from 'node:test';
import { createChaportController, isChaportPage } from '../../artifacts/mini-cattle-farm/src/lib/chaport';

function fixture(path: string) {
  const scripts: Record<string, unknown>[] = [];
  const replacements: string[] = [];
  const win = { location: {
    pathname: path, origin: 'https://example.com', search: '', hash: '',
    get href() { return this.origin + this.pathname + this.search + this.hash; },
    replace: (url: string) => replacements.push(url),
  } } as any;
  const doc = {
    title: 'Farm', body: { appendChild: (script: Record<string, unknown>) => scripts.push(script) },
    createElement: () => ({ remove() {} }),
  } as any;
  const controller = createChaportController(win, doc, '/farm/');
  return { win, scripts, controller, replacements };
}

test('only customer routes are eligible, including path-based previews', () => {
  for (const path of ['/', '/shop', '/checkout', '/product/daisy', '/product-category/cows']) assert.ok(isChaportPage(path));
  for (const path of ['/admin', '/admin-preview', '/owner/orders', '/order/private', '/sign-in', '/sign-up', '/unknown']) {
    assert.equal(isChaportPage(path), false);
    assert.equal(isChaportPage('/farm' + path, '/farm/'), false);
  }
  assert.ok(isChaportPage('/farm/shop', '/farm/'));
  assert.equal(isChaportPage('/farmer/shop', '/farm/'), false);
});

test('private direct entry never loads the script', () => {
  const f = fixture('/farm/order/private');
  f.win.location.hash = '#access=private';
  f.controller.sync();
  assert.equal(f.scripts.length, 0);
});

test('standard embed loads once across public SPA changes, without paid API calls', () => {
  const f = fixture('/farm/shop');
  f.win.location.search = '?campaign=summer';
  f.controller.sync(); f.controller.sync();
  assert.equal(f.scripts.length, 1);
  assert.equal(f.win.chaportConfig.appId, '69edff62c9d873834aeb5332');
  assert.deepEqual(f.win.chaportConfig, { appId: '69edff62c9d873834aeb5332' });
  assert.equal(f.win.chaport._q.length, 0);
  f.win.location.pathname = '/farm/contact';
  f.controller.sync();
  assert.equal(f.scripts.length, 1);
  assert.equal(f.replacements.length, 0);
  assert.equal(f.win.chaport._q.length, 0);
});

test('private navigation replaces the document even before a slow SDK loads', () => {
  const f = fixture('/farm/shop');
  f.controller.sync();
  f.win.location.pathname = '/farm/admin';
  f.controller.sync();
  assert.deepEqual(f.replacements, ['https://example.com/farm/admin']);
});

test('private receipt entry replaces the document while preserving its bearer fragment', () => {
  const f = fixture('/farm/shop');
  f.controller.sync();
  f.win.location.pathname = '/farm/order/private';
  f.win.location.hash = '#access=private';
  f.controller.sync();
  assert.deepEqual(f.replacements, ['https://example.com/farm/order/private#access=private']);
  const privateDocument = fixture('/farm/order/private');
  privateDocument.controller.sync();
  assert.equal(privateDocument.scripts.length, 0);
});

test('token-bearing public URLs are also excluded', () => {
  const f = fixture('/farm/');
  f.win.location.hash = '#access_token=private';
  f.controller.sync();
  assert.equal(f.scripts.length, 0);
});