// Arabic text-to-speech via Lovable AI Gateway (OpenAI gpt-4o-mini-tts).
// Returns an mp3 audio file. Falls back to Google Cloud Chirp HD if configured.
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { decode as base64Decode } from "https://deno.land/std@0.168.0/encoding/base64.ts";

const headers = {
  ...corsHeaders,
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...headers, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers });

  try {
    const { text, voice = "alloy" } = await req.json();
    if (!text || typeof text !== "string") {
      return json({ error: "text required" }, 400);
    }

    // 1) Preferred: Lovable AI Gateway (OpenAI TTS).
    const lovableKey = Deno.env.get("LOVABLE_API_KEY");
    if (lovableKey) {
      const upstream = await fetch("https://ai.gateway.lovable.dev/v1/audio/speech", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${lovableKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openai/gpt-4o-mini-tts",
          input: text,
          voice,
          response_format: "mp3",
          instructions: "Speak in clear, natural Modern Standard Arabic (فصحى) at a warm, friendly pace suitable for a language learner. Pronounce every letter carefully.",
        }),
      });

      if (upstream.ok) {
        const audioBuf = await upstream.arrayBuffer();
        if (audioBuf.byteLength > 0) {
          return new Response(audioBuf, {
            headers: {
              ...headers,
              "Content-Type": "audio/mpeg",
              "Cache-Control": "public, max-age=86400",
            },
          });
        }
      } else {
        const errTxt = await upstream.text().catch(() => "");
        console.error(`[tts] Lovable AI failed ${upstream.status}: ${errTxt.slice(0, 200)}`);
        if (upstream.status === 402) {
          return json({ error: "PAYMENT_REQUIRED", message: "انتهى رصيد Lovable AI." }, 402);
        }
        if (upstream.status === 429) {
          return json({ error: "RATE_LIMITED", fallback: true }, 200);
        }
        // fall through to Google fallback / final fallback
      }
    }

    // 2) Fallback: Google Cloud Chirp HD if configured.
    const googleKey = Deno.env.get("GOOGLE_CLOUD_API_KEY");
    if (googleKey) {
      const upstream = await fetch(
        "https://texttospeech.googleapis.com/v1/text:synthesize",
        {
          method: "POST",
          headers: { "X-Goog-Api-Key": googleKey, "Content-Type": "application/json" },
          body: JSON.stringify({
            input: { text },
            voice: { languageCode: "ar-XA", name: "ar-XA-Chirp3-HD-Kore" },
            audioConfig: { audioEncoding: "MP3", speakingRate: 0.9 },
          }),
        },
      );
      if (upstream.ok) {
        const { audioContent } = await upstream.json();
        if (audioContent) {
          const bytes = base64Decode(audioContent);
          return new Response(bytes, {
            headers: {
              ...headers,
              "Content-Type": "audio/mpeg",
              "Cache-Control": "public, max-age=86400",
            },
          });
        }
      }
    }

    // 3) Neither provider available → tell client to use browser fallback.
    return json({ error: "SERVICE_UNAVAILABLE", fallback: true }, 200);
  } catch (e) {
    console.error("[tts] error:", e);
    return json({ error: "SERVICE_UNAVAILABLE", fallback: true, detail: String(e) }, 200);
  }
});
