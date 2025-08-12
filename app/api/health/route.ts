export async function GET() {
  const expected = 'hkgryypdqiyigoztvran';
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.VITE_SUPABASE_URL ||
    '';
  if (process.env.NODE_ENV !== 'development') {
    const current = url.split('https://')[1]?.split('.')[0] || '';
    if (current && current !== expected) {
      return new Response(
        JSON.stringify({ ok: false, ref: current, expected }),
        { status: 500, headers: { 'content-type': 'application/json' } }
      );
    }
  }
  return new Response(
    JSON.stringify({ ok: true, projectRef: expected }),
    { status: 200, headers: { 'content-type': 'application/json' } }
  );
}
