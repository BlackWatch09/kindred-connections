import { supabase } from "@/lib/supabase";
import { geminiEndpoint } from "@/features/story-world/lib/streamChat";

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

/**
 * Client-side Siraj reply: calls the deployed `gemini-proxy` for text,
 * then inserts the comment under the current user (RLS-safe) with an
 * `ai_name` marker so the UI renders it as Siraj.
 */
export async function triggerSirajReply(postId: string, promptText: string, authorName?: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("not_signed_in");

  const system = `أنت "سراج" — معلّم الذكاء الاصطناعي في منصّة لُغة لتعليم العربية.
أُشير إليك للتّو داخل منشور في المجتمع من الطالب "${authorName || "طالب"}".
- ردّ بالعربية الفصحى، بأسلوب ودود ومشجّع.
- إن كان هناك خطأ لغويّ صحّحه بلطف واذكر القاعدة باختصار.
- إن كان سؤالاً، أجب بوضوح مع مثال.
- ردّك يظهر كتعليق عام على المنشور، فاجعله موجزاً (٣-٦ أسطر كحد أقصى).
- استخدم رمزاً تعبيرياً واحداً على الأكثر في نهاية الرد.`;

  let reply = "أهلاً! أنا هنا. أعد صياغة سؤالك من فضلك 🌙";
  try {
    const url = geminiEndpoint("gemini-2.5-flash", "generateContent");
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: promptText }] }],
        systemInstruction: { role: "system", parts: [{ text: system }] },
        generationConfig: { temperature: 0.85, maxOutputTokens: 512 },
      }),
    });
    if (res.ok) {
      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.map((p: any) => p?.text).filter(Boolean).join("\n").trim();
      if (text) reply = text;
    } else {
      console.warn("[siraj] gemini-proxy error", res.status, await res.text().catch(() => ""));
    }
  } catch (e) {
    console.warn("[siraj] gemini-proxy exception", e);
  }

  const { data: inserted, error } = await supabase
    .from("community_comments")
    .insert({
      post_id: postId,
      user_id: user.id,      // satisfies RLS (auth.uid() = user_id)
      content: reply,
      is_ai: false,          // RLS requires is_ai=false for client inserts
      ai_name: "سراج",       // UI treats presence of ai_name as an AI reply
    })
    .select()
    .single();

  if (error) throw error;
  return inserted;
}

export async function contributeChallenge(faction: FactionId | null) {
  try {
    await supabase.rpc("contribute_challenge", { _faction: faction });
  } catch {
    /* swallow — non-critical gamification */
  }
}
