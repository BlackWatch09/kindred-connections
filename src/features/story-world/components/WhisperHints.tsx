import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, X, ArrowLeft } from "lucide-react";

interface Props {
  hint: { text: string; corrected?: string; original?: string } | null;
  onClose?: () => void;
}

const WhisperHints = ({ hint, onClose }: Props) => (
  <AnimatePresence>
    {hint && hint.text && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.85, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 26 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-md rounded-3xl bg-card border border-amber-300/60 dark:border-amber-500/40 shadow-2xl p-6 pt-8"
          dir="rtl"
        >
          {onClose && (
            <button
              onClick={onClose}
              aria-label="إغلاق"
              className="absolute top-3 left-3 p-1.5 rounded-full text-muted-foreground hover:bg-muted transition"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-full bg-amber-100 dark:bg-amber-500/15 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h3 className="font-arabic font-bold text-base text-foreground">
                خطأ بسيط
              </h3>
              <p className="font-arabic text-xs text-muted-foreground">{hint.text}</p>
            </div>
          </div>

          {(hint.original || hint.corrected) && (
            <div className="flex items-stretch gap-2 mt-5">
              {hint.original && (
                <div className="flex-1 rounded-2xl border border-red-300/60 dark:border-red-500/40 bg-red-50 dark:bg-red-500/10 p-3 text-center">
                  <p className="font-arabic text-[10px] uppercase tracking-wide text-red-600 dark:text-red-400 mb-1">
                    ما كتبته
                  </p>
                  <p className="font-arabic text-base font-semibold text-red-700 dark:text-red-300 line-through decoration-red-400/70">
                    {hint.original}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-center px-1 text-muted-foreground">
                <ArrowLeft className="w-4 h-4" />
              </div>

              {hint.corrected && (
                <div className="flex-1 rounded-2xl border border-emerald-300/60 dark:border-emerald-500/40 bg-emerald-50 dark:bg-emerald-500/10 p-3 text-center">
                  <p className="font-arabic text-[10px] uppercase tracking-wide text-emerald-600 dark:text-emerald-400 mb-1">
                    الأصح
                  </p>
                  <p className="font-arabic text-base font-semibold text-emerald-700 dark:text-emerald-300">
                    {hint.corrected}
                  </p>
                </div>
              )}
            </div>
          )}

          {onClose && (
            <button
              onClick={onClose}
              className="mt-6 w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-arabic font-semibold text-sm hover:opacity-90 transition"
            >
              فهمت، أكمل
            </button>
          )}
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default WhisperHints;
