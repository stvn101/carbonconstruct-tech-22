export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const projectRef = url.split('https://')[1]?.split('.')[0] || '';
  return new Response(JSON.stringify({ ok: true, projectRef }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
}
