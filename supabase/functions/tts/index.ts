// Arabic text-to-speech via Google Cloud Chirp 3 HD (natural, near-human voice).
// Returns an mp3 audio file, or a structured fallback signal when TTS is unavailable.
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { decode as base64Decode } from "https://deno.land/std@0.168.0/encoding/base64.ts";

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
    const apiKey = Deno.env.get("GOOGLE_CLOUD_API_KEY");
    if (!apiKey) {
      return json({ error: "SERVICE_UNAVAILABLE", fallback: true }, 200);
    }

    const { text, voice = "ar-XA-Chirp3-HD-Charon", speed = 0.88 } = await req.json();
    if (!text || typeof text !== "string") {
      return json({ error: "text required" }, 400);
    }

    const upstream = await fetch(
      "https://texttospeech.googleapis.com/v1/text:synthesize",
      {
        method: "POST",
        headers: {
          "X-Goog-Api-Key": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: { text },
          voice: { languageCode: "ar-XA", name: voice },
          audioConfig: { audioEncoding: "MP3", speakingRate: speed },
        }),
      },
    );

    if (!upstream.ok) {
      const errText = await upstream.text().catch(() => "");
      const fallbackable =
        upstream.status >= 500 ||
        upstream.status === 429 ||
        upstream.status === 403;
      return json(
        fallbackable
          ? { error: "SERVICE_UNAVAILABLE", fallback: true }
          : { error: "TTS failed", status: upstream.status, detail: errText },
        fallbackable ? 200 : upstream.status,
      );
    }

    const { audioContent } = await upstream.json();
    if (!audioContent) {
      return json({ error: "SERVICE_UNAVAILABLE", fallback: true }, 200);
    }
    const bytes = base64Decode(audioContent);
    return new Response(bytes, {
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
