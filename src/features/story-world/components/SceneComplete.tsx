import { motion } from "framer-motion";
import { Star, Sparkles, ArrowLeftCircle, BookOpen, MessageCircle, Wand2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { LearnedWord } from "../types";
import type { Correction } from "../hooks/useStorySession";

interface Props {
  words: LearnedWord[];
  corrections: Correction[];
  messagesCount: number;
  stars: number;
  worldName: string;
  onRestart: () => void;
}

const SceneComplete = ({ words, corrections, messagesCount, stars, worldName, onRestart }: Props) => {
  const navigate = useNavigate();
  const accuracy = messagesCount
    ? Math.max(0, Math.round(((messagesCount - corrections.length) / messagesCount) * 100))
    : 100;

  return (
    <div className="min-h-[100dvh] flex items-center justify-center p-4 sm:p-6 relative z-10 overflow-y-auto" dir="rtl">
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-lg w-full bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-2xl my-6"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: 360 }}
            transition={{ delay: 0.15, type: "spring" }}
            className="w-20 h-20 mx-auto rounded-full gradient-gold flex items-center justify-center mb-4"
          >
            <Sparkles className="w-10 h-10 text-accent-foreground" />
          </motion.div>
          <h2 className="font-arabic text-3xl font-bold text-foreground mb-1">أنهيت المشهد!</h2>
          <p className="font-arabic text-muted-foreground mb-5">في {worldName}</p>

          <div className="flex justify-center gap-1 mb-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
              >
                <Star
                  className={`w-8 h-8 ${i < stars ? "fill-amber-400 text-amber-400" : "text-muted"}`}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          <StatCard icon={<BookOpen className="w-4 h-4" />} value={words.length} label="كلمة جديدة" tone="accent" />
          <StatCard icon={<MessageCircle className="w-4 h-4" />} value={messagesCount} label="رسالة" tone="primary" />
          <StatCard icon={<Wand2 className="w-4 h-4" />} value={`${accuracy}%`} label="دقتك" tone="emerald" />
        </div>

        {/* New vocabulary */}
        {words.length > 0 && (
          <section className="bg-secondary/60 rounded-2xl p-4 mb-4">
            <p className="font-arabic text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-accent" /> كلمات جديدة اكتسبتها
            </p>
            <div className="flex flex-wrap gap-1.5">
              {words.slice(0, 20).map((w) => (
                <span
                  key={w.word}
                  className="px-2.5 py-1 rounded-full bg-accent/10 border border-accent/30 text-foreground text-sm font-arabic"
                  title={w.meaning}
                >
                  {w.word}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Corrections */}
        {corrections.length > 0 && (
          <section className="bg-amber-50 dark:bg-amber-500/5 border border-amber-200/60 dark:border-amber-500/20 rounded-2xl p-4 mb-5">
            <p className="font-arabic text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Wand2 className="w-4 h-4 text-amber-600 dark:text-amber-400" /> أخطاء تم تصحيحها
              <span className="mr-auto text-xs font-normal text-muted-foreground">
                {corrections.length}
              </span>
            </p>
            <ul className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {corrections.map((c, i) => (
                <li
                  key={i}
                  className="rounded-xl bg-background/70 border border-border/60 p-2.5"
                >
                  <div className="flex items-center gap-2 text-sm font-arabic">
                    <span className="flex-1 min-w-0 truncate text-red-600 dark:text-red-400 line-through decoration-red-400/60">
                      {c.original}
                    </span>
                    <ArrowLeft className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                    <span className="flex-1 min-w-0 truncate text-emerald-700 dark:text-emerald-400 font-semibold">
                      {c.corrected}
                    </span>
                  </div>
                  {c.hint && (
                    <p className="font-arabic text-xs text-muted-foreground mt-1 leading-relaxed">
                      {c.hint}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        {corrections.length === 0 && messagesCount > 0 && (
          <div className="text-center bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200/60 dark:border-emerald-500/30 rounded-2xl p-3 mb-5">
            <p className="font-arabic text-sm text-emerald-700 dark:text-emerald-300 font-semibold">
              ✨ أداء ممتاز — بدون أي أخطاء!
            </p>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onRestart}
            className="flex-1 px-5 py-3 rounded-xl gradient-gold text-accent-foreground font-semibold font-arabic"
          >
            عالم جديد
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-5 py-3 rounded-xl border border-border text-foreground font-arabic flex items-center gap-2"
          >
            <ArrowLeftCircle className="w-4 h-4" />
            لوحتي
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const StatCard = ({
  icon, value, label, tone,
}: {
  icon: React.ReactNode;
  value: number | string;
  label: string;
  tone: "accent" | "primary" | "emerald";
}) => {
  const toneClass = {
    accent: "text-accent",
    primary: "text-primary",
    emerald: "text-emerald-600 dark:text-emerald-400",
  }[tone];
  return (
    <div className="bg-secondary/60 rounded-2xl p-3 text-center">
      <div className={`flex items-center justify-center gap-1 ${toneClass}`}>{icon}</div>
      <p className={`font-arabic text-2xl font-bold ${toneClass} leading-tight mt-1`}>{value}</p>
      <p className="font-arabic text-[11px] text-muted-foreground mt-0.5">{label}</p>
    </div>
  );
};

export default SceneComplete;
