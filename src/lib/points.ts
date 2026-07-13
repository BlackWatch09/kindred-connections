// Lightweight local points ledger — persists in localStorage per user.
// Rendered by Dashboard as "نقاط سِراج".

export type PointsEntry = {
  tool: string;
  label: string;
  points: number;
  meta?: Record<string, any>;
  at: number;
};

export type PointsLedger = {
  total: number;
  log: PointsEntry[];
};

const KEY = (uid: string | null | undefined) => `siraj_points_${uid || "guest"}`;

export function getPoints(uid: string | null | undefined): PointsLedger {
  try {
    const raw = localStorage.getItem(KEY(uid));
    if (!raw) return { total: 0, log: [] };
    const parsed = JSON.parse(raw);
    return {
      total: Number(parsed?.total) || 0,
      log: Array.isArray(parsed?.log) ? parsed.log : [],
    };
  } catch {
    return { total: 0, log: [] };
  }
}

export function addPoints(
  uid: string | null | undefined,
  entry: Omit<PointsEntry, "at">,
): PointsLedger {
  const ledger = getPoints(uid);
  const next: PointsLedger = {
    total: ledger.total + Math.max(0, Math.round(entry.points)),
    log: [{ ...entry, at: Date.now() }, ...ledger.log].slice(0, 200),
  };
  try {
    localStorage.setItem(KEY(uid), JSON.stringify(next));
    window.dispatchEvent(new CustomEvent("siraj:points-changed"));
  } catch {
    /* ignore */
  }
  return next;
}
