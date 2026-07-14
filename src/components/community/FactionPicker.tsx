import { useState } from "react";
import { FACTIONS, FactionId, chooseFaction } from "@/lib/community";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

interface Props {
  onChosen: (f: FactionId) => void;
  onClose?: () => void;
  dismissible?: boolean;
}

export const FactionPicker = ({ onChosen, onClose, dismissible }: Props) => {
  const { user } = useAuth();
  const [selected, setSelected] = useState<FactionId | null>(null);
  const [busy, setBusy] = useState(false);

  const confirm = async () => {
    if (!user || !selected) return;
    setBusy(true);
    try {
      await chooseFaction(user.id, selected);
      toast.success("انضممت إلى " + FACTIONS[selected].name);
      onChosen(selected);
    } catch (e) {
      toast.error("تعذر الاختيار: " + (e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-background/80 backdrop-blur-sm p-4" dir="rtl">
      <div className="w-full max-w-3xl border border-accent/40 bg-card p-6 md:p-8 shadow-2xl">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 text-accent text-xs uppercase tracking-[0.3em] font-semibold mb-2">
            <ShieldCheck className="w-4 h-4" /> اختر تحالفك
          </div>
          <h2 className="font-arabic text-2xl md:text-3xl font-bold text-foreground">إلى أي بيتٍ من بيوت العرب تنتمي؟</h2>
          <p className="font-arabic text-sm text-muted-foreground mt-2">
            اختيارك يحدد لون بطاقتك، شارتك، وترتيبك في لوحة التحالفات.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.values(FACTIONS).map((f) => {
            const isSel = selected === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setSelected(f.id)}
                className={`text-right border-2 p-5 transition-all ${
                  isSel ? `${f.borderClass} bg-background scale-[1.02]` : "border-border bg-background/50 hover:border-accent/40"
                }`}
              >
                <div className={`w-12 h-12 grid place-items-center text-primary-foreground text-2xl mb-3 ${f.colorClass}`}>
                  {f.emblem}
                </div>
                <div className={`font-arabic text-lg font-bold ${f.textClass}`}>{f.name}</div>
                <div className="font-arabic text-sm text-muted-foreground mt-1">{f.motto}</div>
              </button>
            );
          })}
        </div>
        <div className="mt-6 flex items-center justify-end gap-3">
          {dismissible && (
            <button onClick={onClose} className="text-sm text-muted-foreground hover:text-foreground px-4 py-2">
              لاحقاً
            </button>
          )}
          <button
            onClick={confirm}
            disabled={!selected || busy}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 text-sm font-semibold uppercase tracking-widest hover:bg-emerald transition-colors disabled:opacity-50"
          >
            {busy && <Loader2 className="w-4 h-4 animate-spin" />}
            تأكيد الانضمام
          </button>
        </div>
      </div>
    </div>
  );
};

export default FactionPicker;
