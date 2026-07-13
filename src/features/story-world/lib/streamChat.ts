import { supabase } from "@/lib/supabase";

export async function streamStoryChat(
  body: Record<string, unknown>,
  onDelta: (chunk: string) => void,
): Promise<string> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error("Not authenticated");

  const { data, error } = await supabase.functions.invoke("story-chat", {
    body,
    headers: { Authorization: `Bearer ${session.access_token}` },
  });

  if (error) {
    throw new Error(error.message || "story-chat failed");
  }

  const response = data instanceof Response ? data : null;
  if (!response?.ok || !response.body) {
    const text = response ? await response.text().catch(() => "") : JSON.stringify(data ?? {});
    throw new Error(`story-chat failed: ${response?.status ?? "unknown"} ${text}`);
  }

  const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
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
  const { data, error } = await supabase.functions.invoke("grammar-check", {
    body: { text, level },
    headers: { Authorization: `Bearer ${session.access_token}` },
  });
  if (error) throw new Error(error.message || "grammar-check failed");
  return data as {
    has_error: boolean;
    hint: string;
    corrected: string;
    new_words: { word: string; meaning: string }[];
  };
}

export async function transcribeAudio(base64: string, mimeType: string) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error("Not authenticated");
  const { data, error } = await supabase.functions.invoke("voice-transcribe", {
    body: { audio_base64: base64, mime_type: mimeType },
    headers: { Authorization: `Bearer ${session.access_token}` },
  });
  if (error) throw new Error(error.message || "voice-transcribe failed");
  return data as { text: string };
}
