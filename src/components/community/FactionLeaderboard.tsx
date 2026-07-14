import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { FACTIONS, FactionId, factionOf } from "@/lib/community";
import { Trophy } from "lucide-react";

interface Row {
  faction: string;
  count: number;
}

export const FactionLeaderboard = ({ userFaction }: { userFaction: FactionId | null }) => {
  const [rows, setRows] = useState<Row[]>([]);
  const [challengeId, setChallengeId] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      const { data: ch } = await supabase
        .from("community_challenges")
        .select("id")
        .eq("is_active", true)
        .order("starts_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (!ch?.id) return;
      if (!alive) return;
      setChallengeId(ch.id);
      const { data } = await supabase
        .from("community_challenge_contributions")
        .select("faction, count")
        .eq("challenge_id", ch.id);
      if (!alive) return;
      const base = Object.keys(FACTIONS).map((f) => ({ faction: f, count: 0 }));
      const merged = base.map((b) => ({
        ...b,
        count: data?.find((d) => d.faction === b.faction)?.count || 0,
      }));
      merged.sort((a, b) => b.count - a.count);
      setRows(merged);
    };
    load();

    if (!challengeId) return;
    const ch = supabase
      .channel(`leaderboard-${challengeId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "community_challenge_contributions", filter: `challenge_id=eq.${challengeId}` },
        load,
      )
      .subscribe();
    return () => {
      alive = false;
      supabase.removeChannel(ch);
    };
  }, [challengeId]);

  const total = rows.reduce((s, r) => s + r.count, 0);

  return (
    <div className="border border-border bg-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-4 h-4 text-accent" />
        <h3 className="font-arabic text-base font-semibold text-foreground">صدارة التحالفات</h3>
      </div>
      <ul className="space-y-3">
        {rows.map((r, i) => {
          const f = factionOf(r.faction)!;
          const pct = total > 0 ? Math.round((r.count / total) * 100) : 0;
          const mine = userFaction === r.faction;
          return (
            <li key={r.faction} className={`space-y-1 ${mine ? "" : ""}`}>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className={`w-5 h-5 grid place-items-center text-[11px] font-bold ${f.colorClass} text-primary-foreground`}>{i + 1}</span>
                  <span className={`font-arabic font-semibold ${f.textClass}`}>{f.name}</span>
                  {mine && <span className="text-[9px] uppercase tracking-wider text-muted-foreground">(تحالفك)</span>}
                </div>
                <span className="font-mono text-muted-foreground">{r.count}</span>
              </div>
              <div className="h-1.5 bg-secondary overflow-hidden">
                <div className={`h-full ${f.colorClass} transition-all`} style={{ width: `${pct}%` }} />
              </div>
            </li>
          );
        })}
      </ul>
      <p className="mt-4 text-[11px] text-muted-foreground font-arabic leading-relaxed">
        كل منشور أو تعليق تكتبه يضيف نقطة لتحالفك في التحدي الأسبوعي.
      </p>
    </div>
  );
};

export default FactionLeaderboard;
