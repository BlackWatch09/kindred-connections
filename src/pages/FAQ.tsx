import FAQSection from "@/components/FAQSection";
import { useLanguage } from "@/contexts/LanguageContext";

const FAQ = () => {
  const { t } = useLanguage();
  return (
    <div className="relative z-10">
      <section className="border-b border-border">
        <div className="container mx-auto px-4 py-12 md:py-16 text-center">
          <span className="eyebrow">{t("faq.eyebrow")}</span>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-primary mt-3 tracking-tight">
            {t("faq.title")}
          </h1>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">{t("faq.subtitle")}</p>
        </div>
      </section>
      <FAQSection />
    </div>
  );
};

export default FAQ;
