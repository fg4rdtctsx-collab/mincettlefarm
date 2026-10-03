import { useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { recordVisit } from '@workspace/api-client-react';

/** First-party anonymous session counts; never send email, IP, query or receipt tokens. */
export function VisitorTracker() {
  const [location] = useLocation();
  const session = useRef<string | null>(null);
  const prior = useRef('');
  useEffect(() => {
    if (navigator.doNotTrack === '1' || (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl) return;
    const path = location.split(/[?#]/)[0];
    if (!/^\/(?:shop|about|contact|faq|services|cart|checkout|wishlist|compare|product\/[a-z0-9-]+|product-category\/[a-z0-9-]+)?$/.test(path) || prior.current === path) return;
    prior.current = path;
    if (!session.current) {
      try {
        const saved = sessionStorage.getItem('mcf-visitor-session');
        session.current = saved && /^[a-f0-9-]{36}$/i.test(saved) ? saved : crypto.randomUUID();
        sessionStorage.setItem('mcf-visitor-session', session.current);
      } catch { session.current = crypto.randomUUID(); }
    }
    let referrer = '';
    try { referrer = document.referrer ? new URL(document.referrer).hostname : ''; } catch { /* no referrer */ }
    void recordVisit({ eventId: crypto.randomUUID(), sessionId: session.current, path, referrer }).catch(() => {
      // Analytics failure must not interrupt purchases or expose customer information.
    });
  }, [location]);
  return null;
}