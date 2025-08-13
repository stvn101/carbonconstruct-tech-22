export async function GET() {
  const expected = 'hkgryypdqiyigoztvran';
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.VITE_SUPABASE_URL ||
    '';
  const anonKey = 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    '';
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.VITE_SUPABASE_SERVICE_ROLE ||
    '';

  // Basic URL validation
  const current = url.split('https://')[1]?.split('.')[0] || '';
  const projectRef = current === expected ? expected : current;
  
  // Environment checks
  const anonKeySet = !!anonKey;
  const serviceKeySet = !!serviceKey;
  
  // Supabase connection test
  let supabaseOk = false;
  try {
    if (url && anonKey) {
      // Simple test to verify Supabase connection
      const testResponse = await fetch(`${url}/rest/v1/`, {
        headers: {
          'apikey': anonKey,
          'Content-Type': 'application/json'
        }
      });
      supabaseOk = testResponse.status < 500; // Any response < 500 means connection works
    }
  } catch (error) {
    supabaseOk = false;
  }

  const healthData = {
    ok: projectRef === expected && supabaseOk && anonKeySet && serviceKeySet,
    projectRef,
    supabaseOk,
    anonKeySet,
    serviceKeySet,
    env: {
      projectRef: projectRef || 'unknown'
    }
  };

  const status = healthData.ok ? 200 : 500;
  
  return new Response(
    JSON.stringify(healthData),
    { status, headers: { 'content-type': 'application/json' } }
  );
}
