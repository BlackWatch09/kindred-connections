import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Send, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";

const ticketSchema = z.object({
  name: z.string().trim().min(1, "الاسم مطلوب").max(100),
  email: z.string().trim().email("بريد إلكتروني غير صالح").max(255),
  message: z.string().trim().min(5, "الرسالة قصيرة جداً").max(2000),
});

const Support = () => {
  const { t } = useLanguage();
  const { user, loading } = useAuth();
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: user?.email ?? "",
    message: "",
  });

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    const parsed = ticketSchema.safeParse(form);
    if (!parsed.success) {
      const first = Object.values(parsed.error.flatten().fieldErrors)[0]?.[0];
      toast.error(first ?? "بيانات غير صالحة");
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from("support_tickets").insert({
        user_id: user.id,
        name: parsed.data.name,
        email: parsed.data.email,
        message: parsed.data.message,
      });
      if (error) throw error;
      setSent(true);
      setForm({ name: "", email: user.email ?? "", message: "" });
      toast.success(t("support.sent") || "تم إرسال رسالتك");
      setTimeout(() => setSent(false), 4000);
    } catch (err) {
      console.error("[Support] insert failed", err);
      toast.error("تعذّر إرسال الرسالة. حاول مرة أخرى.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative z-10 py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        <h1 className="font-display text-4xl font-bold text-center text-foreground mb-2">
          {t("support.title")}
        </h1>
        <p className="text-center text-muted-foreground mb-12">{t("support.subtitle")}</p>

        <div className="bg-card border border-border rounded-2xl p-8" style={{ animation: "fade-in-up 0.5s ease-out" }}>
          {sent ? (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
              <p className="text-lg font-semibold text-foreground">{t("support.sent")}</p>
              <p className="text-sm text-muted-foreground mt-2">سيتواصل فريق الدعم معك قريباً.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">{t("support.name")}</label>
                <input
                  type="text"
                  required
                  maxLength={100}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full p-3 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">{t("support.email")}</label>
                <input
                  type="email"
                  required
                  maxLength={255}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full p-3 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">{t("support.message")}</label>
                <textarea
                  required
                  rows={5}
                  maxLength={2000}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full p-3 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-lg gradient-gold text-accent-foreground font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}{" "}
                {t("support.send")}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Support;
