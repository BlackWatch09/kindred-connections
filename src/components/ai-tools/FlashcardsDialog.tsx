import { useEffect, useMemo, useState } from "react";
import {
  Layers, Loader2, Sparkles, ChevronRight, ChevronLeft, Check, X, RotateCcw, Trophy, RefreshCw,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import ToolShell from "./ToolShell";
import { generateFlashcards, type FlashcardDeck, type Flashcard } from "@/lib/aiFn";
import { addPoints } from "@/lib/points";
import { useAuth } from "@/hooks/useAuth";
import { friendlyError, MAX_TOPIC_LEN } from "@/lib/errors";

type Level = "beginner" | "intermediate" | "advanced";
type Lang = "en" | "tr" | "ar";
type Judgement = "known" | "review";

const LEVELS: { id: Level; label: string }[] = [
  { id: "beginner", label: "مبتدئ" },
  { id: "intermediate", label: "متوسط" },
  { id: "advanced", label: "متقدم" },
];

const LANGS: { id: Lang; label: string }[] = [
  { id: "en", label: "English" },
  { id: "tr", label: "Türkçe" },
  { id: "ar", label: "عربي مبسّط" },
];

const TOPIC_CHIPS = [
  "مطعم وطعام", "سفر ومطار", "عمل ومكتب", "عائلة", "تسوّق",
  "طقس", "صحة وطب", "مدرسة", "مدينة ومواصلات", "مشاعر",
];

const POINTS_PER_KNOWN = 4;
const COUNTS = [6, 10, 15] as const;

export default function FlashcardsDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { user } = useAuth();
  const [topic, setTopic] = useState("");
  const [level, setLevel] = useState<Level>("beginner");
  const [lang, setLang] = useState<Lang>("en");
  const [count, setCount] = useState<(typeof COUNTS)[number]>(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deck, setDeck] = useState<FlashcardDeck | null>(null);

  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [judgements, setJudgements] = useState<Record<number, Judgement>>({});
  const [finished, setFinished] = useState(false);
  const [awarded, setAwarded] = useState<number | null>(null);

  useEffect(() => {
    if (!open) return;
    // reset session UI but keep last deck for convenience
    setIdx(0); setFlipped(false); setJudgements({}); setFinished(false); setAwarded(null);
  }, [open]);

  const generate = async () => {
    const t = topic.trim();
    if (t.length > MAX_TOPIC_LEN) {
      toast.error(`الموضوع طويل جداً (الحد ${MAX_TOPIC_LEN} حرف).`);
      return;
    }
    setLoading(true); setError(null); setDeck(null);
    setIdx(0); setFlipped(false); setJudgements({}); setFinished(false); setAwarded(null);
    try {
      const data = await generateFlashcards(t, level, count, lang);
      if (!data.cards.length) throw new Error("لم تُنشأ بطاقات — جرّب موضوعاً آخر.");
      setDeck(data);
    } catch (e) {
      setError(friendlyError(e));
    } finally {
      setLoading(false);
    }
  };

  const cards: Flashcard[] = deck?.cards ?? [];
  const total = cards.length;
  const current = cards[idx];

  const knownCount = useMemo(
    () => Object.values(judgements).filter((j) => j === "known").length,
    [judgements],
  );

  const judge = (j: Judgement) => {
    if (!current) return;
    setJudgements((s) => ({ ...s, [idx]: j }));
    // advance
    if (idx + 1 < total) {
      setIdx(idx + 1);
      setFlipped(false);
    } else {
      finish({ ...judgements, [idx]: j });
    }
  };

  const finish = (final: Record<number, Judgement>) => {
    setFinished(true);
    const known = Object.values(final).filter((j) => j === "known").length;
    const earned = known * POINTS_PER_KNOWN;
    setAwarded(earned);
    if (earned > 0) {
      addPoints(user?.id, {
        tool: "flashcards",
        label: `بطاقات: ${deck?.title || topic || ""}`.trim(),
        points: earned,
        meta: { level, lang, total, known, topic },
      });
    }
  };

  const restart = () => {
    setIdx(0); setFlipped(false); setJudgements({}); setFinished(false); setAwarded(null);
  };

  const goBack = () => {
    if (idx > 0) { setIdx(idx - 1); setFlipped(false); }
  };

  return (
    <ToolShell
      open={open}
      onClose={onClose}
      icon={<Layers className="w-5 h-5" />}
      title="البطاقات الذكية"
      subtitle="مجموعة مفردات مولّدة بالذكاء الاصطناعي — اقلب، احكم، اكسب نقاطاً"
      size="xl"
    >
      <div className="space-y-5 font-arabic-clear" dir="rtl">
        {!deck && !loading && (
          <>
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                موضوع / درس
              </label>
              <input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                dir="rtl"
                placeholder="مثال: مفردات المطار"
                className="mt-2 w-full border border-border bg-background p-3 focus:outline-none focus:border-accent"
              />
              <div className="mt-2 flex flex-wrap gap-2">
                {TOPIC_CHIPS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setTopic(c)}
                    className="text-xs px-3 py-1.5 border border-border hover:border-accent hover:bg-accent/5"
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">المستوى</label>
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
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">لغة الترجمة</label>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {LANGS.map((l) => (
                    <button
                      key={l.id}
                      onClick={() => setLang(l.id)}
                      className={`py-2 text-sm font-semibold border transition ${lang === l.id ? "border-accent bg-accent text-accent-foreground" : "border-border hover:border-accent"}`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <label className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">عدد البطاقات</label>
              <div className="flex gap-2">
                {COUNTS.map((n) => (
                  <button
                    key={n}
                    onClick={() => setCount(n)}
                    className={`px-3 py-1.5 text-sm border ${count === n ? "border-accent bg-accent/10 text-accent" : "border-border"}`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={generate}
              className="w-full py-3 bg-primary text-primary-foreground font-semibold hover:bg-accent hover:text-accent-foreground transition flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" /> توليد المجموعة
            </button>
          </>
        )}

        {loading && (
          <div className="flex items-center justify-center gap-2 text-muted-foreground py-10">
            <Loader2 className="w-4 h-4 animate-spin" /> يجهّز سِراج بطاقاتك…
          </div>
        )}

        {error && (
          <div className="border border-red-300 bg-red-50 text-red-700 p-3 text-sm">{error}</div>
        )}

        {deck && !finished && current && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="eyebrow">— {deck.title} —</p>
                <p className="text-xs text-muted-foreground mt-1">
                  بطاقة {idx + 1} من {total} · {POINTS_PER_KNOWN} نقاط لكل بطاقة "أعرفها"
                </p>
              </div>
              <div className="text-xs text-muted-foreground bg-secondary/60 border border-border px-2 py-1">
                أعرفها: <span className="font-bold text-emerald-600">{knownCount}</span>
              </div>
            </div>

            {/* progress bar */}
            <div className="h-1.5 bg-secondary/60 border border-border overflow-hidden">
              <div
                className="h-full bg-accent transition-all"
                style={{ width: `${((idx) / total) * 100}%` }}
              />
            </div>

            {/* Flip card */}
            <button
              type="button"
              onClick={() => setFlipped((f) => !f)}
              className="w-full min-h-[240px] sm:min-h-[280px] border-2 border-border hover:border-accent bg-card p-6 flex flex-col items-center justify-center text-center transition group"
            >
              {!flipped ? (
                <>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-4">اضغط للقلب</p>
                  <p className="font-arabic-clear font-bold text-primary text-3xl sm:text-5xl leading-tight">
                    {current.word}
                  </p>
                  {current.pos && (
                    <p className="text-xs text-muted-foreground mt-3">{current.pos}{current.root ? ` · جذر: ${current.root}` : ""}</p>
                  )}
                </>
              ) : (
                <>
                  <p className="text-[10px] uppercase tracking-widest text-accent mb-3">الترجمة</p>
                  <p className={`text-xl sm:text-2xl font-semibold text-foreground ${lang === "ar" ? "font-arabic-clear" : "font-body"}`}>
                    {current.translation}
                  </p>
                  {current.example && (
                    <div className="mt-5 pt-5 border-t border-border w-full max-w-lg">
                      <p className="font-arabic-clear text-lg text-foreground leading-loose">{current.example}</p>
                      {current.example_translation && (
                        <p className={`text-xs text-muted-foreground mt-2 ${lang === "ar" ? "font-arabic-clear" : "font-body"}`}>
                          {current.example_translation}
                        </p>
                      )}
                    </div>
                  )}
                </>
              )}
            </button>

            {/* Judgement buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => judge("review")}
                className="py-3 border border-red-300 text-red-700 hover:bg-red-50 dark:hover:bg-red-500/10 font-semibold flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" /> راجعها لاحقاً
              </button>
              <button
                onClick={() => judge("known")}
                className="py-3 border border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 font-semibold flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" /> أعرفها
              </button>
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
              <button
                onClick={goBack}
                disabled={idx === 0}
                className="inline-flex items-center gap-1 hover:text-accent disabled:opacity-40"
              >
                <ChevronRight className="w-3.5 h-3.5" /> السابقة
              </button>
              <button
                onClick={() => setFlipped((f) => !f)}
                className="inline-flex items-center gap-1 hover:text-accent"
              >
                <RotateCcw className="w-3.5 h-3.5" /> اقلب البطاقة
              </button>
              <button
                onClick={() => { if (idx + 1 < total) { setIdx(idx + 1); setFlipped(false); } else finish(judgements); }}
                className="inline-flex items-center gap-1 hover:text-accent"
              >
                تخطّي <ChevronLeft className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {deck && finished && (
          <div className="space-y-4">
            <div className="border border-accent/50 bg-accent/5 p-6 text-center space-y-2">
              <div className="inline-flex items-center gap-2 text-accent font-bold text-xl">
                <Trophy className="w-6 h-6" />
                {knownCount} / {total} بطاقة أتقنتها
              </div>
              <p className="text-sm text-muted-foreground">
                كسبت <span className="font-bold text-accent">{awarded ?? 0}</span> نقطة —
                محفوظة في لوحة تحكمك.
              </p>
            </div>

            {/* Cards to review */}
            {Object.entries(judgements).some(([, j]) => j === "review") && (
              <div>
                <p className="eyebrow">— بطاقات للمراجعة —</p>
                <div className="mt-2 grid sm:grid-cols-2 gap-2">
                  {cards.map((c, i) => judgements[i] === "review" ? (
                    <div key={i} className="border border-border p-3">
                      <div className="flex justify-between items-baseline gap-2">
                        <span className="font-arabic-clear font-bold text-lg text-accent">{c.word}</span>
                        <span className="text-sm text-muted-foreground text-right">{c.translation}</span>
                      </div>
                      {c.example && (
                        <p className="font-arabic-clear text-sm mt-2 text-foreground leading-relaxed">{c.example}</p>
                      )}
                    </div>
                  ) : null)}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:flex sm:flex-wrap gap-2 sm:gap-3">
              <button
                onClick={restart}
                className="px-4 py-2.5 border border-accent text-accent text-sm font-semibold flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" /> إعادة نفس المجموعة
              </button>
              <button
                onClick={generate}
                className="px-4 py-2.5 bg-primary text-primary-foreground text-sm font-semibold flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" /> مجموعة جديدة
              </button>
              <Link
                to="/dashboard"
                onClick={onClose}
                className="px-4 py-2.5 border border-border hover:border-accent text-sm font-semibold text-center"
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
