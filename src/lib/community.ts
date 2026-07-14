import { supabase } from "@/lib/supabase";

export type FactionId = "fasaha" | "hikma" | "balagha";

export interface Faction {
  id: FactionId;
  name: string;
  motto: string;
  colorClass: string;   // bg
  borderClass: string;
  textClass: string;
  ringHex: string;
  emblem: string;
}

export const FACTIONS: Record<FactionId, Faction> = {
  fasaha: {
    id: "fasaha",
    name: "بنو الفصاحة",
    motto: "لسانٌ لا يخطئ",
    colorClass: "bg-emerald-deep",
    borderClass: "border-emerald-glow/60",
    textClass: "text-emerald-glow",
    ringHex: "#0d7a5f",
    emblem: "﷽",
  },
  hikma: {
    id: "hikma",
    name: "بنو الحكمة",
    motto: "قولٌ يُبقى",
    colorClass: "bg-accent",
    borderClass: "border-accent/60",
    textClass: "text-accent",
    ringHex: "#c9a84c",
    emblem: "☾",
  },
  balagha: {
    id: "balagha",
    name: "بنو البلاغة",
    motto: "بيانٌ يسحر",
    colorClass: "bg-[hsl(348_70%_35%)]",
    borderClass: "border-[hsl(348_70%_45%)]/60",
    textClass: "text-[hsl(348_65%_55%)]",
    ringHex: "#a63d55",
    emblem: "❋",
  },
};

export const FACTION_IDS = Object.keys(FACTIONS) as FactionId[];

export function factionOf(id?: string | null): Faction | null {
  if (!id) return null;
  return (FACTIONS as Record<string, Faction>)[id] || null;
}

const factionCacheKey = (userId: string) => `lugha.faction.${userId}`;

/** Returns the user's current faction, or null if not chosen yet. */
export async function ensureFaction(userId: string): Promise<FactionId | null> {
  // Local cache first — avoids re-showing the picker if the DB round-trip is slow or fails.
  const cached = typeof window !== "undefined" ? window.localStorage.getItem(factionCacheKey(userId)) : null;
  const { data: prof, error } = await supabase
    .from("profiles")
    .select("faction")
    .eq("id", userId)
    .maybeSingle();
  if (error) {
    console.warn("[faction] load error", error.message);
    return (cached as FactionId | null) || null;
  }
  const dbVal = (prof?.faction as FactionId | null) || null;
  if (dbVal && typeof window !== "undefined") {
    window.localStorage.setItem(factionCacheKey(userId), dbVal);
  }
  return dbVal || (cached as FactionId | null) || null;
}

/** Persist the user's chosen faction. Throws if the DB update fails. */
export async function chooseFaction(userId: string, faction: FactionId): Promise<FactionId> {
  const { error } = await supabase.from("profiles").update({ faction }).eq("id", userId);
  if (error) {
    console.error("[faction] save error", error);
    throw new Error(error.message);
  }
  if (typeof window !== "undefined") {
    window.localStorage.setItem(factionCacheKey(userId), faction);
  }
  return faction;
}

/** Detects an @Siraj / @سراج mention */
const MENTION_RE = /(^|[\s.,;،؛!?])(@siraj|@سراج|@Siraj)([\s.,;،؛!?]|$)/i;
export function mentionsSiraj(text: string): boolean {
  return MENTION_RE.test(text);
}

export async function triggerSirajReply(postId: string, promptText: string, authorName?: string) {
  const { data, error } = await supabase.functions.invoke("community-siraj", {
    body: { post_id: postId, prompt_text: promptText, author_name: authorName },
  });
  if (error) throw error;
  return data;
}

export async function contributeChallenge(faction: FactionId | null) {
  try {
    await supabase.rpc("contribute_challenge", { _faction: faction });
  } catch {
    /* swallow — non-critical gamification */
  }
}
