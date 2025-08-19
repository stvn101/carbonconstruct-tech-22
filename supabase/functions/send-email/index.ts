import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

type EmailPayload = {
  from?: string;              // optional; defaults to RESEND_FROM
  to: string | string[];      // string or array
  subject: string;
  text?: string;
  html?: string;
  replyTo?: string;           // optional per-request override
};

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
} as const;

const ascii = (s?: string) => (s ?? "").normalize("NFKD").replace(/[^\x00-\x7F]/g, "-");

// Secrets (set in Supabase → Project → Config → Secrets)
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const RESEND_FROM    = Deno.env.get("RESEND_FROM")    ?? "noreply@tech.carbonconstruct.net";
const SUPPORT_EMAIL  = Deno.env.get("SUPPORT_EMAIL")  ?? "support@carbonconstruct.com.au";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: CORS });
  if (req.method !== "POST") return new Response(JSON.stringify({ error: "Method Not Allowed" }), { status: 405, headers: CORS });

  if (!RESEND_API_KEY) {
    return new Response(JSON.stringify({ error: "RESEND_API_KEY missing" }), { status: 500, headers: CORS });
  }

  let payload: EmailPayload;
  try { payload = await req.json(); }
  catch { return new Response(JSON.stringify({ error: "Invalid JSON body" }), { status: 400, headers: CORS }); }

  const to = Array.isArray(payload.to) ? payload.to : [payload.to].filter(Boolean);
  if (!to.length || !payload.subject) {
    return new Response(JSON.stringify({ error: "Missing 'to' or 'subject'" }), { status: 400, headers: CORS });
  }

  const from    = (payload.from && payload.from.trim()) || RESEND_FROM;
  const replyTo = payload.replyTo || SUPPORT_EMAIL;
  const text    = ascii(payload.text);
  const html    = payload.html;

  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to, subject: payload.subject, text, html, reply_to: replyTo }),
  });

  const result = await r.json().catch(() => ({}));
  if (r.ok && result?.id) {
    console.log("Email sent", { id: result.id, from, to, replyTo });
    return new Response(JSON.stringify({ data: { id: result.id }, error: null }), { status: 200, headers: CORS });
  }
  console.error("Email send failed", { status: r.status, result });
  return new Response(JSON.stringify({ error: result || "Unknown error", status: r.status }), { status: 502, headers: CORS });
});
