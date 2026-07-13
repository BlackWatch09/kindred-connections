// Contextual translator — analyzes a word (or short phrase) within its sentence context.
// Input: { sentence: string, word?: string, target_lang?: "en"|"tr"|"ar" }
// Output: { translation, contextual_meaning, root, part_of_speech, examples:[{ar, translation}], notes }

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) return json({ error: "LOVABLE_API_KEY missing" }, 500);
    const { sentence, word, target_lang = "en" } = await req.json();
    if (!sentence || typeof sentence !== "string") return json({ error: "Missing sentence" }, 400);

    const langName = target_lang === "tr" ? "Turkish" : target_lang === "ar" ? "Arabic (simple paraphrase)" : "English";

    const prompt = `You are an Arabic linguistic assistant. Analyse the word/phrase in the given sentence *in context* — not a literal dictionary translation.

Sentence (Arabic): "${sentence}"
Focus word/phrase: ${word ? `"${word}"` : "(identify the most notable word yourself)"}
Target language for the translation: ${langName}

Return ONLY JSON in this exact shape (no text outside JSON):
{
  "focus": "الكلمة أو العبارة المستهدفة",
  "translation": "الترجمة السياقية للجملة كاملة إلى ${langName}",
  "contextual_meaning": "معنى الكلمة في هذا السياق تحديداً (بالعربية)",
  "root": "الجذر الثلاثي/الرباعي إن وُجد (بدون تشكيل)",
  "part_of_speech": "اسم|فعل|حرف|صفة|ظرف",
  "examples": [
    {"ar":"جملة عربية أخرى تستخدم نفس الكلمة أو جذرها مشكّلة","translation":"الترجمة إلى ${langName}"}
  ],
  "notes": "ملاحظة قصيرة عن الاستخدام أو تصريفات مفيدة (بالعربية)"
}
Provide 2-3 example sentences.`;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Lovable-API-Key": apiKey },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        response_format: { type: "json_object" },
        temperature: 0.3,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      if (res.status === 429) return json({ error: "rate_limited" }, 429);
      if (res.status === 402) return json({ error: "credits_exhausted" }, 402);
      return json({ error: "upstream_error", status: res.status, details: errText }, 500);
    }
    const data = await res.json();
    const raw = data?.choices?.[0]?.message?.content ?? "{}";
    let parsed: any;
    try { parsed = JSON.parse(raw); } catch { parsed = { focus: word ?? "", translation: raw, contextual_meaning: "", root: "", part_of_speech: "", examples: [], notes: "" }; }
    return json(parsed);
  } catch (err) {
    console.error(err);
    return json({ error: (err as Error).message }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
}
