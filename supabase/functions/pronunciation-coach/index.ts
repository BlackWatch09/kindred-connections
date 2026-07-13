// Pronunciation Coach — analyzes Arabic pronunciation from recorded audio.
// Input: { audio_base64, mime_type, target?: string }
// Output: { transcription, target, overall_score, feedback, letters:[{char, ok, note, correct_hint}] }

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const MODEL = "gemini-2.5-flash";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) return json({ error: "GEMINI_API_KEY not set" }, 500);

    const { audio_base64, mime_type, target } = await req.json();
    if (!audio_base64 || !mime_type) return json({ error: "Missing audio_base64/mime_type" }, 400);

    const prompt = `أنت مُصحّح نطق عربي خبير في مخارج الحروف (خصوصاً التفريق بين س/ص، ذ/ز/ظ، ت/ط، ض/د، ح/هـ، ق/ك، ع/أ).
${target ? `الجملة المطلوب نطقها: "${target}"` : "لم يُحدّد نص مرجعي؛ اعتمد على ما نطقه الطالب."}

استمع للتسجيل المرفق ثم أعد JSON فقط بالتنسيق التالي (بدون أي نص خارجه):
{
  "transcription": "ما نطقه الطالب فعلياً بالعربية",
  "target": "النص الصحيح المتوقع (نفس الجملة المستهدفة إن وُجدت وإلا اقترح صياغة سليمة لما نطقه)",
  "overall_score": رقم من 0 إلى 100,
  "feedback": "ملاحظة ودودة قصيرة بالعربية (سطر أو سطران)",
  "letters": [
    {"char":"الحرف","ok":true/false,"note":"وصف قصير للخطأ إن وُجد","correct_hint":"طريقة النطق الصحيح باختصار"}
  ]
}
اذكر في "letters" فقط الحروف التي تستحق ملاحظة (صحيحة بارزة أو خاطئة)، بحد أقصى 8 عناصر.`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          role: "user",
          parts: [
            { text: prompt },
            { inlineData: { mimeType: mime_type, data: audio_base64 } },
          ],
        }],
        generationConfig: { temperature: 0.2, responseMimeType: "application/json", maxOutputTokens: 1024 },
      }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.error("Gemini error:", res.status, errText);
      return json({ error: "Gemini error", status: res.status, details: errText }, res.status);
    }
    const data = await res.json();
    const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";
    let parsed: any;
    try { parsed = JSON.parse(raw); } catch { parsed = { transcription: "", target: target ?? "", overall_score: 0, feedback: "لم أتمكن من تحليل التسجيل، حاول مرة أخرى.", letters: [] }; }
    return json(parsed);
  } catch (err) {
    console.error(err);
    return json({ error: (err as Error).message }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
}
