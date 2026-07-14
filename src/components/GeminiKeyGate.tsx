// Global gate: prompts the user once to paste their Google Gemini API key.
// Key is stored in localStorage on their device only, never sent to any server.
// Any AI call in the app fires "lugha:gemini-key-missing" if no key is present,
// which opens this dialog.

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Key, ExternalLink, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import {
  getGeminiKey,
  setGeminiKey,
  clearGeminiKey,
  onGeminiKeyChange,
} from "@/features/story-world/lib/streamChat";

export default function GeminiKeyGate() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [saved, setSaved] = useState<boolean>(!!getGeminiKey());

  useEffect(() => {
    const onMissing = () => setOpen(true);
    window.addEventListener("lugha:gemini-key-missing", onMissing);
    window.addEventListener("lugha:open-gemini-key", onMissing);
    const off = onGeminiKeyChange(() => setSaved(!!getGeminiKey()));
    return () => {
      window.removeEventListener("lugha:gemini-key-missing", onMissing);
      window.removeEventListener("lugha:open-gemini-key", onMissing);
      off();
    };
  }, []);

  const save = () => {
    const trimmed = value.trim();
    if (!trimmed || trimmed.length < 20) {
      toast.error("المفتاح غير صالح — تأكد أنك نسخته بالكامل.");
      return;
    }
    setGeminiKey(trimmed);
    toast.success("تم حفظ المفتاح ✓ كل ميزات الذكاء تعمل الآن.");
    setValue("");
    setOpen(false);
  };

  const remove = () => {
    clearGeminiKey();
    toast.message("تم حذف المفتاح.");
  };

  return (
    <>
      {/* Small floating button — visible only when a key is saved, to let the user rotate/remove it. */}
      {saved && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          title="مفتاح الذكاء الاصطناعي"
          aria-label="إعدادات مفتاح الذكاء الاصطناعي"
          className="fixed bottom-4 left-4 z-40 rounded-full bg-background/80 backdrop-blur border border-border p-2 shadow-sm hover:bg-accent transition-colors"
        >
          <Key className="w-4 h-4 text-muted-foreground" />
        </button>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg" dir="rtl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Key className="w-5 h-5 text-primary" />
              مفتاح الذكاء الاصطناعي
            </DialogTitle>
            <DialogDescription className="text-right leading-relaxed">
              لتشغيل جميع ميزات الذكاء (سِراج، القصص، مساعد الكتابة، الترجمة، النطق…)
              نحتاج مفتاح Google Gemini الخاص بك.
              <br />
              <span className="text-emerald-600 font-medium">مجاني بالكامل</span> من Google —
              يُحفظ في متصفحك فقط ولا يُرفع لأي خادم.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="rounded-lg bg-muted/50 border border-border p-3 text-sm space-y-2">
              <p className="font-medium">خطوات الحصول على المفتاح (دقيقة واحدة):</p>
              <ol className="list-decimal pr-5 space-y-1 text-muted-foreground">
                <li>افتح الرابط أدناه وسجّل دخول بحساب Google.</li>
                <li>اضغط <b>Create API key</b>.</li>
                <li>انسخ المفتاح والصقه هنا.</li>
              </ol>
              <a
                href="https://aistudio.google.com/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:underline text-sm font-medium"
              >
                فتح Google AI Studio
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">الصق المفتاح هنا:</label>
              <Input
                type="password"
                dir="ltr"
                placeholder="AIzaSy…"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && save()}
                autoFocus
              />
              {saved && (
                <p className="text-xs text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  يوجد مفتاح محفوظ حالياً. يمكنك استبداله بلصق مفتاح جديد.
                </p>
              )}
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-2">
            {saved && (
              <Button variant="outline" onClick={remove} className="text-destructive">
                حذف المفتاح
              </Button>
            )}
            <Button variant="ghost" onClick={() => setOpen(false)}>لاحقاً</Button>
            <Button onClick={save} disabled={!value.trim()}>حفظ وتفعيل</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
