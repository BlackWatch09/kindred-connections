// Voice → text transcription via Gemini multimodal audio understanding.
// Deploy: supabase functions deploy voice-transcribe --no-verify-jwt
// Secret: GEMINI_API_KEY
// Accepts JSON: { audio_base64: string, mime_type: string }

import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) return json({ error: "Unauthorized" }, 401);
    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) return json({ error: "GEMINI_API_KEY not set" }, 500);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: claims } = await supabase.auth.getClaims(authHeader.replace("Bearer ", ""));
    if (!claims?.claims) return json({ error: "Unauthorized" }, 401);

    const { audio_base64, mime_type } = await req.json();
    if (!audio_base64 || !mime_type) return json({ error: "Missing audio_base64 or mime_type" }, 400);

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          role: "user",
          parts: [
            { text: "فرّغ الكلام المسموع إلى نص عربي فقط. أعد النص الخام بدون أي تعليق أو علامات ترقيم زائدة. إذا لم يوجد كلام أعد نص فارغ." },
            { inlineData: { mimeType: mime_type, data: audio_base64 } },
          ],
        }],
        generationConfig: { temperature: 0.1, maxOutputTokens: 256 },
      }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      return json({ error: "Gemini error", status: res.status, details: errText }, res.status);
    }
    const data = await res.json();
    const text = (data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "").trim();
    return json({ text });
  } catch (err) {
    console.error(err);
    return json({ error: (err as Error).message }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
