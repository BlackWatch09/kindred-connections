// Central AI model registry. Admin picks one model — every AI feature uses it.
// Storage: piggy-backs on siteContent's localStorage (key `lugha_admin_content_v1`),
// with a lightweight direct read here to avoid circular imports.

export type GeminiModelId =
  | "gemini-2.5-flash-lite"
  | "gemini-2.5-flash"
  | "gemini-2.5-pro"
  | "gemini-2.0-flash"
  | "gemini-2.0-flash-lite";

export type GeminiModelOption = {
  id: GeminiModelId;
  label: string;
  tagline: string;
  badge: "fast" | "balanced" | "premium";
};

export const GEMINI_MODEL_OPTIONS: GeminiModelOption[] = [
  {
    id: "gemini-2.5-flash-lite",
    label: "Gemini 2.5 Flash Lite",
    tagline: "الأخف والأسرع — مثالي للمحادثات اليومية.",
    badge: "fast",
  },
  {
    id: "gemini-2.5-flash",
    label: "Gemini 2.5 Flash",
    tagline: "توازن الجودة والسرعة — الخيار الافتراضي القوي.",
    badge: "balanced",
  },
  {
    id: "gemini-2.5-pro",
    label: "Gemini 2.5 Pro",
    tagline: "أعلى جودة وذكاء — للتحليل العميق والدروس المتقدمة.",
    badge: "premium",
  },
  {
    id: "gemini-2.0-flash",
    label: "Gemini 2.0 Flash",
    tagline: "الجيل السابق السريع — بديل احتياطي مستقر.",
    badge: "balanced",
  },
  {
    id: "gemini-2.0-flash-lite",
    label: "Gemini 2.0 Flash Lite",
    tagline: "الأرخص على الإطلاق — للتجارب والاختبارات.",
    badge: "fast",
  },
];

export const DEFAULT_GEMINI_MODEL: GeminiModelId = "gemini-2.5-flash-lite";
const KEY = "lugha_admin_content_v1";

function readModel(): GeminiModelId {
  try {
    if (typeof localStorage === "undefined") return DEFAULT_GEMINI_MODEL;
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT_GEMINI_MODEL;
    const parsed = JSON.parse(raw);
    const m = parsed?.settings?.aiModel;
    if (typeof m === "string" && GEMINI_MODEL_OPTIONS.some((o) => o.id === m)) {
      return m as GeminiModelId;
    }
  } catch { /* ignore */ }
  return DEFAULT_GEMINI_MODEL;
}

/** Bare Gemini model id, e.g. `gemini-2.5-flash-lite` — for the gemini-proxy path. */
export function getAiModel(): GeminiModelId {
  return readModel();
}

/** Gateway-form id, e.g. `google/gemini-2.5-flash-lite` — for Lovable AI Gateway calls. */
export function getGatewayModel(): string {
  return `google/${readModel()}`;
}
