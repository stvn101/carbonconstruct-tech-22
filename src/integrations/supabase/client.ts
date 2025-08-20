// [CHANGED] src/integrations/supabase/client.ts
// Canonical Supabase client (TECH-22) — env-only, no fallbacks, no overrides
import { createClient } from '@supabase/supabase-js';

type Env = {
  VITE_SUPABASE_URL?: string;
  VITE_SUPABASE_PUBLISHABLE_KEY?: string;
};

console.log('Debug: import.meta.env =', import.meta.env);
console.log('Debug: VITE_SUPABASE_URL =', import.meta.env.VITE_SUPABASE_URL);
console.log('Debug: VITE_SUPABASE_PUBLISHABLE_KEY =', import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);

const { VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY } = import.meta.env;

// Fail fast if envs are missing so we never silently bind to the wrong project.
if (!VITE_SUPABASE_URL || !VITE_SUPABASE_PUBLISHABLE_KEY) {
  console.error('Environment variables missing:', { 
    VITE_SUPABASE_URL, 
    VITE_SUPABASE_PUBLISHABLE_KEY,
    allEnv: import.meta.env
  });
  throw new Error(
    'Supabase env missing: set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.',
  );
}

export const supabase = createClient(VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY, {
  auth: { persistSession: true, autoRefreshToken: true },
});
