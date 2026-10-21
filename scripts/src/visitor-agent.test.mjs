import test from 'node:test';
import assert from 'node:assert/strict';
import { visitorAgent } from '../../artifacts/api-server/src/lib/visitor-agent.ts';

test('coarse browser classification preserves unknowns and mobile Safari', () => {
  assert.deepEqual(visitorAgent(''), { device: 'Unknown', browser: 'Unknown' });
  assert.deepEqual(visitorAgent('Mozilla/5.0 (iPhone) Mobile/15 Safari/604.1'), { device: 'Mobile', browser: 'Safari' });
  assert.deepEqual(visitorAgent('Mozilla/5.0 (iPad) Safari/604.1'), { device: 'Tablet', browser: 'Safari' });
});
test('Edge and Opera are not misclassified as Chrome', () => {
  assert.equal(visitorAgent('Mozilla Chrome/130 Safari/537 Edg/130').browser, 'Edge');
  assert.equal(visitorAgent('Mozilla Chrome/130 Safari/537 OPR/110').browser, 'Opera');
  assert.deepEqual(visitorAgent('Mozilla/5.0 (Linux; Android 14; Mobile) Chrome/130'), { device: 'Mobile', browser: 'Chrome' });
});
