// Direct client-side Gemini calls for AI Hub tools.
// Uses the shared user Gemini key (see getGeminiKey) so we don't depend on edge functions.

import { getGeminiKey } from "@/features/story-world/lib/streamChat";

const MODEL = "gemini-2.5-flash-lite";
const AUDIO_MODEL = "gemini-2.5-flash";

type Part =
  | { text: string }
  | { inlineData: { mimeType: string; data: string } };

async function generateJson<T = any>(parts: Part[], model = MODEL, temperature = 0.4): Promise<T> {
  const key = getGeminiKey();
  if (!key) throw new Error("مفتاح Gemini غير متوفر.");
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts }],
      generationConfig: { temperature, responseMimeType: "application/json", maxOutputTokens: 2048 },
    }),
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    if (res.status === 429) throw new Error("تم تجاوز حد الطلبات، حاول بعد قليل.");
    if (res.status === 402 || res.status === 403) throw new Error("انتهى رصيد Gemini أو المفتاح غير مصرّح.");
    throw new Error(`فشل الطلب (${res.status}): ${txt.slice(0, 200)}`);
  }
  const data = await res.json();
  const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";
  try { return JSON.parse(raw) as T; } catch { return { _raw: raw } as any; }
}

// ---------- Pronunciation Coach ----------
export interface PronLetter { char: string; ok: boolean; note?: string; correct_hint?: string; }
export interface PronResult { transcription: string; target: string; overall_score: number; feedback: string; letters: PronLetter[]; }

export async function pronunciationCoach(audio_base64: string, mime_type: string, target?: string): Promise<PronResult> {
  const prompt = `أنت مُصحّح نطق عربي خبير في مخارج الحروف (خصوصاً التفريق بين س/ص، ذ/ز/ظ، ت/ط، ض/د، ح/هـ، ق/ك، ع/أ).
${target ? `الجملة المطلوب نطقها: "${target}"` : "لم يُحدّد نص مرجعي؛ اعتمد على ما نطقه الطالب."}

استمع للتسجيل المرفق ثم أعد JSON فقط بالتنسيق التالي (بدون أي نص خارجه):
{
  "transcription": "ما نطقه الطالب فعلياً بالعربية",
  "target": "النص الصحيح المتوقع",
  "overall_score": رقم من 0 إلى 100,
  "feedback": "ملاحظة ودودة قصيرة بالعربية (سطر أو سطران)",
  "letters": [
    {"char":"الحرف","ok":true/false,"note":"وصف قصير للخطأ","correct_hint":"طريقة النطق الصحيح باختصار"}
  ]
}
اذكر في "letters" فقط الحروف التي تستحق ملاحظة (بحد أقصى 8).`;
  const result = await generateJson<PronResult>(
    [{ text: prompt }, { inlineData: { mimeType: mime_type, data: audio_base64 } }],
    AUDIO_MODEL,
    0.2,
  );
  return {
    transcription: result?.transcription || "",
    target: result?.target || target || "",
    overall_score: Number(result?.overall_score ?? 0),
    feedback: result?.feedback || "",
    letters: Array.isArray(result?.letters) ? result.letters : [],
  };
}

// ---------- Story generator ----------
export interface StoryResult { title: string; story: string; vocab: { word: string; meaning: string }[]; questions: string[]; }
export async function generateStory(level: string, interests: string, length: "short" | "medium"): Promise<StoryResult> {
  const levelMap: Record<string, string> = {
    beginner: "مبتدئ — جمل قصيرة جداً ومفردات شائعة، 5-8 جمل.",
    intermediate: "متوسط — 8-14 جملة، مفردات متنوعة وتراكيب متوسطة.",
    advanced: "متقدم — 14-20 جملة، مفردات غنية وأسلوب أدبي.",
  };
  const prompt = `اكتب قصة عربية ${length === "medium" ? "متوسطة الطول" : "قصيرة"} لطالب عربية غير ناطق بها.
المستوى: ${levelMap[level] ?? levelMap.beginner}
اهتمامات الطالب: ${interests || "عامة"}

الشروط:
- شكّل جميع الكلمات بالحركات الكاملة (تشكيل).
- استخدم أفعالاً واضحة وحواراً بسيطاً.
- اجعل القصة إيجابية.

أعد JSON فقط بالشكل التالي:
{
  "title": "عنوان القصة مشكّل",
  "story": "نص القصة كامل مع التشكيل، مقسّم بفواصل أسطر \\n\\n بين الفقرات",
  "vocab": [{"word":"كلمة","meaning":"معنى مبسّط"}],
  "questions": ["سؤال فهم قصير", "سؤال آخر"]
}
vocab 4-8 كلمات، questions 2-3 أسئلة.`;
  const r = await generateJson<StoryResult>([{ text: prompt }], MODEL, 0.9);
  return {
    title: r?.title || "",
    story: r?.story || (r as any)?._raw || "",
    vocab: Array.isArray(r?.vocab) ? r.vocab : [],
    questions: Array.isArray(r?.questions) ? r.questions : [],
  };
}

// ---------- Writing assistant ----------
export interface WritingIssue { original: string; correction: string; type: string; explanation: string; }
export interface WritingResult { corrected: string; summary: string; issues: WritingIssue[]; }
export async function analyzeWriting(text: string, level: string): Promise<WritingResult> {
  const prompt = `أنت معلم لغة عربية دقيق ولطيف. حلّل النص التالي لطالب مستواه (${level}) وصحّح الأخطاء النحوية والإملائية والصرفية.

النص:
"""${text}"""

أعد JSON فقط:
{
  "corrected": "النص الكامل بعد التصحيح مع التشكيل الجزئي للكلمات المهمة",
  "summary": "ملخص ودود من سطر أو سطرين",
  "issues": [
    {
      "original": "الجزء الخاطئ",
      "correction": "الصياغة الصحيحة",
      "type": "نحو|إملاء|صرف|أسلوب",
      "explanation": "شرح مبسّط للسبب"
    }
  ]
}
اذكر الأخطاء الحقيقية فقط (بحد أقصى 8). إذا كان النص سليماً اجعل issues مصفوفة فارغة.`;
  const r = await generateJson<WritingResult>([{ text: prompt }], MODEL, 0.3);
  return {
    corrected: r?.corrected || text,
    summary: r?.summary || "",
    issues: Array.isArray(r?.issues) ? r.issues : [],
  };
}

// ---------- Contextual translator ----------
export interface TranslateResult {
  focus: string; translation: string; contextual_meaning: string;
  root: string; part_of_speech: string;
  examples: { ar: string; translation: string }[]; notes: string;
}
export async function contextTranslate(sentence: string, word: string, target_lang: "en" | "tr" | "ar"): Promise<TranslateResult> {
  const langName = target_lang === "tr" ? "Turkish" : target_lang === "ar" ? "عربي مُبسّط" : "English";
  const prompt = `أنت مساعد لغوي للعربية. حلّل الكلمة/العبارة داخل الجملة *في سياقها* — ليس ترجمة حرفية.

الجملة: "${sentence}"
الكلمة/العبارة المستهدفة: ${word ? `"${word}"` : "(اختر أهم كلمة بنفسك)"}
لغة الترجمة: ${langName}

أعد JSON فقط:
{
  "focus": "الكلمة أو العبارة المستهدفة",
  "translation": "ترجمة الجملة كاملة إلى ${langName}",
  "contextual_meaning": "معنى الكلمة في هذا السياق (بالعربية)",
  "root": "الجذر (بدون تشكيل) أو نص فارغ",
  "part_of_speech": "اسم|فعل|حرف|صفة|ظرف",
  "examples": [{"ar":"جملة مشكّلة تستخدم نفس الكلمة/الجذر","translation":"الترجمة إلى ${langName}"}],
  "notes": "ملاحظة قصيرة عن الاستخدام"
}
2-3 أمثلة.`;
  const r = await generateJson<TranslateResult>([{ text: prompt }], MODEL, 0.3);
  return {
    focus: r?.focus || word || "",
    translation: r?.translation || "",
    contextual_meaning: r?.contextual_meaning || "",
    root: r?.root || "",
    part_of_speech: r?.part_of_speech || "",
    examples: Array.isArray(r?.examples) ? r.examples : [],
    notes: r?.notes || "",
  };
}
