// gemini-proxy — forwards Gemini API calls using a server-side GEMINI_API_KEY.
// Client hits: {SUPABASE_URL}/functions/v1/gemini-proxy/v1beta/models/{model}:{method}[?query]
// Supports both JSON and SSE streaming responses.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Expose-Headers": "content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const key =
    Deno.env.get("GEMINI_API_KEY") ||
    Deno.env.get("GOOGLE_CLOUD_API_KEY") ||
    "";
  if (!key) {
    return json({ error: "missing_gemini_key" }, 500);
  }

  try {
    const url = new URL(req.url);
    // Strip function mount prefix — everything after `/gemini-proxy` is the Gemini path.
    const marker = "/gemini-proxy";
    const idx = url.pathname.indexOf(marker);
    let rest = idx >= 0 ? url.pathname.slice(idx + marker.length) : url.pathname;
    if (!rest.startsWith("/")) rest = "/" + rest;
    if (!rest.startsWith("/v1beta/") && !rest.startsWith("/v1/")) {
      return json({ error: "bad_path", path: rest }, 400);
    }

    const params = new URLSearchParams(url.search);
    params.delete("key");
    params.set("key", key);

    const upstreamUrl = `https://generativelanguage.googleapis.com${rest}?${params.toString()}`;

    const body = req.method === "POST" ? await req.text() : undefined;

    const upstream = await fetch(upstreamUrl, {
      method: req.method,
      headers: { "Content-Type": "application/json" },
      body,
    });

    const headers = new Headers(corsHeaders);
    const ct = upstream.headers.get("content-type") || "application/json";
    headers.set("Content-Type", ct);
    headers.set("Cache-Control", "no-cache");

    return new Response(upstream.body, { status: upstream.status, headers });
  } catch (e) {
    return json({ error: String((e as Error).message || e) }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
