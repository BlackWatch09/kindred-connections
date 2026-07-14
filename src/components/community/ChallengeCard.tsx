import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Target, Users } from "lucide-react";

interface Challenge {
  id: string;
  title: string;
  description: string | null;
  target_count: number;
  progress_count: number;
}

export const ChallengeCard = () => {
  const [ch, setCh] = useState<Challenge | null>(null);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      const { data } = await supabase
        .from("community_challenges")
        .select("*")
        .eq("is_active", true)
        .order("starts_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (alive) setCh(data as Challenge | null);
    };
    load();
    const sub = supabase
      .channel("challenge-progress")
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "community_challenges" }, load)
      .subscribe();
    return () => {
      alive = false;
      supabase.removeChannel(sub);
    };
  }, []);

  if (!ch) return null;
  const pct = Math.min(100, Math.round((ch.progress_count / Math.max(1, ch.target_count)) * 100));

  return (
    <div className="relative overflow-hidden border border-accent/40 bg-gradient-to-br from-emerald-deep via-primary to-emerald text-primary-foreground p-6 md:p-8">
      <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-accent/20 blur-3xl pointer-events-none" />
      <div className="relative">
        <div className="flex items-center gap-2 text-accent text-xs uppercase tracking-[0.24em] font-semibold mb-3">
          <Target className="w-4 h-4" />
          <span>تحدّي الأسبوع التعاوني</span>
        </div>
        <h2 className="font-arabic text-2xl md:text-3xl font-bold mb-2 leading-snug">{ch.title}</h2>
        {ch.description && (
          <p className="font-arabic text-sm md:text-base text-primary-foreground/80 mb-5 leading-relaxed max-w-2xl">{ch.description}</p>
        )}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="flex items-center gap-1.5 text-primary-foreground/80"><Users className="w-3.5 h-3.5" /> تقدّم السيرفر</span>
            <span className="text-accent font-bold">
              {ch.progress_count.toLocaleString("ar-EG")} / {ch.target_count.toLocaleString("ar-EG")}
            </span>
          </div>
          <div className="h-2.5 bg-primary-foreground/10 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-accent via-[hsl(43_70%_65%)] to-accent transition-all duration-700"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex justify-end text-[11px] font-mono text-accent">{pct}%</div>
        </div>
      </div>
    </div>
  );
};

export default ChallengeCard;
