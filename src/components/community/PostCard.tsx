import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { contributeChallenge, FactionId, factionOf, mentionsSiraj, triggerSirajReply } from "@/lib/community";
import FactionBadge from "./FactionBadge";
import { Heart, MessageCircle, Sparkles, Trash2 } from "lucide-react";
import { toast } from "sonner";
import sirajAvatar from "@/assets/siraj-chat-avatar.png";

export interface CommunityPost {
  id: string;
  user_id: string;
  content: string;
  image_url: string | null;
  faction: string | null;
  likes_count: number;
  comments_count: number;
  created_at: string;
  author?: { full_name: string | null; avatar_url: string | null } | null;
}

interface Comment {
  id: string;
  post_id: string;
  user_id: string | null;
  content: string;
  is_ai: boolean;
  ai_name: string | null;
  faction: string | null;
  created_at: string;
  author?: { full_name: string | null; avatar_url: string | null } | null;
}

interface Props {
  post: CommunityPost;
  currentFaction: FactionId | null;
  onDeleted?: () => void;
}

const timeAgo = (iso: string) => {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "الآن";
  if (diff < 3600) return `منذ ${Math.floor(diff / 60)} د`;
  if (diff < 86400) return `منذ ${Math.floor(diff / 3600)} س`;
  return `منذ ${Math.floor(diff / 86400)} ي`;
};

export const PostCard = ({ post, currentFaction, onDeleted }: Props) => {
  const { user, profile } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(post.likes_count);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [busy, setBusy] = useState(false);
  const faction = factionOf(post.faction);
  const authorName = post.author?.full_name || "طالب";
  const authorInitial = authorName.charAt(0).toUpperCase() || "ط";

  useEffect(() => {
    if (!user) return;
    supabase
      .from("community_likes")
      .select("post_id")
      .eq("post_id", post.id)
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => setLiked(!!data));
  }, [user, post.id]);

  const loadComments = async () => {
    const { data } = await supabase
      .from("community_comments")
      .select("*")
      .eq("post_id", post.id)
      .order("created_at", { ascending: true });
    if (!data) return;
    const userIds = Array.from(new Set(data.filter((c) => c.user_id).map((c) => c.user_id as string)));
    let profiles: Record<string, { full_name: string | null; avatar_url: string | null }> = {};
    if (userIds.length) {
      const { data: profs } = await supabase.from("profiles").select("id, full_name, avatar_url").in("id", userIds);
      profs?.forEach((p) => { profiles[p.id] = { full_name: p.full_name, avatar_url: p.avatar_url }; });
    }
    setComments(data.map((c) => ({ ...c, author: c.user_id ? profiles[c.user_id] || null : null })) as Comment[]);
  };

  useEffect(() => {
    if (!showComments) return;
    loadComments();
    const sub = supabase
      .channel(`comments-${post.id}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "community_comments", filter: `post_id=eq.${post.id}` }, loadComments)
      .subscribe();
    return () => { supabase.removeChannel(sub); };
  }, [showComments, post.id]);

  const toggleLike = async () => {
    if (!user) return;
    if (liked) {
      setLiked(false); setLikes((n) => n - 1);
      await supabase.from("community_likes").delete().eq("post_id", post.id).eq("user_id", user.id);
    } else {
      setLiked(true); setLikes((n) => n + 1);
      await supabase.from("community_likes").insert({ post_id: post.id, user_id: user.id });
      contributeChallenge(currentFaction);
    }
  };

  const submitComment = async () => {
    if (!user || !commentText.trim()) return;
    setBusy(true);
    try {
      const text = commentText.trim();
      const { error } = await supabase.from("community_comments").insert({
        post_id: post.id,
        user_id: user.id,
        content: text,
        faction: currentFaction,
      });
      if (error) throw error;
      contributeChallenge(currentFaction);
      if (mentionsSiraj(text)) {
        triggerSirajReply(post.id, text, profile?.full_name || user.email?.split("@")[0])
          .catch(() => toast.error("سراج مشغول الآن"));
      }
      setCommentText("");
    } catch (e) {
      toast.error("تعذر التعليق: " + (e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const deletePost = async () => {
    if (!user || user.id !== post.user_id) return;
    if (!confirm("حذف هذا المنشور؟")) return;
    await supabase.from("community_posts").delete().eq("id", post.id);
    onDeleted?.();
  };

  const renderContent = (text: string) =>
    text.split(/(@[sSسِ][iراج]\w*)/g).map((part, i) =>
      /@siraj|@سراج/i.test(part) ? (
        <span key={i} className="text-accent font-semibold">{part}</span>
      ) : (
        <span key={i}>{part}</span>
      ),
    );

  return (
    <article className="border border-border bg-card">
      <header className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 grid place-items-center text-primary-foreground font-bold text-sm ${faction?.colorClass || "bg-primary"}`}>
            {authorInitial}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-arabic text-sm font-semibold text-foreground">{authorName}</span>
              <FactionBadge factionId={post.faction} />
            </div>
            <span className="text-[11px] text-muted-foreground font-mono">{timeAgo(post.created_at)}</span>
          </div>
        </div>
        {user?.id === post.user_id && (
          <button onClick={deletePost} className="text-muted-foreground hover:text-destructive p-1">
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </header>

      <div className="p-4">
        <p dir="auto" className="font-arabic text-[15px] leading-relaxed text-foreground whitespace-pre-wrap">
          {renderContent(post.content)}
        </p>
        {post.image_url && (
          <img src={post.image_url} alt="" className="mt-3 max-h-96 w-full object-cover border border-border" />
        )}
      </div>

      <div className="flex items-center gap-1 px-4 py-2 border-t border-border">
        <button
          onClick={toggleLike}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-sm transition-colors ${
            liked ? "text-[hsl(348_65%_55%)]" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Heart className={`w-4 h-4 ${liked ? "fill-current" : ""}`} />
          <span className="font-mono text-xs">{likes}</span>
        </button>
        <button
          onClick={() => setShowComments((v) => !v)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          <span className="font-mono text-xs">{post.comments_count}</span>
        </button>
      </div>

      {showComments && (
        <div className="border-t border-border bg-background/40 px-4 py-3 space-y-3">
          {comments.map((c) => (
            <CommentRow key={c.id} c={c} />
          ))}
          <div className="flex items-center gap-2 pt-2 border-t border-border">
            <input
              dir="auto"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submitComment()}
              placeholder="أضف تعليقاً… (اكتب @سراج للاستعانة به)"
              className="flex-1 bg-transparent border-0 border-b border-border font-arabic text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:border-accent py-1.5"
            />
            <button
              onClick={submitComment}
              disabled={busy || !commentText.trim()}
              className="text-xs uppercase tracking-widest text-accent hover:text-emerald-glow disabled:opacity-40"
            >
              إرسال
            </button>
          </div>
        </div>
      )}
    </article>
  );
};

const CommentRow = ({ c }: { c: Comment }) => {
  const f = factionOf(c.faction);
  if (c.is_ai) {
    return (
      <div className="flex items-start gap-2.5 border-l-2 border-accent bg-accent/5 p-3">
        <img src={sirajAvatar} alt="سراج" className="w-8 h-8 rounded-none object-cover border border-accent/40" />
        <div className="flex-1">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="font-arabic text-xs font-bold text-accent">سراج</span>
            <Sparkles className="w-3 h-3 text-accent" />
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono">AI</span>
          </div>
          <p dir="auto" className="font-arabic text-sm text-foreground leading-relaxed whitespace-pre-wrap">{c.content}</p>
        </div>
      </div>
    );
  }
  const name = c.author?.full_name || "طالب";
  return (
    <div className="flex items-start gap-2.5">
      <div className={`w-8 h-8 grid place-items-center text-primary-foreground text-xs font-bold ${f?.colorClass || "bg-primary"}`}>
        {name.charAt(0).toUpperCase()}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="font-arabic text-xs font-semibold text-foreground">{name}</span>
          {f && <FactionBadge factionId={c.faction} compact />}
        </div>
        <p dir="auto" className="font-arabic text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">{c.content}</p>
      </div>
    </div>
  );
};

export default PostCard;
