import { useState } from "react";
import { PenLine, Loader2, CheckCircle2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import ToolShell from "./ToolShell";
import { analyzeWriting, type WritingResult as Result } from "@/lib/aiFn";
import { friendlyError, MAX_TEXT_LEN } from "@/lib/errors";

export default function WritingAssistDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [text, setText] = useState("");
  const [level, setLevel] = useState<"beginner" | "intermediate" | "advanced">("beginner");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);

  const analyze = async () => {
    const trimmed = text.trim();
    if (!trimmed) { toast.error("اكتب فقرة قصيرة أولاً."); return; }
    if (trimmed.length < 3) { toast.error("النص قصير جداً للتحليل."); return; }
    if (trimmed.length > MAX_TEXT_LEN) {
      toast.error(`النص طويل جداً (الحد ${MAX_TEXT_LEN} حرف).`);
      return;
    }
    setLoading(true); setError(null); setResult(null);
    try { setResult(await analyzeWriting(trimmed, level)); }
    catch (e) { setError(friendlyError(e)); }
    finally { setLoading(false); }
  };

  return (
    <ToolShell open={open} onClose={onClose} icon={<PenLine className="w-5 h-5" />}
      title="مساعد الكتابة" subtitle="اكتب فقرة وسنصحّح النحو والإملاء مع الشرح">
      <div className="space-y-5">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">المستوى:</span>
          {(["beginner","intermediate","advanced"] as const).map((l) => (
            <button key={l} onClick={() => setLevel(l)}
              className={`px-3 py-1 text-xs border ${level === l ? "border-accent bg-accent/10 text-accent" : "border-border"}`}>
              {l === "beginner" ? "مبتدئ" : l === "intermediate" ? "متوسط" : "متقدم"}
            </button>
          ))}
        </div>

        <textarea value={text} onChange={(e) => setText(e.target.value)} dir="rtl" rows={6}
          placeholder="اكتب فقرة قصيرة بالعربية…"
          className="w-full border border-border bg-background p-3 font-display text-lg leading-loose focus:outline-none focus:border-accent" />

        <button onClick={analyze} disabled={loading || !text.trim()}
          className="w-full py-3 bg-primary text-primary-foreground font-semibold hover:bg-accent hover:text-accent-foreground transition flex items-center justify-center gap-2 disabled:opacity-60">
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> يقرأ النص…</> : "تحليل النص"}
        </button>

        {error && <div className="border border-red-300 bg-red-50 text-red-700 p-3 text-sm">{error}</div>}

        {result && (
          <div className="space-y-4">
            <div className="border border-border bg-secondary/30 p-4">
              <p className="eyebrow">— الملاحظة العامة —</p>
              <p className="mt-2 text-sm text-foreground/90" dir="rtl">{result.summary}</p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-2">النص بعد التصحيح</p>
              <p dir="rtl" className="font-display text-lg leading-loose border border-accent/40 bg-accent/5 p-4 whitespace-pre-line">
                {result.corrected}
              </p>
            </div>

            {result.issues?.length > 0 ? (
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-3 h-3" /> الأخطاء والتصويب
                </p>
                {result.issues.map((i, idx) => (
                  <div key={idx} className="border border-border p-3 bg-background">
                    <div className="flex items-center gap-2 flex-wrap mb-2" dir="rtl">
                      <span className="line-through text-red-600 font-display text-lg">{i.original}</span>
                      <span className="text-muted-foreground">→</span>
                      <span className="text-emerald-700 font-display text-lg">{i.correction}</span>
                      <span className="ms-auto text-[10px] uppercase tracking-widest bg-accent/10 text-accent px-2 py-0.5">{i.type}</span>
                    </div>
                    <p className="text-xs text-muted-foreground" dir="rtl">{i.explanation}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border border-emerald-300 bg-emerald-50 text-emerald-800 p-3 text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> نصك ممتاز، لا أخطاء ملحوظة!
              </div>
            )}
          </div>
        )}
      </div>
    </ToolShell>
  );
}
