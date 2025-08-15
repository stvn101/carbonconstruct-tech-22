import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const TARGET = Deno.env.get("TARGET_URL") ?? "https://stvn.carbonconstruct.net/api/health";

serve(async () => {
  try {
    const res = await fetch(TARGET, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Referer": "https://stvn.carbonconstruct.net/",
        "Accept": "application/json",
      },
    });
    const text = await res.text();

    const headers = new Headers(res.headers);
    if (!headers.get("Content-Type")) headers.set("Content-Type", "application/json");
    headers.set("Access-Control-Allow-Origin", "*");
    headers.set("Access-Control-Allow-Methods", "GET,OPTIONS");
    headers.set("Access-Control-Allow-Headers", "Content-Type,Authorization");

    let body = text;
    try { JSON.parse(text); } catch { body = JSON.stringify({ raw: text }); }

    return new Response(body, { status: res.status, headers });
  } catch (e: any) {
    return new Response(JSON.stringify({ ok:false, error:e?.message ?? "unknown", target: TARGET }), {
      status: 502,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }
});
