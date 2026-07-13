// Arabic text-to-speech via Lovable AI Gateway.
// Returns an mp3 audio file, or a structured fallback signal when premium TTS is unavailable.
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const headers = {
  ...corsHeaders,
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...headers, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers });

  try {
    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) {
      return json({ error: "SERVICE_UNAVAILABLE", fallback: true }, 200);
    }

    const { text, voice = "shimmer", speed = 0.9 } = await req.json();
    if (!text || typeof text !== "string") {
      return json({ error: "text required" }, 400);
    }

    const upstream = await fetch("https://ai.gateway.lovable.dev/v1/audio/speech", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini-tts",
        input: text,
        voice,
        speed,
        response_format: "mp3",
        instructions: "Speak in Modern Standard Arabic with clear, warm, engaging pronunciation like an expert language teacher. Enunciate every letter distinctly. Use a natural, encouraging tone suitable for beginners learning Arabic. Pace slightly slower than conversational speed.",
      }),
    });

    if (!upstream.ok) {
      const errText = await upstream.text().catch(() => "");
      const fallbackable = upstream.status >= 500 || upstream.status === 402 || upstream.status === 403 || upstream.status === 404 || upstream.status === 429;
      return json(
        fallbackable
          ? { error: "SERVICE_UNAVAILABLE", fallback: true }
          : { error: "TTS failed", status: upstream.status, detail: errText },
        fallbackable ? 200 : upstream.status,
      );
    }

    return new Response(upstream.body, {
      headers: {
        ...headers,
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (e) {
    return json({ error: "SERVICE_UNAVAILABLE", fallback: true, detail: String(e) }, 200);
  }
});
