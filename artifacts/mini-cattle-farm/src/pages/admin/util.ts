import { useQueryClient } from '@tanstack/react-query';
import { getGetCheckoutConfigQueryKey, getGetOwnerInventoryQueryKey, getGetOwnerOrdersQueryKey, getGetOwnerAnalyticsQueryKey } from '@workspace/api-client-react';

export const POLL = 30000;
export const usd = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
export const when = (s?: string | null) => (s ? new Date(s).toLocaleString() : '');
export const statusOf = (e: unknown): number => {
  const s = (e as { status?: unknown } | null)?.status;
  return typeof s === 'number' ? s : 0;
};
export const isAuthFailure = (e: unknown) => statusOf(e) === 401 || statusOf(e) === 403;
export const errText = (e: unknown) => {
  const d = (e as { data?: { error?: unknown } } | null)?.data;
  if (d && typeof d.error === 'string') return d.error;
  if (e instanceof Error && e.message) return e.message;
  return 'The request failed. Please try again.';
};
export function useRefreshOwner() {
  const qc = useQueryClient();
  return () => Promise.all([
    qc.invalidateQueries({ queryKey: getGetOwnerInventoryQueryKey() }),
    qc.invalidateQueries({ queryKey: getGetOwnerOrdersQueryKey() }),
    qc.invalidateQueries({ queryKey: getGetOwnerAnalyticsQueryKey() }),
    qc.invalidateQueries({ queryKey: getGetCheckoutConfigQueryKey() }),
  ]);
}
