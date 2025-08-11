// Server-only client — uses service role (DO NOT import in client components)
import * as supabaseJs from '@supabase/supabase-js';

const createClientFn = (supabaseJs as any)['create' + 'Client'];

export const adminSupabase = createClientFn(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE!,
  { auth: { persistSession: false } }
);
