import { useState } from "react";
import { BookOpen, Loader2, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import ToolShell from "./ToolShell";
import { generateStory, type StoryResult as Story } from "@/lib/aiFn";

type Level = "beginner" | "intermediate" | "advanced";


const LEVELS: { id: Level; label: string }[] = [
  { id: "beginner", label: "مبتدئ" },
  { id: "intermediate", label: "متوسط" },
  { id: "advanced", label: "متقدم" },
];

const INTEREST_CHIPS = ["مغامرات", "رياضة", "طبخ", "فضاء", "حيوانات", "تاريخ", "صداقة", "بحر"];

export default function StoryGeneratorDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [level, setLevel] = useState<Level>("beginner");
  const [interests, setInterests] = useState("");
  const [length, setLength] = useState<"short" | "medium">("short");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [story, setStory] = useState<Story | null>(null);

  const generate = async () => {
    setLoading(true); setError(null); setStory(null);
    try {
      const data = await generateStory(level, interests, length);
      setStory(data);
    } catch (e: any) { setError(e.message || "تعذّر توليد القصة."); }
    finally { setLoading(false); }
  };

  return (
    <ToolShell open={open} onClose={onClose} icon={<BookOpen className="w-5 h-5" />}
      title="مولّد القصص التفاعلية" subtitle="قصة مشكّلة كاملة مصمّمة لمستواك واهتماماتك">
      <div className="space-y-5">
        <div>
          <label className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">المستوى</label>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {LEVELS.map((l) => (
              <button key={l.id} onClick={() => setLevel(l.id)}
                className={`py-2 text-sm font-semibold border transition ${level === l.id ? "border-accent bg-accent text-accent-foreground" : "border-border hover:border-accent"}`}>
                {l.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">اهتماماتك</label>
          <input value={interests} onChange={(e) => setInterests(e.target.value)}
            dir="rtl" placeholder="مثال: كرة القدم والفضاء"
            className="mt-2 w-full border border-border bg-background p-3 focus:outline-none focus:border-accent" />
          <div className="mt-2 flex flex-wrap gap-2">
            {INTEREST_CHIPS.map((c) => (
              <button key={c} type="button" onClick={() => setInterests((s) => (s ? `${s}، ${c}` : c))}
                className="text-xs px-3 py-1.5 border border-border hover:border-accent hover:bg-accent/5">
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">الطول</label>
          <div className="flex gap-2">
            {(["short", "medium"] as const).map((l) => (
              <button key={l} onClick={() => setLength(l)}
                className={`px-3 py-1.5 text-sm border ${length === l ? "border-accent bg-accent/10 text-accent" : "border-border"}`}>
                {l === "short" ? "قصيرة" : "متوسطة"}
              </button>
            ))}
          </div>
        </div>

        <button onClick={generate} disabled={loading}
          className="w-full py-3 bg-primary text-primary-foreground font-semibold hover:bg-accent hover:text-accent-foreground transition flex items-center justify-center gap-2 disabled:opacity-60">
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> يخُطّ سِراج قصتك…</> : <><Sparkles className="w-4 h-4" /> توليد قصة</>}
        </button>

        {error && <div className="border border-red-300 bg-red-50 text-red-700 p-3 text-sm">{error}</div>}

        {story && (
          <div className="space-y-4">
            <div className="border border-accent/40 bg-accent/5 p-5">
              <h4 className="font-display text-2xl md:text-3xl font-bold text-primary text-center mb-4" dir="rtl">{story.title}</h4>
              <p dir="rtl" className="font-display text-lg leading-loose text-foreground whitespace-pre-line">{story.story}</p>
            </div>

            {story.vocab?.length > 0 && (
              <div>
                <p className="eyebrow">— مفردات للحفظ —</p>
                <div className="mt-2 grid sm:grid-cols-2 gap-2">
                  {story.vocab.map((v, i) => (
                    <div key={i} className="border border-border p-3 flex justify-between items-center gap-3">
                      <span className="font-display text-lg text-accent">{v.word}</span>
                      <span className="text-sm text-muted-foreground text-right">{v.meaning}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {story.questions?.length > 0 && (
              <div>
                <p className="eyebrow">— أسئلة للتفكير —</p>
                <ol dir="rtl" className="mt-2 space-y-2 list-decimal list-inside text-sm">
                  {story.questions.map((q, i) => <li key={i}>{q}</li>)}
                </ol>
              </div>
            )}

            <div className="pt-2 flex flex-wrap gap-3">
              <button onClick={generate} className="px-4 py-2 border border-border hover:border-accent text-sm font-semibold">قصة جديدة</button>
              <Link to="/story" onClick={onClose} className="px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold">
                دخول عالم القصص التفاعلي ←
              </Link>
            </div>
          </div>
        )}
      </div>
    </ToolShell>
  );
}
