// [CHANGED] src/integrations/supabase/client.ts
// Canonical Supabase client (TECH-22) — env-only, no fallbacks, no overrides
import { createClient } from '@supabase/supabase-js';

type Env = {
  VITE_SUPABASE_URL?: string;
  VITE_SUPABASE_PUBLISHABLE_KEY?: string;
  VITE_SUPABASE_ANON_KEY?: string;
};

const env = import.meta.env as unknown as Env;
const VITE_SUPABASE_URL = env.VITE_SUPABASE_URL;
const VITE_SUPABASE_KEY = env.VITE_SUPABASE_PUBLISHABLE_KEY || env.VITE_SUPABASE_ANON_KEY;

// Fail fast if envs are missing so we never silently bind to the wrong project.
if (!VITE_SUPABASE_URL || !VITE_SUPABASE_KEY) {
  // Keep this error explicit to surface misconfig quickly
  throw new Error(
    'Supabase env missing: set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY (or VITE_SUPABASE_ANON_KEY).',
  );
}

export const supabase = createClient(VITE_SUPABASE_URL, VITE_SUPABASE_KEY, {
  auth: { persistSession: true, autoRefreshToken: true },
});
