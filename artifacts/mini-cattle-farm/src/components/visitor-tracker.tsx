import { useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { recordVisit } from '@workspace/api-client-react';
import { runOptionalVisitorTracking } from '@/lib/visitor-tracking';

/** First-party anonymous session counts; never send email, IP, query or receipt tokens. */
export function VisitorTracker() {
  const [location] = useLocation();
  const session = useRef<string | null>(null);
  const event = useRef<{ path: string; id: string } | null>(null);
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;
    runOptionalVisitorTracking(() => {
    if (navigator.doNotTrack === '1' || (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl) return;
    const path = location.split(/[?#]/)[0];
    if (!/^\/(?:shop|about|contact|faq|services|cart|checkout|wishlist|compare|product\/[a-z0-9-]+|product-category\/[a-z0-9-]+)?$/.test(path)) return;
    if (event.current?.path !== path) event.current = { path, id: crypto.randomUUID() };
    if (!session.current) {
      try {
        const saved = sessionStorage.getItem('mcf-visitor-session');
        session.current = saved && /^[a-f0-9-]{36}$/i.test(saved) ? saved : crypto.randomUUID();
        sessionStorage.setItem('mcf-visitor-session', session.current);
      } catch { session.current = crypto.randomUUID(); }
    }
    let referrer = '';
    try { referrer = document.referrer ? new URL(document.referrer).hostname : ''; } catch { /* no referrer */ }
    const visit = { eventId: event.current.id, sessionId: session.current, path, referrer };
    const send = () => {
      if (document.visibilityState === 'hidden') return;
      void recordVisit(visit).catch(() => {
        // Analytics failure must not interrupt purchases or expose customer information.
      });
    };
    send();
    timer = setInterval(send, 60000);
    });
    return () => { if (timer) clearInterval(timer); };
  }, [location]);
  return null;
}