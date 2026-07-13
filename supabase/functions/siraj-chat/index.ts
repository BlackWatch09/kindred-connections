// Siraj — floating AI Arabic tutor. Streams replies via Lovable AI Gateway (Gemini).
// Public function (no JWT required) — safe because it only calls the AI gateway.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Gemini 2.5 Flash — fast, cheap, multilingual, great for chat + light tutoring.
const MODEL = "google/gemini-2.5-flash-lite";

type Msg = { role: "user" | "assistant" | "system"; content: string };

interface Body {
  messages: Msg[];
  language?: "ar" | "en" | "tr";
  persona?: {
    tutorName?: string;
    tutorTitle?: string;
    tutorAccent?: string;
    tutorGreeting?: string;
  };
  pageContext?: {
    path?: string;
    title?: string;
    hint?: string;
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) return json({ error: "LOVABLE_API_KEY missing" }, 500);

    const body = (await req.json()) as Body;
    const messages = Array.isArray(body?.messages) ? body.messages.slice(-20) : [];
    if (!messages.length) return json({ error: "messages required" }, 400);

    const system = buildSystem(body);

    const upstream = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": apiKey,
      },
      body: JSON.stringify({
        model: MODEL,
        stream: true,
        temperature: 0.85,
        messages: [{ role: "system", content: system }, ...messages],
      }),
    });

    if (!upstream.ok || !upstream.body) {
      const errText = await upstream.text().catch(() => "");
      console.error("Gateway error:", upstream.status, errText);
      if (upstream.status === 429) return json({ error: "rate_limited" }, 429);
      if (upstream.status === 402) return json({ error: "credits_exhausted" }, 402);
      return json({ error: "upstream_error", status: upstream.status, details: errText }, 500);
    }

    // Re-emit as simple SSE {delta}/{done}
    const stream = new ReadableStream({
      async start(controller) {
        const reader = upstream.body!.getReader();
        const decoder = new TextDecoder();
        const encoder = new TextEncoder();
        let buffer = "";
        try {
          while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";
            for (const line of lines) {
              const t = line.trim();
              if (!t.startsWith("data:")) continue;
              const payload = t.slice(5).trim();
              if (!payload || payload === "[DONE]") continue;
              try {
                const parsed = JSON.parse(payload);
                const delta = parsed?.choices?.[0]?.delta?.content ?? "";
                if (delta) {
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ delta })}\n\n`));
                }
              } catch { /* skip */ }
            }
          }
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`));
          controller.close();
        } catch (e) {
          console.error("stream error", e);
          controller.error(e);
        }
      },
    });

    return new Response(stream, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
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

function buildSystem(b: Body): string {
  const lang = b.language ?? "ar";
  const p = b.persona ?? {};
  const name = p.tutorName || (lang === "ar" ? "سِراج" : "Siraj");
  const accent = p.tutorAccent || (lang === "ar" ? "أردني" : "Jordanian");
  const title = p.tutorTitle || (lang === "ar" ? "رفيق الطالب في تعلّم العربية" : "The student's companion for learning Arabic");
  const ctx = b.pageContext ?? {};
  const pageLine = ctx.path || ctx.title
    ? `الطالب الآن في صفحة: ${ctx.title ?? ""} (${ctx.path ?? ""}). ${ctx.hint ?? ""}`.trim()
    : "";

  const langInstruction: Record<string, string> = {
    ar: `تحدّث معه بالعربية العامية اللطيفة (لهجة ${accent}) ما لم يطلب الفصحى. اجعل الردود قصيرة ودافئة (٢-٤ جمل عادة).`,
    en: `Reply mainly in clear English, but sprinkle Arabic examples with translation. Keep replies short and friendly (2–4 sentences).`,
    tr: `Öğrenciye çoğunlukla Türkçe cevap ver; Arapça örnekleri çevirisiyle birlikte ver. Cevapları kısa ve sıcak tut (2–4 cümle).`,
  };

  return `أنت ${name}، ${title}. أنت مساعد ذكي داخل موقع "لُغة" لتعليم اللغة العربية.
- لا تكشف أبداً أنك نموذج ذكاء اصطناعي؛ قدّم نفسك دائماً باسم "${name}".
- ${langInstruction[lang] ?? langInstruction.ar}
- عند تصحيح خطأ لغوي، اذكر الصواب بلطف ثم اشرح باختصار.
- عند تقديم كلمة عربية، اكتبها مشكولة عند اللزوم مع ترجمتها بين قوسين إذا كانت لغة المحادثة غير العربية.
- استخدم Markdown البسيط (قوائم قصيرة، **تشديد**) لتحسين القراءة.
- إذا سُئلت عن شيء خارج نطاق تعلّم العربية، أعد التوجيه بلطف لتعلّم اللغة.
${pageLine ? `\nسياق الصفحة الحالية: ${pageLine}` : ""}`;
}
