// A Pages 404 redirect carries the route in a query parameter, but private
// receipt tokens stay in the fragment and are never sent to the web server.
export function restorePagesRoute(href: string, base: string): string | null {
  const current = new URL(href);
  const route = current.searchParams.get('__mcf_path');
  if (!route || !route.startsWith('/') || route.startsWith('//')) return null;
  if (current.pathname !== base && current.pathname !== `${base}index.html`) return null;
  const target = new URL(`${base.replace(/\/$/, '')}${route}`, current.origin);
  if (target.origin !== current.origin || !target.pathname.startsWith(base)) return null;
  return `${target.pathname}${target.search}${current.hash}`;
}