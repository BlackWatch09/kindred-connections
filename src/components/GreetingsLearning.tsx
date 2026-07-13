import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { arabicExpressions, getExpressionGroups, ArabicExpression } from "@/data/arabicGreetings";
import { Volume2, CheckCircle, XCircle, RotateCcw, ChevronRight, ChevronLeft, Trophy, Sparkles, X } from "lucide-react";

type QuizType = "mcq" | "match" | "write";

interface QuizQuestion {
  type: QuizType;
  expression: ArabicExpression;
  options?: string[];
  correctIdx?: number;
}

const generateQuiz = (group: ArabicExpression[]): QuizQuestion[] => {
  const questions: QuizQuestion[] = [];
  const all = arabicExpressions;

  // MCQ for each expression
  group.forEach((expr) => {
    const wrong = all
      .filter((e) => e.id !== expr.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    const options = [...wrong.map((w) => w.meaning), expr.meaning].sort(() => Math.random() - 0.5);
    questions.push({
      type: "mcq",
      expression: expr,
      options,
      correctIdx: options.indexOf(expr.meaning),
    });
  });

  // Match question
  questions.push({ type: "match", expression: group[0] });

  // Write question
  const writeExpr = group[Math.floor(Math.random() * group.length)];
  questions.push({ type: "write", expression: writeExpr });

  return questions;
};

const speakArabic = (text: string) => {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "ar-SA";
    u.rate = 0.8;
    window.speechSynthesis.speak(u);
  }
};

interface GreetingsLearningProps {
  onClose?: () => void;
}

const GreetingsLearning = ({ onClose }: GreetingsLearningProps) => {
  const { t, language } = useLanguage();
  const expressionGroups = useMemo(() => getExpressionGroups(4), []);
  const [currentGroupIdx, setCurrentGroupIdx] = useState(0);
  const [phase, setPhase] = useState<"learn" | "quiz" | "results">("learn");
  const [currentExprIdx, setCurrentExprIdx] = useState(0);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [quizIdx, setQuizIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [groupScores, setGroupScores] = useState<number[]>([]);
  const [currentScore, setCurrentScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [writeInput, setWriteInput] = useState("");
  const [writeResult, setWriteResult] = useState<"correct" | "wrong" | null>(null);
  const [matchSelected, setMatchSelected] = useState<number | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<number[]>([]);
  const [playingExpr, setPlayingExpr] = useState<number | null>(null);
  const [shuffledMeanings, setShuffledMeanings] = useState<ArabicExpression[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);

  const currentGroup = expressionGroups[currentGroupIdx];
  const currentExpr = currentGroup?.[currentExprIdx];
  const isLastGroup = currentGroupIdx >= expressionGroups.length - 1;
  const allDone = phase === "results" && isLastGroup;

  const avgScore = useMemo(() => {
    if (groupScores.length === 0) return 0;
    return Math.round(groupScores.reduce((a, b) => a + b, 0) / groupScores.length);
  }, [groupScores]);

  useEffect(() => {
    if (groupScores.length > 0) {
      localStorage.setItem("greetings_scores", JSON.stringify(groupScores));
    }
  }, [groupScores]);

  const handlePlaySound = useCallback((expr: ArabicExpression) => {
    setPlayingExpr(expr.id);
    speakArabic(expr.arabic);
    setTimeout(() => setPlayingExpr(null), 1200);
  }, []);

  const handlePlayExample = useCallback((expr: ArabicExpression) => {
    speakArabic(expr.exampleAr);
  }, []);

  const getMeaning = (expr: ArabicExpression) => {
    if (language === "ar") return expr.meaningAr;
    if (language === "tr") return expr.meaningTr;
    return expr.meaning;
  };

  const getExample = (expr: ArabicExpression) => {
    if (language === "ar") return expr.exampleAr;
    if (language === "tr") return expr.exampleTr;
    return expr.exampleEn;
  };

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
    setMatchSelected(null);
    setMatchedPairs([]);
    setShuffledMeanings([...currentGroup].sort(() => Math.random() - 0.5));
    setPhase("quiz");
  };

  const handleMCQAnswer = (idx: number) => {
    if (showAnswer) return;
    setSelectedAnswer(idx);
    setShowAnswer(true);
    if (idx === quizQuestions[quizIdx].correctIdx) {
      setCurrentScore((s) => s + 1);
    }
  };

  const handleWriteCheck = () => {
    const correct = quizQuestions[quizIdx].expression.transliteration.toLowerCase().replace(/[ʿāūīṣḥḍṭẓ]/g, (c) => {
      const map: Record<string, string> = { "ʿ": "'", "ā": "a", "ū": "u", "ī": "i", "ṣ": "s", "ḥ": "h", "ḍ": "d", "ṭ": "t", "ẓ": "z" };
      return map[c] || c;
    });
    const input = writeInput.trim().toLowerCase();
    if (input === correct || input === quizQuestions[quizIdx].expression.transliteration.toLowerCase()) {
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
      setMatchSelected(null);
      setMatchedPairs([]);
    }
  };

  const nextGroup = () => {
    if (!isLastGroup) {
      setCurrentGroupIdx((i) => i + 1);
      setCurrentExprIdx(0);
      setPhase("learn");
      sectionRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const restartAll = () => {
    setCurrentGroupIdx(0);
    setCurrentExprIdx(0);
    setPhase("learn");
    setGroupScores([]);
    localStorage.removeItem("greetings_scores");
  };

  const progressPct = Math.round(((currentGroupIdx + (phase === "results" ? 1 : 0)) / expressionGroups.length) * 100);

  return (
    <div ref={sectionRef} className="mt-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-display text-xl font-bold text-foreground">{t("greetings.title")}</h3>
          <p className="text-sm text-muted-foreground">{t("greetings.subtitle")}</p>
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
          <span>{t("alphabet.group")} {currentGroupIdx + 1} / {expressionGroups.length}</span>
          <span>{progressPct}%</span>
        </div>
        <div className="w-full bg-secondary rounded-full h-1.5">
          <div className="h-1.5 rounded-full gradient-gold transition-all duration-500" style={{ width: `${progressPct}%` }} />
        </div>
      </div>

      {/* LEARN PHASE */}
      {phase === "learn" && (
        <div className="space-y-6 animate-[fade-in-up_0.4s_ease-out]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentGroup.map((expr, i) => (
              <button
                key={expr.id}
                onClick={() => { setCurrentExprIdx(i); handlePlaySound(expr); }}
                className={`group relative bg-card border rounded-xl p-4 text-right transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 ${
                  currentExprIdx === i ? "border-accent shadow-sm ring-2 ring-accent/20" : "border-border hover:border-accent/50"
                }`}
              >
                <div className="relative z-10">
                  <span className="text-2xl font-arabic text-foreground block mb-1">{expr.arabic}</span>
                  <span className="text-xs font-semibold text-accent block">{expr.transliteration}</span>
                  <span className="text-xs text-muted-foreground block">{getMeaning(expr)}</span>
                  <div className={`mt-2 inline-flex items-center justify-center w-7 h-7 rounded-full transition-colors ${
                    playingExpr === expr.id ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground group-hover:bg-accent/20"
                  }`}>
                    <Volume2 className="w-3.5 h-3.5" />
                  </div>
                </div>
              </button>
            ))}
          </div>

          {currentExpr && (
            <div className="bg-secondary/30 border border-border rounded-xl p-6 animate-[fade-in-up_0.3s_ease-out]">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="flex-shrink-0 w-28 h-28 rounded-xl gradient-gold flex items-center justify-center p-2">
                  <span className="text-2xl font-arabic text-accent-foreground text-center leading-tight">{currentExpr.arabic}</span>
                </div>
                <div className="flex-1 text-center sm:text-left space-y-2">
                  <h4 className="font-display text-lg font-bold text-foreground">
                    {currentExpr.transliteration}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {t("greetings.meaning")}: <span className="font-semibold text-foreground">{getMeaning(currentExpr)}</span>
                  </p>
                  <div className="bg-background rounded-lg p-3 inline-block">
                    <span className="text-xs text-muted-foreground">{t("greetings.example")}:</span>
                    <p className="text-lg font-arabic text-foreground">{currentExpr.exampleAr}</p>
                    <p className="text-xs text-muted-foreground">{getExample(currentExpr)}</p>
                    <button
                      onClick={() => handlePlayExample(currentExpr)}
                      className="mt-2 inline-flex items-center gap-1 px-3 py-1 rounded-md bg-secondary text-muted-foreground hover:text-foreground text-xs transition-colors"
                    >
                      <Volume2 className="w-3 h-3" /> {t("greetings.playExample")}
                    </button>
                  </div>
                  <div>
                    <button
                      onClick={() => handlePlaySound(currentExpr)}
                      className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-lg gradient-gold text-accent-foreground font-semibold text-xs hover:opacity-90 transition-opacity"
                    >
                      <Volume2 className="w-3.5 h-3.5" /> {t("alphabet.listen")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center">
            <button
              onClick={() => setCurrentExprIdx(Math.max(0, currentExprIdx - 1))}
              disabled={currentExprIdx === 0}
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
              onClick={() => setCurrentExprIdx(Math.min(currentGroup.length - 1, currentExprIdx + 1))}
              disabled={currentExprIdx >= currentGroup.length - 1}
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
              <h3 className="text-sm font-semibold text-foreground mb-1">{t("greetings.mcqPrompt")}</h3>
              <p className="text-3xl font-arabic text-accent mb-4 font-bold text-center">{quizQuestions[quizIdx].expression.arabic}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {quizQuestions[quizIdx].options!.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleMCQAnswer(i)}
                    className={`p-3 rounded-xl border text-sm text-left transition-all ${
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
                    {selectedAnswer === quizQuestions[quizIdx].correctIdx ? t("quiz.correct") : `${t("quiz.incorrect")} — ${quizQuestions[quizIdx].expression.meaning}`}
                  </span>
                  <button onClick={nextQuizQuestion} className="px-4 py-1.5 rounded-lg gradient-gold text-accent-foreground font-semibold text-xs">
                    {t("quiz.next")}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Match */}
          {quizQuestions[quizIdx].type === "match" && (
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-4">{t("greetings.matchPrompt")}</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  {currentGroup.map((expr, i) => (
                    <button
                      key={`e-${i}`}
                      onClick={() => {
                        if (matchedPairs.includes(i)) return;
                        setMatchSelected(matchSelected === i ? null : i);
                      }}
                      disabled={matchedPairs.includes(i)}
                      className={`w-full p-3 rounded-xl border text-lg font-arabic transition-all ${
                        matchedPairs.includes(i)
                          ? "bg-emerald-500/10 border-emerald-500 opacity-50"
                          : matchSelected === i
                          ? "border-accent bg-accent/10"
                          : "border-border hover:border-accent/50"
                      }`}
                    >
                      {expr.arabic}
                    </button>
                  ))}
                </div>
                <div className="space-y-2">
                  {shuffledMeanings.map((expr, i) => (
                    <button
                      key={`m-${i}`}
                      onClick={() => {
                        if (matchSelected === null) return;
                        const selectedExpr = currentGroup[matchSelected];
                        if (selectedExpr.meaning === expr.meaning) {
                          setMatchedPairs((p) => [...p, matchSelected]);
                          setCurrentScore((s) => s + 1);
                        }
                        setMatchSelected(null);
                      }}
                      disabled={matchedPairs.some((pi) => currentGroup[pi]?.meaning === expr.meaning)}
                      className={`w-full p-3 rounded-xl border text-xs font-semibold transition-all ${
                        matchedPairs.some((pi) => currentGroup[pi]?.meaning === expr.meaning)
                          ? "bg-emerald-500/10 border-emerald-500 opacity-50"
                          : "border-border hover:border-accent/50 text-foreground"
                      }`}
                    >
                      {expr.meaning}
                    </button>
                  ))}
                </div>
              </div>
              {matchedPairs.length >= currentGroup.length && (
                <div className="mt-4 flex justify-end">
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
              <h3 className="text-sm font-semibold text-foreground mb-1">{t("greetings.writePrompt")}</h3>
              <p className="text-4xl font-arabic text-accent mb-4 text-center">{quizQuestions[quizIdx].expression.arabic}</p>
              <div className="flex gap-2 max-w-sm mx-auto">
                <input
                  type="text"
                  value={writeInput}
                  onChange={(e) => setWriteInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !writeResult && handleWriteCheck()}
                  placeholder={t("greetings.typeTransliteration")}
                  className="flex-1 p-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent"
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
                    {writeResult === "correct" ? <><CheckCircle className="w-3.5 h-3.5" /> {t("quiz.correct")}</> : <><XCircle className="w-3.5 h-3.5" /> {t("alphabet.correctAnswer")}: {quizQuestions[quizIdx].expression.transliteration}</>}
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

      {/* RESULTS */}
      {phase === "results" && (
        <div className="bg-card border border-border rounded-xl p-6 text-center animate-[fade-in-up_0.4s_ease-out]">
          {allDone ? (
            <>
              <Trophy className="w-12 h-12 text-accent mx-auto mb-3" />
              <h3 className="font-display text-2xl font-bold text-foreground mb-1">{t("greetings.allComplete")}</h3>
              <p className="text-4xl font-bold text-accent mb-1">{avgScore}%</p>
              <p className="text-sm text-muted-foreground mb-4">{t("alphabet.avgScore")}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6 max-w-lg mx-auto">
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
              <p className="text-3xl font-bold text-accent mb-1">
                {Math.round((currentScore / totalQuestions) * 100)}%
              </p>
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

export default GreetingsLearning;
