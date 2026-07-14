// Central error utilities: friendly Arabic messages, timeouts, and retries.
// Keep messages short, honest, and actionable.

export const MAX_TEXT_LEN = 2000;
export const MAX_SENTENCE_LEN = 500;
export const MAX_TOPIC_LEN = 120;
export const MAX_INTERESTS_LEN = 200;

export class AppError extends Error {
  code: string;
  cause?: unknown;
  constructor(message: string, code = "APP_ERROR", cause?: unknown) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.cause = cause;
  }
}

/**
 * Convert any thrown value into a short Arabic message that is safe to show.
 * Falls back to a generic message; never returns an empty string.
 */
export function friendlyError(err: unknown): string {
  if (err == null) return "حدث خطأ غير متوقع. حاول مرة أخرى.";

  // Native abort / timeout
  const name = (err as any)?.name;
  if (name === "AbortError") return "استغرقت العملية وقتاً طويلاً. تحقّق من اتصالك ثم أعِد المحاولة.";
  if (name === "TimeoutError") return "انتهت مهلة الاتصال. حاول مرة أخرى.";

  // Fetch/network
  if (err instanceof TypeError && /fetch|network/i.test(err.message)) {
    return "تعذّر الاتصال بالخادم. تحقّق من اتصال الإنترنت.";
  }

  // Supabase FunctionsError shape
  const status =
    (err as any)?.context?.status ??
    (err as any)?.status ??
    (err as any)?.response?.status;

  if (status === 429) return "تم تجاوز حد الطلبات، انتظر قليلاً ثم أعد المحاولة.";
  if (status === 402) return "انتهى رصيد الذكاء الاصطناعي. تواصل مع الدعم.";
  if (status === 401 || status === 403) return "الصلاحية مرفوضة. سجّل الدخول مجدداً أو تواصل مع الدعم.";
  if (status === 404) return "الخدمة المطلوبة غير متوفرة حالياً.";
  if (typeof status === "number" && status >= 500) return "الخدمة غير متاحة مؤقتاً. حاول بعد قليل.";

  const msg = (err as any)?.message;
  if (typeof msg === "string" && msg.trim()) {
    // Trim overly long raw errors before showing.
    return msg.length > 240 ? msg.slice(0, 240) + "…" : msg;
  }

  return "حدث خطأ غير متوقع. حاول مرة أخرى.";
}

/** Wrap a promise with a timeout. Rejects with a TimeoutError-like Error. */
export function withTimeout<T>(promise: Promise<T>, ms: number, label = "operation"): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const t = setTimeout(() => {
      const e = new Error(`انتهت مهلة ${label}.`);
      (e as any).name = "TimeoutError";
      reject(e);
    }, ms);
    promise.then(
      (v) => { clearTimeout(t); resolve(v); },
      (e) => { clearTimeout(t); reject(e); },
    );
  });
}

/** Simple retry with exponential backoff. Skips retry on 4xx (client errors). */
export async function retry<T>(
  fn: () => Promise<T>,
  { tries = 2, baseDelay = 400 }: { tries?: number; baseDelay?: number } = {},
): Promise<T> {
  let lastErr: unknown;
  for (let i = 0; i < tries; i++) {
    try {
      return await fn();
    } catch (e: any) {
      lastErr = e;
      const status = e?.context?.status ?? e?.status;
      // Do not retry on validation / auth / not-found errors.
      if (typeof status === "number" && status >= 400 && status < 500 && status !== 408 && status !== 429) {
        throw e;
      }
      if (i < tries - 1) await new Promise((r) => setTimeout(r, baseDelay * Math.pow(2, i)));
    }
  }
  throw lastErr;
}

/** Enforce a max length on a user string; throws a friendly AppError when exceeded. */
export function assertMaxLen(value: string, max: number, field: string): void {
  if (value && value.length > max) {
    throw new AppError(`${field} طويل جداً (الحد ${max} حرف).`, "VALIDATION");
  }
}
