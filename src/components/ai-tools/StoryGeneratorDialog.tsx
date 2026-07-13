import { useMemo, useState } from "react";
import { BookOpen, Loader2, Sparkles, Check, X, Trophy, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";
import ToolShell from "./ToolShell";
import { generateStory, type StoryResult as Story, type StoryQuestion } from "@/lib/aiFn";
import { addPoints } from "@/lib/points";
import { useAuth } from "@/hooks/useAuth";

type Level = "beginner" | "intermediate" | "advanced";

const LEVELS: { id: Level; label: string }[] = [
  { id: "beginner", label: "مبتدئ" },
  { id: "intermediate", label: "متوسط" },
  { id: "advanced", label: "متقدم" },
];

const INTEREST_CHIPS = ["مغامرات", "رياضة", "طبخ", "فضاء", "حيوانات", "تاريخ", "صداقة", "بحر"];
const POINTS_PER_CORRECT = 10;

export default function StoryGeneratorDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { user } = useAuth();
  const [level, setLevel] = useState<Level>("beginner");
  const [interests, setInterests] = useState("");
  const [length, setLength] = useState<"short" | "medium">("short");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [story, setStory] = useState<Story | null>(null);

  // quiz state
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [awardedPoints, setAwardedPoints] = useState<number | null>(null);

  const resetQuiz = () => {
    setAnswers({});
    setSubmitted(false);
    setAwardedPoints(null);
  };

  const generate = async () => {
    setLoading(true); setError(null); setStory(null); resetQuiz();
    try {
      const data = await generateStory(level, interests, length);
      setStory(data);
    } catch (e: any) { setError(e.message || "تعذّر توليد القصة."); }
    finally { setLoading(false); }
  };

  const questions: StoryQuestion[] = story?.questions ?? [];
  const allAnswered = questions.length > 0 && questions.every((_, i) => answers[i] !== undefined);
  const correctCount = useMemo(
    () => questions.reduce((n, q, i) => (answers[i] === q.correct_index ? n + 1 : n), 0),
    [questions, answers],
  );

  const submitQuiz = () => {
    if (!allAnswered || submitted) return;
    const earned = correctCount * POINTS_PER_CORRECT;
    setSubmitted(true);
    setAwardedPoints(earned);
    if (earned > 0) {
      addPoints(user?.id, {
        tool: "story-quiz",
        label: `اختبار قصة: ${story?.title || ""}`.trim(),
        points: earned,
        meta: { level, length, total: questions.length, correct: correctCount },
      });
    }
  };

  return (
    <ToolShell open={open} onClose={onClose} icon={<BookOpen className="w-5 h-5" />}
      title="مولّد القصص التفاعلية" subtitle="قصة مشكّلة + اختبار فهم وكسب نقاط">
      <div className="space-y-5">
        <div>
          <label className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">المستوى</label>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {LEVELS.map((l) => (
              <button key={l.id} onClick={() => setLevel(l.id)}
                className={`py-2 text-sm font-semibold border transition ${level === l.id ? "border-accent bg-accent text-accent-foreground" : "border-border hover:border-accent"}`}>
                {l.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">اهتماماتك</label>
          <input value={interests} onChange={(e) => setInterests(e.target.value)}
            dir="rtl" placeholder="مثال: كرة القدم والفضاء"
            className="mt-2 w-full border border-border bg-background p-3 focus:outline-none focus:border-accent" />
          <div className="mt-2 flex flex-wrap gap-2">
            {INTEREST_CHIPS.map((c) => (
              <button key={c} type="button" onClick={() => setInterests((s) => (s ? `${s}، ${c}` : c))}
                className="text-xs px-3 py-1.5 border border-border hover:border-accent hover:bg-accent/5">
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">الطول</label>
          <div className="flex gap-2">
            {(["short", "medium"] as const).map((l) => (
              <button key={l} onClick={() => setLength(l)}
                className={`px-3 py-1.5 text-sm border ${length === l ? "border-accent bg-accent/10 text-accent" : "border-border"}`}>
                {l === "short" ? "قصيرة" : "متوسطة"}
              </button>
            ))}
          </div>
        </div>

        <button onClick={generate} disabled={loading}
          className="w-full py-3 bg-primary text-primary-foreground font-semibold hover:bg-accent hover:text-accent-foreground transition flex items-center justify-center gap-2 disabled:opacity-60">
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> يخُطّ سِراج قصتك…</> : <><Sparkles className="w-4 h-4" /> توليد قصة</>}
        </button>

        {error && <div className="border border-red-300 bg-red-50 text-red-700 p-3 text-sm">{error}</div>}

        {story && (
          <div className="space-y-4">
            <div className="border border-accent/40 bg-accent/5 p-5">
              <h4 className="font-display text-2xl md:text-3xl font-bold text-primary text-center mb-4" dir="rtl">{story.title}</h4>
              <p dir="rtl" className="font-display text-lg leading-loose text-foreground whitespace-pre-line">{story.story}</p>
            </div>

            {story.vocab?.length > 0 && (
              <div>
                <p className="eyebrow">— مفردات للحفظ —</p>
                <div className="mt-2 grid sm:grid-cols-2 gap-2">
                  {story.vocab.map((v, i) => (
                    <div key={i} className="border border-border p-3 flex justify-between items-center gap-3">
                      <span className="font-display text-lg text-accent">{v.word}</span>
                      <span className="text-sm text-muted-foreground text-right">{v.meaning}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {questions.length > 0 && (
              <div className="space-y-3" dir="rtl">
                <div className="flex items-center justify-between">
                  <p className="eyebrow">— اختبر فهمك —</p>
                  <span className="text-xs text-muted-foreground">
                    {questions.length} أسئلة · {POINTS_PER_CORRECT} نقاط لكل إجابة صحيحة
                  </span>
                </div>

                <ol className="space-y-4">
                  {questions.map((q, qi) => {
                    const chosen = answers[qi];
                    return (
                      <li key={qi} className="border border-border p-4 bg-card">
                        <p className="font-semibold text-foreground mb-3">
                          <span className="text-accent">{qi + 1}.</span> {q.question}
                        </p>
                        <div className="grid gap-2">
                          {q.options.map((opt, oi) => {
                            const isChosen = chosen === oi;
                            const isCorrect = oi === q.correct_index;
                            let cls = "border-border hover:border-accent";
                            if (submitted) {
                              if (isCorrect) cls = "border-emerald-500 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300";
                              else if (isChosen) cls = "border-red-400 bg-red-500/10 text-red-800 dark:text-red-300";
                              else cls = "border-border opacity-70";
                            } else if (isChosen) {
                              cls = "border-accent bg-accent/10";
                            }
                            return (
                              <button
                                key={oi}
                                type="button"
                                disabled={submitted}
                                onClick={() => setAnswers((a) => ({ ...a, [qi]: oi }))}
                                className={`text-right p-3 border transition text-sm flex items-center justify-between gap-3 ${cls} disabled:cursor-default`}
                              >
                                <span className="flex-1">{opt}</span>
                                {submitted && isCorrect && <Check className="w-4 h-4 shrink-0 text-emerald-600" />}
                                {submitted && isChosen && !isCorrect && <X className="w-4 h-4 shrink-0 text-red-600" />}
                              </button>
                            );
                          })}
                        </div>
                        {submitted && q.explanation && (
                          <p className="mt-3 text-xs text-muted-foreground border-r-2 border-accent/40 pr-2">
                            {q.explanation}
                          </p>
                        )}
                      </li>
                    );
                  })}
                </ol>

                {!submitted ? (
                  <button
                    onClick={submitQuiz}
                    disabled={!allAnswered}
                    className="w-full py-3 bg-accent text-accent-foreground font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Trophy className="w-4 h-4" />
                    {allAnswered ? "احتساب النتيجة" : `أجب عن كل الأسئلة (${Object.keys(answers).length}/${questions.length})`}
                  </button>
                ) : (
                  <div className="border border-accent/50 bg-accent/5 p-4 text-center space-y-2">
                    <div className="inline-flex items-center gap-2 text-accent font-bold text-lg">
                      <Trophy className="w-5 h-5" />
                      {correctCount} / {questions.length} إجابات صحيحة
                    </div>
                    <p className="text-sm text-muted-foreground">
                      كسبت <span className="font-bold text-accent">{awardedPoints ?? 0}</span> نقطة —
                      محفوظة في لوحة تحكمك.
                    </p>
                    <button
                      onClick={resetQuiz}
                      className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 border border-border text-xs hover:border-accent"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> إعادة المحاولة (بدون نقاط إضافية)
                    </button>
                  </div>
                )}
              </div>
            )}

            <div className="pt-2 flex flex-wrap gap-3">
              <button onClick={generate} className="px-4 py-2 border border-border hover:border-accent text-sm font-semibold">قصة جديدة</button>
              <Link to="/dashboard" onClick={onClose} className="px-4 py-2 border border-accent text-accent text-sm font-semibold">
                لوحة التحكم
              </Link>
              <Link to="/story" onClick={onClose} className="px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold">
                دخول عالم القصص التفاعلي ←
              </Link>
            </div>
          </div>
        )}
      </div>
    </ToolShell>
  );
}
