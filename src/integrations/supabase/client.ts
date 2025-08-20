// [CHANGED] src/integrations/supabase/client.ts
// Canonical Supabase client (TECH-22) — env-only, no fallbacks, no overrides
import { createClient } from '@supabase/supabase-js';

type Env = {
  VITE_SUPABASE_URL?: string;
  VITE_SUPABASE_PUBLISHABLE_KEY?: string;
};

const { VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY } = (import.meta as any)
  .env as Env;

// Fail fast if envs are missing so we never silently bind to the wrong project.
if (!VITE_SUPABASE_URL || !VITE_SUPABASE_PUBLISHABLE_KEY) {
  throw new Error(
    'Supabase env missing: set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.',
  );
}

export const supabase = createClient(VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY, {
  auth: { persistSession: true, autoRefreshToken: true },
});
