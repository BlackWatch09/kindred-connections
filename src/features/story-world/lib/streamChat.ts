import { supabase } from "@/lib/supabase";

const SUPABASE_URL = "https://zekkojrgknpvmxskyqno.supabase.co";

export async function streamStoryChat(
  body: Record<string, unknown>,
  onDelta: (chunk: string) => void,
): Promise<string> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error("Not authenticated");

  const res = await fetch(`${SUPABASE_URL}/functions/v1/story-chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok || !res.body) {
    const text = await res.text().catch(() => "");
    throw new Error(`story-chat failed: ${res.status} ${text}`);
  }

  const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
  let buffer = "";
  let full = "";
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += value;
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data:")) continue;
      const payload = trimmed.slice(5).trim();
      if (!payload) continue;
      try {
        const parsed = JSON.parse(payload);
        if (parsed.delta) {
          full += parsed.delta;
          onDelta(parsed.delta);
        }
      } catch { /* skip */ }
    }
  }
  return full;
}

export async function checkGrammar(text: string, level: string) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error("Not authenticated");
  const res = await fetch(`${SUPABASE_URL}/functions/v1/grammar-check`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({ text, level }),
  });
  if (!res.ok) throw new Error(`grammar-check failed: ${res.status}`);
  return res.json() as Promise<{
    has_error: boolean;
    hint: string;
    corrected: string;
    new_words: { word: string; meaning: string }[];
  }>;
}

export async function transcribeAudio(base64: string, mimeType: string) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error("Not authenticated");
  const res = await fetch(`${SUPABASE_URL}/functions/v1/voice-transcribe`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({ audio_base64: base64, mime_type: mimeType }),
  });
  if (!res.ok) throw new Error(`voice-transcribe failed: ${res.status}`);
  return res.json() as Promise<{ text: string }>;
}
