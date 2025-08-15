import { createClient } from '@supabase/supabase-js';
const url =
(typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_SUPABASE_URL) ||
process.env.NEXT_PUBLIC_SUPABASE_URL ||
process.env.VITE_SUPABASE_URL ||
'';
const anon =
(typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_SUPABASE_ANON_KEY) ||
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
 process.env.VITE_SUPABASE_ANON_KEY ||
'';
if (!url || !anon) {
throw new Error('Supabase public URL/anon key are missing. Set NEXT_PUBLIC_* or VITE_* envs.');
}
export const adminSupabase = createClient(url, serviceRole, { auth: { persistSession: false }});
