import { test } from 'node:test';
import assert from 'node:assert/strict';
import { runOptionalVisitorTracking } from '../../artifacts/mini-cattle-farm/src/lib/visitor-tracking.ts';

test('HTTP browsers without randomUUID skip analytics without crashing', () => {
  let visits = 0;
  assert.doesNotThrow(() => runOptionalVisitorTracking(() => { visits++; }, {}));
  assert.equal(visits, 0);
});

test('secure browsers continue recording visits', () => {
  let visits = 0;
  runOptionalVisitorTracking(() => { visits++; }, { randomUUID: () => 'visitor-id' });
  assert.equal(visits, 1);
});

test('synchronous analytics errors cannot escape into the storefront', () => {
  assert.doesNotThrow(() => runOptionalVisitorTracking(() => {
    throw new Error('Browser storage or analytics is unavailable');
  }, { randomUUID: () => 'visitor-id' }));
});
