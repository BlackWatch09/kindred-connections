import { useMemo, useState } from "react";
import { Volume2, ChevronLeft, ChevronRight, CheckCircle2, XCircle, Trophy, RotateCcw } from "lucide-react";
import type { Lesson, LessonItem } from "@/data/courseLessons";

interface Props {
  lesson: Lesson;
  onComplete: () => void;
}

const speakArabic = (text: string) => {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "ar-SA";
    u.rate = 0.8;
    window.speechSynthesis.speak(u);
  }
};

interface QuizQ {
  item: LessonItem;
  options: string[];
  correctIdx: number;
}

const buildQuiz = (items: LessonItem[]): QuizQ[] => {
  const pool = items.map((i) => i.en);
  return items.map((item) => {
    const wrong = pool
      .filter((e) => e !== item.en)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    const options = [...wrong, item.en].sort(() => Math.random() - 0.5);
    return { item, options, correctIdx: options.indexOf(item.en) };
  });
};

const GenericLesson = ({ lesson, onComplete }: Props) => {
  const [phase, setPhase] = useState<"learn" | "quiz" | "done">("learn");
  const [idx, setIdx] = useState(0);
  const quiz = useMemo(() => buildQuiz(lesson.items), [lesson]);
  const [qIdx, setQIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const item = lesson.items[idx];
  const q = quiz[qIdx];
  const total = quiz.length;
  const pct = Math.round((score / total) * 100);

  const next = () => {
    if (idx < lesson.items.length - 1) setIdx(idx + 1);
    else setPhase("quiz");
  };

  const answer = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    if (i === q.correctIdx) setScore((s) => s + 1);
    setTimeout(() => {
      if (qIdx < quiz.length - 1) {
        setQIdx(qIdx + 1);
        setPicked(null);
      } else {
        setPhase("done");
      }
    }, 900);
  };

  const restart = () => {
    setPhase("learn");
    setIdx(0);
    setQIdx(0);
    setPicked(null);
    setScore(0);
  };

  if (phase === "done") {
    const pass = pct >= 60;
    return (
      <div className="max-w-2xl mx-auto text-center bg-card border border-border rounded-3xl p-8 shadow-sm">
        <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${pass ? "bg-emerald-100" : "bg-amber-100"}`}>
          <Trophy className={`w-10 h-10 ${pass ? "text-emerald-600" : "text-amber-600"}`} />
        </div>
        <h2 className="font-arabic text-3xl font-bold mb-2">{pass ? "أحسنت!" : "تدرّب أكثر"}</h2>
        <p className="text-muted-foreground mb-6 font-arabic">
          حصلتَ على {score} من {total} ({pct}٪)
        </p>
        <div className="flex justify-center gap-3">
          <button
            onClick={restart}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border hover:bg-secondary transition-colors font-arabic"
          >
            <RotateCcw className="w-4 h-4" /> إعادة
          </button>
          <button
            onClick={onComplete}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg gradient-gold text-accent-foreground font-semibold font-arabic hover:opacity-90"
          >
            <CheckCircle2 className="w-4 h-4" /> إنهاء الدرس
          </button>
        </div>
      </div>
    );
  }

  if (phase === "quiz") {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="mb-4 flex items-center justify-between font-arabic text-sm text-muted-foreground">
          <span>سؤال {qIdx + 1} / {total}</span>
          <span>النقاط: {score}</span>
        </div>
        <div className="bg-card border border-border rounded-3xl p-8 shadow-sm">
          <p className="text-center text-muted-foreground font-arabic mb-3">ما معنى الكلمة التالية؟</p>
          <div className="flex items-center justify-center gap-3 mb-8">
            <h2 className="font-arabic text-5xl font-bold text-foreground" dir="rtl">{q.item.ar}</h2>
            <button
              onClick={() => speakArabic(q.item.ar)}
              className="w-10 h-10 rounded-full bg-secondary hover:bg-secondary/70 flex items-center justify-center"
              aria-label="Play"
            >
              <Volume2 className="w-5 h-5 text-accent" />
            </button>
          </div>
          <div className="grid gap-3">
            {q.options.map((opt, i) => {
              const isCorrect = i === q.correctIdx;
              const isPicked = i === picked;
              const state =
                picked === null
                  ? "border-border hover:border-accent hover:bg-accent/5"
                  : isCorrect
                  ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                  : isPicked
                  ? "border-red-500 bg-red-50 text-red-800"
                  : "border-border opacity-60";
              return (
                <button
                  key={i}
                  onClick={() => answer(i)}
                  className={`flex items-center justify-between gap-3 p-4 rounded-xl border-2 text-start transition-all ${state}`}
                >
                  <span className="font-medium">{opt}</span>
                  {picked !== null && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                  {picked !== null && isPicked && !isCorrect && <XCircle className="w-5 h-5 text-red-600" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // learn phase
  return (
    <div className="max-w-2xl mx-auto">
      {lesson.intro && (
        <p className="text-center font-arabic text-muted-foreground mb-4" dir="rtl">
          {lesson.intro}
        </p>
      )}
      <div className="mb-3 flex items-center justify-between font-arabic text-sm text-muted-foreground">
        <span>مفردة {idx + 1} / {lesson.items.length}</span>
        <button onClick={() => setPhase("quiz")} className="text-accent hover:underline">
          تخطي إلى الاختبار
        </button>
      </div>
      <div className="bg-card border border-border rounded-3xl p-8 shadow-sm text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <h2 className="font-arabic text-6xl font-bold text-foreground" dir="rtl">{item.ar}</h2>
          <button
            onClick={() => speakArabic(item.ar)}
            className="w-11 h-11 rounded-full bg-secondary hover:bg-secondary/70 flex items-center justify-center"
            aria-label="Play"
          >
            <Volume2 className="w-5 h-5 text-accent" />
          </button>
        </div>
        <p className="text-muted-foreground italic mb-2">{item.translit}</p>
        <p className="text-lg font-semibold text-foreground mb-4">{item.en}</p>
        {item.exampleAr && (
          <div className="mt-6 pt-6 border-t border-border text-start">
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Example</p>
            <p className="font-arabic text-xl text-foreground mb-1" dir="rtl">{item.exampleAr}</p>
            {item.exampleEn && <p className="text-sm text-muted-foreground">{item.exampleEn}</p>}
          </div>
        )}
      </div>
      <div className="flex justify-between mt-5">
        <button
          onClick={() => setIdx(Math.max(0, idx - 1))}
          disabled={idx === 0}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed font-arabic"
        >
          <ChevronRight className="w-4 h-4" /> السابق
        </button>
        <button
          onClick={next}
          className="inline-flex items-center gap-2 px-6 py-2 rounded-lg gradient-gold text-accent-foreground font-semibold font-arabic"
        >
          {idx === lesson.items.length - 1 ? "ابدأ الاختبار" : "التالي"}
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default GenericLesson;
