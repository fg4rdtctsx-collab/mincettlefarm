const names = new Intl.DisplayNames(['en'], { type: 'region' });
export function countryName(code: string) {
  return /^[A-Z]{2}$/.test(code) ? names.of(code) || code : 'Unknown';
}
export function countryFlag(code: string) {
  return /^[A-Z]{2}$/.test(code) ? [...code].map(c => String.fromCodePoint(127397 + c.charCodeAt(0))).join('') : '';
}
export function Country({ code }: { code: string }) {
  return <span className="ad-country"><span aria-hidden="true">{countryFlag(code)}</span> {countryName(code)}</span>;
}
