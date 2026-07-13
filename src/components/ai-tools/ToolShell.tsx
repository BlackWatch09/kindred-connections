import { ReactNode } from "react";
import { X } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  children: ReactNode;
}

export default function ToolShell({ open, onClose, title, subtitle, icon, children }: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-primary/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-3xl max-h-[92vh] bg-card border border-border shadow-2xl flex flex-col animate-in slide-in-from-bottom-4">
        <div className="flex items-start justify-between gap-4 p-5 border-b border-border bg-primary text-primary-foreground">
          <div className="flex items-center gap-3">
            {icon && <div className="w-10 h-10 bg-accent text-accent-foreground flex items-center justify-center shrink-0">{icon}</div>}
            <div>
              <h3 className="font-display text-xl md:text-2xl font-bold leading-tight">{title}</h3>
              {subtitle && <p className="text-xs text-primary-foreground/70 mt-1">{subtitle}</p>}
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-primary-foreground/10 transition-colors" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="overflow-y-auto p-5 md:p-6 flex-1">{children}</div>
      </div>
    </div>
  );
}
