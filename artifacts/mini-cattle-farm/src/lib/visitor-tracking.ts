/** Optional analytics must never stop the storefront, including on HTTP. */
export function runOptionalVisitorTracking(
  track: () => void,
  browserCrypto: Pick<Crypto, 'randomUUID'> | undefined = globalThis.crypto,
): void {
  // randomUUID requires a secure context in Safari and other browsers.
  if (typeof browserCrypto?.randomUUID !== 'function') return;
  try {
    track();
  } catch {
    // Privacy settings, blocked storage, or browser APIs may disable analytics.
  }
}
