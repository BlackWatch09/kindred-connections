import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { arabicAlphabet, getLetterGroups, ArabicLetter } from "@/data/arabicAlphabet";
import { Volume2, CheckCircle, XCircle, RotateCcw, ChevronRight, ChevronLeft, Trophy, Sparkles } from "lucide-react";

type QuizType = "mcq" | "match" | "write";

interface QuizQuestion {
  type: QuizType;
  letter: ArabicLetter;
  options?: string[];
  correctIdx?: number;
  matchPairs?: { letter: string; name: string }[];
}

const generateQuiz = (group: ArabicLetter[]): QuizQuestion[] => {
  const questions: QuizQuestion[] = [];
  const allLetters = arabicAlphabet;

  // MCQ: identify the letter by name
  group.forEach((letter) => {
    const wrong = allLetters
      .filter((l) => l.letter !== letter.letter)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    const options = [...wrong.map((w) => w.letter), letter.letter].sort(() => Math.random() - 0.5);
    questions.push({
      type: "mcq",
      letter,
      options,
      correctIdx: options.indexOf(letter.letter),
    });
  });

  // Match: match letters with names
  const shuffledNames = [...group].sort(() => Math.random() - 0.5);
  questions.push({
    type: "match",
    letter: group[0],
    matchPairs: group.map((l, i) => ({ letter: l.letter, name: shuffledNames[i].name })),
  });

  // Write: type the letter name
  const writeLetter = group[Math.floor(Math.random() * group.length)];
  questions.push({
    type: "write",
    letter: writeLetter,
  });

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

const Alphabet = () => {
  const { t } = useLanguage();
  const letterGroups = useMemo(() => getLetterGroups(), []);
  const [currentGroupIdx, setCurrentGroupIdx] = useState(0);
  const [phase, setPhase] = useState<"learn" | "quiz" | "results">("learn");
  const [currentLetterIdx, setCurrentLetterIdx] = useState(0);
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
  const [matchAnswerMap, setMatchAnswerMap] = useState<Record<number, number>>({});
  const [playingLetter, setPlayingLetter] = useState<string | null>(null);
  const [shuffledNames, setShuffledNames] = useState<ArabicLetter[]>([]);
  const [matchSelectedName, setMatchSelectedName] = useState<number | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const currentGroup = letterGroups[currentGroupIdx];
  const currentLetter = currentGroup?.[currentLetterIdx];
  const isLastGroup = currentGroupIdx >= letterGroups.length - 1;
  const allDone = phase === "results" && isLastGroup;

  const avgScore = useMemo(() => {
    if (groupScores.length === 0) return 0;
    return Math.round(groupScores.reduce((a, b) => a + b, 0) / groupScores.length);
  }, [groupScores]);

  // Save scores to localStorage
  useEffect(() => {
    if (groupScores.length > 0) {
      localStorage.setItem("alphabet_scores", JSON.stringify(groupScores));
    }
  }, [groupScores]);

  const handlePlaySound = useCallback((letter: ArabicLetter) => {
    setPlayingLetter(letter.letter);
    speakArabic(letter.nameAr);
    setTimeout(() => setPlayingLetter(null), 1200);
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
    setMatchSelected(null);
    setMatchedPairs([]);
    setMatchSelectedName(null);
    setShuffledNames([...currentGroup].sort(() => Math.random() - 0.5));
    setMatchAnswerMap({});
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
    const correct = quizQuestions[quizIdx].letter.name.toLowerCase();
    if (writeInput.trim().toLowerCase() === correct) {
      setWriteResult("correct");
      setCurrentScore((s) => s + 1);
    } else {
      setWriteResult("wrong");
    }
  };

  const handleMatchSelect = (idx: number) => {
    if (matchedPairs.includes(idx)) return;
    if (matchSelected === null) {
      setMatchSelected(idx);
    } else {
      const pairs = quizQuestions[quizIdx].matchPairs!;
      const group = letterGroups[currentGroupIdx];
      // Check if the two selected indices form a correct pair
      const letter1 = pairs[matchSelected].letter;
      const name2 = pairs[idx].name;
      const letter2 = pairs[idx].letter;
      const name1 = pairs[matchSelected].name;
      
      const isCorrect1 = group.some(l => l.letter === letter1 && l.name === name2);
      const isCorrect2 = group.some(l => l.letter === letter2 && l.name === name1);
      
      if (isCorrect1 || isCorrect2) {
        setMatchedPairs((p) => [...p, matchSelected, idx]);
        setCurrentScore((s) => s + 1);
      }
      setMatchSelected(null);
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
      setCurrentLetterIdx(0);
      setPhase("learn");
      sectionRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const restartAll = () => {
    setCurrentGroupIdx(0);
    setCurrentLetterIdx(0);
    setPhase("learn");
    setGroupScores([]);
    localStorage.removeItem("alphabet_scores");
  };

  const progressPct = Math.round(((currentGroupIdx + (phase === "results" ? 1 : 0)) / letterGroups.length) * 100);

  return (
    <div ref={sectionRef} className="relative z-10 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl font-bold text-foreground mb-2">
            {t("alphabet.title")}
          </h1>
          <p className="text-muted-foreground">{t("alphabet.subtitle")}</p>
        </div>

        {/* Overall progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>{t("alphabet.group")} {currentGroupIdx + 1} / {letterGroups.length}</span>
            <span>{progressPct}%</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div
              className="h-2 rounded-full gradient-gold transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* ===== LEARN PHASE ===== */}
        {phase === "learn" && (
          <div className="space-y-8 animate-[fade-in-up_0.4s_ease-out]">
            {/* Letter cards grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {currentGroup.map((letter, i) => (
                <button
                  key={letter.letter}
                  onClick={() => {
                    setCurrentLetterIdx(i);
                    handlePlaySound(letter);
                  }}
                  className={`group relative bg-card border rounded-2xl p-6 text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                    currentLetterIdx === i
                      ? "border-accent shadow-md ring-2 ring-accent/20"
                      : "border-border hover:border-accent/50"
                  }`}
                >
                  {/* Watermark */}
                  <span className="absolute inset-0 flex items-center justify-center text-8xl font-arabic text-accent/5 pointer-events-none select-none">
                    {letter.letter}
                  </span>
                  <div className="relative z-10">
                    <span className="text-5xl font-arabic text-foreground block mb-3">{letter.letter}</span>
                    <span className="text-sm font-semibold text-accent">{letter.name}</span>
                    <span className="block text-xs text-muted-foreground mt-1">/{letter.transliteration}/</span>
                    <div className={`mt-3 inline-flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
                      playingLetter === letter.letter ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground group-hover:bg-accent/20"
                    }`}>
                      <Volume2 className="w-4 h-4" />
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Detailed letter view */}
            {currentLetter && (
              <div className="bg-card border border-border rounded-2xl p-8 animate-[fade-in-up_0.3s_ease-out]">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="flex-shrink-0 w-32 h-32 rounded-2xl gradient-gold flex items-center justify-center">
                    <span className="text-7xl font-arabic text-accent-foreground">{currentLetter.letter}</span>
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h2 className="font-display text-2xl font-bold text-foreground mb-1">
                      {currentLetter.name} <span className="text-muted-foreground font-arabic">({currentLetter.nameAr})</span>
                    </h2>
                    <p className="text-muted-foreground mb-3">
                      {t("alphabet.transliteration")}: <span className="font-semibold text-foreground">/{currentLetter.transliteration}/</span>
                    </p>
                    <div className="bg-secondary/50 rounded-xl p-4 inline-block">
                      <span className="text-sm text-muted-foreground">{t("alphabet.example")}:</span>
                      <p className="text-2xl font-arabic text-foreground mt-1">{currentLetter.exampleWordAr}</p>
                      <p className="text-sm text-muted-foreground">
                        {currentLetter.exampleWord} — <span className="text-accent font-medium">{currentLetter.exampleMeaning}</span>
                      </p>
                    </div>
                    <button
                      onClick={() => handlePlaySound(currentLetter)}
                      className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-gold text-accent-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
                    >
                      <Volume2 className="w-4 h-4" /> {t("alphabet.listen")}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <button
                onClick={() => setCurrentLetterIdx(Math.max(0, currentLetterIdx - 1))}
                disabled={currentLetterIdx === 0}
                className="flex items-center gap-1 px-4 py-2 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:border-accent/50 transition-colors disabled:opacity-30"
              >
                <ChevronLeft className="w-4 h-4" /> {t("alphabet.prev")}
              </button>
              <button
                onClick={startQuiz}
                className="px-6 py-2.5 rounded-xl gradient-gold text-accent-foreground font-semibold text-sm hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" /> {t("alphabet.takeQuiz")}
              </button>
              <button
                onClick={() => setCurrentLetterIdx(Math.min(currentGroup.length - 1, currentLetterIdx + 1))}
                disabled={currentLetterIdx >= currentGroup.length - 1}
                className="flex items-center gap-1 px-4 py-2 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:border-accent/50 transition-colors disabled:opacity-30"
              >
                {t("alphabet.next")} <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ===== QUIZ PHASE ===== */}
        {phase === "quiz" && quizQuestions[quizIdx] && (
          <div className="bg-card border border-border rounded-2xl p-8 animate-[fade-in-up_0.4s_ease-out]">
            <div className="flex justify-between text-sm text-muted-foreground mb-4">
              <span>{t("alphabet.question")} {quizIdx + 1}/{quizQuestions.length}</span>
              <span>{currentScore} ✓</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-1.5 mb-6">
              <div className="h-1.5 rounded-full gradient-gold transition-all" style={{ width: `${((quizIdx + 1) / quizQuestions.length) * 100}%` }} />
            </div>

            {/* MCQ */}
            {quizQuestions[quizIdx].type === "mcq" && (
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {t("alphabet.mcqPrompt")}
                </h3>
                <p className="text-3xl font-arabic text-accent mb-6 font-bold">{quizQuestions[quizIdx].letter.name}</p>
                <div className="grid grid-cols-2 gap-3">
                  {quizQuestions[quizIdx].options!.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleMCQAnswer(i)}
                      className={`p-5 rounded-xl border text-3xl font-arabic transition-all ${
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
                  <div className="mt-6 flex justify-between items-center">
                    <span className={`text-sm font-semibold ${selectedAnswer === quizQuestions[quizIdx].correctIdx ? "text-emerald-600" : "text-destructive"}`}>
                      {selectedAnswer === quizQuestions[quizIdx].correctIdx ? t("quiz.correct") : `${t("quiz.incorrect")} — ${quizQuestions[quizIdx].letter.letter}`}
                    </span>
                    <button onClick={nextQuizQuestion} className="px-6 py-2 rounded-lg gradient-gold text-accent-foreground font-semibold text-sm">
                      {t("quiz.next")}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Match */}
            {quizQuestions[quizIdx].type === "match" && (
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-6">{t("alphabet.matchPrompt")}</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    {currentGroup.map((l, i) => (
                      <button
                        key={`l-${i}`}
                        onClick={() => {
                          if (matchedPairs.includes(i)) return;
                          setMatchSelected(matchSelected === i ? null : i);
                        }}
                        disabled={matchedPairs.includes(i)}
                        className={`w-full p-4 rounded-xl border text-2xl font-arabic transition-all ${
                          matchedPairs.includes(i)
                            ? "bg-emerald-500/10 border-emerald-500 opacity-50"
                            : matchSelected === i
                            ? "border-accent bg-accent/10"
                            : "border-border hover:border-accent/50"
                        }`}
                      >
                        {l.letter}
                      </button>
                    ))}
                  </div>
                  <div className="space-y-3">
                    {shuffledNames.map((l, i) => (
                      <button
                        key={`n-${i}`}
                        onClick={() => {
                          if (matchSelected === null) return;
                          const selectedLetter = currentGroup[matchSelected];
                          if (selectedLetter.name === l.name) {
                            setMatchedPairs(p => [...p, matchSelected]);
                            setCurrentScore(s => s + 1);
                          }
                          setMatchSelected(null);
                        }}
                        disabled={matchedPairs.some(pi => currentGroup[pi]?.name === l.name)}
                        className={`w-full p-4 rounded-xl border text-sm font-semibold transition-all ${
                          matchedPairs.some(pi => currentGroup[pi]?.name === l.name)
                            ? "bg-emerald-500/10 border-emerald-500 opacity-50"
                            : "border-border hover:border-accent/50 text-foreground"
                        }`}
                      >
                        {l.name}
                      </button>
                    ))}
                  </div>
                </div>
                {matchedPairs.length >= currentGroup.length && (
                  <div className="mt-6 flex justify-end">
                    <button onClick={nextQuizQuestion} className="px-6 py-2 rounded-lg gradient-gold text-accent-foreground font-semibold text-sm">
                      {t("quiz.next")}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Write */}
            {quizQuestions[quizIdx].type === "write" && (
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{t("alphabet.writePrompt")}</h3>
                <p className="text-6xl font-arabic text-accent mb-6 text-center">{quizQuestions[quizIdx].letter.letter}</p>
                <div className="flex gap-3 max-w-sm mx-auto">
                  <input
                    type="text"
                    value={writeInput}
                    onChange={(e) => setWriteInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !writeResult && handleWriteCheck()}
                    placeholder={t("alphabet.typeName")}
                    className="flex-1 p-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    disabled={!!writeResult}
                  />
                  {!writeResult && (
                    <button onClick={handleWriteCheck} className="px-5 py-2 rounded-lg gradient-gold text-accent-foreground font-semibold text-sm">
                      {t("quiz.check")}
                    </button>
                  )}
                </div>
                {writeResult && (
                  <div className="mt-6 flex justify-between items-center">
                    <span className={`text-sm font-semibold flex items-center gap-2 ${writeResult === "correct" ? "text-emerald-600" : "text-destructive"}`}>
                      {writeResult === "correct" ? <><CheckCircle className="w-4 h-4" /> {t("quiz.correct")}</> : <><XCircle className="w-4 h-4" /> {t("alphabet.correctAnswer")}: {quizQuestions[quizIdx].letter.name}</>}
                    </span>
                    <button onClick={nextQuizQuestion} className="px-6 py-2 rounded-lg gradient-gold text-accent-foreground font-semibold text-sm">
                      {t("quiz.next")}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ===== RESULTS PHASE ===== */}
        {phase === "results" && (
          <div className="bg-card border border-border rounded-2xl p-8 text-center animate-[fade-in-up_0.4s_ease-out]">
            {allDone ? (
              <>
                <Trophy className="w-16 h-16 text-accent mx-auto mb-4" />
                <h2 className="font-display text-3xl font-bold text-foreground mb-2">{t("alphabet.allComplete")}</h2>
                <p className="text-5xl font-bold text-accent mb-2">{avgScore}%</p>
                <p className="text-muted-foreground mb-6">{t("alphabet.avgScore")}</p>
                {/* Score breakdown */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8 max-w-2xl mx-auto">
                  {groupScores.map((score, i) => (
                    <div key={i} className={`p-3 rounded-xl border ${score >= 70 ? "border-emerald-500/50 bg-emerald-500/5" : "border-destructive/50 bg-destructive/5"}`}>
                      <p className="text-xs text-muted-foreground">{t("alphabet.group")} {i + 1}</p>
                      <p className={`text-lg font-bold ${score >= 70 ? "text-emerald-600" : "text-destructive"}`}>{score}%</p>
                    </div>
                  ))}
                </div>
                <button onClick={restartAll} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg gradient-gold text-accent-foreground font-semibold">
                  <RotateCcw className="w-4 h-4" /> {t("alphabet.restart")}
                </button>
              </>
            ) : (
              <>
                <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                <h2 className="font-display text-2xl font-bold text-foreground mb-2">{t("alphabet.groupComplete")}</h2>
                <p className="text-4xl font-bold text-accent mb-1">
                  {Math.round((currentScore / totalQuestions) * 100)}%
                </p>
                <p className="text-muted-foreground mb-6">{currentScore}/{totalQuestions} {t("quiz.correct").toLowerCase()}</p>
                <div className="flex gap-3 justify-center">
                  <button onClick={() => { setPhase("learn"); startQuiz(); }} className="px-5 py-2.5 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                    <RotateCcw className="w-4 h-4" /> {t("quiz.restart")}
                  </button>
                  <button onClick={nextGroup} className="px-6 py-2.5 rounded-lg gradient-gold text-accent-foreground font-semibold text-sm flex items-center gap-2">
                    {t("alphabet.nextGroup")} <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Alphabet;
