import { useEffect, useRef, useState } from "react";
import { Radio, Mic, Square, Loader2, Play, Volume2, RotateCcw, Trophy, Sparkles } from "lucide-react";
import ToolShell from "./ToolShell";
import { generateInterviewPlan, scoreInterview, type InterviewPlan, type InterviewFeedback, type InterviewTurn } from "@/lib/aiFn";
import { transcribeAudio } from "@/features/story-world/lib/streamChat";
import { speakArabic, stopSpeaking } from "@/lib/tts";
import { addPoints } from "@/lib/points";
import { useAuth } from "@/hooks/useAuth";

type Phase = "setup" | "loading" | "interview" | "scoring" | "done" | "error";

const LEVELS = [
  { value: "beginner", label: "مبتدئ" },
  { value: "intermediate", label: "متوسط" },
  { value: "advanced", label: "متقدم" },
];

const TOPICS = [
  "التعارف والحياة اليومية",
  "العمل والدراسة",
  "السفر والسياحة",
  "الطعام والمطبخ",
  "الهوايات والفنون",
];

export default function VoiceInterviewDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { user } = useAuth();
  const [phase, setPhase] = useState<Phase>("setup");
  const [level, setLevel] = useState("intermediate");
  const [topic, setTopic] = useState(TOPICS[0]);
  const [plan, setPlan] = useState<InterviewPlan | null>(null);
  const [step, setStep] = useState(0); // question index
  const [turns, setTurns] = useState<InterviewTurn[]>([]);
  const [recording, setRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [feedback, setFeedback] = useState<InterviewFeedback | null>(null);
  const [error, setError] = useState<string | null>(null);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const mimeRef = useRef<string>("audio/webm");
  const streamRef = useRef<MediaStream | null>(null);
  const awardedRef = useRef(false);

  // stop audio when closing
  useEffect(() => {
    if (!open) {
      stopSpeaking();
      setSpeaking(false);
      recorderRef.current?.stop?.();
      streamRef.current?.getTracks().forEach((t) => t.stop());
    }
  }, [open]);

  const reset = () => {
    stopSpeaking();
    setPhase("setup");
    setPlan(null);
    setStep(0);
    setTurns([]);
    setFeedback(null);
    setError(null);
    awardedRef.current = false;
  };

  const startInterview = async () => {
    setPhase("loading");
    setError(null);
    try {
      const p = await generateInterviewPlan(level, topic);
      setPlan(p);
      setStep(0);
      setTurns([]);
      setPhase("interview");
      // greet + ask first question
      await speak(`${p.intro} ${p.questions[0]}`);
    } catch (e: any) {
      setError(e.message || "تعذّر بدء المقابلة.");
      setPhase("error");
    }
  };

  const speak = async (text: string) => {
    setSpeaking(true);
    try {
      await speakArabic(text);
    } finally {
      // speakArabic resolves when playback starts; give it a moment
      setTimeout(() => setSpeaking(false), 300);
    }
  };

  const replayQuestion = async () => {
    if (!plan) return;
    await speak(plan.questions[step]);
  };

  const startRecording = async () => {
    setError(null);
    try {
      stopSpeaking();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mime = MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm"
        : MediaRecorder.isTypeSupported("audio/mp4") ? "audio/mp4" : "";
      mimeRef.current = mime || "audio/webm";
      const rec = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
      chunksRef.current = [];
      rec.ondataavailable = (e) => e.data.size && chunksRef.current.push(e.data);
      rec.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: mimeRef.current });
        handleAnswer(blob);
      };
      rec.start();
      recorderRef.current = rec;
      setRecording(true);
    } catch {
      setError("لم أتمكن من الوصول إلى المايكروفون. الرجاء منح الإذن.");
    }
  };

  const stopRecording = () => {
    recorderRef.current?.stop();
    setRecording(false);
  };

  const handleAnswer = async (blob: Blob) => {
    if (!plan) return;
    setTranscribing(true);
    try {
      const base64 = await blobToBase64(blob);
      const { text } = await transcribeAudio(base64, mimeRef.current);
      const answer = text.trim();
      const newTurns = [...turns, { question: plan.questions[step], answer }];
      setTurns(newTurns);
      const nextStep = step + 1;
      if (nextStep < plan.questions.length) {
        setStep(nextStep);
        await speak(plan.questions[nextStep]);
      } else {
        // finished — score
        setPhase("scoring");
        try {
          const fb = await scoreInterview(level, topic, newTurns);
          setFeedback(fb);
          if (!awardedRef.current) {
            const pts = Math.max(5, Math.round(fb.overall_score / 4));
            addPoints(user?.id, { tool: "interview", label: `مقابلة صوتية · ${topic}`, points: pts, meta: { level, score: fb.overall_score } });
            awardedRef.current = true;
          }
          setPhase("done");
        } catch (e: any) {
          setError(e.message || "تعذّر تقييم المقابلة.");
          setPhase("error");
        }
      }
    } catch (e: any) {
      setError(e.message || "تعذّر تفريغ الصوت.");
    } finally {
      setTranscribing(false);
    }
  };

  return (
    <ToolShell
      open={open}
      onClose={() => { reset(); onClose(); }}
      icon={<Radio className="w-5 h-5" />}
      title="المقابلة الصوتية"
      subtitle="مقابلة قصيرة يقودها سِراج بصوت واضح لتقييم طلاقتك"
      size="xl"
    >
      <div className="space-y-6" dir="rtl">
        {phase === "setup" && (
          <div className="space-y-5">
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">المستوى</label>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {LEVELS.map((l) => (
                  <button
                    key={l.value}
                    onClick={() => setLevel(l.value)}
                    className={`px-3 py-2 border text-sm font-semibold transition ${level === l.value ? "border-accent bg-accent/10 text-accent" : "border-border hover:border-accent"}`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">الموضوع</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {TOPICS.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTopic(t)}
                    className={`px-3 py-1.5 text-xs border transition ${topic === t ? "border-accent bg-accent/10 text-accent" : "border-border hover:border-accent"}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="mt-2 w-full border border-border bg-background p-3 text-sm focus:outline-none focus:border-accent"
                placeholder="أو اكتب موضوعك الخاص"
              />
            </div>

            <div className="border border-dashed border-border bg-secondary/20 p-4 text-sm text-muted-foreground leading-relaxed">
              🎙️ ستستمع لأربعة أسئلة صوتية. بعد كل سؤال اضغط زر التسجيل وأجب بصوتك، ثم أوقف التسجيل لينتقل سِراج للسؤال التالي.
            </div>

            <button
              onClick={startInterview}
              className="w-full py-3 bg-accent text-accent-foreground font-display font-bold text-lg hover:opacity-90 transition"
            >
              ابدأ المقابلة
            </button>
          </div>
        )}

        {phase === "loading" && (
          <div className="flex flex-col items-center gap-3 py-16 text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
            <p>يُعدّ سِراج أسئلة المقابلة…</p>
          </div>
        )}

        {phase === "interview" && plan && (
          <div className="space-y-5">
            <div className="flex items-center justify-between text-xs uppercase tracking-widest text-muted-foreground">
              <span>السؤال {step + 1} / {plan.questions.length}</span>
              <span>{plan.title}</span>
            </div>

            <div className="border border-accent/40 bg-accent/5 p-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-accent text-accent-foreground flex items-center justify-center shrink-0">
                  <Radio className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] uppercase tracking-widest text-accent font-semibold">سِراج يسأل</p>
                  <p className="mt-2 font-display text-xl leading-relaxed">{plan.questions[step]}</p>
                </div>
              </div>
              <button
                onClick={replayQuestion}
                disabled={speaking || recording}
                className="mt-4 inline-flex items-center gap-2 text-xs text-accent border border-accent/40 px-3 py-1.5 hover:bg-accent/10 transition disabled:opacity-50"
              >
                <Volume2 className="w-3.5 h-3.5" /> {speaking ? "يتحدّث…" : "أعد الاستماع"}
              </button>
            </div>

            <div className="flex flex-col items-center gap-3 border border-dashed border-border p-6 bg-secondary/20">
              {transcribing ? (
                <div className="flex items-center gap-2 text-accent">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-sm">يفرّغ إجابتك…</span>
                </div>
              ) : !recording ? (
                <button
                  onClick={startRecording}
                  disabled={speaking}
                  className="w-20 h-20 rounded-full bg-accent text-accent-foreground flex items-center justify-center shadow-lg hover:scale-105 transition disabled:opacity-50"
                >
                  <Mic className="w-8 h-8" />
                </button>
              ) : (
                <button
                  onClick={stopRecording}
                  className="w-20 h-20 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg animate-pulse"
                >
                  <Square className="w-8 h-8" />
                </button>
              )}
              <p className="text-sm text-muted-foreground text-center">
                {recording ? "جارٍ التسجيل… اضغط للإيقاف" : transcribing ? "يحلّل إجابتك…" : speaking ? "استمع للسؤال ثم أجب" : "اضغط الميكروفون وأجب بصوتك"}
              </p>
            </div>

            {turns.length > 0 && (
              <div className="space-y-2 max-h-48 overflow-y-auto border border-border p-3 bg-background">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">الإجابات السابقة</p>
                {turns.map((t, i) => (
                  <div key={i} className="text-xs border-b border-border/60 pb-2 last:border-0">
                    <p className="font-semibold text-primary">س{i + 1}: {t.question}</p>
                    <p className="text-muted-foreground mt-1">ج: {t.answer || "(لم يُلتقط صوت)"}</p>
                  </div>
                ))}
              </div>
            )}

            {error && <div className="border border-red-300 bg-red-50 text-red-700 p-3 text-sm">{error}</div>}
          </div>
        )}

        {phase === "scoring" && (
          <div className="flex flex-col items-center gap-3 py-16 text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
            <p>يقيّم سِراج أداءك…</p>
          </div>
        )}

        {phase === "done" && feedback && (
          <div className="space-y-5">
            <div className="flex items-center justify-between border border-accent/40 bg-accent/10 p-5">
              <div>
                <p className="eyebrow flex items-center gap-2"><Trophy className="w-4 h-4" /> — نتيجة المقابلة —</p>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{feedback.summary}</p>
              </div>
              <div className="text-center shrink-0">
                <div className="text-4xl font-display font-bold text-accent">{feedback.overall_score}</div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">من 100</div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { l: "الطلاقة", v: feedback.fluency },
                { l: "النطق", v: feedback.pronunciation },
                { l: "المفردات", v: feedback.vocabulary },
                { l: "النحو", v: feedback.grammar },
              ].map((s) => (
                <div key={s.l} className="border border-border p-3 text-center">
                  <div className="text-2xl font-display font-bold text-primary">{s.v}</div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">{s.l}</div>
                </div>
              ))}
            </div>

            {feedback.strengths.length > 0 && (
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-2">نقاط القوة</p>
                <ul className="space-y-1 text-sm">
                  {feedback.strengths.map((s, i) => (
                    <li key={i} className="border-r-2 border-emerald-400 pr-3 py-1">✓ {s}</li>
                  ))}
                </ul>
              </div>
            )}

            {feedback.improvements.length > 0 && (
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-2">اقتراحات للتحسين</p>
                <ul className="space-y-1 text-sm">
                  {feedback.improvements.map((s, i) => (
                    <li key={i} className="border-r-2 border-amber-400 pr-3 py-1">↑ {s}</li>
                  ))}
                </ul>
              </div>
            )}

            {feedback.suggested_phrases.length > 0 && (
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-2 flex items-center gap-2">
                  <Sparkles className="w-3 h-3" /> جمل بديلة يمكنك استخدامها
                </p>
                <div className="space-y-2">
                  {feedback.suggested_phrases.map((p, i) => (
                    <div key={i} className="border border-border p-3 bg-secondary/20">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-display text-base flex-1">{p.ar}</p>
                        <button onClick={() => speakArabic(p.ar)} className="text-accent hover:opacity-80 shrink-0" aria-label="استمع">
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>
                      {p.note && <p className="text-xs text-muted-foreground mt-1">{p.note}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <button onClick={reset} className="flex-1 py-2 border border-border hover:border-accent text-sm font-semibold flex items-center justify-center gap-2">
                <RotateCcw className="w-4 h-4" /> مقابلة جديدة
              </button>
              <button onClick={() => { reset(); onClose(); }} className="flex-1 py-2 bg-primary text-primary-foreground text-sm font-semibold">
                إنهاء
              </button>
            </div>
          </div>
        )}

        {phase === "error" && (
          <div className="space-y-4">
            <div className="border border-red-300 bg-red-50 text-red-700 p-4 text-sm">{error}</div>
            <button onClick={reset} className="w-full py-2 border border-border hover:border-accent text-sm font-semibold flex items-center justify-center gap-2">
              <Play className="w-4 h-4" /> حاول مرة أخرى
            </button>
          </div>
        )}
      </div>
    </ToolShell>
  );
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => { const s = r.result as string; resolve(s.split(",")[1] || ""); };
    r.onerror = () => reject(r.error);
    r.readAsDataURL(blob);
  });
}
