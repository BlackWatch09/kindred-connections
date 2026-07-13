// Story chat — streams a heritage character's reply via Gemini 2.5 Flash.
// Deploy: supabase functions deploy story-chat --no-verify-jwt
// Secret needed: supabase secrets set GEMINI_API_KEY=xxxx

import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const MODEL = "gemini-2.5-flash";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return json({ error: "Unauthorized" }, 401);
    }

    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) return json({ error: "GEMINI_API_KEY not set" }, 500);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: claims } = await supabase.auth.getClaims(authHeader.replace("Bearer ", ""));
    if (!claims?.claims) return json({ error: "Unauthorized" }, 401);
    const userId = claims.claims.sub;

    const body = await req.json();
    const {
      worldId,
      characterName,
      characterPersona,
      level,
      sceneSeed,
      priorScenarios = [],
      unknownWords = [],
      history = [],
      userMessage,
      isOpening = false,
    } = body ?? {};

    if (!worldId || !characterName || (!userMessage && !isOpening)) {
      return json({ error: "Missing fields" }, 400);
    }

    const systemInstruction = buildSystemPrompt({
      worldId,
      characterName,
      characterPersona,
      level,
      sceneSeed,
      priorScenarios,
      unknownWords,
    });

    // Build Gemini contents from last 10 messages
    const contents = history.slice(-10).map((m: { role: string; content: string }) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));
    if (isOpening) {
      contents.push({
        role: "user",
        parts: [{ text: "ابدأ المشهد الآن بجملة ترحيب قصيرة وطبيعية باللهجة الأردنية، لا تتجاوز جملتين." }],
      });
    } else {
      contents.push({ role: "user", parts: [{ text: userMessage }] });
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:streamGenerateContent?alt=sse&key=${apiKey}`;

    const geminiRes = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemInstruction }] },
        contents,
        generationConfig: { temperature: 0.9, topP: 0.95, maxOutputTokens: 512 },
      }),
    });

    if (!geminiRes.ok || !geminiRes.body) {
      const errText = await geminiRes.text().catch(() => "");
      console.error("Gemini error:", geminiRes.status, errText);
      return json({ error: "Gemini upstream error", status: geminiRes.status, details: errText }, geminiRes.status);
    }

    // Transform Gemini SSE into simple text deltas SSE
    const stream = new ReadableStream({
      async start(controller) {
        const reader = geminiRes.body!.getReader();
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
              const trimmed = line.trim();
              if (!trimmed.startsWith("data:")) continue;
              const payload = trimmed.slice(5).trim();
              if (!payload || payload === "[DONE]") continue;
              try {
                const parsed = JSON.parse(payload);
                const text = parsed?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text ?? "").join("") ?? "";
                if (text) {
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ delta: text })}\n\n`));
                }
              } catch { /* skip parse errors */ }
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

function buildSystemPrompt(o: {
  worldId: string;
  characterName: string;
  characterPersona: string;
  level: string;
  sceneSeed?: { weather?: string; mood?: string; timeOfDay?: string; sideEvent?: string };
  priorScenarios: string[];
  unknownWords: string[];
}) {
  const seed = o.sceneSeed ?? {};
  const priors = o.priorScenarios.length ? o.priorScenarios.slice(-8).join(" | ") : "لا يوجد";
  const unknown = o.unknownWords.length ? o.unknownWords.slice(0, 15).join("، ") : "—";
  const levelGuide: Record<string, string> = {
    beginner: "جمل قصيرة جداً (٤-٧ كلمات)، مفردات يومية بسيطة، تكرار لطيف.",
    intermediate: "جمل متوسطة، مفردات أوسع، اسأل أسئلة مفتوحة أحياناً.",
    advanced: "جمل غنية، تعابير شعبية وأمثال أردنية، حوار طبيعي كامل.",
  };
  return `أنت "${o.characterName}"، شخصية أردنية أصيلة في عالم "${o.worldId}".
شخصيتك: ${o.characterPersona}

قواعد صارمة:
- تحدث دائماً بالعربية العامية الأردنية الدافئة (ليست فصحى جامدة).
- لا تكشف أبداً أنك ذكاء اصطناعي أو نموذج لغوي. أنت إنسان حقيقي في هذا المكان.
- كل رد قصير طبيعي كأنه محادثة (رد واحد، ليس قائمة).
- ${levelGuide[o.level] ?? levelGuide.beginner}
- لا تكرر نفس السيناريو السابق. السيناريوهات السابقة لهذا المستخدم: ${priors}
- حاول بلطف استخدام كلمات جديدة على الطالب: ${unknown}
- إذا أخطأ الطالب، لا تصححه مباشرة، فقط أعد الجملة الصحيحة ضمن ردك الطبيعي.

تفاصيل هذا المشهد (اليوم فقط):
- الطقس: ${seed.weather ?? "معتدل"}
- الوقت: ${seed.timeOfDay ?? "الظهيرة"}
- مزاجك اليوم: ${seed.mood ?? "منبسط"}
- حدث جانبي: ${seed.sideEvent ?? "لا شيء مميز"}

اجعل كل جلسة فريدة تماماً بناءً على هذه التفاصيل.`;
}
