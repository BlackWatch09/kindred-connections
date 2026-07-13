import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Send, MessageSquare, Mail, CheckCircle } from "lucide-react";

const Support = () => {
  const { t } = useLanguage();
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3000);
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
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">{t("support.name")}</label>
                <input
                  type="text"
                  required
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
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full p-3 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-lg gradient-gold text-accent-foreground font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" /> {t("support.send")}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Support;
