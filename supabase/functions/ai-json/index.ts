// Generic JSON generator — server-side proxy to Lovable AI Gateway.
// Replaces the browser-side `generateJson` helper so LOVABLE_API_KEY never
// reaches the client. Only accepts a small allowlist of preset tasks so the
// endpoint can't be turned into a free-form model gateway.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const DEFAULT_MODEL = "google/gemini-2.5-flash-lite";

// Allowed task prompts. Keep server-authoritative so clients can only pick
// pre-approved shapes and can't inject arbitrary system prompts.
const TASKS: Record<string, { model?: string; temperature?: number; build: (input: any) => string }> = {
  "daily-challenge": {
    temperature: 0.6,
    build: ({ level = "A1", seed = "" }) => `أنت مصمّم تمارين عربية يومية.
أنشئ تحدّياً قصيراً لمتعلّم عربي في مستوى ${level}.
Seed للتنوّع: ${seed}

أعد JSON فقط:
{
  "title": "عنوان قصير مشوّق",
  "instruction": "شرح المطلوب في سطر واحد",
  "prompt": "النص أو الجملة المطلوب التعامل معها",
  "expected": "الإجابة النموذجية (مشكّلة)",
  "hint": "تلميح قصير",
  "points": رقم بين 5 و 20
}`,
  },
  "flashcards": {
    temperature: 0.5,
    build: ({ topic = "", level = "A1", count = 8 }) => `ولّد ${count} بطاقة تعليمية عربية عن "${topic}" لمستوى ${level}.
أعد JSON فقط:
{
  "cards": [
    {"front": "الكلمة أو الجملة العربية (مشكّلة)", "back": "المعنى بالإنجليزية", "example": "جملة مثال قصيرة بالعربية"}
  ]
}`,
  },
  "scan-meta": {
    temperature: 0.2,
    build: ({ text = "" }) => `النص التالي مستخرج من ورقة ممسوحة. أعطني JSON فقط بالحقول:
{
  "language": "ar" أو "en" أو "mixed",
  "title": "عنوان قصير مقترح (٢-٦ كلمات) بلغة النص، أو ''",
  "summary": "ملخّص من سطرين بلغة النص",
  "keywords": ["٣-٦ كلمات مفتاحية بلغة النص"]
}
النص:
"""
${String(text).slice(0, 3500)}
"""`,
  },
};

interface Body {
  task: string;
  input?: Record<string, unknown>;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "method not allowed" }, 405);

  try {
    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) return json({ error: "LOVABLE_API_KEY missing" }, 500);

    const body = (await req.json()) as Body;
    const task = String(body?.task || "");
    const spec = TASKS[task];
    if (!spec) return json({ error: "unknown task" }, 400);

    const prompt = spec.build(body.input || {});
    const upstream = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Lovable-API-Key": apiKey },
      body: JSON.stringify({
        model: spec.model || DEFAULT_MODEL,
        temperature: spec.temperature ?? 0.4,
        response_format: { type: "json_object" },
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!upstream.ok) {
      const errText = await upstream.text().catch(() => "");
      const status = upstream.status === 429 ? 429 : upstream.status === 402 ? 402 : 502;
      return json({ error: "upstream_failed", detail: errText.slice(0, 400) }, status);
    }

    const data = await upstream.json();
    const raw = data?.choices?.[0]?.message?.content || "{}";
    let parsed: unknown = {};
    try { parsed = JSON.parse(raw); } catch { parsed = { _raw: raw }; }
    return json(parsed);
  } catch (err: any) {
    console.error("ai-json error", err);
    return json({ error: "internal", detail: String(err?.message || err).slice(0, 400) }, 500);
  }
});

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
