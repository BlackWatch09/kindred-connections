// Client-side Gemini integration — no Lovable Cloud / Edge Functions required.
// The user's Gemini API key is stored in localStorage under GEMINI_API_KEY.
// Get a free key at: https://aistudio.google.com/apikey

const MODEL = "gemini-2.5-flash-lite";
const STORAGE_KEY = "GEMINI_API_KEY";

export function getGeminiKey(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(STORAGE_KEY);
}

export function setGeminiKey(key: string) {
  window.localStorage.setItem(STORAGE_KEY, key.trim());
}

export function clearGeminiKey() {
  window.localStorage.removeItem(STORAGE_KEY);
}

function requireKey(): string {
  const k = getGeminiKey();
  if (!k) throw new Error("MISSING_GEMINI_KEY");
  return k;
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

export async function streamStoryChat(
  body: Record<string, unknown>,
  onDelta: (chunk: string) => void,
): Promise<string> {
  const apiKey = requireKey();
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
  } = body as any;

  const systemInstruction = buildSystemPrompt({
    worldId,
    characterName,
    characterPersona,
    level,
    sceneSeed,
    priorScenarios,
    unknownWords,
  });

  const contents = (history as { role: string; content: string }[])
    .slice(-10)
    .map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

  if (isOpening) {
    contents.push({
      role: "user",
      parts: [{ text: "ابدأ المشهد الآن بجملة ترحيب قصيرة وطبيعية باللهجة الأردنية، لا تتجاوز جملتين." }],
    });
  } else {
    contents.push({ role: "user", parts: [{ text: String(userMessage ?? "") }] });
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:streamGenerateContent?alt=sse&key=${apiKey}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemInstruction }] },
      contents,
      generationConfig: { temperature: 0.9, topP: 0.95, maxOutputTokens: 512 },
    }),
  });

  if (!res.ok || !res.body) {
    const text = await res.text().catch(() => "");
    throw new Error(`Gemini error ${res.status}: ${text.slice(0, 200)}`);
  }

  const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
  let buffer = "";
  let full = "";
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += value;
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data:")) continue;
      const payload = trimmed.slice(5).trim();
      if (!payload || payload === "[DONE]") continue;
      try {
        const parsed = JSON.parse(payload);
        const text = parsed?.candidates?.[0]?.content?.parts
          ?.map((p: { text?: string }) => p.text ?? "")
          .join("") ?? "";
        if (text) {
          full += text;
          onDelta(text);
        }
      } catch { /* skip */ }
    }
  }
  return full;
}

export async function checkGrammar(text: string, level: string) {
  const apiKey = requireKey();
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

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.2, responseMimeType: "application/json" },
    }),
  });
  if (!res.ok) {
    const err = await res.text().catch(() => "");
    throw new Error(`grammar-check error ${res.status}: ${err.slice(0, 200)}`);
  }
  const data = await res.json();
  const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";
  try {
    return JSON.parse(raw) as {
      has_error: boolean;
      hint: string;
      corrected: string;
      new_words: { word: string; meaning: string }[];
    };
  } catch {
    return { has_error: false, hint: "", corrected: text, new_words: [] };
  }
}

export async function transcribeAudio(base64: string, mimeType: string) {
  const apiKey = requireKey();
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{
        role: "user",
        parts: [
          { text: "فرّغ الكلام المسموع إلى نص عربي فقط. أعد النص الخام بدون أي تعليق أو علامات ترقيم زائدة. إذا لم يوجد كلام أعد نص فارغ." },
          { inlineData: { mimeType, data: base64 } },
        ],
      }],
      generationConfig: { temperature: 0.1, maxOutputTokens: 256 },
    }),
  });
  if (!res.ok) {
    const err = await res.text().catch(() => "");
    throw new Error(`voice-transcribe error ${res.status}: ${err.slice(0, 200)}`);
  }
  const data = await res.json();
  const text = (data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "").trim();
  return { text } as { text: string };
}
