import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { Search, Plus, Minus, ArrowRight, MessageSquare, Users, ClipboardCheck } from "lucide-react";

const faqKeys = [
  "placement", "scoring", "unlock", "quizzes", "language",
  "teachers", "dashboard", "login", "translation", "support",
  "mobile", "privacy",
];

const FAQItem = ({ questionKey, index }: { questionKey: string; index: number }) => {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(open ? contentRef.current.scrollHeight : 0);
    }
  }, [open]);

  return (
    <div
      className="border border-border rounded-xl overflow-hidden transition-shadow hover:shadow-md bg-card"
      style={{ animation: `fade-in-up 0.4s ease-out ${index * 0.05}s both` }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl"
        aria-expanded={open}
      >
        <span className="font-display text-sm md:text-base font-semibold text-foreground">
          {t(`faq.${questionKey}.q`)}
        </span>
        <span className="shrink-0 w-7 h-7 rounded-full gradient-gold flex items-center justify-center text-accent-foreground transition-transform duration-300">
          {open ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </span>
      </button>
      <div
        style={{ height, transition: "height 0.3s ease, opacity 0.3s ease", opacity: open ? 1 : 0 }}
        className="overflow-hidden"
      >
        <div ref={contentRef} className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed">
          {t(`faq.${questionKey}.a`)}
        </div>
      </div>
    </div>
  );
};

const FAQSection = () => {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const filtered = faqKeys.filter((key) => {
    if (!search.trim()) return true;
    const q = t(`faq.${key}.q`).toLowerCase();
    const a = t(`faq.${key}.a`).toLowerCase();
    return q.includes(search.toLowerCase()) || a.includes(search.toLowerCase());
  });

  return (
    <section ref={sectionRef} className="py-20 px-4 relative overflow-hidden">
      {/* Subtle watermark */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center" aria-hidden="true">
        <span className="text-[12rem] md:text-[18rem] font-bold text-foreground/[0.02] select-none leading-none" style={{ fontFamily: "var(--font-arabic)" }}>
          أسئلة
        </span>
      </div>

      <div className={`container mx-auto max-w-3xl relative z-10 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-center text-foreground mb-2">
          {t("faq.title")}
        </h2>
        <p className="text-center text-muted-foreground mb-8">{t("faq.subtitle")}</p>

        {/* Search */}
        <div className="relative max-w-md mx-auto mb-10">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("faq.search")}
            className="w-full ps-10 pe-4 py-3 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent placeholder:text-muted-foreground"
          />
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {filtered.length > 0 ? (
            filtered.map((key, i) => <FAQItem key={key} questionKey={key} index={i} />)
          ) : (
            <p className="text-center text-muted-foreground py-8">{t("faq.noResults")}</p>
          )}
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
          <Link
            to="/support"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl gradient-gold text-accent-foreground font-semibold hover:opacity-90 transition-opacity shadow-md"
          >
            <MessageSquare className="w-4 h-4" /> {t("faq.cta.support")}
          </Link>
          <Link
            to="/teachers"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-foreground text-foreground font-semibold hover:bg-foreground hover:text-background transition-colors"
          >
            <Users className="w-4 h-4" /> {t("faq.cta.teachers")}
          </Link>
          <Link
            to="/learn"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-accent text-accent font-semibold hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <ClipboardCheck className="w-4 h-4" /> {t("faq.cta.placement")}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
