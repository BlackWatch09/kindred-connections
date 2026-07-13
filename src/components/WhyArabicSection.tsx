import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  Languages,
  Pen,
  Volume2,
  BookOpen,
  Globe,
  Sparkles,
  ArrowRight,
} from "lucide-react";

const rootData: Record<
  string,
  { root: string; words: { ar: string; en: string; tr: string }[] }
> = {
  ktb: {
    root: "ك ت ب",
    words: [
      { ar: "كِتَاب", en: "Book", tr: "Kitap" },
      { ar: "كَاتِب", en: "Writer", tr: "Yazar" },
      { ar: "مَكْتَبَة", en: "Library", tr: "Kütüphane" },
      { ar: "مَكْتُوب", en: "Written / Letter", tr: "Yazılmış / Mektup" },
    ],
  },
  drs: {
    root: "د ر س",
    words: [
      { ar: "دَرْس", en: "Lesson", tr: "Ders" },
      { ar: "مُدَرِّس", en: "Teacher", tr: "Öğretmen" },
      { ar: "مَدْرَسَة", en: "School", tr: "Okul" },
      { ar: "دِرَاسَة", en: "Study", tr: "Çalışma" },
    ],
  },
  slm: {
    root: "س ل م",
    words: [
      { ar: "سَلَام", en: "Peace", tr: "Barış" },
      { ar: "إِسْلَام", en: "Islam", tr: "İslam" },
      { ar: "مُسْلِم", en: "Muslim", tr: "Müslüman" },
      { ar: "تَسْلِيم", en: "Surrender / Delivery", tr: "Teslim" },
    ],
  },
};

const WhyArabicSection = () => {
  const { t, language } = useLanguage();
  const [activeRoot, setActiveRoot] = useState<string | null>(null);
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());
  const [headerVisible, setHeaderVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const headerRef = useRef<HTMLDivElement>(null);

  const features = [
    { icon: Globe, key: "arabic.feat.global" },
    { icon: Pen, key: "arabic.feat.calligraphy" },
    { icon: Languages, key: "arabic.feat.roots" },
    { icon: Volume2, key: "arabic.feat.sounds" },
    { icon: BookOpen, key: "arabic.feat.poetry" },
    { icon: Sparkles, key: "arabic.feat.precision" },
  ];

  const handleObserve = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.target === headerRef.current && entry.isIntersecting) {
          setHeaderVisible(true);
        }
        cardRefs.current.forEach((ref, i) => {
          if (entry.target === ref && entry.isIntersecting) {
            setVisibleCards((prev) => new Set(prev).add(i));
          }
        });
      });
    },
    []
  );

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) {
      setHeaderVisible(true);
      setVisibleCards(new Set(features.map((_, i) => i)));
      return;
    }

    const observer = new IntersectionObserver(handleObserve, {
      threshold: 0.15,
    });

    if (headerRef.current) observer.observe(headerRef.current);
    cardRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [handleObserve, features.length]);

  const wordLang = language === "ar" ? "ar" : language === "tr" ? "tr" : "en";

  return (
    <section
      ref={sectionRef}
      className="relative py-20 px-4 overflow-hidden"
    >
      {/* Background calligraphy watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none" aria-hidden="true">
        <span
          className="text-[12rem] md:text-[18rem] font-arabic text-foreground/[0.03] leading-none"
          style={{ fontFamily: "var(--font-arabic)" }}
        >
          العربية
        </span>
      </div>

      {/* Subtle geometric dots overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        aria-hidden="true"
        style={{
          backgroundImage:
            "radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="container mx-auto max-w-5xl relative z-10">
        {/* Header */}
        <div
          ref={headerRef}
          className="text-center mb-14 transition-all duration-700"
          style={{
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible
              ? "translateY(0)"
              : "translateY(24px)",
          }}
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
            {t("arabic.title")}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
            {t("arabic.intro")}
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-16">
          {features.map((f, i) => (
            <div
              key={f.key}
              ref={(el) => { cardRefs.current[i] = el; }}
              className="group p-5 md:p-6 rounded-2xl bg-card border border-border 
                         hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center"
              style={{
                opacity: visibleCards.has(i) ? 1 : 0,
                transform: visibleCards.has(i)
                  ? "translateY(0)"
                  : "translateY(20px)",
                transition: `opacity 0.5s ease ${i * 0.1}s, transform 0.5s ease ${i * 0.1}s, box-shadow 0.3s`,
              }}
            >
              <div className="inline-flex p-3 rounded-xl gradient-gold mb-3 group-hover:shadow-md transition-shadow">
                <f.icon className="w-5 h-5 text-accent-foreground" />
              </div>
              <h3 className="font-display text-sm md:text-base font-semibold text-foreground mb-1">
                {t(`${f.key}.title`)}
              </h3>
              <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                {t(`${f.key}.desc`)}
              </p>
            </div>
          ))}
        </div>

        {/* Root Magic interactive widget */}
        <div className="bg-card border border-border rounded-2xl p-6 md:p-8 mb-12">
          <h3 className="font-display text-xl md:text-2xl font-bold text-foreground mb-2 text-center">
            {t("arabic.rootMagic.title")}
          </h3>
          <p className="text-sm text-muted-foreground text-center mb-6">
            {t("arabic.rootMagic.desc")}
          </p>

          {/* Root selector buttons */}
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {Object.entries(rootData).map(([key, data]) => (
              <button
                key={key}
                onClick={() =>
                  setActiveRoot(activeRoot === key ? null : key)
                }
                className={`px-5 py-2.5 rounded-xl font-arabic text-lg font-semibold transition-all duration-300
                  ${
                    activeRoot === key
                      ? "gradient-gold text-accent-foreground shadow-lg scale-105"
                      : "bg-secondary text-foreground hover:bg-secondary/80 hover:shadow-md"
                  }`}
                style={{ fontFamily: "var(--font-arabic)" }}
                dir="rtl"
              >
                {data.root}
              </button>
            ))}
          </div>

          {/* Derived words */}
          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-3 transition-all duration-500"
            style={{
              maxHeight: activeRoot ? "300px" : "0px",
              opacity: activeRoot ? 1 : 0,
              overflow: "hidden",
            }}
          >
            {activeRoot &&
              rootData[activeRoot].words.map((word, i) => (
                <div
                  key={i}
                  className="bg-secondary/70 rounded-xl p-4 text-center hover:shadow-md transition-all duration-300"
                  style={{
                    animation: `fade-in-up 0.4s ease-out ${i * 0.08}s both`,
                  }}
                >
                  <p
                    className="text-xl md:text-2xl font-semibold text-foreground mb-1"
                    style={{ fontFamily: "var(--font-arabic)" }}
                    dir="rtl"
                  >
                    {word.ar}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {word[wordLang] || word.en}
                  </p>
                </div>
              ))}
          </div>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/courses"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl gradient-gold text-accent-foreground font-semibold text-lg hover:opacity-90 transition-opacity shadow-lg"
          >
            {t("hero.cta")} <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            to="/learn"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl border-2 border-foreground text-foreground font-semibold text-lg hover:bg-foreground hover:text-background transition-colors"
          >
            {t("hero.placement")}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default WhyArabicSection;
