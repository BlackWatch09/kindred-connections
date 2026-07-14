// Arabic TTS helper for course audio.
// Plays browser speech immediately inside the user's click gesture, then warms
// the premium TTS cache when the edge function is available.
import { supabase } from "@/lib/supabase";
import { TTS_AUDIO } from "@/generated/ttsManifest";

const TTS_URL = `https://zekkojrgknpvmxskyqno.supabase.co/functions/v1/tts`;
const SUPABASE_ANON = "sb_publishable_fbcN8yLZl8_5VMGokMH24g_4LaaOnCu";

const cache = new Map<string, string>(); // text -> object URL
let currentAudio: HTMLAudioElement | null = null;
let currentUtterance: SpeechSynthesisUtterance | null = null;

function getArabicVoice(): SpeechSynthesisVoice | undefined {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return undefined;
  const voices = window.speechSynthesis.getVoices();
  return voices.find((voice) => /^ar([-_]|$)/i.test(voice.lang)) ?? voices.find((voice) => /arabic/i.test(voice.name));
}

function speakWithBrowser(text: string): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      resolve();
      return;
    }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "ar-SA";
    u.rate = 0.85;
    u.pitch = 1;
    const voice = getArabicVoice();
    if (voice) u.voice = voice;
    u.onend = () => resolve();
    u.onerror = () => resolve();
    currentUtterance = u;
    window.speechSynthesis.speak(u);
  });
}

export function stopSpeaking() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    currentUtterance = null;
  }
}

async function fetchPremiumSpeech(text: string): Promise<string | null> {
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

  const contentType = res.headers.get("Content-Type") || "";
  if (contentType.includes("application/json")) {
    const payload = await res.json().catch(() => null);
    if (payload?.fallback) return null;
    throw new Error(payload?.error || `tts ${res.status}`);
  }

  if (!res.ok) throw new Error(`tts ${res.status}`);
  if (!contentType.includes("audio")) throw new Error(`tts invalid content type: ${contentType || "unknown"}`);

  const blob = await res.blob();
  if (!blob.size) throw new Error("tts empty audio");
  const url = URL.createObjectURL(blob);
  cache.set(text, url);
  return url;
}

function playUrl(url: string): Promise<void> {
  return new Promise((resolve) => {
    const audio = new Audio(url);
    audio.preload = "auto";
    currentAudio = audio;
    const done = () => resolve();
    audio.onended = done;
    audio.onerror = done;
    audio.play().catch((err) => {
      console.warn("[tts] audio play failed:", err);
      resolve();
    });
  });
}

/**
 * Speak Arabic text. Resolves when playback ENDS (or immediately on failure).
 * Tries local pre-generated audio → session cache → premium edge function → browser speech.
 */
export async function speakArabic(text: string): Promise<void> {
  if (!text) return;
  stopSpeaking();

  const localUrl = TTS_AUDIO[text];
  if (localUrl) {
    await playUrl(localUrl);
    return;
  }

  const cachedUrl = cache.get(text);
  if (cachedUrl) {
    await playUrl(cachedUrl);
    return;
  }

  // Fetch premium first; only fall back to browser speech on failure so we
  // wait for the natural Arabic voice when it is available.
  try {
    const url = await fetchPremiumSpeech(text);
    if (url) {
      await playUrl(url);
      return;
    }
  } catch (err) {
    console.warn("[tts] premium audio unavailable, using browser speech:", err);
  }

  await speakWithBrowser(text);
}
