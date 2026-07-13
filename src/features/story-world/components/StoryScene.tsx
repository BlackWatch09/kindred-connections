import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Send, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { useStorySession } from "../hooks/useStorySession";
import { getWorld } from "../data/worlds";
import { generateSceneSeed } from "../lib/sceneSeed";
import { streamStoryChat, checkGrammar, getGeminiKey, setGeminiKey } from "../lib/streamChat";

function ensureGeminiKey(): boolean {
  if (getGeminiKey()) return true;
  const k = window.prompt(
    "أدخل مفتاح Gemini API المجاني لتفعيل المحادثة\n(احصل عليه مجاناً من: https://aistudio.google.com/apikey)",
    "",
  );
  if (k && k.trim()) { setGeminiKey(k.trim()); return true; }
  return false;
}
import DialogueStream from "./DialogueStream";
import WhisperHints from "./WhisperHints";
import VocabularyBar from "./VocabularyBar";
import VoiceRecorder from "./VoiceRecorder";
import SceneComplete from "./SceneComplete";
import { toast } from "sonner";

const StoryScene = () => {
  const { worldId } = useParams<{ worldId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const world = worldId ? getWorld(worldId) : null;

  const {
    sessionId, messages, streamingText, isStreaming, currentHint, learnedThisSession, corrections,
    sceneSeed, priorScenarios, unknownWords,
    init, addMessage, appendStream, finalizeStream, setStreaming, setHint, addLearned, addCorrection, reset,
  } = useStorySession();

  const [input, setInput] = useState("");
  const [complete, setComplete] = useState(false);
  const [stars, setStars] = useState(0);
  const [ready, setReady] = useState(false);
  const hintTimeoutRef = useRef<number | null>(null);
  const grammarTimerRef = useRef<number | null>(null);

  // Bootstrap session
  useEffect(() => {
    if (!world || !user) return;
    let cancelled = false;
    (async () => {
      // Create session row
      const { data: sess, error: sErr } = await supabase
        .from("story_sessions")
        .insert({ user_id: user.id, world_id: world.id, level: world.level })
        .select()
        .single();
      if (sErr || !sess) {
        toast.error("تعذر بدء الجلسة");
        return;
      }
      // Load prior scenarios & unknown words
      const { data: history } = await supabase
        .from("scene_history")
        .select("scenario_used")
        .eq("user_id", user.id)
        .eq("world_id", world.id)
        .order("created_at", { ascending: false })
        .limit(8);

      const priors = (history ?? []).map((r: { scenario_used: string }) => r.scenario_used);
      const seed = generateSceneSeed();

      if (cancelled) return;
      init({
        sessionId: sess.id,
        worldId: world.id,
        sceneSeed: seed,
        priorScenarios: priors,
        unknownWords: [],
      });
      setReady(true);

      // Save this scenario signature
      const sig = `${seed.timeOfDay}|${seed.weather}|${seed.mood}|${seed.sideEvent}`;
      await supabase.from("scene_history").insert({
        user_id: user.id, world_id: world.id, scenario_used: sig,
      });

      // Kick off opening line
      await runAssistant({
        sessionIdArg: sess.id,
        isOpening: true,
        seedArg: seed,
        priorsArg: priors,
      });
    })();
    return () => { cancelled = true; reset(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [world?.id, user?.id]);

  const runAssistant = useCallback(async (opts: {
    sessionIdArg: string;
    isOpening?: boolean;
    userMessage?: string;
    seedArg?: typeof sceneSeed;
    priorsArg?: string[];
  }) => {
    if (!world || !user) return;
    setStreaming(true);
    try {
      const full = await streamStoryChat({
        worldId: world.id,
        characterName: world.characterName,
        characterPersona: world.characterPersona,
        level: world.level,
        sceneSeed: opts.seedArg ?? sceneSeed,
        priorScenarios: opts.priorsArg ?? priorScenarios,
        unknownWords,
        history: useStorySession.getState().messages.map((m) => ({ role: m.role, content: m.content })),
        userMessage: opts.userMessage,
        isOpening: opts.isOpening,
      }, (chunk) => appendStream(chunk));
      finalizeStream();
      // Persist assistant message
      await supabase.from("story_messages").insert({
        session_id: opts.sessionIdArg, user_id: user.id, role: "assistant", content: full,
      });
    } catch (e) {
      console.error(e);
      const message = e instanceof Error ? e.message : "";
      if (message === "MISSING_GEMINI_KEY") {
        if (ensureGeminiKey()) {
          setStreaming(false);
          toast.info("تم حفظ المفتاح، جرّب الإرسال مرة ثانية");
        } else {
          toast.error("تحتاج مفتاح Gemini لتفعيل المحادثة");
        }
      } else {
        toast.error("انقطع الاتصال — تحقق من مفتاح Gemini أو الاتصال بالإنترنت");
      }
      setStreaming(false);
    }
  }, [world, user, sceneSeed, priorScenarios, unknownWords, appendStream, finalizeStream, setStreaming]);

  const send = async (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg || !sessionId || !user || isStreaming) return;
    setInput("");
    const userMsg = { id: crypto.randomUUID(), role: "user" as const, content: msg, createdAt: Date.now() };
    addMessage(userMsg);
    await supabase.from("story_messages").insert({
      session_id: sessionId, user_id: user.id, role: "user", content: msg,
    });
    runAssistant({ sessionIdArg: sessionId, userMessage: msg });
    // Fire grammar check
    runGrammar(msg);
  };

  const runGrammar = useCallback((text: string) => {
    if (!world || !user) return;
    if (grammarTimerRef.current) window.clearTimeout(grammarTimerRef.current);
    grammarTimerRef.current = window.setTimeout(async () => {
      try {
        const res = await checkGrammar(text, world.level);
        if (res.has_error && res.hint) {
          setHint({ text: res.hint, corrected: res.corrected, original: text });
          addCorrection({ original: text, corrected: res.corrected || text, hint: res.hint });
          if (hintTimeoutRef.current) window.clearTimeout(hintTimeoutRef.current);
          hintTimeoutRef.current = window.setTimeout(() => setHint(null), 9000);
        }
        // Save new words
        for (const w of res.new_words ?? []) {
          if (!w.word) continue;
          addLearned(w);
          await supabase.from("learned_vocabulary")
            .insert({ user_id: user.id, word: w.word, meaning: w.meaning, learned_in_session: sessionId })
            .then(() => {}, () => {}); // ignore unique conflict
        }
      } catch (e) { console.error(e); }
    }, 800);
  }, [world, user, sessionId, addLearned, addCorrection, setHint]);

  const finish = async () => {
    if (!sessionId || !user || !world) return;
    const words = learnedThisSession.length;
    const target = world.targetVocab;
    const ratio = Math.min(1, words / target);
    const finalStars = Math.max(1, Math.round(ratio * 5));
    setStars(finalStars);
    setComplete(true);
    await supabase.from("story_sessions")
      .update({ ended_at: new Date().toISOString(), stars: finalStars, words_learned: words })
      .eq("id", sessionId);
  };

  if (!world) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <button onClick={() => navigate("/story")} className="text-accent underline">العودة للعوالم</button>
      </div>
    );
  }

  if (complete) {
    return (
      <SceneComplete
        words={learnedThisSession}
        corrections={corrections}
        messagesCount={messages.filter((m) => m.role === "user").length}
        stars={stars}
        worldName={world.nameAr}
        onRestart={() => navigate("/story")}
      />
    );
  }

  return (
    <div className="relative z-10 h-[100dvh] overflow-hidden" dir="rtl">
      <div className="flex flex-col lg:flex-row h-full">
        {/* Scene panel */}
        <div className="relative lg:w-3/5 lg:h-full h-[32dvh] flex-shrink-0 overflow-hidden bg-black">
          <motion.img
            src={world.worldImage}
            alt={world.nameAr}
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ scale: 1.15 }}
            animate={{ scale: 1 }}
            transition={{ duration: 6, ease: "easeOut" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          <button
            onClick={() => navigate("/story")}
            className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur text-white text-xs border border-white/20 hover:bg-black/70"
          >
            <ArrowRight className="w-3.5 h-3.5" /> العوالم
          </button>

          <div className="absolute top-3 left-3 z-10">
            <button
              onClick={finish}
              className="px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-semibold font-arabic hover:opacity-90"
            >
              إنهاء المشهد
            </button>
          </div>

          <div className="absolute bottom-0 right-0 left-0">
            <div className="flex items-end gap-2.5 px-4 pt-4 pb-2 text-white lg:gap-3 lg:p-6">
              <img
                src={world.characterImage}
                alt={world.characterName}
                className="w-12 h-12 lg:w-20 lg:h-20 rounded-full object-cover border-2 border-white/80 shadow-xl"
              />
              <div className="min-w-0">
                <p className="text-[10px] lg:text-sm text-white/80 font-arabic leading-tight">تتحدث الآن مع</p>
                <p className="font-arabic text-base lg:text-2xl font-bold leading-tight truncate">{world.characterName}</p>
                <p className="text-[10px] lg:text-xs text-white/70 font-arabic truncate">{world.nameAr}</p>
              </div>
            </div>
            <VocabularyBar words={learnedThisSession} target={world.targetVocab} />
          </div>
        </div>

        {/* Dialogue panel */}
        <div className="flex-1 min-h-0 flex flex-col bg-card border-t lg:border-t-0 lg:border-r border-border">
          {!ready ? (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin ml-2" />
              <span className="font-arabic">يجهّز المشهد…</span>
            </div>
          ) : (
            <DialogueStream
              messages={messages}
              streamingText={streamingText}
              isStreaming={isStreaming}
              characterImage={world.characterImage}
              characterName={world.characterName}
            />
          )}

          <div className="p-4 border-t border-border bg-background/50">
            <form
              onSubmit={(e) => { e.preventDefault(); send(); }}
              className="flex items-center gap-2"
            >
              <VoiceRecorder onTranscribed={(t) => send(t)} disabled={isStreaming} />
              <input
                dir="rtl"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="اكتب ردك بالعربية…"
                className="flex-1 px-4 py-2.5 rounded-full bg-background border border-border text-foreground font-arabic focus:outline-none focus:ring-2 focus:ring-accent"
                disabled={isStreaming}
              />
              <button
                type="submit"
                disabled={isStreaming || !input.trim()}
                className="flex-shrink-0 w-11 h-11 rounded-full gradient-gold text-accent-foreground flex items-center justify-center disabled:opacity-40"
              >
                {isStreaming ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 -rotate-180" />}
              </button>
            </form>
            <WhisperHints hint={currentHint} onClose={() => setHint(null)} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryScene;
