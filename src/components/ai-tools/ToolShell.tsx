import { ReactNode } from "react";
import { X } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  headerExtra?: ReactNode;
  size?: "md" | "lg" | "xl";
  children: ReactNode;
}

const sizeClass = {
  md: "sm:max-w-xl",
  lg: "sm:max-w-2xl",
  xl: "sm:max-w-3xl",
} as const;

export default function ToolShell({
  open, onClose, title, subtitle, icon, headerExtra, size = "lg", children,
}: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[80] flex items-stretch sm:items-start justify-center sm:pt-20 sm:pb-6 sm:px-4">
      <div className="absolute inset-0 bg-primary/60 backdrop-blur-sm" onClick={onClose} />
      <div
        className={`relative w-full ${sizeClass[size]} h-[100dvh] sm:h-auto sm:max-h-[calc(100vh-6rem)] bg-card border border-border shadow-2xl flex flex-col sm:rounded-lg overflow-hidden animate-in slide-in-from-bottom-4`}
      >

        <div className="flex items-start justify-between gap-3 p-4 sm:p-5 border-b border-border bg-primary text-primary-foreground">
          <div className="flex items-center gap-3 min-w-0">
            {icon && (
              <div className="w-10 h-10 bg-accent text-accent-foreground flex items-center justify-center shrink-0">
                {icon}
              </div>
            )}
            <div className="min-w-0">
              <h3 className="font-display text-lg sm:text-xl md:text-2xl font-bold leading-tight truncate">{title}</h3>
              {subtitle && (
                <p className="text-[11px] sm:text-xs text-primary-foreground/70 mt-1 line-clamp-2">{subtitle}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {headerExtra}
            <button
              onClick={onClose}
              className="p-2 hover:bg-primary-foreground/10 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="overflow-y-auto p-4 sm:p-5 md:p-6 flex-1 overscroll-contain">
          {children}
        </div>
      </div>
    </div>
  );
}

