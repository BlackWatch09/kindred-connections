import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { ensureFaction, FACTIONS, FactionId, factionOf } from "@/lib/community";
import PostComposer from "@/components/community/PostComposer";
import PostCard, { CommunityPost } from "@/components/community/PostCard";
import ChallengeCard from "@/components/community/ChallengeCard";
import FactionLeaderboard from "@/components/community/FactionLeaderboard";
import FactionPicker from "@/components/community/FactionPicker";
import { Loader2, Sparkles, Users2 } from "lucide-react";

const Community = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [faction, setFaction] = useState<FactionId | null>(null);
  const [factionLoaded, setFactionLoaded] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    if (!user) return;
    ensureFaction(user.id).then((f) => {
      setFaction(f);
      setFactionLoaded(true);
      if (!f) setShowPicker(true);
    });
  }, [user]);

  const loadPosts = async () => {
    const { data } = await supabase
      .from("community_posts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    if (!data) { setPosts([]); setLoading(false); return; }
    const ids = Array.from(new Set(data.map((p) => p.user_id)));
    let profs: Record<string, { full_name: string | null; avatar_url: string | null }> = {};
    if (ids.length) {
      const { data: pr } = await supabase.from("profiles").select("id, full_name, avatar_url").in("id", ids);
      pr?.forEach((p) => { profs[p.id] = { full_name: p.full_name, avatar_url: p.avatar_url }; });
    }
    setPosts(data.map((p) => ({ ...p, author: profs[p.user_id] || null })) as CommunityPost[]);
    setLoading(false);
  };

  useEffect(() => {
    loadPosts();
    const sub = supabase
      .channel("community-feed")
      .on("postgres_changes", { event: "*", schema: "public", table: "community_posts" }, loadPosts)
      .subscribe();
    return () => { supabase.removeChannel(sub); };
  }, []);

  const myFaction = faction ? factionOf(faction) : null;

  return (
    <div className="min-h-screen bg-background py-8 md:py-12" dir="rtl">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Hero header */}
        <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 text-accent text-xs uppercase tracking-[0.3em] font-semibold mb-2">
              <Users2 className="w-4 h-4" /> <span>مجتمع لُغة</span>
            </div>
            <h1 className="font-arabic text-3xl md:text-4xl font-bold text-foreground leading-tight">
              الحائط الاجتماعي
            </h1>
            <p className="font-arabic text-sm text-muted-foreground mt-1">
              انشر، علّق، تحالف، وتعلّم مع سراج والطلاب.
            </p>
          </div>
          {myFaction ? (
            <button
              onClick={() => setShowPicker(true)}
              className={`border ${myFaction.borderClass} bg-card px-4 py-3 flex items-center gap-3 hover:bg-background transition-colors group`}
              title="تغيير التحالف"
            >
              <div className={`w-10 h-10 grid place-items-center text-primary-foreground text-lg ${myFaction.colorClass}`}>
                {myFaction.emblem}
              </div>
              <div className="text-right">
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">تحالفك · اضغط للتغيير</div>
                <div className={`font-arabic text-sm font-bold ${myFaction.textClass}`}>{myFaction.name}</div>
                <div className="text-[11px] text-muted-foreground font-arabic">{myFaction.motto}</div>
              </div>
            </button>
          ) : factionLoaded && user ? (
            <button
              onClick={() => setShowPicker(true)}
              className="flex items-center gap-2 border border-accent/60 bg-accent/10 text-accent px-4 py-3 hover:bg-accent/20 transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              <span className="font-arabic text-sm font-semibold">اختر تحالفك للبدء</span>
            </button>
          ) : null}
        </div>

        {/* Challenge banner */}
        <div className="mb-8">
          <ChallengeCard />
        </div>

        {/* Layout: feed + sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          <div className="space-y-5 min-w-0">
            <PostComposer faction={faction} onPosted={loadPosts} />
            {loading ? (
              <div className="flex items-center justify-center py-16 text-muted-foreground">
                <Loader2 className="w-5 h-5 animate-spin" />
              </div>
            ) : posts.length === 0 ? (
              <div className="border border-dashed border-border bg-card p-10 text-center">
                <p className="font-arabic text-muted-foreground">لا توجد منشورات بعد — كن أول من ينشر!</p>
              </div>
            ) : (
              posts.map((p) => <PostCard key={p.id} post={p} currentFaction={faction} onDeleted={loadPosts} />)
            )}
          </div>

          <aside className="space-y-5">
            <FactionLeaderboard userFaction={faction} />
            <div className="border border-border bg-card p-5">
              <h3 className="font-arabic text-base font-semibold text-foreground mb-3">التحالفات الثلاثة</h3>
              <ul className="space-y-3">
                {Object.values(FACTIONS).map((f) => (
                  <li key={f.id} className="flex items-center gap-3">
                    <div className={`w-8 h-8 grid place-items-center text-primary-foreground ${f.colorClass}`}>{f.emblem}</div>
                    <div>
                      <div className={`font-arabic text-sm font-semibold ${f.textClass}`}>{f.name}</div>
                      <div className="text-[11px] text-muted-foreground font-arabic">{f.motto}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border border-accent/40 bg-accent/5 p-5">
              <h3 className="font-arabic text-sm font-bold text-accent mb-2">💡 نصيحة</h3>
              <p className="font-arabic text-xs text-foreground/80 leading-relaxed">
                اكتب <span className="text-accent font-semibold">@سراج</span> داخل أي منشور أو تعليق ليردّ عليك الذكاء الاصطناعي فوراً — يصحّح، يشرح، ويشجّع.
              </p>
            </div>
          </aside>
        </div>
      </div>
      {showPicker && user && (
        <FactionPicker
          dismissible={!!faction}
          onClose={() => setShowPicker(false)}
          onChosen={(f) => { setFaction(f); setShowPicker(false); }}
        />
      )}
    </div>
  );
};

export default Community;
