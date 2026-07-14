import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";

interface Props {
  children: ReactNode;
  /** Optional custom fallback renderer. */
  fallback?: (error: Error, reset: () => void) => ReactNode;
  /** Optional short label for context (e.g. "الأداة"). */
  scope?: string;
}

interface State {
  error: Error | null;
}

/**
 * App-wide error boundary with a friendly Arabic fallback UI.
 * Catches render-time errors from descendants and offers recovery actions.
 * Async errors (promise rejections) are NOT caught here — handle those with
 * try/catch and `friendlyError()` from `@/lib/errors`.
 */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error("[ErrorBoundary]", this.props.scope || "", error, info?.componentStack);
  }

  private reset = () => this.setState({ error: null });

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    if (this.props.fallback) return this.props.fallback(error, this.reset);

    return (
      <div
        role="alert"
        dir="rtl"
        className="min-h-[60vh] flex items-center justify-center p-6 bg-background"
      >
        <div className="max-w-lg w-full border border-border bg-card p-6 sm:p-8 text-center space-y-5">
          <div className="mx-auto w-14 h-14 bg-red-500/10 border border-red-500/30 flex items-center justify-center">
            <AlertTriangle className="w-7 h-7 text-red-600" />
          </div>
          <div className="space-y-2">
            <p className="eyebrow text-muted-foreground">— حدث خلل غير متوقع —</p>
            <h2 className="font-display text-2xl font-bold text-primary">
              نعتذر، تعطّل عرض هذه الصفحة
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              وقعت مشكلة تقنية أثناء عرض المحتوى. يمكنك المحاولة مجدداً أو العودة إلى الصفحة الرئيسية.
              إذا تكرّر الخطأ، أعِد تحميل الصفحة أو تواصل مع الدعم.
            </p>
            {import.meta.env.DEV && (
              <pre
                dir="ltr"
                className="mt-3 text-left text-[11px] bg-secondary/50 border border-border p-2 overflow-auto max-h-40 whitespace-pre-wrap"
              >
                {error.message}
              </pre>
            )}
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={this.reset}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition"
            >
              <RotateCcw className="w-4 h-4" /> إعادة المحاولة
            </button>
            <button
              onClick={() => { window.location.href = "/"; }}
              className="inline-flex items-center gap-2 px-4 py-2.5 border border-border text-sm font-semibold hover:border-accent transition"
            >
              <Home className="w-4 h-4" /> الرئيسية
            </button>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-4 py-2.5 border border-border text-sm font-semibold hover:border-accent transition"
            >
              إعادة تحميل الصفحة
            </button>
          </div>
        </div>
      </div>
    );
  }
}
