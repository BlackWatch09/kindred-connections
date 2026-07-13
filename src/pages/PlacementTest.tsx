import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { placementQuestions, PlacementQuestion } from "@/data/placementTestQuestions";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Volume2, RotateCcw, Share2, ArrowRight, CheckCircle, XCircle } from "lucide-react";

const STORAGE_KEY = "placement_test_progress";
const RESULT_KEY = "placement_test_result";

const speakArabic = (text: string) => {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "ar-SA";
  u.rate = 0.8;
  window.speechSynthesis.speak(u);
};

interface SavedProgress {
  currentIndex: number;
  answers: Record<number, string>;
}

interface TestResult {
  score: number;
  total: number;
  easy: { correct: number; total: number };
  intermediate: { correct: number; total: number };
  advanced: { correct: number; total: number };
  answers: Record<number, string>;
  date: string;
}

const PlacementTest = () => {
  const navigate = useNavigate();
  const questions = placementQuestions;
  const total = questions.length;

  // Load saved progress
  const loadProgress = (): SavedProgress => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return { currentIndex: 0, answers: {} };
  };

  const [currentIndex, setCurrentIndex] = useState(() => loadProgress().currentIndex);
  const [answers, setAnswers] = useState<Record<number, string>>(() => loadProgress().answers);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [fillInput, setFillInput] = useState("");
  const [matchSelections, setMatchSelections] = useState<Record<string, string>>({});
  const [showResult, setShowResult] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);

  // Check if already completed
  useEffect(() => {
    const savedResult = localStorage.getItem(RESULT_KEY);
    const progress = loadProgress();
    if (savedResult && Object.keys(progress.answers).length === total) {
      setAnswers(progress.answers);
      setShowResult(true);
    }
  }, []);

  // Save progress
  useEffect(() => {
    if (!showResult) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ currentIndex, answers }));
    }
  }, [currentIndex, answers, showResult]);

  const currentQ = questions[currentIndex];

  const submitAnswer = useCallback(() => {
    let answer = "";
    if (currentQ.type === "fillBlank") {
      answer = fillInput.trim();
    } else if (currentQ.type === "matching" && currentQ.matchPairs) {
      answer = currentQ.matchPairs.map(p => `${p.left}:${matchSelections[p.left] || ""}`).join(",");
    } else {
      answer = selectedOption || "";
    }
    if (!answer) return;

    const newAnswers = { ...answers, [currentQ.id]: answer };
    setAnswers(newAnswers);

    if (currentIndex + 1 >= total) {
      // Complete
      const result = calculateResult(newAnswers);
      localStorage.setItem(RESULT_KEY, JSON.stringify(result));
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ currentIndex: currentIndex, answers: newAnswers }));
      setShowResult(true);
    } else {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setFillInput("");
      setMatchSelections({});
    }
  }, [currentQ, selectedOption, fillInput, matchSelections, answers, currentIndex, total]);

  const calculateResult = (ans: Record<number, string>): TestResult => {
    const levels = { easy: { correct: 0, total: 10 }, intermediate: { correct: 0, total: 10 }, advanced: { correct: 0, total: 10 } };
    let totalCorrect = 0;

    questions.forEach(q => {
      const userAns = ans[q.id] || "";
      const isCorrect = userAns.trim() === q.correctAnswer.trim();
      if (isCorrect) {
        totalCorrect++;
        levels[q.level].correct++;
      }
    });

    return { score: totalCorrect, total, ...levels, answers: ans, date: new Date().toISOString() };
  };

  const result = useMemo(() => {
    if (!showResult) return null;
    return calculateResult(answers);
  }, [showResult, answers]);

  const percentage = result ? Math.round((result.score / result.total) * 100) : 0;

  const levelLabel = percentage >= 70 ? "Advanced" : percentage >= 40 ? "Intermediate" : "Beginner";
  const levelRoute = percentage >= 70 ? "/courses#advanced" : percentage >= 40 ? "/courses#intermediate" : "/courses";
  const levelColor = percentage >= 70 ? "text-purple-600" : percentage >= 40 ? "text-blue-600" : "text-emerald-600";

  const retake = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(RESULT_KEY);
    setCurrentIndex(0);
    setAnswers({});
    setSelectedOption(null);
    setFillInput("");
    setMatchSelections({});
    setShowResult(false);
    setIsReviewing(false);
  };

  const shareResult = () => {
    const text = `I scored ${percentage}% on the AlifXpert Arabic Placement Test! My level: ${levelLabel}. 🎓`;
    if (navigator.share) {
      navigator.share({ title: "AlifXpert Placement Test", text });
    } else {
      navigator.clipboard.writeText(text);
    }
  };

  // ====== REVIEW MODE ======
  if (isReviewing) {
    return (
      <div className="relative z-10 py-12 px-4 min-h-screen">
        <div className="container mx-auto max-w-3xl">
          <div className="flex items-center justify-between mb-8">
            <h1 className="font-display text-2xl font-bold text-foreground">Review Answers</h1>
            <Button variant="outline" onClick={() => setIsReviewing(false)}>Back to Results</Button>
          </div>
          <div className="space-y-4">
            {questions.map((q, i) => {
              const userAns = answers[q.id] || "(no answer)";
              const isCorrect = userAns.trim() === q.correctAnswer.trim();
              return (
                <div key={q.id} className={`p-4 rounded-xl border ${isCorrect ? "border-emerald-300 bg-emerald-500/5" : "border-destructive/30 bg-destructive/5"}`}>
                  <div className="flex items-start gap-2">
                    {isCorrect ? <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" /> : <XCircle className="w-5 h-5 text-destructive mt-0.5 shrink-0" />}
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground mb-1">Q{i + 1} – {q.label} ({q.level})</p>
                      <p className="text-sm font-medium text-foreground mb-2">{q.question}</p>
                      <p className="text-sm"><span className="text-muted-foreground">Your answer:</span> <span className={isCorrect ? "text-emerald-600 font-semibold" : "text-destructive font-semibold"}>{userAns}</span></p>
                      {!isCorrect && <p className="text-sm"><span className="text-muted-foreground">Correct:</span> <span className="text-emerald-600 font-semibold">{q.correctAnswer}</span></p>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ====== RESULTS ======
  if (showResult && result) {
    return (
      <div className="relative z-10 py-12 px-4 min-h-screen">
        <div className="container mx-auto max-w-2xl">
          <div className="bg-card border border-border rounded-2xl p-8 text-center" style={{ animation: "fade-in-up 0.6s ease-out" }}>
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">Placement Test Results</h1>
            <p className="text-muted-foreground mb-8">Here's how you did</p>

            <div className="text-6xl font-bold text-accent mb-2">{percentage}%</div>
            <p className="text-muted-foreground mb-8">{result.score} / {result.total} correct answers</p>

            {/* Breakdown */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {([
                { label: "Easy", data: result.easy, color: "text-emerald-600" },
                { label: "Intermediate", data: result.intermediate, color: "text-blue-600" },
                { label: "Advanced", data: result.advanced, color: "text-purple-600" },
              ] as const).map(s => (
                <div key={s.label} className="bg-secondary rounded-xl p-4">
                  <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
                  <p className={`text-2xl font-bold ${s.color}`}>{s.data.correct}/{s.data.total}</p>
                </div>
              ))}
            </div>

            {/* Level classification */}
            <div className="bg-secondary rounded-xl p-6 mb-8">
              <p className="text-sm text-muted-foreground mb-1">Your level is</p>
              <p className={`text-3xl font-bold font-display ${levelColor}`}>{levelLabel}</p>
              <p className="text-sm text-muted-foreground mt-2">
                {percentage >= 70 ? "Excellent! You have a strong foundation in Arabic." :
                 percentage >= 40 ? "Good job! You know the basics and are ready for more." :
                 "Great start! Let's build your Arabic skills from the ground up."}
              </p>
            </div>

            {/* CTA */}
            <Button
              onClick={() => navigate(levelRoute)}
              className="gradient-gold text-accent-foreground font-semibold text-lg px-8 py-3 h-auto rounded-xl shadow-lg mb-4 w-full sm:w-auto"
            >
              Go to {levelLabel} Level <ArrowRight className="w-5 h-5 ml-2" />
            </Button>

            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
              <Button variant="outline" onClick={retake} className="gap-2">
                <RotateCcw className="w-4 h-4" /> Retake Test
              </Button>
              <Button variant="outline" onClick={shareResult} className="gap-2">
                <Share2 className="w-4 h-4" /> Share Result
              </Button>
              <Button variant="ghost" onClick={() => setIsReviewing(true)} className="gap-2">
                Review Answers
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ====== QUIZ UI ======
  const progressPct = ((currentIndex + 1) / total) * 100;
  const levelBadge = currentQ.level === "easy" ? "bg-emerald-500/10 text-emerald-600" : currentQ.level === "intermediate" ? "bg-blue-500/10 text-blue-600" : "bg-purple-500/10 text-purple-600";

  return (
    <div className="relative z-10 py-12 px-4 min-h-screen">
      <div className="container mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-2xl font-bold text-foreground text-center mb-4">Placement Test</h1>
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <span>Question {currentIndex + 1} of {total}</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${levelBadge}`}>
              {currentQ.level.charAt(0).toUpperCase() + currentQ.level.slice(1)}
            </span>
          </div>
          <Progress value={progressPct} className="h-2" />
        </div>

        {/* Question Card */}
        <div className="bg-card border border-border rounded-2xl p-8" style={{ animation: "fade-in-up 0.4s ease-out" }}>
          <p className="text-xs text-muted-foreground mb-1">Question {currentIndex + 1} – {currentQ.label}</p>
          <h2 className="text-lg font-semibold text-foreground mb-6">{currentQ.question}</h2>

          {/* Audio button for listening questions */}
          {currentQ.type === "listening" && currentQ.arabicAudio && (
            <button
              onClick={() => speakArabic(currentQ.arabicAudio!)}
              className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent/10 border border-accent/30 text-accent font-medium hover:bg-accent/20 transition-colors"
            >
              <Volume2 className="w-5 h-5" /> Play Sound
            </button>
          )}

          {/* MCQ / True-False / Spelling / Listening with options */}
          {(currentQ.type === "mcq" || currentQ.type === "trueFalse" || currentQ.type === "listening" || currentQ.type === "spelling") && currentQ.options && (
            <div className="grid gap-3">
              {currentQ.options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setSelectedOption(opt)}
                  className={`w-full text-left p-4 rounded-xl border text-sm font-medium transition-all ${
                    selectedOption === opt
                      ? "border-accent bg-accent/10 text-foreground"
                      : "border-border text-foreground hover:border-accent/50 hover:bg-secondary"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}

          {/* Fill in the blank */}
          {currentQ.type === "fillBlank" && (
            <input
              type="text"
              dir="rtl"
              value={fillInput}
              onChange={(e) => setFillInput(e.target.value)}
              placeholder="اكتب إجابتك هنا..."
              className="w-full p-4 rounded-xl border border-border bg-background text-foreground font-arabic text-lg focus:outline-none focus:ring-2 focus:ring-accent"
              onKeyDown={(e) => e.key === "Enter" && submitAnswer()}
            />
          )}

          {/* Matching */}
          {currentQ.type === "matching" && currentQ.matchPairs && (
            <div className="space-y-3">
              {currentQ.matchPairs.map((pair) => (
                <div key={pair.left} className="flex items-center gap-3">
                  <span className="font-arabic text-lg text-foreground w-20 text-right">{pair.left}</span>
                  <span className="text-muted-foreground">→</span>
                  <select
                    value={matchSelections[pair.left] || ""}
                    onChange={(e) => setMatchSelections({ ...matchSelections, [pair.left]: e.target.value })}
                    className="flex-1 p-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    <option value="">Select meaning...</option>
                    {currentQ.matchPairs!.map(p => (
                      <option key={p.right} value={p.right}>{p.right}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          )}

          {/* Submit */}
          <div className="mt-8 flex justify-end">
            <Button
              onClick={submitAnswer}
              disabled={
                (currentQ.type === "fillBlank" && !fillInput.trim()) ||
                ((currentQ.type === "mcq" || currentQ.type === "trueFalse" || currentQ.type === "listening" || currentQ.type === "spelling") && !selectedOption) ||
                (currentQ.type === "matching" && currentQ.matchPairs && Object.keys(matchSelections).length < currentQ.matchPairs.length)
              }
              className="gradient-gold text-accent-foreground font-semibold px-8 rounded-xl"
            >
              {currentIndex + 1 >= total ? "Finish Test" : "Next"} <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlacementTest;
