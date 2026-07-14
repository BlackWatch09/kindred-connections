import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { contributeChallenge, ensureFaction, FactionId, mentionsSiraj, triggerSirajReply } from "@/lib/community";
import { ImagePlus, Send, Sparkles, X } from "lucide-react";
import { toast } from "sonner";

interface Props {
  faction: FactionId | null;
  onPosted: () => void;
}

export const PostComposer = ({ faction, onPosted }: Props) => {
  const { user, profile } = useAuth();
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [showImageInput, setShowImageInput] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!user || !content.trim()) return;
    if (!faction) {
      toast.error("اختر تحالفك أولاً من أعلى الصفحة");
      return;
    }
    setBusy(true);
    try {
      const fac = faction;
      const { data: post, error } = await supabase
        .from("community_posts")
        .insert({
          user_id: user.id,
          content: content.trim(),
          image_url: imageUrl.trim() || null,
          faction: fac,
        })
        .select()
        .single();
        .from("community_posts")
        .insert({
          user_id: user.id,
          content: content.trim(),
          image_url: imageUrl.trim() || null,
          faction: fac,
        })
        .select()
        .single();
      if (error) throw error;

      contributeChallenge(fac);

      if (mentionsSiraj(content)) {
        triggerSirajReply(
          post.id,
          content,
          profile?.full_name || user.email?.split("@")[0],
        ).catch(() => toast.error("سراج مشغول الآن، حاول لاحقاً"));
        toast.success("تم النشر — سراج يكتب رداً…", { icon: "🌙" });
      } else {
        toast.success("تم النشر");
      }

      setContent("");
      setImageUrl("");
      setShowImageInput(false);
      onPosted();
    } catch (e) {
      toast.error("تعذر النشر: " + (e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const hasMention = mentionsSiraj(content);

  return (
    <div className="border border-border bg-card p-5">
      <textarea
        dir="auto"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="شارك سؤالاً، منشوراً، أو صورة لخط يدك… اكتب @سراج للاستعانة بالذكاء الاصطناعي"
        rows={3}
        maxLength={2000}
        className="w-full resize-none bg-transparent text-foreground font-arabic text-base placeholder:text-muted-foreground/70 focus:outline-none"
      />
      {showImageInput && (
        <div className="mt-2 flex items-center gap-2">
          <input
            dir="ltr"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://… رابط صورة"
            className="flex-1 border border-border bg-background px-3 py-1.5 text-sm text-foreground focus:outline-none focus:border-accent"
          />
          <button onClick={() => { setImageUrl(""); setShowImageInput(false); }} className="p-1 text-muted-foreground hover:text-destructive">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      {imageUrl && (
        <div className="mt-3 relative">
          <img src={imageUrl} alt="preview" className="max-h-56 border border-border object-cover" />
        </div>
      )}
      <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowImageInput((v) => !v)}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-accent transition-colors"
          >
            <ImagePlus className="w-4 h-4" /> صورة
          </button>
          {hasMention && (
            <span className="flex items-center gap-1 text-xs text-accent font-arabic">
              <Sparkles className="w-3.5 h-3.5" /> سراج سيرد على منشورك
            </span>
          )}
          <span className="text-[11px] text-muted-foreground font-mono">{content.length}/2000</span>
        </div>
        <button
          onClick={submit}
          disabled={busy || !content.trim()}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold uppercase tracking-widest hover:bg-emerald transition-colors disabled:opacity-50"
        >
          <Send className="w-4 h-4" /> نشر
        </button>
      </div>
    </div>
  );
};

export default PostComposer;
