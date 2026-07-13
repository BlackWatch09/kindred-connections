import { motion, AnimatePresence } from "framer-motion";
import type { LearnedWord } from "../types";
import { Feather } from "lucide-react";

interface Props {
  words: LearnedWord[];
  target: number;
}

const VocabularyBar = ({ words, target }: Props) => {
  const pct = Math.min(100, Math.round((words.length / target) * 100));
  return (
    <div className="px-4 py-3 bg-black/50 backdrop-blur border-t border-white/10">
      <div className="flex items-center justify-between mb-2 text-white/90">
        <div className="flex items-center gap-2 text-sm">
          <Feather className="w-4 h-4" />
          <span className="font-arabic">المفردات المكتسبة</span>
        </div>
        <span className="text-xs font-mono">{words.length} / {target}</span>
      </div>
      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden mb-2">
        <motion.div
          className="h-full bg-gradient-to-r from-amber-400 to-amber-600"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      <div className="flex gap-1.5 overflow-x-auto scrollbar-thin pb-1">
        <AnimatePresence>
          {words.map((w) => (
            <motion.span
              key={w.word}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-shrink-0 px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-100 text-xs font-arabic"
              title={w.meaning}
            >
              {w.word}
            </motion.span>
          ))}
        </AnimatePresence>
        {words.length === 0 && (
          <span className="text-xs text-white/50 font-arabic">تحدث معه لتكتشف كلمات جديدة…</span>
        )}
      </div>
    </div>
  );
};

export default VocabularyBar;
