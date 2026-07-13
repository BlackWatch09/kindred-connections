import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Flame, Star, BookOpen, ArrowRight, Play, Sparkles, Wand2,
  Trophy, Search, Compass, Calendar, MessageCircle, Target,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { WORLDS as worlds } from "@/features/story-world/data/worlds";

type StorySession = {
  id: string;
  world_id: string;
  level: string;
  stars: number | null;
  words_learned: number | null;
  started_at: string;
  ended_at: string | null;
};

type Vocab = {
  id: string;
  word: string;
  meaning: string | null;
  created_at: string;
};

type LocalCorrection = {
  original: string;
  corrected: string;
  hint: string;
  at: number;
  worldId: string;
  worldName: string;
};

type LocalSession = {
  id: string;
  worldId: string;
  worldName: string;
  stars: number;
  words: number;
  accuracy: number;
  at: number;
};

const worldNameById = (id: string) => worlds.find((w) => w.id === id)?.nameAr ?? id;

const Dashboard = () => {
  const { user, profile } = useAuth();

  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<StorySession[]>([]);
  const [vocab, setVocab] = useState<Vocab[]>([]);
  const [corrections, setCorrections] = useState<LocalCorrection[]>([]);
  const [localSessions, setLocalSessions] = useState<LocalSession[]>([]);
  const [vocabQuery, setVocabQuery] = useState("");

  const displayName =
    profile?.full_name ||
    (user?.user_metadata?.full_name as string | undefined) ||
    user?.email?.split("@")[0] ||
    "طالب";

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      const [sRes, vRes] = await Promise.all([
        supabase
          .from("story_sessions")
          .select("id, world_id, level, stars, words_learned, started_at, ended_at")
          .eq("user_id", user.id)
          .order("started_at", { ascending: false })
          .limit(50),
        supabase
          .from("learned_vocabulary")
          .select("id, word, meaning, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(500),
      ]);
      if (cancelled) return;
      setSessions((sRes.data as StorySession[]) ?? []);
      setVocab((vRes.data as Vocab[]) ?? []);
      try {
        setCorrections(
          JSON.parse(localStorage.getItem(`story_corrections_${user.id}`) || "[]"),
        );
        setLocalSessions(
          JSON.parse(localStorage.getItem(`story_sessions_local_${user.id}`) || "[]"),
        );
      } catch { /* ignore */ }
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [user]);

  const stats = useMemo(() => {
    const completed = sessions.filter((s) => s.ended_at);
    const totalStars = completed.reduce((sum, s) => sum + (s.stars ?? 0), 0);
    const totalWords = vocab.length;
    const avgAccuracy = localSessions.length
      ? Math.round(localSessions.reduce((s, x) => s + x.accuracy, 0) / localSessions.length)
      : null;
    // Streak: consecutive days with at least one session
    const days = new Set(
      sessions.map((s) => new Date(s.started_at).toISOString().slice(0, 10)),
    );
    let streak = 0;
    const d = new Date();
    while (days.has(d.toISOString().slice(0, 10))) {
      streak++;
      d.setDate(d.getDate() - 1);
    }
    return { completedCount: completed.length, totalStars, totalWords, avgAccuracy, streak };
  }, [sessions, vocab, localSessions]);

  const filteredVocab = useMemo(() => {
    const q = vocabQuery.trim();
    if (!q) return vocab;
    return vocab.filter(
      (v) =>
        v.word.includes(q) ||
        (v.meaning ?? "").includes(q),
    );
  }, [vocab, vocabQuery]);

  const recentCompleted = useMemo(
    () => sessions.filter((s) => s.ended_at).slice(0, 5),
    [sessions],
  );

  const suggestedWorld = useMemo(() => {
    const played = new Set(sessions.map((s) => s.world_id));
    return worlds.find((w) => !played.has(w.id)) ?? worlds[0];
  }, [sessions]);

  return (
    <div className="relative z-10 py-6 md:py-10 px-4" dir="rtl">
      <div className="container mx-auto max-w-6xl space-y-6">

        {/* Welcome */}
        <div className="bg-card border border-border rounded-3xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div className="min-w-0">
              <p className="text-sm text-muted-foreground font-arabic">أهلاً بعودتك</p>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground truncate">
                {displayName} 👋
              </h1>
              <p className="text-muted-foreground font-arabic mt-1 text-sm">
                رحلتك مع العربية — كل محادثة تبنيك خطوة أقرب للطلاقة.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                to={`/story/${suggestedWorld.id}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-gold text-accent-foreground font-arabic font-semibold hover:opacity-90 transition-opacity shadow-md"
              >
                <Play className="w-4 h-4" /> ابدأ محادثة الآن
              </Link>
              <Link
                to="/story"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border text-foreground font-arabic hover:bg-secondary transition-colors"
              >
                <Compass className="w-4 h-4" /> كل العوالم
              </Link>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          <StatTile icon={<Trophy className="w-4 h-4" />} value={stats.completedCount} label="مشهد أنهيته" tone="accent" />
          <StatTile icon={<Star className="w-4 h-4" />} value={stats.totalStars} label="نجمة كسبتها" tone="amber" />
          <StatTile icon={<BookOpen className="w-4 h-4" />} value={stats.totalWords} label="كلمة تعلمتها" tone="primary" />
          <StatTile icon={<Wand2 className="w-4 h-4" />} value={stats.avgAccuracy != null ? `${stats.avgAccuracy}%` : "—"} label="متوسط دقتك" tone="emerald" />
          <StatTile icon={<Flame className="w-4 h-4" />} value={stats.streak} label="يوم متتالي" tone="rose" />
        </div>

        {/* Two column */}
        <div className="grid lg:grid-cols-3 gap-6">

          {/* Recent scenes */}
          <section className="lg:col-span-2 bg-card border border-border rounded-3xl p-5 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-accent" /> آخر مشاهدك
              </h2>
              <Link to="/story" className="text-xs text-accent hover:underline font-arabic">جميع العوالم</Link>
            </div>

            {loading ? (
              <SkeletonList />
            ) : recentCompleted.length === 0 ? (
              <EmptyState
                title="لم تُنهِ أي مشهد بعد"
                subtitle="ادخل إلى عالم وابدأ محادثة قصيرة — أول مشهد يستغرق دقائق."
                ctaLabel="ابدأ الآن"
                to={`/story/${suggestedWorld.id}`}
              />
            ) : (
              <ul className="space-y-2">
                {recentCompleted.map((s) => {
                  const local = localSessions.find((x) => x.id === s.id);
                  return (
                    <li
                      key={s.id}
                      className="flex items-center gap-3 p-3 rounded-2xl bg-secondary/50 hover:bg-secondary transition-colors"
                    >
                      <div className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center text-accent-foreground flex-shrink-0">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-arabic font-semibold text-foreground truncate">
                          {worldNameById(s.world_id)}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                          <Calendar className="w-3 h-3" />
                          {new Date(s.started_at).toLocaleDateString("ar-EG")}
                          <span className="opacity-40">•</span>
                          <BookOpen className="w-3 h-3" /> {s.words_learned ?? 0} كلمة
                          {local?.accuracy != null && (
                            <>
                              <span className="opacity-40">•</span>
                              <Wand2 className="w-3 h-3" /> {local.accuracy}%
                            </>
                          )}
                        </p>
                      </div>
                      <div className="flex items-center gap-0.5 flex-shrink-0">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${i < (s.stars ?? 0) ? "fill-amber-400 text-amber-400" : "text-muted"}`}
                          />
                        ))}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          {/* Suggested world */}
          <section className="bg-card border border-border rounded-3xl overflow-hidden">
            <div className="relative h-32">
              <img src={suggestedWorld.worldImage} alt={suggestedWorld.nameAr} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-2 right-3 left-3 text-white">
                <p className="text-[10px] uppercase tracking-wider opacity-80">اقتراح لك</p>
                <p className="font-arabic text-lg font-bold truncate">{suggestedWorld.nameAr}</p>
              </div>
            </div>
            <div className="p-5">
              <p className="font-arabic text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                {suggestedWorld.tagline}
              </p>
              <Link
                to={`/story/${suggestedWorld.id}`}
                className="inline-flex items-center gap-2 w-full justify-center px-4 py-2.5 rounded-xl gradient-gold text-accent-foreground font-arabic font-semibold hover:opacity-90"
              >
                <Play className="w-4 h-4" /> ادخل هذا العالم
                <ArrowRight className="w-4 h-4 rotate-180" />
              </Link>
            </div>
          </section>
        </div>

        {/* Vocabulary */}
        <section className="bg-card border border-border rounded-3xl p-5 md:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-accent" /> مكتبة كلماتك
              <span className="text-xs text-muted-foreground font-normal">
                ({vocab.length})
              </span>
            </h2>
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={vocabQuery}
                onChange={(e) => setVocabQuery(e.target.value)}
                placeholder="ابحث بكلمة أو معنى…"
                className="w-full sm:w-64 pr-9 pl-3 py-2 rounded-xl bg-background border border-border text-sm font-arabic focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>

          {loading ? (
            <SkeletonList />
          ) : filteredVocab.length === 0 ? (
            <EmptyState
              title={vocabQuery ? "لا يوجد نتائج" : "لا كلمات محفوظة بعد"}
              subtitle={vocabQuery ? "جرّب كلمة أخرى." : "كل كلمة جديدة تقولها في محادثة تُحفظ هنا تلقائياً."}
            />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-96 overflow-y-auto pr-1">
              {filteredVocab.slice(0, 60).map((v) => (
                <div
                  key={v.id}
                  className="p-3 rounded-xl bg-secondary/60 border border-border/40 hover:border-accent/40 transition"
                >
                  <p className="font-arabic font-semibold text-foreground text-sm truncate">{v.word}</p>
                  {v.meaning && (
                    <p className="font-arabic text-xs text-muted-foreground mt-0.5 line-clamp-2">
                      {v.meaning}
                    </p>
                  )}
                </div>
              ))}
              {filteredVocab.length > 60 && (
                <p className="col-span-full text-center text-xs text-muted-foreground font-arabic pt-2">
                  و {filteredVocab.length - 60} كلمة أخرى…
                </p>
              )}
            </div>
          )}
        </section>

        {/* Corrections history */}
        <section className="bg-card border border-border rounded-3xl p-5 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-amber-500" /> تصحيحاتك الأخيرة
              <span className="text-xs text-muted-foreground font-normal">
                ({corrections.length})
              </span>
            </h2>
            <p className="text-xs text-muted-foreground font-arabic">
              راجعها لتتذكر ولا تكررها
            </p>
          </div>

          {loading ? (
            <SkeletonList />
          ) : corrections.length === 0 ? (
            <EmptyState
              title="لا أخطاء مسجلة"
              subtitle="ابدأ محادثة — أي خطأ تصححه سيظهر هنا لتتعلم منه لاحقاً."
            />
          ) : (
            <ul className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {corrections.slice(0, 30).map((c, i) => (
                <li
                  key={i}
                  className="rounded-2xl bg-secondary/40 border border-border/40 p-3"
                >
                  <div className="flex items-center gap-2 text-sm font-arabic mb-1">
                    <span className="flex-1 min-w-0 truncate text-red-600 dark:text-red-400 line-through decoration-red-400/60">
                      {c.original}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                    <span className="flex-1 min-w-0 truncate text-emerald-700 dark:text-emerald-400 font-semibold">
                      {c.corrected}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                    <MessageCircle className="w-3 h-3" />
                    <span className="font-arabic truncate flex-1">{c.hint}</span>
                    <span className="font-arabic opacity-70 flex-shrink-0">{c.worldName}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Goal hint */}
        <div className="bg-gradient-to-l from-amber-50 to-amber-100/50 dark:from-amber-500/10 dark:to-amber-500/5 border border-amber-200/60 dark:border-amber-500/20 rounded-3xl p-5 text-center">
          <Target className="w-6 h-6 text-amber-600 dark:text-amber-400 mx-auto mb-2" />
          <p className="font-arabic font-semibold text-foreground">
            هدف اليوم: مشهد واحد على الأقل ✨
          </p>
          <p className="font-arabic text-xs text-muted-foreground mt-1">
            الاستمرارية أهم من الكمية — دقائق يومياً تصنع فرقاً كبيراً.
          </p>
        </div>
      </div>
    </div>
  );
};

const StatTile = ({
  icon, value, label, tone,
}: {
  icon: React.ReactNode;
  value: number | string;
  label: string;
  tone: "accent" | "amber" | "primary" | "emerald" | "rose";
}) => {
  const toneClass = {
    accent: "text-accent",
    amber: "text-amber-500",
    primary: "text-primary",
    emerald: "text-emerald-600 dark:text-emerald-400",
    rose: "text-rose-500",
  }[tone];
  return (
    <div className="bg-card border border-border rounded-2xl p-4 text-center">
      <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full bg-secondary/70 ${toneClass} mb-2`}>
        {icon}
      </div>
      <p className={`font-arabic text-2xl font-bold ${toneClass} leading-tight`}>{value}</p>
      <p className="font-arabic text-[11px] text-muted-foreground mt-0.5">{label}</p>
    </div>
  );
};

const SkeletonList = () => (
  <div className="space-y-2">
    {Array.from({ length: 3 }).map((_, i) => (
      <div key={i} className="h-14 rounded-2xl bg-secondary/50 animate-pulse" />
    ))}
  </div>
);

const EmptyState = ({
  title, subtitle, ctaLabel, to,
}: { title: string; subtitle: string; ctaLabel?: string; to?: string }) => (
  <div className="text-center py-8 px-4">
    <p className="font-arabic font-semibold text-foreground">{title}</p>
    <p className="font-arabic text-sm text-muted-foreground mt-1">{subtitle}</p>
    {ctaLabel && to && (
      <Link
        to={to}
        className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-xl gradient-gold text-accent-foreground font-arabic font-semibold text-sm hover:opacity-90"
      >
        <Play className="w-3.5 h-3.5" /> {ctaLabel}
      </Link>
    )}
  </div>
);

export default Dashboard;
