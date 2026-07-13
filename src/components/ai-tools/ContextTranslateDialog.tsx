import { useState } from "react";
import { Languages, Loader2 } from "lucide-react";
import ToolShell from "./ToolShell";
import { contextTranslate, type TranslateResult as Result } from "@/lib/aiFn";

export default function ContextTranslateDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [sentence, setSentence] = useState("ذَهَبَ الفارِسُ إلى المَعْرَكَة بِقَلْبٍ شُجاع.");
  const [word, setWord] = useState("");
  const [lang, setLang] = useState<"en" | "tr" | "ar">("en");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);

  const analyze = async () => {
    if (!sentence.trim()) return;
    setLoading(true); setError(null); setResult(null);
    try { setResult(await contextTranslate(sentence, word, lang)); }
    catch (e: any) { setError(e.message || "تعذّر التحليل."); }
    finally { setLoading(false); }
  };

  return (
    <ToolShell open={open} onClose={onClose} icon={<Languages className="w-5 h-5" />}
      title="المترجم السياقي الذكي" subtitle="فهم الكلمات داخل جملها، مع الجذر وأمثلة الاستخدام">
      <div className="space-y-5">
        <div>
          <label className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">الجملة</label>
          <textarea value={sentence} onChange={(e) => setSentence(e.target.value)} dir="rtl" rows={3}
            className="mt-2 w-full border border-border bg-background p-3 font-display text-lg focus:outline-none focus:border-accent" />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">الكلمة المركّز عليها (اختياري)</label>
            <input value={word} onChange={(e) => setWord(e.target.value)} dir="rtl" placeholder="اترك فارغاً للتحليل الذكي"
              className="mt-2 w-full border border-border bg-background p-3 focus:outline-none focus:border-accent" />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">لغة الترجمة</label>
            <div className="mt-2 flex gap-2">
              {([["en","English"],["tr","Türkçe"],["ar","عربي مُبسّط"]] as const).map(([id, label]) => (
                <button key={id} onClick={() => setLang(id)}
                  className={`flex-1 py-2 text-sm border ${lang === id ? "border-accent bg-accent/10 text-accent" : "border-border"}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button onClick={analyze} disabled={loading || !sentence.trim()}
          className="w-full py-3 bg-primary text-primary-foreground font-semibold hover:bg-accent hover:text-accent-foreground transition flex items-center justify-center gap-2 disabled:opacity-60">
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> يفكّك المعنى…</> : "تحليل سياقي"}
        </button>

        {error && <div className="border border-red-300 bg-red-50 text-red-700 p-3 text-sm">{error}</div>}

        {result && (
          <div className="space-y-4">
            <div className="border border-accent/40 bg-accent/5 p-4">
              <p className="eyebrow">— الكلمة —</p>
              <p className="font-display text-3xl text-primary mt-1" dir="rtl">{result.focus}</p>
              <p className="mt-2 text-sm text-foreground/90" dir="rtl">{result.contextual_meaning}</p>
            </div>

            <div className="grid sm:grid-cols-3 gap-2 text-sm">
              <InfoRow label="الجذر" value={result.root || "—"} />
              <InfoRow label="النوع" value={result.part_of_speech || "—"} />
              <InfoRow label="ترجمة الجملة" value={result.translation || "—"} />
            </div>

            {result.examples?.length > 0 && (
              <div>
                <p className="eyebrow">— أمثلة على الاستخدام —</p>
                <div className="mt-2 space-y-2">
                  {result.examples.map((ex, i) => (
                    <div key={i} className="border border-border p-3">
                      <p dir="rtl" className="font-display text-lg">{ex.ar}</p>
                      <p className="text-xs text-muted-foreground mt-1">{ex.translation}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.notes && (
              <div className="border border-dashed border-border bg-secondary/30 p-3 text-xs text-muted-foreground" dir="rtl">
                💡 {result.notes}
              </div>
            )}
          </div>
        )}
      </div>
    </ToolShell>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-border p-3 bg-background">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="mt-1 font-semibold text-foreground text-sm" dir="auto">{value}</div>
    </div>
  );
}
