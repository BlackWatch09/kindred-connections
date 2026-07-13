import { AnimatePresence, motion } from "framer-motion";
import { Lightbulb } from "lucide-react";

interface Props {
  hint: { text: string; corrected?: string } | null;
}

const WhisperHints = ({ hint }: Props) => (
  <AnimatePresence>
    {hint && hint.text && (
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.25 }}
        className="mt-2 flex items-start gap-2 px-3 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 dark:bg-amber-500/10 dark:border-amber-500/30 dark:text-amber-100"
      >
        <Lightbulb className="w-4 h-4 mt-0.5 flex-shrink-0 text-amber-600" />
        <div className="text-sm leading-relaxed">
          <p className="font-arabic">{hint.text}</p>
          {hint.corrected && (
            <p className="font-arabic text-xs mt-1 opacity-80">
              الأفضل: <span className="font-semibold">{hint.corrected}</span>
            </p>
          )}
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default WhisperHints;
