import { useRef, useState } from "react";
import {
  ScanLine, Upload, Camera, Copy, Check, Download, RotateCcw, FileText, Sparkles, Loader2,
  Printer, Usb, ArrowLeft, Wifi, MonitorSmartphone, AlertTriangle, Info,
} from "lucide-react";
import ToolShell from "./ToolShell";
import { scanImageText, type ScanResult } from "@/lib/aiFn";
import { toast } from "sonner";
import { addPoints } from "@/lib/points";

interface Props {
  open: boolean;
  onClose: () => void;
}

type Stage = "idle" | "device" | "preview" | "scanning" | "done" | "error";

const fileToBase64 = (file: File): Promise<{ base64: string; mime: string; dataUrl: string }> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const base64 = dataUrl.split(",")[1] || "";
      resolve({ base64, mime: file.type || "image/jpeg", dataUrl });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export default function SmartScannerDialog({ open, onClose }: Props) {
  const [stage, setStage] = useState<Stage>("idle");
  const [imgUrl, setImgUrl] = useState<string>("");
  const [result, setResult] = useState<ScanResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [editedText, setEditedText] = useState<string>("");
  const [detectedDevice, setDetectedDevice] = useState<string>("");
  const [probing, setProbing] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const camRef = useRef<HTMLInputElement>(null);
  const scanFileRef = useRef<HTMLInputElement>(null);

  const handleReset = () => {
    setStage("idle");
    setImgUrl("");
    setResult(null);
    setErrorMsg("");
    setEditedText("");
    setCopied(false);
  };

  // WebUSB probe for still-image class devices (USB class 6 = Still Imaging / PTP)
  const probeUsbScanner = async () => {
    const nav: any = navigator;
    if (!nav?.usb?.requestDevice) {
      toast.error("متصفحك لا يدعم WebUSB — جرّب Chrome أو Edge على الحاسوب");
      return;
    }
    try {
      setProbing(true);
      const device: any = await nav.usb.requestDevice({
        // Class 6 = Image (scanners/cameras). Include class 7 (Printer, for MFPs) as a fallback.
        filters: [{ classCode: 6 }, { classCode: 7 }, {}],
      });
      const name = [device?.manufacturerName, device?.productName].filter(Boolean).join(" ") || "جهاز غير مُعرَّف";
      setDetectedDevice(name);
      toast.success(`تم التعرّف على: ${name}`);
    } catch (err: any) {
      if (err?.name !== "NotFoundError") {
        toast.error("تعذّر الوصول إلى الجهاز");
      }
    } finally {
      setProbing(false);
    }
  };

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("الرجاء رفع صورة صالحة");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      toast.error("حجم الصورة كبير جداً (الحد الأقصى 8MB)");
      return;
    }

    try {
      const { base64, mime, dataUrl } = await fileToBase64(file);
      setImgUrl(dataUrl);
      setStage("scanning");
      setErrorMsg("");

      const r = await scanImageText(base64, mime);
      setResult(r);
      setEditedText(r.text);
      setStage("done");
      if (r.text.trim().length > 0) {
        addPoints(null, { tool: "smart-scanner", label: "الماسح الضوئي الذكي", points: 15 });
        toast.success("تم استخراج النص بنجاح +15 نقطة");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err?.message || "حدث خطأ أثناء المسح");
      setStage("error");
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(editedText);
      setCopied(true);
      toast.success("نُسخ النص");
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("تعذّر النسخ");
    }
  };

  const handleDownload = () => {
    const blob = new Blob([editedText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${result?.title || "scanned-text"}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ToolShell
      open={open}
      onClose={() => { handleReset(); onClose(); }}
      title="الماسح الضوئي الذكي"
      subtitle="صوّر أو ارفع ورقة، ودع الذكاء الاصطناعي يستخرج النص بدقّة عالية"
      icon={<ScanLine className="w-5 h-5" />}
      size="xl"
    >
      {/* IDLE — upload options */}
      {stage === "idle" && (
        <div className="space-y-6">
          <div className="grid sm:grid-cols-3 gap-4">
            <button
              onClick={() => fileRef.current?.click()}
              className="group relative border-2 border-dashed border-border hover:border-accent bg-card p-6 text-center transition-all overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent/0 via-accent/5 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity" />
              <Upload className="w-9 h-9 mx-auto mb-3 text-accent" />
              <p className="font-display text-base font-bold text-primary">ارفع صورة</p>
              <p className="text-[11px] text-muted-foreground mt-1">JPG / PNG / WEBP · حتى 8MB</p>
            </button>

            <button
              onClick={() => camRef.current?.click()}
              className="group relative border-2 border-dashed border-border hover:border-accent bg-card p-6 text-center transition-all overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent/0 via-accent/5 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity" />
              <Camera className="w-9 h-9 mx-auto mb-3 text-accent" />
              <p className="font-display text-base font-bold text-primary">صوّر بالكاميرا</p>
              <p className="text-[11px] text-muted-foreground mt-1">يعمل على الجوال والحاسوب</p>
            </button>

            <button
              onClick={() => setStage("device")}
              className="group relative border-2 border-dashed border-accent/50 hover:border-accent bg-gradient-to-br from-accent/5 to-transparent p-6 text-center transition-all overflow-hidden"
            >
              <span className="absolute top-2 left-2 text-[9px] uppercase tracking-[0.24em] bg-accent text-accent-foreground px-1.5 py-0.5 font-bold">جديد</span>
              <div className="absolute inset-0 bg-gradient-to-br from-accent/0 via-accent/10 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity" />
              <Printer className="w-9 h-9 mx-auto mb-3 text-accent" />
              <p className="font-display text-base font-bold text-primary">جهاز Scanner</p>
              <p className="text-[11px] text-muted-foreground mt-1">USB أو شبكة · احترافي</p>
            </button>
          </div>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          <input
            ref={camRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          <input
            ref={scanFileRef}
            type="file"
            accept="image/*,application/pdf"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />

          <div className="border border-border bg-secondary/30 p-5 space-y-2">
            <p className="eyebrow flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-accent" /> — نصائح لأفضل نتيجة —
            </p>
            <ul className="text-sm text-muted-foreground space-y-1.5 list-disc pr-5">
              <li>ثبّت الكاميرا وتجنّب الاهتزاز.</li>
              <li>وفّر إضاءة جيّدة وامسح الظلال على الورقة.</li>
              <li>حاذِ الورقة داخل الإطار كاملة قدر الإمكان.</li>
              <li>يدعم الماسح النصوص العربية والإنجليزية معاً.</li>
            </ul>
          </div>
        </div>
      )}

      {/* SCANNING — laser effect */}
      {stage === "scanning" && (
        <div className="space-y-5">
          <div className="relative mx-auto max-w-xl border-2 border-accent/50 bg-black overflow-hidden">
            {imgUrl && (
              <img src={imgUrl} alt="scanning" className="w-full h-auto block max-h-[55vh] object-contain" />
            )}
            {/* Grid overlay */}
            <div
              className="absolute inset-0 pointer-events-none opacity-30 mix-blend-overlay"
              style={{
                backgroundImage:
                  "linear-gradient(to right, hsl(var(--accent)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--accent)) 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />
            {/* Laser bar */}
            <div className="absolute inset-x-0 h-1 bg-accent shadow-[0_0_20px_6px_hsl(var(--accent))] scanner-laser" />
            {/* Corner brackets */}
            <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-accent" />
            <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-accent" />
            <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-accent" />
            <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-accent" />
          </div>
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 text-accent font-semibold">
              <Loader2 className="w-4 h-4 animate-spin" />
              جارٍ استخراج النص بدقّة عالية…
            </div>
            <p className="text-xs text-muted-foreground">قد يستغرق بضع ثوانٍ حسب حجم النص</p>
          </div>

          <style>{`
            @keyframes scanner-laser {
              0%   { top: 0%; opacity: 0.9; }
              50%  { top: calc(100% - 4px); opacity: 1; }
              100% { top: 0%; opacity: 0.9; }
            }
            .scanner-laser { animation: scanner-laser 2.4s ease-in-out infinite; }
          `}</style>
        </div>
      )}

      {/* DONE — result */}
      {stage === "done" && result && (
        <div className="space-y-5">
          {/* Meta strip */}
          <div className="flex flex-wrap items-center justify-between gap-3 border border-border bg-secondary/30 p-4">
            <div className="min-w-0">
              {result.title && (
                <h4 className="font-display text-lg font-bold text-primary truncate">{result.title}</h4>
              )}
              <p className="text-xs text-muted-foreground mt-0.5">
                {result.word_count} كلمة · اللغة: {result.language === "en" ? "الإنجليزية" : result.language === "mixed" ? "مختلطة" : "العربية"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm border border-border hover:border-accent hover:text-accent transition-colors"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? "تم النسخ" : "نسخ"}
              </button>
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm border border-border hover:border-accent hover:text-accent transition-colors"
              >
                <Download className="w-4 h-4" /> تحميل .txt
              </button>
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <RotateCcw className="w-4 h-4" /> مسح جديد
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-[1fr,1.4fr] gap-5">
            {/* Preview */}
            {imgUrl && (
              <div className="border border-border bg-secondary/20 p-2 max-h-[60vh] overflow-auto">
                <img src={imgUrl} alt="scanned" className="w-full h-auto block" />
              </div>
            )}
            {/* Editable text */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="eyebrow flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-accent" /> — النص المستخرج —
                </p>
              </div>
              <textarea
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                dir={result.language === "en" ? "ltr" : "rtl"}
                className={`w-full min-h-[45vh] p-4 bg-card border border-border focus:border-accent focus:outline-none text-base leading-loose ${result.language === "en" ? "font-body" : "font-arabic"}`}
                spellCheck={false}
              />
              {result.summary && (
                <div className="border-r-2 border-accent bg-accent/5 p-3">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-accent font-bold mb-1">ملخّص</p>
                  <p className="text-sm text-foreground leading-relaxed">{result.summary}</p>
                </div>
              )}
              {result.keywords && result.keywords.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {result.keywords.map((k, i) => (
                    <span key={i} className="text-xs px-2.5 py-1 bg-primary/5 border border-border text-primary">
                      {k}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ERROR */}
      {stage === "error" && (
        <div className="text-center py-10 space-y-4">
          <p className="font-display text-xl text-destructive">تعذّر استخراج النص</p>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">{errorMsg}</p>
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <RotateCcw className="w-4 h-4" /> حاول مرة أخرى
          </button>
        </div>
      )}
    </ToolShell>
  );
}
