// Writing assistant — analyzes an Arabic paragraph for grammar & spelling with explanations.
// Input: { text: string, level?: "beginner"|"intermediate"|"advanced" }
// Output: { corrected, summary, issues:[{original, correction, type, explanation}] }

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
    const { text, level = "beginner" } = await req.json();
    if (!text || typeof text !== "string") return json({ error: "Missing text" }, 400);

    const prompt = `أنت معلم لغة عربية دقيق ولطيف. حلّل النص التالي لطالب مستواه (${level}) وصحّح الأخطاء النحوية والإملائية والصرفية.

النص:
"""${text}"""

أعد JSON فقط بالشكل التالي (بدون أي نص خارجه):
{
  "corrected": "النص الكامل بعد التصحيح مع التشكيل الجزئي في الكلمات المهمة",
  "summary": "ملخص ودود من سطر أو سطرين عن جودة النص العامة والنصيحة الأهم",
  "issues": [
    {
      "original": "الجزء الخاطئ كما ورد",
      "correction": "الصياغة الصحيحة",
      "type": "نحو|إملاء|صرف|أسلوب",
      "explanation": "شرح مبسّط للسبب بالعربية"
    }
  ]
}
- اذكر في "issues" فقط الأخطاء الحقيقية، بحد أقصى 8.
- إذا كان النص سليماً تماماً، اجعل issues مصفوفة فارغة.`;

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
    try { parsed = JSON.parse(raw); } catch { parsed = { corrected: text, summary: "", issues: [] }; }
    return json(parsed);
  } catch (err) {
    console.error(err);
    return json({ error: (err as Error).message }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
}
