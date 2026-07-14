import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { MessageCircle, X, Send, Sparkles, Trash2, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAiPersona } from "@/hooks/useAiPersona";
import { useAuth } from "@/hooks/useAuth";
import { pickLocalized } from "@/lib/siteContent";
import sirajAvatarUrl from "@/assets/siraj-avatar.png";
import sirajChatAvatarUrl from "@/assets/siraj-chat-avatar.png";
const sirajAvatar = { url: sirajAvatarUrl };
const sirajChatAvatar = { url: sirajChatAvatarUrl };


type ChatMsg = { role: "user" | "assistant"; content: string };

const STORAGE_KEY = "lugha.siraj.chat.v1";
const OPEN_EVENT = "siraj:open";

import { geminiEndpoint } from "@/features/story-world/lib/streamChat";

const GEMINI_MODEL = "gemini-2.5-flash-lite";

function buildSirajSystem(opts: {
  language: "ar" | "en" | "tr";
  tutorName: string;
  tutorTitle: string;
  tutorAccent: string;
  pageContext: { path?: string; title?: string; hint?: string };
}): string {
  const { language, tutorName, tutorTitle, tutorAccent, pageContext } = opts;
  const pageLine =
    pageContext.path || pageContext.title
      ? `الطالب الآن في صفحة: ${pageContext.title ?? ""} (${pageContext.path ?? ""}). ${pageContext.hint ?? ""}`.trim()
      : "";
  const langInstruction: Record<string, string> = {
    ar: `تحدّث معه بالعربية العامية اللطيفة (لهجة ${tutorAccent || "أردنية"}) ما لم يطلب الفصحى. اجعل الردود قصيرة ودافئة (٢-٤ جمل).`,
    en: `Reply mainly in clear English, sprinkle Arabic examples with translation. Keep replies short and friendly (2–4 sentences).`,
    tr: `Öğrenciye çoğunlukla Türkçe cevap ver; Arapça örnekleri çevirisiyle ver. 2–4 cümle, sıcak.`,
  };
  return `أنت ${tutorName}، ${tutorTitle || "رفيق الطالب في تعلّم العربية"}. أنت مساعد ذكي داخل موقع "لُغة".
- لا تكشف أبداً أنك نموذج ذكاء اصطناعي؛ قدّم نفسك دائماً باسم "${tutorName}".
- ${langInstruction[language] ?? langInstruction.ar}
- عند تصحيح خطأ لغوي، اذكر الصواب بلطف ثم اشرح باختصار.
- استخدم Markdown بسيط لتحسين القراءة.
- إذا سُئلت خارج نطاق العربية، أعد التوجيه بلطف.
${pageLine ? `\nسياق الصفحة الحالية: ${pageLine}` : ""}`;
}

const UI = {
  ar: {
    open: "افتح مجلس سِراج",
    close: "إغلاق",
    placeholder: "اسأل سِراج أي شيء عن العربية…",
    send: "إرسال",
    clear: "مسح المحادثة",
    online: "متصل الآن",
    footer: "مدعوم بذكاء لُغة",
    error: "تعذّر الاتصال بسِراج. جرّب مرة أخرى.",
    rateLimit: "الطلب كثير الآن. أعد المحاولة بعد لحظات.",
    credits: "انتهت رصيد الذكاء الاصطناعي. أضف رصيداً للاستمرار.",
    thinking: "سِراج يفكّر…",
    starter: "أهلاً! أنا سِراج. اسألني عن أي كلمة، جملة، أو درس تحتاج مساعدة فيه.",
    hints: ["ما معنى «كتاب»؟", "علّمني تحية صباحية", "صحّح جملتي: أنا يذهب إلى السوق", "اعطني كلمة اليوم"],
  },
  en: {
    open: "Open Siraj's chat",
    close: "Close",
    placeholder: "Ask Siraj anything about Arabic…",
    send: "Send",
    clear: "Clear chat",
    online: "Online",
    footer: "Powered by Lugha AI",
    error: "Couldn't reach Siraj. Please try again.",
    rateLimit: "Too many requests. Please try again in a moment.",
    credits: "AI credits exhausted. Please top up to continue.",
    thinking: "Siraj is thinking…",
    starter: "Hi! I'm Siraj. Ask me any Arabic word, phrase, or lesson question.",
    hints: ["What does «kitab» mean?", "Teach me a morning greeting", "Correct: I go to market in Arabic", "Give me today's word"],
  },
  tr: {
    open: "Siraj sohbetini aç",
    close: "Kapat",
    placeholder: "Siraj'a Arapça hakkında her şeyi sor…",
    send: "Gönder",
    clear: "Sohbeti temizle",
    online: "Çevrimiçi",
    footer: "Lugha AI ile güçlendirildi",
    error: "Siraj'a ulaşılamadı. Lütfen tekrar deneyin.",
    rateLimit: "Çok fazla istek. Lütfen biraz sonra tekrar deneyin.",
    credits: "AI kredisi bitti. Devam etmek için yükleme yapın.",
    thinking: "Siraj düşünüyor…",
    starter: "Merhaba! Ben Siraj. Arapça hakkında herhangi bir soruyu bana sor.",
    hints: ["«kitab» ne demek?", "Sabah selamı öğret", "Düzelt: Pazara gidiyorum", "Bugünün kelimesi nedir?"],
  },
} as const;

const routeHints: Array<{ match: RegExp; hint: string }> = [
  { match: /^\/course\/alphabet/, hint: "الطالب يدرس الحروف الأبجدية العربية." },
  { match: /^\/course\/greetings/, hint: "الطالب يدرس التحيات والعبارات اليومية." },
  { match: /^\/course\/numbers/, hint: "الطالب يدرس الأرقام العربية." },
  { match: /^\/course\//, hint: "الطالب داخل صفحة درس عربي." },
  { match: /^\/story/, hint: "الطالب في وضع 'عوالم القصص' يتحدّث مع شخصية." },
  { match: /^\/placement-test/, hint: "الطالب يجري اختبار تحديد المستوى." },
  { match: /^\/learn/, hint: "الطالب يتصفّح مسارات التعلّم." },
  { match: /^\/teachers/, hint: "الطالب يستعرض المدرّسين." },
  { match: /^\/ai/, hint: "الطالب في مجلس لُغة." },
  { match: /^\/support/, hint: "الطالب في صفحة الدعم." },
  { match: /^\/faq/, hint: "الطالب يقرأ الأسئلة الشائعة." },
];

const routeIsHidden = (path: string) =>
  path.startsWith("/admin") ||
  path.startsWith("/login") ||
  /^\/story\/[^/]+/.test(path);

const SirajCompanion = () => {
  const { language, dir } = useLanguage();
  const persona = useAiPersona();
  const { pathname } = useLocation();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as ChatMsg[]) : [];
    } catch { return []; }
  });
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const strings = UI[language];
  const tutorName = pickLocalized(persona.tutorName, language, "Siraj");
  const tutorTitle = pickLocalized(persona.tutorTitle, language, "");
  const initial = tutorName.charAt(0) || "س";
  const hidden = routeIsHidden(pathname);

  // Persist
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-40))); } catch {}
  }, [messages]);

  // Cross-page open trigger
  useEffect(() => {
    const openHandler = () => setOpen(true);
    window.addEventListener(OPEN_EVENT, openHandler);
    return () => window.removeEventListener(OPEN_EVENT, openHandler);
  }, []);

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, streamingText, open]);

  // Focus input on open
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  const pageContext = useMemo(() => {
    const hint = routeHints.find((r) => r.match.test(pathname))?.hint ?? "";
    return {
      path: pathname,
      title: typeof document !== "undefined" ? document.title : "",
      hint,
    };
  }, [pathname]);

  const send = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    setError(null);
    setInput("");
    const nextMessages: ChatMsg[] = [...messages, { role: "user", content: trimmed }];
    setMessages(nextMessages);
    setBusy(true);
    setStreamingText("");

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const systemInstruction = buildSirajSystem({
        language,
        tutorName,
        tutorTitle,
        tutorAccent: pickLocalized(persona.tutorAccent, language, ""),
        pageContext,
      });

      const contents = nextMessages.slice(-12).map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

      const url = geminiEndpoint(GEMINI_MODEL, "streamGenerateContent", "alt=sse");

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemInstruction }] },
          contents,
          generationConfig: { temperature: 0.85, maxOutputTokens: 512 },
        }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => "");
        console.error("[Siraj] Gemini error", res.status, errText);
        if (res.status === 429) setError(strings.rateLimit);
        else if (res.status === 402 || res.status === 403) setError(strings.credits);
        else setError(`${strings.error} (${res.status})`);
        setBusy(false);
        return;
      }
      if (!res.body) { setError(strings.error); setBusy(false); return; }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let assembled = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";
        for (const line of lines) {
          const t = line.trim();
          if (!t.startsWith("data:")) continue;
          const payload = t.slice(5).trim();
          if (!payload || payload === "[DONE]") continue;
          try {
            const parsed = JSON.parse(payload);
            const delta =
              parsed?.candidates?.[0]?.content?.parts
                ?.map((p: { text?: string }) => p.text ?? "")
                .join("") ?? "";
            if (delta) {
              assembled += delta;
              setStreamingText(assembled);
            }
          } catch { /* skip */ }
        }
      }


      if (assembled) {
        setMessages((prev) => [...prev, { role: "assistant", content: assembled }]);
      }
      setStreamingText("");
    } catch (e) {
      if ((e as Error).name !== "AbortError") {
        console.error(e);
        setError(strings.error);
      }
    } finally {
      setBusy(false);
      abortRef.current = null;
    }
  }, [messages, busy, language, tutorName, tutorTitle, persona, pageContext, strings]);

  const clear = () => {
    abortRef.current?.abort();
    setMessages([]);
    setStreamingText("");
    setError(null);
  };

  if (hidden || !user) return null;

  const panelSide = dir === "rtl" ? "left-5" : "right-5";

  return (
    <>
      {/* Floating trigger — glued to bottom-left corner */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label={strings.open}
          title={tutorName}
          className="fixed -bottom-5 left-4 md:-bottom-7 md:left-6 z-[60] group focus:outline-none"
        >
          {/* Glow halo */}
          <span
            aria-hidden
            className="absolute inset-5 -z-10 rounded-full bg-[radial-gradient(circle_at_center,hsl(var(--accent)/0.5),transparent_70%)] blur-3xl animate-siraj-glow"
          />
          {/* Avatar (no card) */}
          <img
            src={sirajAvatar.url}
            alt={tutorName}
            draggable={false}
            className="relative w-36 h-36 md:w-48 md:h-48 object-contain select-none drop-shadow-[0_20px_30px_rgba(6,78,59,0.5)] animate-siraj-float transition-transform duration-500 ease-out group-hover:scale-105 group-hover:-translate-y-1 group-active:scale-95"
          />
          {/* Online dot */}
          <span
            aria-hidden
            className="absolute top-8 right-8 md:top-12 md:right-12 w-3 h-3 bg-emerald-400 rounded-full ring-2 ring-background shadow-md animate-pulse"
          />
        </button>
      )}





      {/* Chat panel */}
      {open && (
        <div
          className={`fixed bottom-5 ${panelSide} z-[60] w-[min(96vw,400px)] h-[min(80vh,620px)] bg-card border-2 border-primary shadow-2xl flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300`}
        >
          {/* Header */}
          <div className="bg-primary text-primary-foreground p-4 flex items-center gap-3 border-b border-accent/40">
            <span className="w-12 h-12 rounded-full overflow-hidden bg-accent/10 ring-2 ring-accent shrink-0">
              <img src={sirajChatAvatar.url} alt={tutorName} className="w-full h-full object-cover" />
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-display italic font-semibold text-lg leading-tight truncate">{tutorName}</p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-accent font-semibold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                {strings.online}
              </p>
            </div>
            <button
              onClick={clear}
              title={strings.clear}
              className="text-primary-foreground/60 hover:text-destructive p-1.5"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setOpen(false)}
              title={strings.close}
              className="text-primary-foreground/70 hover:text-accent p-1.5"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-background/40">
            {messages.length === 0 && (
              <div className="text-center py-6">
                <div className="w-20 h-20 mx-auto rounded-full overflow-hidden bg-accent/10 ring-2 ring-accent mb-3">
                  <img src={sirajChatAvatar.url} alt={tutorName} className="w-full h-full object-cover" />
                </div>
                <p className="text-sm text-foreground leading-relaxed max-w-[280px] mx-auto">
                  {strings.starter}
                </p>
                <div className="mt-5 flex flex-col gap-2 max-w-[300px] mx-auto">
                  {strings.hints.map((h) => (
                    <button
                      key={h}
                      onClick={() => send(h)}
                      className="text-xs text-start px-3 py-2 border border-border bg-card hover:border-accent hover:text-accent transition-colors"
                    >
                      <Sparkles className="inline w-3 h-3 me-1.5 text-accent" />
                      {h}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m, i) => (
              <Bubble key={i} msg={m} tutorAvatar={sirajChatAvatar.url} tutorName={tutorName} />
            ))}

            {streamingText && (
              <Bubble msg={{ role: "assistant", content: streamingText }} tutorAvatar={sirajChatAvatar.url} tutorName={tutorName} streaming />
            )}

            {busy && !streamingText && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground px-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> {strings.thinking}
              </div>
            )}

            {error && (
              <div className="text-xs text-destructive bg-destructive/10 border border-destructive/40 p-2">
                {error}
              </div>
            )}
          </div>

          {/* Composer */}
          <form
            onSubmit={(e) => { e.preventDefault(); send(input); }}
            className="border-t border-border p-3 bg-card"
          >
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send(input);
                  }
                }}
                rows={1}
                placeholder={strings.placeholder}
                className="flex-1 resize-none bg-background border border-border px-3 py-2 text-sm focus:border-accent outline-none max-h-32 min-h-[40px]"
              />
              <button
                type="submit"
                disabled={busy || !input.trim()}
                className="bg-accent text-accent-foreground w-10 h-10 flex items-center justify-center hover:opacity-90 disabled:opacity-40 transition-opacity"
                aria-label={strings.send}
              >
                {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </div>
            <p className="mt-2 text-[10px] uppercase tracking-widest text-muted-foreground text-center flex items-center justify-center gap-1.5">
              <MessageCircle className="w-3 h-3 text-accent" />
              {strings.footer}
            </p>
          </form>
        </div>
      )}
    </>
  );
};

const Bubble = ({
  msg,
  tutorAvatar,
  tutorName,
  streaming,
}: {
  msg: ChatMsg;
  tutorAvatar: string;
  tutorName: string;
  streaming?: boolean;
}) => {
  const isUser = msg.role === "user";
  return (
    <div className={`flex gap-2 ${isUser ? "flex-row-reverse" : ""}`}>
      {isUser ? (
        <span className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-primary text-primary-foreground">
          أنا
        </span>
      ) : (
        <span className="shrink-0 w-8 h-8 rounded-full overflow-hidden ring-1 ring-accent bg-accent/10">
          <img src={tutorAvatar} alt={tutorName} className="w-full h-full object-cover" />
        </span>
      )}
      <div
        className={`max-w-[78%] px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-secondary text-foreground border border-border"
        }`}
      >
        {renderInline(msg.content)}
        {streaming && <span className="inline-block w-1.5 h-4 ms-1 bg-accent animate-pulse align-middle" />}
      </div>
    </div>
  );
};

// Minimal **bold** rendering — no dependency on react-markdown.
const renderInline = (text: string) => {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) =>
    p.startsWith("**") && p.endsWith("**") ? (
      <strong key={i} className="font-semibold text-accent">{p.slice(2, -2)}</strong>
    ) : (
      <span key={i}>{p}</span>
    )
  );
};

export const openSiraj = () => window.dispatchEvent(new CustomEvent("siraj:open"));

export default SirajCompanion;
