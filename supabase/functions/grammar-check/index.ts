// Grammar whisper — quick JSON-only analysis of the user's last message.
// Deploy: supabase functions deploy grammar-check --no-verify-jwt
// Secret: GEMINI_API_KEY

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

    const { text, level } = await req.json();
    if (!text || typeof text !== "string") return json({ error: "Missing text" }, 400);

    const prompt = `أنت معلم لغة عربية لطيف. حلل جملة الطالب (مستوى ${level ?? "مبتدئ"}) واكتشف أخطاء نحوية أو صرفية بسيطة.
جملة الطالب: "${text}"

أعد فقط JSON صالح بهذا الشكل (بدون أي نص خارج JSON):
{
  "has_error": boolean,
  "hint": "همسة قصيرة ولطيفة بالعربية، لا تتجاوز 15 كلمة، بلا شرح طويل",
  "corrected": "الجملة الصحيحة أو نفس الجملة إذا كانت سليمة",
  "new_words": [{"word":"كلمة","meaning":"معنى قصير"}]
}
إذا كانت الجملة سليمة أعد has_error=false وhint فارغة.
new_words = كلمات عربية جديرة بالحفظ من جملة الطالب (0-3 كلمات).`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.2, responseMimeType: "application/json" },
      }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      return json({ error: "Gemini error", status: res.status, details: errText }, res.status);
    }
    const data = await res.json();
    const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";
    let parsed;
    try { parsed = JSON.parse(raw); } catch { parsed = { has_error: false, hint: "", corrected: text, new_words: [] }; }
    return json(parsed);
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
