import { useRef, useState } from "react";
import { Mic, Square, Loader2 } from "lucide-react";
import { transcribeAudio } from "../lib/streamChat";
import { toast } from "sonner";

interface Props {
  onTranscribed: (text: string) => void;
  disabled?: boolean;
}

const VoiceRecorder = ({ onTranscribed, disabled }: Props) => {
  const [recording, setRecording] = useState(false);
  const [processing, setProcessing] = useState(false);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mime = MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : MediaRecorder.isTypeSupported("audio/mp4")
        ? "audio/mp4"
        : "";
      const rec = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
      chunksRef.current = [];
      rec.ondataavailable = (e) => e.data.size && chunksRef.current.push(e.data);
      rec.onstop = async () => {
        streamRef.current?.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: rec.mimeType || "audio/webm" });
        if (blob.size < 1500) {
          toast.error("التسجيل قصير جداً، حاول مرة أخرى");
          setProcessing(false);
          return;
        }
        setProcessing(true);
        try {
          const base64 = await blobToBase64(blob);
          const { text } = await transcribeAudio(base64, blob.type);
          if (text) onTranscribed(text);
          else toast.error("لم نتمكن من فهم الكلام");
        } catch (err) {
          console.error(err);
          toast.error("فشل تحويل الصوت");
        } finally {
          setProcessing(false);
        }
      };
      rec.start();
      recorderRef.current = rec;
      setRecording(true);
    } catch (err) {
      console.error(err);
      toast.error("لا يمكن الوصول للميكروفون");
    }
  };

  const stop = () => {
    recorderRef.current?.stop();
    setRecording(false);
  };

  const busy = processing;

  return (
    <button
      type="button"
      disabled={disabled || busy}
      onClick={recording ? stop : start}
      className={`flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center transition-all ${
        recording
          ? "bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/40"
          : busy
          ? "bg-secondary text-muted-foreground"
          : "bg-accent text-accent-foreground hover:opacity-90"
      } disabled:opacity-50`}
      aria-label={recording ? "إيقاف التسجيل" : "بدء التسجيل"}
    >
      {busy ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : recording ? (
        <Square className="w-4 h-4 fill-current" />
      ) : (
        <Mic className="w-5 h-5" />
      )}
    </button>
  );
};

const blobToBase64 = (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1] ?? "");
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

export default VoiceRecorder;
