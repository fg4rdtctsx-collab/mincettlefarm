import { createClient } from '@supabase/supabase-js';
import { setAuthTokenGetter, setBaseUrl } from '@workspace/api-client-react';

const projectUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

function validateProjectUrl(value: string): string {
  const url = new URL(value);
  if (url.protocol !== 'https:' || !/^[a-z0-9-]+\.supabase\.co$/.test(url.hostname) || url.username || url.password || url.port || url.pathname !== '/') {
    throw new Error('VITE_SUPABASE_URL must be your HTTPS Supabase project URL.');
  }
  return url.origin;
}

const origin = projectUrl ? validateProjectUrl(projectUrl) : null;
// Reject privileged keys rather than accidentally embedding them in a build.
if (publishableKey) {
  if (publishableKey.startsWith('sb_secret_')) throw new Error('Never use a Supabase secret key in frontend configuration.');
  if (publishableKey.startsWith('eyJ')) {
    let role = '';
    try { role = JSON.parse(atob(publishableKey.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))).role; }
    catch { throw new Error('Invalid Supabase browser key.'); }
    if (role !== 'anon') throw new Error('Only the anon or publishable key may be used in the browser.');
  } else if (!publishableKey.startsWith('sb_publishable_')) {
    throw new Error('Use a Supabase publishable or legacy anon key.');
  }
}

export const supabase = origin && publishableKey ? createClient(origin, publishableKey, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false },
}) : null;

export function configureSupabaseApi() {
  setBaseUrl(origin ? `${origin}/functions/v1/checkout` : null);
  setAuthTokenGetter(supabase ? async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session?.access_token ?? null;
  } : null);
}