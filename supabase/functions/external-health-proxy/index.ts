import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const targetUrl = "https://stvn.carbonconstruct.net/api/health";

  try {
    console.log("[external-health-proxy] Fetching:", targetUrl);

    const upstream = await fetch(targetUrl, {
      headers: { Accept: "application/json" },
    });

    const contentType = upstream.headers.get("content-type") ?? "application/json";
    const text = await upstream.text();

    // Return the exact upstream body and status, preserving content-type
    return new Response(text, {
      status: upstream.status,
      headers: {
        ...corsHeaders,
        "content-type": contentType,
      },
    });
  } catch (error) {
    console.error("[external-health-proxy] Error:", error);
    return new Response(
      JSON.stringify({ ok: false, error: (error as Error).message }),
      {
        status: 500,
        headers: { ...corsHeaders, "content-type": "application/json" },
      }
    );
  }
});
