// app/api/storage/route.ts
import { adminSupabase } from '@/lib/supabase/admin';

export async function GET() {
  const { data, error } = await adminSupabase.storage
    .from('epd-exports')
    .list('', { limit: 5, sortBy: { column: 'name', order: 'desc' } });

  return new Response(
    JSON.stringify({ ok: !error, files: data ?? [], error: error?.message }),
    { status: error ? 500 : 200, headers: { 'content-type': 'application/json' } }
  );
}
