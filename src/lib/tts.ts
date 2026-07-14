// Arabic TTS — calls Google Gemini TTS directly from the client using the
// existing shared Gemini API key (same as the other AI Hub tools). No edge
// function required. Falls back to browser SpeechSynthesis when Gemini fails.

import { getGeminiKey } from "@/features/story-world/lib/streamChat";
import { TTS_AUDIO } from "@/generated/ttsManifest";

const TTS_MODEL = "gemini-2.5-flash-preview-tts";
const VOICE = "Kore"; // warm neutral voice, good for Arabic

const cache = new Map<string, string>(); // text -> object URL (session cache)
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
    u.rate = 0.9;
    u.pitch = 1;
    const voice = getArabicVoice();
    if (voice) u.voice = voice;
    u.onend = () => resolve();
    u.onerror = () => resolve();
    currentUtterance = u;
    window.speechSynthesis.speak(u);
    // Safety timeout: some browsers never fire onend for Arabic.
    setTimeout(() => resolve(), Math.max(3000, text.length * 90));
  });
}

export function stopSpeaking() {
  if (currentAudio) {
    try { currentAudio.pause(); } catch { /* ignore */ }
    currentAudio = null;
  }
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    currentUtterance = null;
  }
}

// Parse mimeType like "audio/L16;codec=pcm;rate=24000" to get sample rate.
function parseSampleRate(mime: string): number {
  const m = /rate=(\d+)/i.exec(mime || "");
  return m ? parseInt(m[1], 10) : 24000;
}

// Wrap raw PCM (16-bit LE mono) as a WAV blob so <audio> can play it.
function pcmToWav(pcm: Uint8Array, sampleRate: number): Blob {
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = sampleRate * numChannels * bitsPerSample / 8;
  const blockAlign = numChannels * bitsPerSample / 8;
  const dataSize = pcm.length;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);
  const writeStr = (offset: number, s: string) => {
    for (let i = 0; i < s.length; i++) view.setUint8(offset + i, s.charCodeAt(i));
  };
  writeStr(0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeStr(8, "WAVE");
  writeStr(12, "fmt ");
  view.setUint32(16, 16, true);          // PCM chunk size
  view.setUint16(20, 1, true);            // format = PCM
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);
  writeStr(36, "data");
  view.setUint32(40, dataSize, true);
  new Uint8Array(buffer, 44).set(pcm);
  return new Blob([buffer], { type: "audio/wav" });
}

function base64ToBytes(b64: string): Uint8Array {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function fetchGeminiSpeech(text: string): Promise<string | null> {
  const { geminiEndpoint } = await import("@/features/story-world/lib/streamChat");
  const url = geminiEndpoint(TTS_MODEL, "generateContent");
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: `Read the following Arabic text aloud in clear, warm Modern Standard Arabic (فصحى) at a natural pace suitable for a language learner. Pronounce every letter carefully. Text: ${text}`,
        }],
      }],
      generationConfig: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: VOICE } },
        },
      },
    }),
  });
  if (!res.ok) {
    const err = await res.text().catch(() => "");
    throw new Error(`gemini-tts ${res.status}: ${err.slice(0, 200)}`);
  }
  const data = await res.json();
  const part = data?.candidates?.[0]?.content?.parts?.find((p: any) => p?.inlineData?.data);
  const b64 = part?.inlineData?.data;
  const mime = part?.inlineData?.mimeType || "audio/L16;rate=24000";
  if (!b64) return null;
  const pcm = base64ToBytes(b64);
  const wav = pcmToWav(pcm, parseSampleRate(mime));
  const objectUrl = URL.createObjectURL(wav);
  cache.set(text, objectUrl);
  return objectUrl;
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
 * Order: local pre-generated audio → session cache → Gemini TTS → browser speech.
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

  try {
    const url = await fetchGeminiSpeech(text);
    if (url) {
      await playUrl(url);
      return;
    }
  } catch (err) {
    console.warn("[tts] Gemini TTS unavailable, using browser speech:", err);
  }

  await speakWithBrowser(text);
}
