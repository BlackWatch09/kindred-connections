import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { CheckCircle, XCircle, RotateCcw, Gamepad2, PenTool, ListChecks } from "lucide-react";

type QuizQuestion = {
  question: string;
  options: string[];
  correct: number;
};

const quizData: Record<string, QuizQuestion[]> = {
  beginner: [
    { question: "What is 'مرحبا' in English?", options: ["Goodbye", "Hello", "Thank you", "Please"], correct: 1 },
    { question: "How do you say 'book' in Arabic?", options: ["قلم", "كتاب", "دفتر", "كرسي"], correct: 1 },
    { question: "What does 'شكراً' mean?", options: ["Sorry", "Hello", "Thank you", "Welcome"], correct: 2 },
    { question: "Choose the correct Arabic letter for 'B':", options: ["ت", "ب", "ث", "ن"], correct: 1 },
    { question: "What is the number 5 in Arabic?", options: ["٣", "٧", "٥", "٩"], correct: 2 },
  ],
  intermediate: [
    { question: "What is the past tense of 'يكتب' (to write)?", options: ["كتب", "يكتب", "سيكتب", "اكتب"], correct: 0 },
    { question: "'الطقس جميل اليوم' means:", options: ["The food is delicious", "The weather is beautiful today", "The class is boring", "The book is interesting"], correct: 1 },
    { question: "Choose the correct plural of 'كتاب':", options: ["كتب", "كتابات", "كتابين", "كتبة"], correct: 0 },
    { question: "What does 'أين المحطة؟' mean?", options: ["Where is the station?", "What time is it?", "How much is this?", "Who is this?"], correct: 0 },
    { question: "'يذهب إلى المدرسة' - The verb form is:", options: ["Past", "Present", "Future", "Imperative"], correct: 1 },
  ],
  advanced: [
    { question: "What rhetorical device is 'الأسد' when referring to a brave person?", options: ["Simile", "Metaphor", "Hyperbole", "Personification"], correct: 1 },
    { question: "'لا حول ولا قوة إلا بالله' is an example of:", options: ["Proverb", "Hadith", "Dhikr expression", "Poetry"], correct: 2 },
    { question: "In formal Arabic, 'إن' is followed by:", options: ["Nominative", "Accusative", "Genitive", "Jussive"], correct: 1 },
    { question: "The Egyptian dialect word 'إزيك' corresponds to MSA:", options: ["كيف أنت", "ماذا تريد", "أين أنت", "من أنت"], correct: 0 },
    { question: "'المتنبي' was a famous:", options: ["Historian", "Poet", "Scientist", "Caliph"], correct: 1 },
  ],
};

const writingExercises: Record<string, { prompt: string; hint: string }[]> = {
  beginner: [
    { prompt: "Write 'Hello' in Arabic:", hint: "مرحبا" },
    { prompt: "Write 'Thank you' in Arabic:", hint: "شكراً" },
  ],
  intermediate: [
    { prompt: "Write 'I went to the school' in Arabic:", hint: "ذهبت إلى المدرسة" },
    { prompt: "Write 'The weather is cold today' in Arabic:", hint: "الطقس بارد اليوم" },
  ],
  advanced: [
    { prompt: "Write a sentence using the Idafa construction:", hint: "كتاب المعلم (the teacher's book)" },
    { prompt: "Write a conditional sentence (لو):", hint: "لو درست لنجحت" },
  ],
};

const Learn = () => {
  const { t } = useLanguage();
  const [selectedLevel, setSelectedLevel] = useState<string>("beginner");
  const [mode, setMode] = useState<"quiz" | "writing" | "game">("quiz");
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [writingAnswer, setWritingAnswer] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [gameWord, setGameWord] = useState("");
  const [gameScore, setGameScore] = useState(0);

  const questions = quizData[selectedLevel];
  const exercises = writingExercises[selectedLevel];

  const wordPairs = [
    { ar: "كتاب", en: "Book" }, { ar: "قلم", en: "Pen" },
    { ar: "بيت", en: "House" }, { ar: "ماء", en: "Water" },
  ];
  const [matchedPairs, setMatchedPairs] = useState<number[]>([]);
  const [selectedCard, setSelectedCard] = useState<{ type: "ar" | "en"; idx: number } | null>(null);

  const handleAnswer = (idx: number) => {
    if (showResult) return;
    setSelected(idx);
    setShowResult(true);
    if (idx === questions[currentQ].correct) setScore((s) => s + 1);
  };

  const nextQuestion = () => {
    if (currentQ + 1 >= questions.length) {
      setQuizComplete(true);
    } else {
      setCurrentQ((q) => q + 1);
      setSelected(null);
      setShowResult(false);
    }
  };

  const restart = () => {
    setCurrentQ(0);
    setSelected(null);
    setShowResult(false);
    setScore(0);
    setQuizComplete(false);
    setWritingAnswer("");
    setShowHint(false);
    setMatchedPairs([]);
    setSelectedCard(null);
    setGameScore(0);
  };

  const handleMatch = (type: "ar" | "en", idx: number) => {
    if (matchedPairs.includes(idx)) return;
    if (!selectedCard) {
      setSelectedCard({ type, idx });
    } else {
      if (selectedCard.type !== type && selectedCard.idx === idx) {
        setMatchedPairs((p) => [...p, idx]);
        setGameScore((s) => s + 1);
      }
      setSelectedCard(null);
    }
  };

  const levels = ["beginner", "intermediate", "advanced"];
  const modes = [
    { key: "quiz" as const, icon: ListChecks, label: t("quiz.multiplechoice") },
    { key: "writing" as const, icon: PenTool, label: t("quiz.writing") },
    { key: "game" as const, icon: Gamepad2, label: t("quiz.game") },
  ];

  return (
    <div className="relative z-10 py-12 px-4">
      <div className="container mx-auto max-w-3xl">
        <h1 className="font-display text-4xl font-bold text-center text-foreground mb-2">
          {t("quiz.title")}
        </h1>
        <p className="text-center text-muted-foreground mb-8">{t("quiz.subtitle")}</p>

        {/* Level selector */}
        <div className="flex justify-center gap-3 mb-6">
          {levels.map((lvl) => (
            <button
              key={lvl}
              onClick={() => { setSelectedLevel(lvl); restart(); }}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
                selectedLevel === lvl
                  ? "gradient-gold text-accent-foreground shadow-md"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {t(`courses.${lvl}`)}
            </button>
          ))}
        </div>

        {/* Mode selector */}
        <div className="flex justify-center gap-3 mb-10">
          {modes.map((m) => (
            <button
              key={m.key}
              onClick={() => { setMode(m.key); restart(); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                mode === m.key
                  ? "border-accent text-accent bg-accent/10"
                  : "border-border text-muted-foreground hover:border-accent/50"
              }`}
            >
              <m.icon className="w-4 h-4" /> {m.label}
            </button>
          ))}
        </div>

        {/* Quiz Mode */}
        {mode === "quiz" && (
          <div className="bg-card border border-border rounded-2xl p-8">
            {quizComplete ? (
              <div className="text-center">
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">{t("quiz.complete")}</h2>
                <p className="text-5xl font-bold text-accent mb-2">{score}/{questions.length}</p>
                <p className="text-muted-foreground mb-6">{t("quiz.score")}</p>
                <button onClick={restart} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg gradient-gold text-accent-foreground font-semibold">
                  <RotateCcw className="w-4 h-4" /> {t("quiz.restart")}
                </button>
              </div>
            ) : (
              <>
                <div className="flex justify-between text-sm text-muted-foreground mb-4">
                  <span>{currentQ + 1}/{questions.length}</span>
                  <span>{score} ✓</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-1.5 mb-6">
                  <div className="h-1.5 rounded-full gradient-gold transition-all" style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }} />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-6">{questions[currentQ].question}</h3>
                <div className="grid gap-3">
                  {questions[currentQ].options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleAnswer(i)}
                      className={`w-full text-left p-4 rounded-xl border text-sm font-medium transition-all ${
                        showResult
                          ? i === questions[currentQ].correct
                            ? "border-emerald-500 bg-emerald-500/10 text-emerald-700"
                            : i === selected
                            ? "border-destructive bg-destructive/10 text-destructive"
                            : "border-border text-muted-foreground"
                          : selected === i
                          ? "border-accent bg-accent/10 text-foreground"
                          : "border-border text-foreground hover:border-accent/50 hover:bg-secondary"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        {showResult && i === questions[currentQ].correct && <CheckCircle className="w-5 h-5 text-emerald-500" />}
                        {showResult && i === selected && i !== questions[currentQ].correct && <XCircle className="w-5 h-5 text-destructive" />}
                        {opt}
                      </span>
                    </button>
                  ))}
                </div>
                {showResult && (
                  <div className="mt-6 flex justify-between items-center">
                    <span className={`text-sm font-semibold ${selected === questions[currentQ].correct ? "text-emerald-600" : "text-destructive"}`}>
                      {selected === questions[currentQ].correct ? t("quiz.correct") : t("quiz.incorrect")}
                    </span>
                    <button onClick={nextQuestion} className="px-6 py-2 rounded-lg gradient-gold text-accent-foreground font-semibold text-sm">
                      {t("quiz.next")}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Writing Mode */}
        {mode === "writing" && (
          <div className="bg-card border border-border rounded-2xl p-8 space-y-6">
            {exercises.map((ex, i) => (
              <div key={i} className="border-b border-border pb-6 last:border-0 last:pb-0">
                <p className="font-semibold text-foreground mb-3">{ex.prompt}</p>
                <input
                  type="text"
                  dir="rtl"
                  className="w-full p-3 rounded-lg border border-border bg-background text-foreground font-arabic text-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="اكتب هنا..."
                  value={writingAnswer}
                  onChange={(e) => setWritingAnswer(e.target.value)}
                />
                <button onClick={() => setShowHint(!showHint)} className="mt-2 text-sm text-accent hover:underline">
                  {showHint ? `💡 ${ex.hint}` : "Show hint"}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Game Mode - Matching */}
        {mode === "game" && (
          <div className="bg-card border border-border rounded-2xl p-8">
            <h3 className="text-lg font-semibold text-foreground mb-6 text-center">Match Arabic with English</h3>
            {matchedPairs.length === wordPairs.length ? (
              <div className="text-center">
                <p className="text-2xl font-bold text-accent mb-4">🎉 All matched!</p>
                <button onClick={restart} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg gradient-gold text-accent-foreground font-semibold">
                  <RotateCcw className="w-4 h-4" /> {t("quiz.restart")}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  {wordPairs.map((pair, i) => (
                    <button
                      key={`ar-${i}`}
                      onClick={() => handleMatch("ar", i)}
                      disabled={matchedPairs.includes(i)}
                      className={`w-full p-4 rounded-xl border text-lg font-arabic transition-all ${
                        matchedPairs.includes(i)
                          ? "bg-emerald-500/10 border-emerald-500 opacity-50"
                          : selectedCard?.type === "ar" && selectedCard.idx === i
                          ? "border-accent bg-accent/10"
                          : "border-border hover:border-accent/50"
                      }`}
                    >
                      {pair.ar}
                    </button>
                  ))}
                </div>
                <div className="space-y-3">
                  {wordPairs.map((pair, i) => (
                    <button
                      key={`en-${i}`}
                      onClick={() => handleMatch("en", i)}
                      disabled={matchedPairs.includes(i)}
                      className={`w-full p-4 rounded-xl border text-lg transition-all ${
                        matchedPairs.includes(i)
                          ? "bg-emerald-500/10 border-emerald-500 opacity-50"
                          : selectedCard?.type === "en" && selectedCard.idx === i
                          ? "border-accent bg-accent/10"
                          : "border-border hover:border-accent/50"
                      }`}
                    >
                      {pair.en}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Learn;
