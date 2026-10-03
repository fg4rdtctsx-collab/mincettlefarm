import { test } from 'node:test';
import assert from 'node:assert/strict';
import { restorePagesRoute } from '../../artifacts/mini-cattle-farm/src/lib/pages-route.ts';

test('restores a product route under the repository prefix', () => {
  assert.equal(restorePagesRoute('https://example.github.io/mincettlefarm/?__mcf_path=%2Fproduct%2Fcalf', '/mincettlefarm/'), '/mincettlefarm/product/calf');
});
test('keeps private receipt token in the fragment', () => {
  assert.equal(restorePagesRoute('https://example.github.io/mincettlefarm/?__mcf_path=%2Forder%2F123%3Fview%3Dreceipt#access=private', '/mincettlefarm/'), '/mincettlefarm/order/123?view=receipt#access=private');
});
test('supports root custom domains', () => {
  assert.equal(restorePagesRoute('https://farm.example/?__mcf_path=%2Fshop', '/'), '/shop');
});
test('restores a custom-domain product deep link without a repository prefix', () => {
  assert.equal(restorePagesRoute('https://minicattlefarm.com/?__mcf_path=%2Fproduct%2Fcalf', '/'), '/product/calf');
});
test('keeps custom-domain receipt access private during route restoration', () => {
  assert.equal(restorePagesRoute('https://minicattlefarm.com/?__mcf_path=%2Forder%2F123#access=private', '/'), '/order/123#access=private');
});
test('rejects external and escaping routes', () => {
  for (const route of ['//evil.example/', '/../outside', '/%2e%2e/outside']) {
    assert.equal(restorePagesRoute(`https://example.github.io/mincettlefarm/?__mcf_path=${encodeURIComponent(route)}`, '/mincettlefarm/'), null);
  }
});
test('does not hijack a real page query', () => {
  assert.equal(restorePagesRoute('https://example.github.io/mincettlefarm/shop?__mcf_path=%2Fcart', '/mincettlefarm/'), null);
});