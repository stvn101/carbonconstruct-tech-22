import { createClient } from '@supabase/supabase-js';

// URL can come from either naming scheme
const url =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL ||
  '';

/**
 * Service role must be server-side only.
 * We support multiple names because platforms differ:
 *  - SUPABASE_SERVICE_ROLE (preferred)
 *  - SUPABASE_SERVICE_ROLE_KEY (Lovable legacy)
 *  - VITE_SUPABASE_SERVICE_ROLE (only if the platform forces VITE names; still server-only)
 */
const service =
  process.env.SUPABASE_SERVICE_ROLE ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_SERVICE_ROLE ||
  '';

if (!url || !service) {
  console.error('Missing Supabase server envs (URL/service role).');
  throw new Error('Supabase service role not configured');
}

export const adminSupabase = createClient(url, service, {
  auth: { persistSession: false },
});
