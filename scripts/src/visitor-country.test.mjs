import test from 'node:test';
import assert from 'node:assert/strict';
import { lookupVisitorCountry } from '../../artifacts/api-server/src/lib/visitor-country.ts';

test('country lookup returns only a country code, not IP or exact location', async () => {
  const country = await lookupVisitorCountry('8.8.8.8, 10.0.0.1', async url => {
    assert.equal(url, 'https://api.country.is/8.8.8.8');
    return Response.json({ ip: '8.8.8.8', country: 'US', location: { latitude: 0 } });
  });
  assert.equal(country, 'US');
});
test('private, malformed, unavailable or unrecognized location stays unknown', async () => {
  for (const address of ['127.0.0.1', '10.0.0.1', '::1', '', 'https://evil.example']) {
    assert.equal(await lookupVisitorCountry(address, async () => { throw Error('must not request'); }), '');
  }
  assert.equal(await lookupVisitorCountry('8.8.8.8', async () => { throw Error('network'); }), '');
  assert.equal(await lookupVisitorCountry('8.8.8.8', async () => Response.json({ country: 'ZZ' })), '');
});
