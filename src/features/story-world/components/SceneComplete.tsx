import { motion } from "framer-motion";
import { Star, Sparkles, ArrowLeftCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { LearnedWord } from "../types";

interface Props {
  words: LearnedWord[];
  stars: number;
  worldName: string;
  onRestart: () => void;
}

const SceneComplete = ({ words, stars, worldName, onRestart }: Props) => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative z-10" dir="rtl">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg w-full bg-card border border-border rounded-3xl p-8 text-center shadow-2xl"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: 360 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="w-20 h-20 mx-auto rounded-full gradient-gold flex items-center justify-center mb-4"
        >
          <Sparkles className="w-10 h-10 text-accent-foreground" />
        </motion.div>
        <h2 className="font-arabic text-3xl font-bold text-foreground mb-1">أنهيت المشهد!</h2>
        <p className="font-arabic text-muted-foreground mb-6">في {worldName}</p>

        <div className="flex justify-center gap-1 mb-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
            >
              <Star
                className={`w-8 h-8 ${i < stars ? "fill-amber-400 text-amber-400" : "text-muted"}`}
              />
            </motion.div>
          ))}
        </div>

        <div className="bg-secondary rounded-2xl p-4 mb-6">
          <p className="font-arabic text-sm text-muted-foreground mb-2">
            كلمات جديدة اكتسبتها
          </p>
          <p className="font-arabic text-4xl font-bold text-accent mb-3">{words.length}</p>
          {words.length > 0 && (
            <div className="flex flex-wrap justify-center gap-1.5">
              {words.slice(0, 12).map((w) => (
                <span
                  key={w.word}
                  className="px-2.5 py-1 rounded-full bg-accent/10 border border-accent/30 text-foreground text-sm font-arabic"
                  title={w.meaning}
                >
                  {w.word}
                </span>
              ))}
            </div>
          )}
        </div>

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

export default SceneComplete;
