import { createClient } from '@supabase/supabase-js';

// Accept both Next-style and Vite-style env names
const url =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL ||
  '';

const anon =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  '';

if (!url || !anon) {
  console.error('Missing Supabase public envs (URL/ANON).');
  throw new Error('Supabase public env not configured');
}

export const supabase = createClient(url, anon);
