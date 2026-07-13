// Admin auth: password hash in localStorage. Default: "abuhantash123"
const HASH_KEY = "lugha_admin_pw_hash";
const SESSION_KEY = "lugha_admin_session";
const DEFAULT_PW = "abuhantash123";

async function sha256(s: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function ensureDefaultPassword() {
  if (!localStorage.getItem(HASH_KEY)) {
    localStorage.setItem(HASH_KEY, await sha256(DEFAULT_PW));
  }
}

export async function verifyPassword(pw: string): Promise<boolean> {
  await ensureDefaultPassword();
  return (await sha256(pw)) === localStorage.getItem(HASH_KEY);
}

export async function changePassword(current: string, next: string): Promise<boolean> {
  if (!(await verifyPassword(current))) return false;
  if (next.length < 6) return false;
  localStorage.setItem(HASH_KEY, await sha256(next));
  return true;
}

export function startSession() {
  const token = crypto.randomUUID();
  sessionStorage.setItem(SESSION_KEY, token);
}

export function isAuthed(): boolean {
  return !!sessionStorage.getItem(SESSION_KEY);
}

export function endSession() {
  sessionStorage.removeItem(SESSION_KEY);
}
