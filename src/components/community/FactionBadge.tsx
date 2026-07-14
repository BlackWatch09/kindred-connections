import { Faction, factionOf } from "@/lib/community";

interface Props {
  factionId?: string | null;
  compact?: boolean;
}

export const FactionBadge = ({ factionId, compact }: Props) => {
  const f: Faction | null = factionOf(factionId);
  if (!f) return null;
  return (
    <span
      className={`inline-flex items-center gap-1 border ${f.borderClass} ${f.textClass} bg-background/50 px-2 py-0.5 text-[10px] font-arabic tracking-wide`}
      title={f.motto}
    >
      <span className="text-[11px] leading-none">{f.emblem}</span>
      {!compact && <span>{f.name}</span>}
    </span>
  );
};

export default FactionBadge;
