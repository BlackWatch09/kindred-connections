const BASE = "https://zekkojrgknpvmxskyqno.supabase.co/functions/v1";
const ANON = "sb_publishable_fbcN8yLZl8_5VMGokMH24g_4LaaOnCu";

export async function callFn<T = any>(name: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE}/${name}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: ANON,
      Authorization: `Bearer ${ANON}`,
    },
    body: JSON.stringify(body ?? {}),
  });
  const text = await res.text();
  let data: any;
  try { data = text ? JSON.parse(text) : {}; } catch { data = { error: text }; }
  if (!res.ok) {
    const msg = data?.error || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return data as T;
}
