// app/api/probe/route.ts
import { adminSupabase } from '@/lib/supabase/admin';

export async function GET() {
  const { data, error } = await adminSupabase.from('materials').select('id').limit(5);
  return new Response(
    JSON.stringify({ ok: !error, rows: data ?? [], error: error?.message }),
    { status: error ? 500 : 200, headers: { 'content-type': 'application/json' } }
  );
}
