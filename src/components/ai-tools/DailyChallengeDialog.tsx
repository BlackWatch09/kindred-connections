import { useEffect, useMemo, useState } from "react";
import { Calendar, Loader2, Check, X, Trophy, RotateCcw, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import ToolShell from "./ToolShell";
import { generateDailyChallenge, type DailyChallenge, type DailyTask } from "@/lib/aiFn";
import { addPoints } from "@/lib/points";
import { useAuth } from "@/hooks/useAuth";

type Level = "beginner" | "intermediate" | "advanced";

const LEVELS: { id: Level; label: string }[] = [
  { id: "beginner", label: "مبتدئ" },
  { id: "intermediate", label: "متوسط" },
  { id: "advanced", label: "متقدم" },
];

const POINTS_PER_CORRECT = 15;
const CACHE_KEY = "siraj_daily_challenge";
const AWARD_KEY = "siraj_daily_awarded";

// Very loose Arabic normalization: strip tashkeel, tatweel, and non-letters for translate scoring.
function normalizeAr(s: string) {
  return s
    .replace(/[\u064B-\u0652\u0670\u0640]/g, "")
    .replace(/[أإآا]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim()
    .toLowerCase();
}
function similar(a: string, b: string) {
  const na = normalizeAr(a);
  const nb = normalizeAr(b);
  if (!na || !nb) return false;
  if (na === nb) return true;
  const aw = new Set(na.split(/\s+/));
  const bw = nb.split(/\s+/);
  const hit = bw.filter((w) => aw.has(w)).length;
  return hit / Math.max(bw.length, 1) >= 0.7;
}

const todaySeed = () => new Date().toISOString().slice(0, 10);

export default function DailyChallengeDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { user } = useAuth();
  const [level, setLevel] = useState<Level>("beginner");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [challenge, setChallenge] = useState<DailyChallenge | null>(null);

  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [awarded, setAwarded] = useState<number | null>(null);

  const resetAll = () => {
    setAnswers({});
    setSubmitted(false);
    setAwarded(null);
  };

  // Load cached challenge for today on open
  useEffect(() => {
    if (!open) return;
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.date === todaySeed() && parsed?.level === level && parsed?.data) {
          setChallenge(parsed.data);
        }
      }
    } catch { /* ignore */ }
  }, [open, level]);

  const generate = async () => {
    setLoading(true); setError(null); setChallenge(null); resetAll();
    try {
      const data = await generateDailyChallenge(level, todaySeed());
      setChallenge(data);
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify({ date: todaySeed(), level, data }));
      } catch { /* ignore */ }
    } catch (e: any) {
      setError(e.message || "تعذّر توليد تحدّي اليوم.");
    } finally {
      setLoading(false);
    }
  };

  const tasks: DailyTask[] = challenge?.tasks ?? [];
  const allAnswered = tasks.length > 0 && tasks.every((_, i) => (answers[i] ?? "").trim().length > 0);
  const correctness = useMemo(
    () => tasks.map((t, i) => {
      const a = (answers[i] ?? "").trim();
      if (!a) return false;
      if (t.kind === "translate") return similar(a, t.correct);
      return a === t.correct;
    }),
    [tasks, answers],
  );
  const correctCount = correctness.filter(Boolean).length;

  const submit = () => {
    if (!allAnswered || submitted) return;
    setSubmitted(true);
    const earned = correctCount * POINTS_PER_CORRECT;
    // Only award once per day
    let alreadyAwarded = false;
    try {
      alreadyAwarded = localStorage.getItem(AWARD_KEY) === todaySeed();
    } catch { /* ignore */ }
    const grant = alreadyAwarded ? 0 : earned;
    setAwarded(grant);
    if (grant > 0) {
      addPoints(user?.id, {
        tool: "daily-challenge",
        label: `تحدّي اليوم: ${challenge?.title || ""}`.trim(),
        points: grant,
        meta: { level, total: tasks.length, correct: correctCount, date: todaySeed() },
      });
      try { localStorage.setItem(AWARD_KEY, todaySeed()); } catch { /* ignore */ }
    }
  };

  return (
    <ToolShell
      open={open}
      onClose={onClose}
      icon={<Calendar className="w-5 h-5" />}
      title="تحدّي اليوم"
      subtitle="4 مهام يومية سريعة — اكسب نقاط كل يوم"
      size="xl"
    >
      <div className="space-y-5 font-arabic-clear" dir="rtl">
        {!challenge && !loading && (
          <>
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">اختر مستواك</label>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {LEVELS.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => setLevel(l.id)}
                    className={`py-2 text-sm font-semibold border transition ${level === l.id ? "border-accent bg-accent text-accent-foreground" : "border-border hover:border-accent"}`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="border border-border bg-secondary/40 p-4 text-sm text-muted-foreground leading-relaxed">
              كل يوم يحضّر لك سِراج تحدّياً جديداً من ٤ مهام (اختيارات، فراغات، ترجمة). أول محاولة صحيحة اليوم تمنحك النقاط —
              <span className="font-semibold text-accent"> {POINTS_PER_CORRECT} نقطة </span>
              لكل إجابة صحيحة.
            </div>

            <button
              onClick={generate}
              className="w-full py-3 bg-primary text-primary-foreground font-semibold hover:bg-accent hover:text-accent-foreground transition flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" /> ابدأ تحدّي اليوم
            </button>
          </>
        )}

        {loading && (
          <div className="flex items-center justify-center gap-2 text-muted-foreground py-8">
            <Loader2 className="w-4 h-4 animate-spin" /> يجهّز سِراج التحدّي…
          </div>
        )}

        {error && (
          <div className="border border-red-300 bg-red-50 text-red-700 p-3 text-sm">{error}</div>
        )}

        {challenge && (
          <div className="space-y-5">
            <div className="border border-accent/40 bg-accent/5 p-4">
              <h4 className="font-bold text-primary text-lg">{challenge.title}</h4>
              {challenge.intro && <p className="text-sm text-muted-foreground mt-1">{challenge.intro}</p>}
            </div>

            <ol className="space-y-4">
              {tasks.map((t, i) => {
                const chosen = answers[i] ?? "";
                const isCorrect = submitted && correctness[i];
                const isWrong = submitted && !correctness[i];
                return (
                  <li
                    key={i}
                    className={`border p-4 bg-card ${submitted ? (isCorrect ? "border-emerald-500/60" : "border-red-400/60") : "border-border"}`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <p className="font-semibold text-foreground">
                        <span className="text-accent">{i + 1}.</span> {t.prompt}
                      </p>
                      <span className="text-[10px] uppercase tracking-widest text-muted-foreground border border-border px-2 py-0.5">
                        {t.kind === "mcq" ? "اختيار" : t.kind === "fill" ? "فراغ" : "ترجمة"}
                      </span>
                    </div>

                    {t.context && (
                      <p
                        dir={t.kind === "translate" ? "ltr" : "rtl"}
                        className={`mb-3 p-3 bg-secondary/40 border border-border/60 text-sm leading-relaxed ${t.kind === "translate" ? "text-left font-body" : ""}`}
                      >
                        {t.context}
                      </p>
                    )}

                    {t.options ? (
                      <div className="grid gap-2">
                        {t.options.map((opt, oi) => {
                          const isChosen = chosen === opt;
                          const isRight = opt === t.correct;
                          let cls = "border-border hover:border-accent";
                          if (submitted) {
                            if (isRight) cls = "border-emerald-500 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300";
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
                              onClick={() => setAnswers((a) => ({ ...a, [i]: opt }))}
                              className={`text-right p-3 border transition text-sm flex items-center justify-between gap-3 ${cls} disabled:cursor-default`}
                            >
                              <span className="flex-1 leading-relaxed">{opt}</span>
                              {submitted && isRight && <Check className="w-4 h-4 shrink-0 text-emerald-600" />}
                              {submitted && isChosen && !isRight && <X className="w-4 h-4 shrink-0 text-red-600" />}
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <textarea
                        value={chosen}
                        onChange={(e) => setAnswers((a) => ({ ...a, [i]: e.target.value }))}
                        disabled={submitted}
                        dir="rtl"
                        rows={2}
                        placeholder="اكتب إجابتك بالعربية…"
                        className={`w-full border p-3 bg-background focus:outline-none focus:border-accent text-sm ${
                          submitted ? (isCorrect ? "border-emerald-500" : "border-red-400") : "border-border"
                        }`}
                      />
                    )}

                    {submitted && (
                      <div className="mt-3 space-y-1">
                        {!correctness[i] && (
                          <p className="text-xs">
                            <span className="text-muted-foreground">الإجابة الصحيحة: </span>
                            <span className="font-bold text-emerald-700 dark:text-emerald-400">{t.correct}</span>
                          </p>
                        )}
                        {t.explanation && (
                          <p className="text-xs text-muted-foreground border-r-2 border-accent/40 pr-2 leading-relaxed">
                            {t.explanation}
                          </p>
                        )}
                      </div>
                    )}
                  </li>
                );
              })}
            </ol>

            {!submitted ? (
              <button
                onClick={submit}
                disabled={!allAnswered}
                className="w-full py-3 bg-accent text-accent-foreground font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Trophy className="w-4 h-4" />
                {allAnswered ? "احتساب النتيجة" : `أكمل كل المهام (${Object.values(answers).filter((v) => v.trim()).length}/${tasks.length})`}
              </button>
            ) : (
              <div className="border border-accent/50 bg-accent/5 p-4 text-center space-y-2">
                <div className="inline-flex items-center gap-2 text-accent font-bold text-lg">
                  <Trophy className="w-5 h-5" />
                  {correctCount} / {tasks.length} صحيحة
                </div>
                <p className="text-sm text-muted-foreground">
                  {awarded && awarded > 0 ? (
                    <>كسبت <span className="font-bold text-accent">{awarded}</span> نقطة اليوم — محفوظة في لوحة تحكمك.</>
                  ) : (
                    <>حصلت على نقاط تحدّي اليوم مسبقاً — عُد غداً لتحدٍّ جديد.</>
                  )}
                </p>
                <button
                  onClick={resetAll}
                  className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 border border-border text-xs hover:border-accent"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> إعادة المحاولة (بدون نقاط إضافية)
                </button>
              </div>
            )}

            <div className="pt-2 grid grid-cols-1 sm:flex sm:flex-wrap gap-2 sm:gap-3">
              <button
                onClick={generate}
                disabled={loading}
                className="px-4 py-2.5 border border-border hover:border-accent text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                تحدٍّ جديد
              </button>
              <Link
                to="/dashboard"
                onClick={onClose}
                className="px-4 py-2.5 border border-accent text-accent text-sm font-semibold text-center"
              >
                لوحة التحكم
              </Link>
            </div>
          </div>
        )}
      </div>
    </ToolShell>
  );
}
