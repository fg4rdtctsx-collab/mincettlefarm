/** Country-only lookup. No raw IPs, coordinates or city data are retained. */
export async function lookupVisitorCountry(address: string, request: typeof fetch = fetch): Promise<string> {
  const ip = address.split(',')[0].trim();
  if (!ip || ip.length > 45 || !/^[a-f0-9:.]+$/i.test(ip)
    || /^(127\.|10\.|192\.168\.|169\.254\.|172\.(1[6-9]|2\d|3[01])\.|::1$|f[cd]|fe80:)/i.test(ip)) return '';
  try {
    const response = await request(`https://api.country.is/${encodeURIComponent(ip)}`, {
      signal: AbortSignal.timeout(1500), redirect: 'error',
    });
    if (!response.ok) return '';
    const data: unknown = await response.json();
    const country = data && typeof data === 'object' && 'country' in data ? data.country : null;
    return typeof country === 'string' && /^[A-Z]{2}$/.test(country) && !['XX', 'ZZ'].includes(country) ? country : '';
  } catch { return ''; }
}
