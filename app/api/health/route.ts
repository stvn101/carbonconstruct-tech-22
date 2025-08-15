export async function GET() {
  return new Response(
    JSON.stringify({ ok: true, supabase: 'configured' }),
    { status: 200, headers: { 'content-type': 'application/json' } }
  );
}
