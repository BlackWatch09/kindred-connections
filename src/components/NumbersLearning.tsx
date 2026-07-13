import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { arabicNumbers, getNumberGroups, ArabicNumber } from "@/data/arabicNumbers";
import { Volume2, CheckCircle, XCircle, RotateCcw, ChevronRight, ChevronLeft, Trophy, Sparkles, X, Ear, Type } from "lucide-react";

type QuizType = "mcq" | "audio" | "image" | "write";

interface QuizQuestion {
  type: QuizType;
  number: ArabicNumber;
  options?: string[];
  correctIdx?: number;
  imageCount?: number;
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

const EMOJI_MAP: Record<number, string> = {
  1: "🍎", 2: "⭐", 3: "📚", 4: "🌸", 5: "✋",
  6: "🐦", 7: "📅", 8: "🔵", 9: "☕", 10: "⚪",
  11: "❤️", 12: "📆", 13: "🍃", 14: "🪨", 15: "💧",
  16: "🟦", 17: "📿", 18: "💎", 19: "🏮", 20: "🪙",
};

const generateQuiz = (group: ArabicNumber[]): QuizQuestion[] => {
  const questions: QuizQuestion[] = [];
  const all = arabicNumbers;

  // MCQ for each number
  group.forEach((num) => {
    const wrong = all.filter((n) => n.value !== num.value).sort(() => Math.random() - 0.5).slice(0, 3);
    const options = [...wrong.map((w) => w.word), num.word].sort(() => Math.random() - 0.5);
    questions.push({ type: "mcq", number: num, options, correctIdx: options.indexOf(num.word) });
  });

  // Audio recognition - pick 2
  const audioNums = [...group].sort(() => Math.random() - 0.5).slice(0, 2);
  audioNums.forEach((num) => {
    const wrong = all.filter((n) => n.value !== num.value).sort(() => Math.random() - 0.5).slice(0, 3);
    const options = [...wrong.map((w) => w.name), num.name].sort(() => Math.random() - 0.5);
    questions.push({ type: "audio", number: num, options, correctIdx: options.indexOf(num.name) });
  });

  // Image recognition - pick 1
  const imgNum = group[Math.floor(Math.random() * group.length)];
  const wrongImg = all.filter((n) => n.value !== imgNum.value).sort(() => Math.random() - 0.5).slice(0, 3);
  const imgOptions = [...wrongImg.map((w) => w.arabic), imgNum.arabic].sort(() => Math.random() - 0.5);
  questions.push({ type: "image", number: imgNum, options: imgOptions, correctIdx: imgOptions.indexOf(imgNum.arabic), imageCount: imgNum.value });

  // Write - pick 1
  const writeNum = group[Math.floor(Math.random() * group.length)];
  questions.push({ type: "write", number: writeNum });

  return questions;
};

interface NumbersLearningProps {
  onClose?: () => void;
}

const NumbersLearning = ({ onClose }: NumbersLearningProps) => {
  const { t } = useLanguage();
  const numberGroups = useMemo(() => getNumberGroups(), []);
  const [currentGroupIdx, setCurrentGroupIdx] = useState(0);
  const [phase, setPhase] = useState<"learn" | "quiz" | "results">("learn");
  const [currentNumIdx, setCurrentNumIdx] = useState(0);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [quizIdx, setQuizIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [groupScores, setGroupScores] = useState<number[]>([]);
  const [currentScore, setCurrentScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [writeInput, setWriteInput] = useState("");
  const [writeResult, setWriteResult] = useState<"correct" | "wrong" | null>(null);
  const [playingNum, setPlayingNum] = useState<number | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const currentGroup = numberGroups[currentGroupIdx];
  const currentNumber = currentGroup?.[currentNumIdx];
  const isLastGroup = currentGroupIdx >= numberGroups.length - 1;
  const allDone = phase === "results" && isLastGroup;

  const avgScore = useMemo(() => {
    if (groupScores.length === 0) return 0;
    return Math.round(groupScores.reduce((a, b) => a + b, 0) / groupScores.length);
  }, [groupScores]);

  useEffect(() => {
    if (groupScores.length > 0) {
      localStorage.setItem("numbers_scores", JSON.stringify(groupScores));
    }
  }, [groupScores]);

  const handlePlaySound = useCallback((num: ArabicNumber) => {
    setPlayingNum(num.value);
    speakArabic(num.word);
    setTimeout(() => setPlayingNum(null), 1200);
  }, []);

  const startQuiz = () => {
    const q = generateQuiz(currentGroup);
    setQuizQuestions(q);
    setQuizIdx(0);
    setCurrentScore(0);
    setTotalQuestions(q.length);
    setSelectedAnswer(null);
    setShowAnswer(false);
    setWriteInput("");
    setWriteResult(null);
    setPhase("quiz");
  };

  const handleAnswer = (idx: number) => {
    if (showAnswer) return;
    setSelectedAnswer(idx);
    setShowAnswer(true);
    if (idx === quizQuestions[quizIdx].correctIdx) {
      setCurrentScore((s) => s + 1);
    }
  };

  const handleWriteCheck = () => {
    const q = quizQuestions[quizIdx];
    const input = writeInput.trim();
    if (input === q.number.word || input === q.number.arabic) {
      setWriteResult("correct");
      setCurrentScore((s) => s + 1);
    } else {
      setWriteResult("wrong");
    }
  };

  const nextQuizQuestion = () => {
    if (quizIdx + 1 >= quizQuestions.length) {
      const pct = Math.round((currentScore / totalQuestions) * 100);
      setGroupScores((s) => [...s, pct]);
      setPhase("results");
    } else {
      setQuizIdx((i) => i + 1);
      setSelectedAnswer(null);
      setShowAnswer(false);
      setWriteInput("");
      setWriteResult(null);
    }
  };

  const nextGroup = () => {
    if (!isLastGroup) {
      setCurrentGroupIdx((i) => i + 1);
      setCurrentNumIdx(0);
      setPhase("learn");
      sectionRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const restartAll = () => {
    setCurrentGroupIdx(0);
    setCurrentNumIdx(0);
    setPhase("learn");
    setGroupScores([]);
    localStorage.removeItem("numbers_scores");
  };

  const progressPct = Math.round(((currentGroupIdx + (phase === "results" ? 1 : 0)) / numberGroups.length) * 100);

  const renderEmojis = (count: number, emoji: string) => {
    const display = Math.min(count, 20);
    return (
      <div className="flex flex-wrap justify-center gap-1 text-2xl leading-tight">
        {Array.from({ length: display }, (_, i) => (
          <span key={i}>{emoji}</span>
        ))}
      </div>
    );
  };

  return (
    <div ref={sectionRef} className="mt-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-display text-xl font-bold text-foreground">{t("numbers.title")}</h3>
          <p className="text-sm text-muted-foreground">{t("numbers.subtitle")}</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>{t("alphabet.group")} {currentGroupIdx + 1} / {numberGroups.length}</span>
          <span>{progressPct}%</span>
        </div>
        <div className="w-full bg-secondary rounded-full h-1.5">
          <div className="h-1.5 rounded-full gradient-gold transition-all duration-500" style={{ width: `${progressPct}%` }} />
        </div>
      </div>

      {/* LEARN PHASE */}
      {phase === "learn" && (
        <div className="space-y-6 animate-[fade-in-up_0.4s_ease-out]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {currentGroup.map((num, i) => (
              <button
                key={num.value}
                onClick={() => { setCurrentNumIdx(i); handlePlaySound(num); }}
                className={`group relative bg-card border rounded-xl p-4 text-center transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 ${
                  currentNumIdx === i ? "border-accent shadow-sm ring-2 ring-accent/20" : "border-border hover:border-accent/50"
                }`}
              >
                <div className="mb-2 text-2xl">{renderEmojis(num.value, EMOJI_MAP[num.value] || "⬜")}</div>
                <span className="text-3xl font-arabic text-foreground block mb-1">{num.arabic}</span>
                <span className="text-lg font-arabic text-accent block mb-1">{num.word}</span>
                <span className="text-xs text-muted-foreground">{num.name}</span>
                <div className={`mt-2 inline-flex items-center justify-center w-7 h-7 rounded-full transition-colors ${
                  playingNum === num.value ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground group-hover:bg-accent/20"
                }`}>
                  <Volume2 className="w-3.5 h-3.5" />
                </div>
              </button>
            ))}
          </div>

          {currentNumber && (
            <div className="bg-secondary/30 border border-border rounded-xl p-6 animate-[fade-in-up_0.3s_ease-out]">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="flex-shrink-0 w-24 h-24 rounded-xl gradient-gold flex items-center justify-center">
                  <span className="text-4xl font-arabic text-accent-foreground">{currentNumber.arabic}</span>
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h4 className="font-display text-lg font-bold text-foreground mb-1">
                    {currentNumber.name} <span className="text-muted-foreground font-arabic">({currentNumber.word})</span>
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    {t("alphabet.transliteration")}: <span className="font-semibold text-foreground">/{currentNumber.transliteration}/</span>
                  </p>
                  <div className="bg-background rounded-lg p-3 inline-block">
                    <div className="text-2xl mb-1">{renderEmojis(currentNumber.value, EMOJI_MAP[currentNumber.value] || "⬜")}</div>
                    <p className="text-xs text-muted-foreground">{currentNumber.imageDescription}</p>
                  </div>
                  <button
                    onClick={() => handlePlaySound(currentNumber)}
                    className="mt-3 ml-0 sm:ml-3 inline-flex items-center gap-2 px-4 py-2 rounded-lg gradient-gold text-accent-foreground font-semibold text-xs hover:opacity-90 transition-opacity"
                  >
                    <Volume2 className="w-3.5 h-3.5" /> {t("alphabet.listen")}
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center">
            <button
              onClick={() => setCurrentNumIdx(Math.max(0, currentNumIdx - 1))}
              disabled={currentNumIdx === 0}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:text-foreground hover:border-accent/50 transition-colors disabled:opacity-30"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> {t("alphabet.prev")}
            </button>
            <button
              onClick={startQuiz}
              className="px-5 py-2 rounded-lg gradient-gold text-accent-foreground font-semibold text-xs hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5" /> {t("alphabet.takeQuiz")}
            </button>
            <button
              onClick={() => setCurrentNumIdx(Math.min(currentGroup.length - 1, currentNumIdx + 1))}
              disabled={currentNumIdx >= currentGroup.length - 1}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:text-foreground hover:border-accent/50 transition-colors disabled:opacity-30"
            >
              {t("alphabet.next")} <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* QUIZ PHASE */}
      {phase === "quiz" && quizQuestions[quizIdx] && (
        <div className="bg-card border border-border rounded-xl p-6 animate-[fade-in-up_0.4s_ease-out]">
          <div className="flex justify-between text-xs text-muted-foreground mb-3">
            <span>{t("alphabet.question")} {quizIdx + 1}/{quizQuestions.length}</span>
            <span>{currentScore} ✓</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-1 mb-5">
            <div className="h-1 rounded-full gradient-gold transition-all" style={{ width: `${((quizIdx + 1) / quizQuestions.length) * 100}%` }} />
          </div>

          {/* MCQ */}
          {quizQuestions[quizIdx].type === "mcq" && (
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-1">{t("numbers.mcqPrompt")}</h3>
              <p className="text-2xl font-bold text-accent mb-4">{quizQuestions[quizIdx].number.name} ({quizQuestions[quizIdx].number.arabic})</p>
              <div className="grid grid-cols-2 gap-2">
                {quizQuestions[quizIdx].options!.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswer(i)}
                    className={`p-4 rounded-xl border text-xl font-arabic transition-all ${
                      showAnswer
                        ? i === quizQuestions[quizIdx].correctIdx
                          ? "border-emerald-500 bg-emerald-500/10 text-emerald-700"
                          : i === selectedAnswer
                          ? "border-destructive bg-destructive/10 text-destructive"
                          : "border-border text-muted-foreground"
                        : selectedAnswer === i
                        ? "border-accent bg-accent/10"
                        : "border-border hover:border-accent/50 hover:bg-secondary text-foreground"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              {showAnswer && (
                <div className="mt-4 flex justify-between items-center">
                  <span className={`text-xs font-semibold ${selectedAnswer === quizQuestions[quizIdx].correctIdx ? "text-emerald-600" : "text-destructive"}`}>
                    {selectedAnswer === quizQuestions[quizIdx].correctIdx ? t("quiz.correct") : `${t("quiz.incorrect")} — ${quizQuestions[quizIdx].number.word}`}
                  </span>
                  <button onClick={nextQuizQuestion} className="px-4 py-1.5 rounded-lg gradient-gold text-accent-foreground font-semibold text-xs">
                    {t("quiz.next")}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Audio Recognition */}
          {quizQuestions[quizIdx].type === "audio" && (
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-2">{t("numbers.audioPrompt")}</h3>
              <button
                onClick={() => speakArabic(quizQuestions[quizIdx].number.word)}
                className="mb-4 mx-auto flex items-center gap-2 px-6 py-3 rounded-xl gradient-gold text-accent-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                <Ear className="w-5 h-5" /> {t("numbers.playAudio")}
              </button>
              <div className="grid grid-cols-2 gap-2">
                {quizQuestions[quizIdx].options!.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswer(i)}
                    className={`p-4 rounded-xl border text-sm font-semibold transition-all ${
                      showAnswer
                        ? i === quizQuestions[quizIdx].correctIdx
                          ? "border-emerald-500 bg-emerald-500/10 text-emerald-700"
                          : i === selectedAnswer
                          ? "border-destructive bg-destructive/10 text-destructive"
                          : "border-border text-muted-foreground"
                        : selectedAnswer === i
                        ? "border-accent bg-accent/10"
                        : "border-border hover:border-accent/50 hover:bg-secondary text-foreground"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              {showAnswer && (
                <div className="mt-4 flex justify-between items-center">
                  <span className={`text-xs font-semibold ${selectedAnswer === quizQuestions[quizIdx].correctIdx ? "text-emerald-600" : "text-destructive"}`}>
                    {selectedAnswer === quizQuestions[quizIdx].correctIdx ? t("quiz.correct") : `${t("quiz.incorrect")} — ${quizQuestions[quizIdx].number.name}`}
                  </span>
                  <button onClick={nextQuizQuestion} className="px-4 py-1.5 rounded-lg gradient-gold text-accent-foreground font-semibold text-xs">
                    {t("quiz.next")}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Image Recognition */}
          {quizQuestions[quizIdx].type === "image" && (
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-2">{t("numbers.imagePrompt")}</h3>
              <div className="bg-secondary/50 rounded-xl p-6 mb-4 text-center">
                <div className="text-4xl mb-2">
                  {renderEmojis(quizQuestions[quizIdx].number.value, EMOJI_MAP[quizQuestions[quizIdx].number.value] || "⬜")}
                </div>
                <p className="text-xs text-muted-foreground">{t("numbers.countItems")}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {quizQuestions[quizIdx].options!.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswer(i)}
                    className={`p-4 rounded-xl border text-2xl font-arabic transition-all ${
                      showAnswer
                        ? i === quizQuestions[quizIdx].correctIdx
                          ? "border-emerald-500 bg-emerald-500/10 text-emerald-700"
                          : i === selectedAnswer
                          ? "border-destructive bg-destructive/10 text-destructive"
                          : "border-border text-muted-foreground"
                        : selectedAnswer === i
                        ? "border-accent bg-accent/10"
                        : "border-border hover:border-accent/50 hover:bg-secondary text-foreground"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              {showAnswer && (
                <div className="mt-4 flex justify-between items-center">
                  <span className={`text-xs font-semibold ${selectedAnswer === quizQuestions[quizIdx].correctIdx ? "text-emerald-600" : "text-destructive"}`}>
                    {selectedAnswer === quizQuestions[quizIdx].correctIdx ? t("quiz.correct") : `${t("quiz.incorrect")} — ${quizQuestions[quizIdx].number.arabic}`}
                  </span>
                  <button onClick={nextQuizQuestion} className="px-4 py-1.5 rounded-lg gradient-gold text-accent-foreground font-semibold text-xs">
                    {t("quiz.next")}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Write */}
          {quizQuestions[quizIdx].type === "write" && (
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-1">{t("numbers.writePrompt")}</h3>
              <p className="text-lg font-bold text-accent mb-1">{quizQuestions[quizIdx].number.name} ({quizQuestions[quizIdx].number.value})</p>
              <p className="text-xs text-muted-foreground mb-4">{t("numbers.writeHint")}</p>
              <div className="flex gap-2 max-w-sm mx-auto">
                <input
                  type="text"
                  value={writeInput}
                  onChange={(e) => setWriteInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !writeResult && handleWriteCheck()}
                  placeholder={t("numbers.typePlaceholder")}
                  dir="rtl"
                  className="flex-1 p-2.5 rounded-lg border border-border bg-background text-foreground text-sm font-arabic focus:outline-none focus:ring-2 focus:ring-accent"
                  disabled={!!writeResult}
                />
                {!writeResult && (
                  <button onClick={handleWriteCheck} className="px-4 py-1.5 rounded-lg gradient-gold text-accent-foreground font-semibold text-xs">
                    {t("quiz.check")}
                  </button>
                )}
              </div>
              {writeResult && (
                <div className="mt-4 flex justify-between items-center">
                  <span className={`text-xs font-semibold flex items-center gap-1 ${writeResult === "correct" ? "text-emerald-600" : "text-destructive"}`}>
                    {writeResult === "correct" ? <><CheckCircle className="w-3.5 h-3.5" /> {t("quiz.correct")}</> : <><XCircle className="w-3.5 h-3.5" /> {t("alphabet.correctAnswer")}: {quizQuestions[quizIdx].number.word}</>}
                  </span>
                  <button onClick={nextQuizQuestion} className="px-4 py-1.5 rounded-lg gradient-gold text-accent-foreground font-semibold text-xs">
                    {t("quiz.next")}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* RESULTS PHASE */}
      {phase === "results" && (
        <div className="bg-card border border-border rounded-xl p-6 text-center animate-[fade-in-up_0.4s_ease-out]">
          {allDone ? (
            <>
              <Trophy className="w-12 h-12 text-accent mx-auto mb-3" />
              <h3 className="font-display text-2xl font-bold text-foreground mb-1">{t("numbers.allComplete")}</h3>
              <p className="text-4xl font-bold text-accent mb-1">{avgScore}%</p>
              <p className="text-sm text-muted-foreground mb-4">{t("alphabet.avgScore")}</p>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-6 max-w-lg mx-auto">
                {groupScores.map((score, i) => (
                  <div key={i} className={`p-2 rounded-lg border ${score >= 70 ? "border-emerald-500/50 bg-emerald-500/5" : "border-destructive/50 bg-destructive/5"}`}>
                    <p className="text-xs text-muted-foreground">{t("alphabet.group")} {i + 1}</p>
                    <p className={`text-sm font-bold ${score >= 70 ? "text-emerald-600" : "text-destructive"}`}>{score}%</p>
                  </div>
                ))}
              </div>
              <button onClick={restartAll} className="inline-flex items-center gap-2 px-5 py-2 rounded-lg gradient-gold text-accent-foreground font-semibold text-sm">
                <RotateCcw className="w-3.5 h-3.5" /> {t("alphabet.restart")}
              </button>
            </>
          ) : (
            <>
              <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
              <h3 className="font-display text-xl font-bold text-foreground mb-1">{t("alphabet.groupComplete")}</h3>
              <p className="text-3xl font-bold text-accent mb-1">{Math.round((currentScore / totalQuestions) * 100)}%</p>
              <p className="text-sm text-muted-foreground mb-4">{currentScore}/{totalQuestions} {t("quiz.correct").toLowerCase()}</p>
              <div className="flex gap-2 justify-center">
                <button onClick={() => { setPhase("learn"); startQuiz(); }} className="px-4 py-2 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                  <RotateCcw className="w-3.5 h-3.5" /> {t("quiz.restart")}
                </button>
                <button onClick={nextGroup} className="px-5 py-2 rounded-lg gradient-gold text-accent-foreground font-semibold text-xs flex items-center gap-1">
                  {t("alphabet.nextGroup")} <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default NumbersLearning;
