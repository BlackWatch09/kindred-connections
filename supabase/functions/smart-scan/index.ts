// Smart AI Scanner — OCR via Lovable AI Gateway (Gemini vision).
// Public function; the LOVABLE_API_KEY stays server-side so it never leaks to the browser.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const OCR_MODEL = "google/gemini-2.5-flash";
const META_MODEL = "google/gemini-2.5-flash-lite";

interface Body {
  image_base64: string;
  mime_type: string;
}

const OCR_PROMPT = `أنت ماسح ضوئي ذكي متخصّص في استخراج النصوص العربية والإنجليزية من الصور بأعلى دقّة ممكنة.
اقرأ الصورة المرفقة واستخرج **كل** النص المرئي فيها حرفياً وبدون أي تعديل، تلخيص، أو ترجمة.

قواعد صارمة:
- حافظ على أسطر النص وترتيبها كما تظهر في الصورة.
- شكّل الكلمات العربية بالتشكيل إن ظهر واضحاً، وإلا اتركها بدون تشكيل.
- لا تُضف علامات ترقيم غير موجودة، ولا تُصحّح أخطاء الكاتب.
- إن كان جزء غير واضح، ضع مكانه [...] بدل التخمين.
- لا تُخرج أي شرح أو مقدمة، فقط النص المستخرج بصيغة نصّ عادي.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "method not allowed" }, 405);

  try {
    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) return json({ error: "LOVABLE_API_KEY missing" }, 500);

    const body = (await req.json()) as Body;
    const b64 = String(body?.image_base64 || "");
    const mime = String(body?.mime_type || "image/jpeg");

    if (!b64) return json({ error: "image_base64 required" }, 400);
    // rough byte-size check (base64 → 3/4). Cap at ~10 MB decoded.
    if (b64.length > 14_000_000) return json({ error: "image too large" }, 413);
    if (!/^image\//.test(mime)) return json({ error: "invalid mime_type" }, 400);

    const dataUrl = `data:${mime};base64,${b64}`;

    // Step 1: OCR — plain text output
    const ocrRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Lovable-API-Key": apiKey },
      body: JSON.stringify({
        model: OCR_MODEL,
        temperature: 0.05,
        max_tokens: 4096,
        messages: [{
          role: "user",
          content: [
            { type: "text", text: OCR_PROMPT },
            { type: "image_url", image_url: { url: dataUrl } },
          ],
        }],
      }),
    });

    if (!ocrRes.ok) {
      const errText = await ocrRes.text().catch(() => "");
      const status = ocrRes.status === 429 ? 429 : ocrRes.status === 402 ? 402 : 502;
      return json({ error: "ocr_failed", detail: errText.slice(0, 400) }, status);
    }

    const ocrData = await ocrRes.json();
    const rawText: string = (ocrData?.choices?.[0]?.message?.content || "").trim();

    if (!rawText) {
      return json({
        language: "ar",
        text: "",
        summary: "لم يُعثر على نصوص واضحة في الصورة.",
        keywords: [],
        word_count: 0,
      });
    }

    // Step 2: metadata (best-effort — never fail the whole request on this)
    let meta: any = {};
    try {
      const metaRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Lovable-API-Key": apiKey },
        body: JSON.stringify({
          model: META_MODEL,
          temperature: 0.2,
          response_format: { type: "json_object" },
          messages: [{
            role: "user",
            content: `النص التالي مستخرج من ورقة ممسوحة. أعطني JSON فقط بالحقول:
{
  "language": "ar" أو "en" أو "mixed",
  "title": "عنوان قصير مقترح (٢-٦ كلمات) بلغة النص، أو '' إذا لم يكن مناسباً",
  "summary": "ملخّص من سطرين بلغة النص",
  "keywords": ["٣-٦ كلمات مفتاحية بلغة النص"]
}
النص:
"""
${rawText.slice(0, 3500)}
"""`,
          }],
        }),
      });
      if (metaRes.ok) {
        const md = await metaRes.json();
        const raw = md?.choices?.[0]?.message?.content || "{}";
        meta = JSON.parse(raw);
      }
    } catch { /* ignore */ }

    return json({
      language: meta?.language === "en" || meta?.language === "mixed" ? meta.language : "ar",
      title: typeof meta?.title === "string" ? meta.title : "",
      text: rawText,
      summary: typeof meta?.summary === "string" ? meta.summary : "",
      keywords: Array.isArray(meta?.keywords) ? meta.keywords.map(String).slice(0, 6) : [],
      word_count: rawText.split(/\s+/).filter(Boolean).length,
    });
  } catch (err: any) {
    console.error("smart-scan error", err);
    return json({ error: "internal", detail: String(err?.message || err).slice(0, 400) }, 500);
  }
});

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
