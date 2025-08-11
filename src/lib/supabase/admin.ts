import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const service =
  process.env.SUPABASE_SERVICE_ROLE ??
  process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !service) {
  console.error('Missing Supabase server envs: NEXT_PUBLIC_SUPABASE_URL and/or SUPABASE_SERVICE_ROLE{_KEY}.');
  throw new Error('Supabase service role not configured');
}

export const adminSupabase = createClient(url, service, {
  auth: { persistSession: false },
});

