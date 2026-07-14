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
export interface StoryQuestion {
  question: string;
  options: string[];
  correct_index: number;
  explanation?: string;
}
export interface StoryResult {
  title: string;
  story: string;
  vocab: { word: string; meaning: string }[];
  questions: StoryQuestion[];
}
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
  "questions": [
    {
      "question": "سؤال فهم قصير عن القصة",
      "options": ["خيار 1","خيار 2","خيار 3","خيار 4"],
      "correct_index": 0,
      "explanation": "شرح قصير للإجابة الصحيحة"
    }
  ]
}
- vocab: 4-8 كلمات.
- questions: 3-5 أسئلة اختيار من متعدد، كل سؤال بأربعة خيارات مختلفة (بدون تكرار) وإجابة واحدة صحيحة فقط.
- correct_index رقم من 0 إلى 3 يشير إلى موقع الإجابة الصحيحة داخل options.
- اجعل الأسئلة تختبر الفهم الحقيقي للقصة (شخصيات، أحداث، معانٍ) لا معلومات عامة.`;
  const r = await generateJson<StoryResult>([{ text: prompt }], MODEL, 0.9);
  const questions: StoryQuestion[] = Array.isArray(r?.questions)
    ? (r.questions as any[])
        .map((q) => ({
          question: String(q?.question ?? ""),
          options: Array.isArray(q?.options) ? q.options.map(String).slice(0, 4) : [],
          correct_index: Math.max(0, Math.min(3, Number(q?.correct_index ?? 0))),
          explanation: q?.explanation ? String(q.explanation) : "",
        }))
        .filter((q) => q.question && q.options.length >= 2)
    : [];
  return {
    title: r?.title || "",
    story: r?.story || (r as any)?._raw || "",
    vocab: Array.isArray(r?.vocab) ? r.vocab : [],
    questions,
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

// ---------- Daily Challenge ----------
export interface DailyTask {
  kind: "mcq" | "fill" | "translate";
  prompt: string;      // instruction / question
  context?: string;    // sentence with ____ or extra info
  options?: string[];  // for mcq
  correct: string;     // canonical correct answer (option text or exact string)
  explanation?: string;
}
export interface DailyChallenge {
  title: string;
  intro: string;
  tasks: DailyTask[];
}
export async function generateDailyChallenge(level: string, seed: string): Promise<DailyChallenge> {
  const prompt = `أنت مصمّم تمارين لغة عربية لطالب مستواه (${level}).
اليوم مرجعي: ${seed}. اجعل التمارين متنوعة ومتوسطة الصعوبة وممتعة، وركّز على الاستخدام اليومي (سفر، طعام، عمل، أصدقاء).

أعد JSON فقط بهذا الشكل:
{
  "title": "عنوان قصير للتحدي",
  "intro": "جملة تحفيزية قصيرة",
  "tasks": [
    {
      "kind": "mcq",
      "prompt": "سؤال فهم مفرد",
      "options": ["خيار 1","خيار 2","خيار 3","خيار 4"],
      "correct": "الخيار الصحيح كنص كامل مطابق لأحد options",
      "explanation": "شرح قصير"
    },
    {
      "kind": "fill",
      "prompt": "أكمل الفراغ بالكلمة المناسبة",
      "context": "جملة بها فراغ ____ يجب ملؤه",
      "options": ["كلمة 1","كلمة 2","كلمة 3","كلمة 4"],
      "correct": "الكلمة الصحيحة كنص مطابق لأحد options",
      "explanation": "شرح"
    },
    {
      "kind": "translate",
      "prompt": "ترجم الجملة إلى العربية",
      "context": "The English sentence to translate.",
      "correct": "الترجمة العربية النموذجية المشكّلة",
      "explanation": "ملاحظة عن التركيب"
    }
  ]
}

الشروط:
- 4 مهام بالضبط (يمكنك تكرار الأنواع بترتيب مختلف).
- شكّل الكلمات العربية بالحركات الكاملة.
- لكل mcq و fill: أربعة خيارات مختلفة وواحدة صحيحة فقط، و correct يجب أن يطابق أحدها حرفياً.
- لـ translate: correct هي إجابة نموذجية واحدة (نقبل مطابقة تقريبية).`;
  const r = await generateJson<DailyChallenge>([{ text: prompt }], MODEL, 0.7);
  const tasks: DailyTask[] = Array.isArray(r?.tasks)
    ? (r.tasks as any[]).map((t) => ({
        kind: (["mcq", "fill", "translate"].includes(t?.kind) ? t.kind : "mcq") as DailyTask["kind"],
        prompt: String(t?.prompt || ""),
        context: t?.context ? String(t.context) : undefined,
        options: Array.isArray(t?.options) ? t.options.map(String).slice(0, 4) : undefined,
        correct: String(t?.correct || ""),
        explanation: t?.explanation ? String(t.explanation) : "",
      })).filter((t) => t.prompt && t.correct)
    : [];
  return {
    title: r?.title || "تحدّي اليوم",
    intro: r?.intro || "",
    tasks,
  };
}

// ---------- Smart Flashcards ----------
export interface Flashcard {
  word: string;           // Arabic word (with tashkeel)
  translation: string;    // meaning in target language
  example: string;        // Arabic example sentence (with tashkeel)
  example_translation: string;
  root?: string;
  pos?: string;           // part of speech
}
export interface FlashcardDeck {
  title: string;
  cards: Flashcard[];
}
export async function generateFlashcards(
  topic: string,
  level: string,
  count: number,
  target_lang: "en" | "tr" | "ar",
): Promise<FlashcardDeck> {
  const langName = target_lang === "tr" ? "Turkish" : target_lang === "ar" ? "عربي مبسّط" : "English";
  const prompt = `أنت مصمّم بطاقات تعليمية للغة العربية. أنشئ مجموعة بطاقات مفردات للطالب.

الموضوع/الدرس: ${topic || "مفردات عامة يومية"}
المستوى: ${level}
لغة الترجمة: ${langName}
عدد البطاقات: ${count}

أعد JSON فقط:
{
  "title": "عنوان قصير للمجموعة",
  "cards": [
    {
      "word": "الكلمة العربية مشكّلة",
      "translation": "الترجمة إلى ${langName}",
      "example": "جملة مثالية قصيرة تستخدم الكلمة، مشكّلة بالكامل",
      "example_translation": "ترجمة الجملة إلى ${langName}",
      "root": "الجذر بدون تشكيل أو نص فارغ",
      "pos": "اسم|فعل|صفة|ظرف|حرف"
    }
  ]
}
- اجعل الكلمات متنوعة ومناسبة للمستوى (بدون تكرار).
- شكّل جميع الكلمات والجمل العربية بالحركات الكاملة.
- اجعل الأمثلة مفيدة وواقعية.`;
  const r = await generateJson<FlashcardDeck>([{ text: prompt }], MODEL, 0.7);
  const cards: Flashcard[] = Array.isArray(r?.cards)
    ? (r.cards as any[]).map((c) => ({
        word: String(c?.word || ""),
        translation: String(c?.translation || ""),
        example: String(c?.example || ""),
        example_translation: String(c?.example_translation || ""),
        root: c?.root ? String(c.root) : "",
        pos: c?.pos ? String(c.pos) : "",
      })).filter((c) => c.word && c.translation)
    : [];
  return { title: r?.title || topic || "بطاقات مفردات", cards };
}

// ---------- Voice Interview ----------
export interface InterviewPlan {
  title: string;
  intro: string;      // spoken by AI to greet the candidate
  questions: string[]; // 4-5 spoken questions in Arabic (with tashkeel)
}
export async function generateInterviewPlan(level: string, topic: string): Promise<InterviewPlan> {
  const prompt = `أنت مُحاور لغة عربية ودود اسمك "سِراج". صمّم مقابلة صوتية قصيرة لطالب مستواه (${level}) حول الموضوع: "${topic || "التعارف والحياة اليومية"}".
اجعل الأسئلة مفتوحة، تشجّع الطالب على التحدث بجمل كاملة، متدرّجة من السهل إلى الأصعب.

أعد JSON فقط:
{
  "title": "عنوان قصير للمقابلة",
  "intro": "ترحيب قصير مشكّل بالكامل يُقرأ صوتياً (سطر إلى سطرين)",
  "questions": ["سؤال 1 مشكّل", "سؤال 2 مشكّل", "سؤال 3 مشكّل", "سؤال 4 مشكّل"]
}
- 4 أسئلة بالضبط.
- شكّل جميع الكلمات العربية بالحركات الكاملة (تشكيل كامل) لأنها ستُقرأ صوتياً.
- استخدم فصحى مبسّطة وواضحة.`;
  const r = await generateJson<InterviewPlan>([{ text: prompt }], MODEL, 0.6);
  const questions = Array.isArray(r?.questions)
    ? r.questions.map(String).filter(Boolean).slice(0, 5)
    : [];
  return {
    title: r?.title || "مقابلة صوتية",
    intro: r?.intro || "أَهْلاً بِكَ فِي الْمُقابَلَةِ الصَّوْتِيَّة. سَنَبْدَأُ بِسُؤالٍ بَسِيط.",
    questions: questions.length ? questions : [
      "عَرِّفْ بِنَفْسِكَ مِنْ فَضْلِكَ.",
      "ما هِوايَتُكَ الْمُفَضَّلَة؟ وَلِماذا؟",
      "صِفْ لِي يَوْمَكَ الْمُعْتاد.",
      "ما هُوَ هَدَفُكَ مِنْ تَعَلُّمِ اللُّغَةِ الْعَرَبِيَّة؟",
    ],
  };
}

export interface InterviewTurn { question: string; answer: string; }
export interface InterviewFeedback {
  overall_score: number;         // 0-100
  fluency: number;
  pronunciation: number;
  vocabulary: number;
  grammar: number;
  strengths: string[];
  improvements: string[];
  suggested_phrases: { ar: string; note: string }[];
  summary: string;
}
export async function scoreInterview(level: string, topic: string, turns: InterviewTurn[]): Promise<InterviewFeedback> {
  const transcript = turns
    .map((t, i) => `س${i + 1}: ${t.question}\nج${i + 1}: ${t.answer || "(لم يجب)"}`)
    .join("\n\n");
  const prompt = `أنت مُقيّم لغة عربية خبير. قيّم أداء الطالب في المقابلة التالية.
المستوى: ${level}
الموضوع: ${topic || "عام"}

نص المقابلة (كُتب من تفريغ صوتي):
"""
${transcript}
"""

أعد JSON فقط:
{
  "overall_score": 0-100,
  "fluency": 0-100,
  "pronunciation": 0-100,
  "vocabulary": 0-100,
  "grammar": 0-100,
  "strengths": ["نقطة قوة 1","..."],
  "improvements": ["اقتراح تحسين 1","..."],
  "suggested_phrases": [{"ar":"جملة مشكّلة بديلة أفضل","note":"لماذا هي أفضل"}],
  "summary": "ملخّص ودود من سطرين بالعربية"
}
- 2-4 عناصر في strengths و improvements و suggested_phrases.
- شكّل الجمل العربية في suggested_phrases بالكامل.
- كن واقعياً: إن كانت الإجابات فارغة اجعل الدرجات منخفضة.`;
  const r = await generateJson<InterviewFeedback>([{ text: prompt }], MODEL, 0.3);
  const clamp = (n: any) => Math.max(0, Math.min(100, Math.round(Number(n) || 0)));
  return {
    overall_score: clamp(r?.overall_score),
    fluency: clamp(r?.fluency),
    pronunciation: clamp(r?.pronunciation),
    vocabulary: clamp(r?.vocabulary),
    grammar: clamp(r?.grammar),
    strengths: Array.isArray(r?.strengths) ? r.strengths.map(String) : [],
    improvements: Array.isArray(r?.improvements) ? r.improvements.map(String) : [],
    suggested_phrases: Array.isArray(r?.suggested_phrases)
      ? (r.suggested_phrases as any[]).map((p) => ({ ar: String(p?.ar || ""), note: String(p?.note || "") })).filter((p) => p.ar)
      : [],
    summary: r?.summary || "",
  };
}

// ---------- Smart AI Scanner (OCR) ----------
export interface ScanResult {
  language: "ar" | "en" | "mixed";
  title?: string;
  text: string;
  summary?: string;
  keywords?: string[];
  word_count: number;
}

export async function scanImageText(image_base64: string, mime_type: string): Promise<ScanResult> {
  // Step 1: high-fidelity OCR — return raw text only, preserve line breaks
  const ocrPrompt = `أنت ماسح ضوئي ذكي متخصّص في استخراج النصوص العربية والإنجليزية من الصور بأعلى دقّة ممكنة.
اقرأ الصورة المرفقة واستخرج **كل** النص المرئي فيها حرفياً وبدون أي تعديل، تلخيص، أو ترجمة.

قواعد صارمة:
- حافظ على أسطر النص وترتيبها كما تظهر في الصورة.
- شكّل الكلمات العربية بالتشكيل إن ظهر واضحاً، وإلا اتركها بدون تشكيل.
- لا تُضف علامات ترقيم غير موجودة، ولا تُصحّح أخطاء الكاتب.
- إن كان جزء غير واضح، ضع مكانه [...] بدل التخمين.
- لا تُخرج أي شرح أو مقدمة، فقط النص المستخرج بصيغة نصّ عادي.`;

  const key = getGeminiKey();
  if (!key) throw new Error("مفتاح Gemini غير متوفر.");
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [
        { text: ocrPrompt },
        { inlineData: { mimeType: mime_type, data: image_base64 } },
      ]}],
      generationConfig: { temperature: 0.05, maxOutputTokens: 4096 },
    }),
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    if (res.status === 429) throw new Error("تم تجاوز حد الطلبات، حاول بعد قليل.");
    if (res.status === 402 || res.status === 403) throw new Error("انتهى رصيد Gemini أو المفتاح غير مصرّح.");
    throw new Error(`فشل المسح (${res.status}): ${txt.slice(0, 200)}`);
  }
  const data = await res.json();
  const rawText: string = (data?.candidates?.[0]?.content?.parts?.[0]?.text || "").trim();

  if (!rawText) {
    return { language: "ar", text: "", word_count: 0, summary: "لم يُعثر على نصوص واضحة في الصورة." };
  }

  // Step 2: enrich with metadata (title, summary, keywords) — best effort
  try {
    const metaPrompt = `النص التالي مستخرج من ورقة ممسوحة. أعطني JSON فقط بالحقول:
{
  "language": "ar" أو "en" أو "mixed",
  "title": "عنوان قصير مقترح (٢-٦ كلمات) بلغة النص، أو '' إذا لم يكن مناسباً",
  "summary": "ملخّص من سطرين بلغة النص",
  "keywords": ["٣-٦ كلمات مفتاحية بلغة النص"]
}
النص:
"""
${rawText.slice(0, 3500)}
"""`;
    const meta = await generateJson<any>([{ text: metaPrompt }], MODEL, 0.2);
    return {
      language: (meta?.language === "en" || meta?.language === "mixed") ? meta.language : "ar",
      title: typeof meta?.title === "string" ? meta.title : "",
      text: rawText,
      summary: typeof meta?.summary === "string" ? meta.summary : "",
      keywords: Array.isArray(meta?.keywords) ? meta.keywords.map(String).slice(0, 6) : [],
      word_count: rawText.split(/\s+/).filter(Boolean).length,
    };
  } catch {
    return { language: "ar", text: rawText, word_count: rawText.split(/\s+/).filter(Boolean).length };
  }
}
