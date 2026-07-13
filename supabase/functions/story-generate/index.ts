// Story generator — creates a leveled, harakat-marked Arabic story tailored to interests.
// Input: { level: "beginner"|"intermediate"|"advanced", interests: string, length?: "short"|"medium" }
// Output: { title, story, vocab:[{word, meaning}], questions:[string] }

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
    const { level = "beginner", interests = "", length = "short" } = await req.json();

    const levelMap: Record<string, string> = {
      beginner: "مبتدئ — جمل قصيرة جداً ومفردات شائعة، 5-8 جمل.",
      intermediate: "متوسط — 8-14 جملة، مفردات متنوعة وتراكيب متوسطة.",
      advanced: "متقدم — 14-20 جملة، مفردات غنية وأسلوب أدبي.",
    };

    const prompt = `اكتب قصة عربية قصيرة (${length === "medium" ? "متوسطة الطول" : "قصيرة"}) لطالب عربية غير ناطق بها.
المستوى: ${levelMap[level] ?? levelMap.beginner}
اهتمامات الطالب: ${interests || "عامة"}

الشروط:
- شكّل جميع الكلمات بالحركات الكاملة (تشكيل).
- استخدم أفعالاً واضحة وحواراً بسيطاً.
- اجعل القصة إيجابية ومناسبة لجميع الأعمار.

أعد JSON فقط بالشكل التالي بدون أي نص خارجه:
{
  "title": "عنوان القصة مشكّل",
  "story": "نص القصة كامل مع التشكيل، مقسّم بفواصل أسطر \\n\\n بين الفقرات",
  "vocab": [{"word":"كلمة مهمة","meaning":"معنى مبسّط بالعربية"}],
  "questions": ["سؤال فهم قصير", "سؤال آخر"]
}
"vocab" 4-8 كلمات، "questions" 2-3 أسئلة.`;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Lovable-API-Key": apiKey },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        response_format: { type: "json_object" },
        temperature: 0.9,
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
    try { parsed = JSON.parse(raw); } catch { parsed = { title: "", story: raw, vocab: [], questions: [] }; }
    return json(parsed);
  } catch (err) {
    console.error(err);
    return json({ error: (err as Error).message }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
}
