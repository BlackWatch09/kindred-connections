// Arabic TTS helper — calls the `tts` edge function (Lovable AI Gateway).
// Falls back to browser speechSynthesis if the network call fails.
import { supabase } from "@/lib/supabase";

const TTS_URL = `https://zekkojrgknpvmxskyqno.supabase.co/functions/v1/tts`;
const SUPABASE_ANON = "sb_publishable_fbcN8yLZl8_5VMGokMH24g_4LaaOnCu";

const cache = new Map<string, string>(); // text -> object URL
let currentAudio: HTMLAudioElement | null = null;

function fallback(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "ar-SA";
  u.rate = 0.85;
  window.speechSynthesis.speak(u);
}

export function stopSpeaking() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

export async function speakArabic(text: string): Promise<void> {
  if (!text) return;
  stopSpeaking();

  try {
    let url = cache.get(text);
    if (!url) {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token ?? SUPABASE_ANON;
      const res = await fetch(TTS_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_ANON,
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error(`tts ${res.status}`);
      const blob = await res.blob();
      url = URL.createObjectURL(blob);
      cache.set(text, url);
    }

    const audio = new Audio(url);
    currentAudio = audio;
    await audio.play();
  } catch (err) {
    console.warn("[tts] falling back to speechSynthesis:", err);
    fallback(text);
  }
}
