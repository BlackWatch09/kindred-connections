import { useEffect, useRef, useState } from "react";
import { Mic, Square, Loader2, Play, Sparkles } from "lucide-react";
import ToolShell from "./ToolShell";
import { callFn } from "@/lib/aiFn";

const SUGGESTIONS = [
  "السَّلامُ عَلَيْكُم",
  "أُحِبُّ اللُّغَةَ العَرَبِيَّة",
  "الشَّمْسُ ساطِعَةٌ اليَوْم",
  "قَرَأْتُ كِتاباً جَميلاً",
  "ذَهَبَ الطِّفْلُ إِلى الحَديقَة",
];

interface Letter { char: string; ok: boolean; note?: string; correct_hint?: string; }
interface Result { transcription: string; target: string; overall_score: number; feedback: string; letters: Letter[]; }

export default function VoiceCoachDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [target, setTarget] = useState(SUGGESTIONS[0]);
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const mimeRef = useRef<string>("audio/webm");

  useEffect(() => () => { if (audioUrl) URL.revokeObjectURL(audioUrl); }, [audioUrl]);

  const reset = () => { setResult(null); setError(null); if (audioUrl) URL.revokeObjectURL(audioUrl); setAudioUrl(null); };

  const start = async () => {
    reset();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mime = MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm"
        : MediaRecorder.isTypeSupported("audio/mp4") ? "audio/mp4" : "";
      mimeRef.current = mime || "audio/webm";
      const rec = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
      chunksRef.current = [];
      rec.ondataavailable = (e) => e.data.size && chunksRef.current.push(e.data);
      rec.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: mimeRef.current });
        setAudioUrl(URL.createObjectURL(blob));
        analyze(blob);
      };
      rec.start();
      recorderRef.current = rec;
      setRecording(true);
    } catch (e: any) {
      setError("لم أتمكن من الوصول إلى المايكروفون. الرجاء منح الإذن ثم المحاولة مجدداً.");
    }
  };

  const stop = () => { recorderRef.current?.stop(); setRecording(false); };

  const analyze = async (blob: Blob) => {
    setLoading(true); setError(null);
    try {
      const base64 = await blobToBase64(blob);
      const data = await callFn<Result>("pronunciation-coach", {
        audio_base64: base64,
        mime_type: mimeRef.current,
        target,
      });
      setResult(data);
    } catch (e: any) {
      setError(e.message || "تعذّر التحليل، حاول مرة أخرى.");
    } finally { setLoading(false); }
  };

  return (
    <ToolShell open={open} onClose={onClose} icon={<Mic className="w-5 h-5" />}
      title="المُصحّح الصوتي" subtitle="سجّل نطقك واحصل على تحليل لمخارج الحروف">
      <div className="space-y-6">
        <div>
          <label className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">الجملة المستهدفة</label>
          <textarea
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            rows={2}
            dir="rtl"
            className="mt-2 w-full border border-border bg-background p-3 font-display text-lg leading-relaxed focus:outline-none focus:border-accent"
          />
          <div className="mt-2 flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button key={s} type="button" onClick={() => setTarget(s)}
                className="text-xs px-3 py-1.5 border border-border hover:border-accent hover:bg-accent/5 transition-colors">
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 border border-dashed border-border p-6 bg-secondary/20">
          {!recording ? (
            <button onClick={start} disabled={loading}
              className="w-20 h-20 rounded-full bg-accent text-accent-foreground flex items-center justify-center shadow-lg hover:scale-105 transition disabled:opacity-50">
              <Mic className="w-8 h-8" />
            </button>
          ) : (
            <button onClick={stop}
              className="w-20 h-20 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg animate-pulse">
              <Square className="w-8 h-8" />
            </button>
          )}
          <p className="text-sm text-muted-foreground">
            {recording ? "جارٍ التسجيل… اضغط للإيقاف" : loading ? "يحلّل النطق…" : "اضغط الزر ثم انطق الجملة"}
          </p>
          {audioUrl && !recording && (
            <audio src={audioUrl} controls className="w-full max-w-sm" />
          )}
        </div>

        {loading && (
          <div className="flex items-center justify-center gap-2 text-accent">
            <Loader2 className="w-5 h-5 animate-spin" /> <span className="text-sm">جاري تحليل مخارج الحروف…</span>
          </div>
        )}

        {error && <div className="border border-red-300 bg-red-50 text-red-700 p-3 text-sm">{error}</div>}

        {result && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border border-border bg-secondary/30 p-4">
              <div>
                <p className="eyebrow">— نتيجة التحليل —</p>
                <p className="mt-1 text-sm text-muted-foreground">{result.feedback}</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-display font-bold text-accent">{result.overall_score}</div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">من 100</div>
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-2">ما نطقت</p>
              <p dir="rtl" className="font-display text-lg border border-border p-3 bg-background">{result.transcription || "—"}</p>
            </div>

            {result.target && (
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-2">الصياغة الصحيحة</p>
                <p dir="rtl" className="font-display text-lg border border-accent/40 p-3 bg-accent/5">{result.target}</p>
              </div>
            )}

            {result.letters?.length > 0 && (
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-2 flex items-center gap-2">
                  <Sparkles className="w-3 h-3" /> ملاحظات على الحروف
                </p>
                <div className="grid sm:grid-cols-2 gap-2">
                  {result.letters.map((l, i) => (
                    <div key={i} className={`border p-3 ${l.ok ? "border-emerald-300 bg-emerald-50" : "border-red-300 bg-red-50"}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`font-display text-2xl ${l.ok ? "text-emerald-700" : "text-red-700"}`}>{l.char}</span>
                        <span className={`text-[10px] uppercase tracking-widest font-bold ${l.ok ? "text-emerald-700" : "text-red-700"}`}>
                          {l.ok ? "سليم" : "يحتاج تحسين"}
                        </span>
                      </div>
                      {l.note && <p className="text-xs text-foreground/80">{l.note}</p>}
                      {l.correct_hint && <p className="text-xs text-muted-foreground mt-1">💡 {l.correct_hint}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button onClick={reset} className="w-full py-2 border border-border hover:border-accent text-sm font-semibold flex items-center justify-center gap-2">
              <Play className="w-4 h-4" /> جرّب مرة أخرى
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
