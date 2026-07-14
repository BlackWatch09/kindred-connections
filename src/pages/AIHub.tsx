import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles, Mic, MessageCircle, BookOpen, Languages, PenLine,
  Wand2, Calendar, Layers, GraduationCap, Radio, ArrowUpRight, ScanLine,
} from "lucide-react";
import { pickLocalized } from "@/lib/siteContent";
import { useAiPersona } from "@/hooks/useAiPersona";
import { useLanguage } from "@/contexts/LanguageContext";
import { openSiraj } from "@/components/SirajCompanion";
import VoiceCoachDialog from "@/components/ai-tools/VoiceCoachDialog";
import StoryGeneratorDialog from "@/components/ai-tools/StoryGeneratorDialog";
import WritingAssistDialog from "@/components/ai-tools/WritingAssistDialog";
import ContextTranslateDialog from "@/components/ai-tools/ContextTranslateDialog";
import DailyChallengeDialog from "@/components/ai-tools/DailyChallengeDialog";
import FlashcardsDialog from "@/components/ai-tools/FlashcardsDialog";
import VoiceInterviewDialog from "@/components/ai-tools/VoiceInterviewDialog";
import SmartScannerDialog from "@/components/ai-tools/SmartScannerDialog";

type ToolKey = "tutor" | "voice" | "placement" | "story" | "translate" | "writing" | "daily" | "flash" | "interview" | "scanner";

type Tool = {
  key: ToolKey;
  icon: any;
  title: string;
  desc: string;
  cta: string;
  href?: string;
  badge?: string;
};

type Category = {
  id: string;
  eyebrow: { ar: string; en: string };
  title: { ar: string; en: string };
  keys: ToolKey[];
};

const CATEGORIES: Category[] = [
  {
    id: "conversation",
    eyebrow: { ar: "المحادثة والصوت", en: "Conversation & Voice" },
    title: { ar: "تحدّث. استمع. أتقن.", en: "Speak. Listen. Master." },
    keys: ["tutor", "voice", "interview"],
  },
  {
    id: "creation",
    eyebrow: { ar: "القراءة والكتابة", en: "Reading & Writing" },
    title: { ar: "اقرأ بعمق واكتب بثقة.", en: "Read deeply, write with confidence." },
    keys: ["story", "writing", "translate"],
  },
  {
    id: "capture",
    eyebrow: { ar: "الالتقاط الذكي", en: "Smart Capture" },
    title: { ar: "من الورق إلى الشاشة في لحظة.", en: "From paper to screen in a heartbeat." },
    keys: ["scanner"],
  },
  {
    id: "practice",
    eyebrow: { ar: "التقييم والتدريب", en: "Assessment & Practice" },
    title: { ar: "قِس مستواك ودرّبه يوميًا.", en: "Measure and train your level daily." },
    keys: ["placement", "daily", "flash"],
  },
];

const AIHub = () => {
  const { t, language } = useLanguage();
  const persona = useAiPersona();
  const hubName = pickLocalized(persona.hubName, language);
  const hubTagline = pickLocalized(persona.hubTagline, language);
  const tutorName = pickLocalized(persona.tutorName, language);
  const tutorTitle = pickLocalized(persona.tutorTitle, language);
  const tutorGreeting = pickLocalized(persona.tutorGreeting, language);

  const isAr = language === "ar";
  const [openTool, setOpenTool] = useState<null | "voice" | "story" | "translate" | "writing" | "daily" | "flash" | "interview" | "scanner">(null);

  const toolsMap: Record<ToolKey, Tool> = {
    tutor:     { key: "tutor",     icon: MessageCircle, title: `${t("aihub.tools.tutor")} — ${tutorName}`, desc: t("aihub.tools.tutor.desc"), cta: t("aihub.cta.talk"), badge: t("aihub.badge.flagship") },
    voice:     { key: "voice",     icon: Mic,           title: t("aihub.tools.voice"),  desc: t("aihub.tools.voice.desc"),  cta: t("aihub.cta.record") },
    placement: { key: "placement", icon: GraduationCap, title: t("aihub.tools.placement"), desc: t("aihub.tools.placement.desc"), cta: t("aihub.cta.start"), href: "/placement-test" },
    story:     { key: "story",     icon: BookOpen,      title: t("aihub.tools.story"),  desc: t("aihub.tools.story.desc"),  cta: t("aihub.cta.create") },
    translate: { key: "translate", icon: Languages,     title: t("aihub.tools.translate"), desc: t("aihub.tools.translate.desc"), cta: t("aihub.cta.open") },
    writing:   { key: "writing",   icon: PenLine,       title: t("aihub.tools.writing"), desc: t("aihub.tools.writing.desc"), cta: t("aihub.cta.write") },
    daily:     { key: "daily",     icon: Calendar,      title: t("aihub.tools.daily"),   desc: t("aihub.tools.daily.desc"),   cta: t("aihub.cta.today") },
    flash:     { key: "flash",     icon: Layers,        title: t("aihub.tools.flash"),   desc: t("aihub.tools.flash.desc"),   cta: t("aihub.cta.review") },
    interview: { key: "interview", icon: Radio,         title: t("aihub.tools.interview"), desc: t("aihub.tools.interview.desc"), cta: t("aihub.cta.begin") },
    scanner:   { key: "scanner",   icon: ScanLine,      title: isAr ? "الماسح الضوئي الذكي" : "Smart AI Scanner", desc: isAr ? "صوّر أي ورقة واستخرج نصّها بدقّة عالية — قابل للتحرير والنسخ والتحميل." : "Snap any page and extract its text with high accuracy — editable, copyable, downloadable.", cta: isAr ? "ابدأ المسح" : "Start scan", badge: isAr ? "جديد" : "New" },
  };

  const isAr = language === "ar";

  const handlerFor = (key: ToolKey) => {
    if (key === "tutor") return openSiraj;
    if (key === "placement") return undefined;
    return () => setOpenTool(key as any);
  };

  const renderCard = (tool: Tool, index: number, featured = false) => {
    const { key, icon: Icon, title, desc, cta, href, badge } = tool;
    const num = String(index + 1).padStart(2, "0");

    const Body = (
      <div className={`group relative h-full border border-border bg-card hover:border-accent transition-all duration-500 overflow-hidden ${featured ? "p-8 md:p-10" : "p-6"}`}>
        {/* Corner ornament */}
        <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none">
          <div className="absolute top-0 right-0 w-full h-px bg-accent/30" />
          <div className="absolute top-0 right-0 h-full w-px bg-accent/30" />
        </div>
        <div className="absolute bottom-0 left-0 w-16 h-16 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute bottom-0 left-0 w-full h-px bg-accent/30" />
          <div className="absolute bottom-0 left-0 h-full w-px bg-accent/30" />
        </div>

        {/* Glow */}
        <div className="absolute -right-16 -top-16 w-40 h-40 rounded-full bg-accent/5 group-hover:bg-accent/20 blur-2xl transition-all duration-700" />

        {badge && (
          <span className="absolute top-4 left-4 text-[9px] uppercase tracking-[0.28em] bg-accent text-accent-foreground px-2.5 py-1 font-bold z-10">
            {badge}
          </span>
        )}

        <div className="relative flex flex-col h-full">
          <div className="flex items-start justify-between mb-6">
            <div className={`bg-primary text-primary-foreground flex items-center justify-center group-hover:bg-accent group-hover:text-accent-foreground transition-colors duration-500 ${featured ? "w-16 h-16" : "w-12 h-12"}`}>
              <Icon className={featured ? "w-8 h-8" : "w-6 h-6"} />
            </div>
            <span className="font-display italic text-2xl text-muted-foreground/40 group-hover:text-accent/70 transition-colors">
              {num}
            </span>
          </div>

          <h3 className={`font-display font-bold text-primary leading-tight ${featured ? "text-3xl md:text-4xl" : "text-2xl"}`}>
            {title}
          </h3>
          <p className={`mt-3 text-muted-foreground leading-relaxed flex-1 ${featured ? "text-base max-w-lg" : "text-sm"}`}>
            {desc}
          </p>

          <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-sm font-semibold text-accent">
            <span className="tracking-wide">{cta}</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
          </div>
        </div>
      </div>
    );

    if (href) return <Link key={key} to={href} className={featured ? "md:col-span-2" : ""}>{Body}</Link>;
    const handler = handlerFor(key);
    if (handler) {
      return (
        <button key={key} type="button" onClick={handler} className={`text-start w-full ${featured ? "md:col-span-2" : ""}`}>
          {Body}
        </button>
      );
    }
    return <div key={key} className={featured ? "md:col-span-2" : ""}>{Body}</div>;
  };

  let counter = 0;

  return (
    <div className="min-h-screen">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border bg-primary text-primary-foreground">
        <div className="absolute inset-0 opacity-[0.08] pointer-events-none" style={{
          backgroundImage: `radial-gradient(circle at 15% 20%, hsl(var(--accent)) 0px, transparent 45%), radial-gradient(circle at 85% 80%, hsl(var(--accent)) 0px, transparent 45%)`,
        }} />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
        <div className="container mx-auto px-4 py-20 md:py-28 relative">
          <div className="max-w-3xl">
            <p className="text-[11px] uppercase tracking-[0.4em] text-accent font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> {t("aihub.eyebrow")}
            </p>
            <h1 className="font-display text-5xl md:text-7xl font-bold leading-[1.05]">
              <span className="italic">{hubName}</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-primary-foreground/80 leading-relaxed max-w-2xl">
              {hubTagline}
            </p>
            <div className="mt-8 inline-flex items-center gap-3 border border-accent/40 bg-accent/10 px-4 py-3">
              <span className="w-9 h-9 bg-accent text-accent-foreground flex items-center justify-center font-display italic font-bold text-lg">
                {tutorName.charAt(0)}
              </span>
              <div className={isAr ? "text-right" : "text-left"}>
                <p className="text-sm font-semibold text-accent">{tutorName} · {tutorTitle}</p>
                <p className="text-xs text-primary-foreground/70">{tutorGreeting}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION HEADER */}
      <section className="container mx-auto px-4 pt-16 md:pt-20 pb-6">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <p className="eyebrow">— {t("aihub.section.eyebrow")} —</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-primary mt-2">{t("aihub.section.title")}</h2>
          </div>
          <p className="text-sm text-muted-foreground max-w-sm">{t("aihub.section.hint")}</p>
        </div>
      </section>

      {/* CATEGORIZED TOOLS */}
      <section className="container mx-auto px-4 pb-16 md:pb-20 space-y-16">
        {CATEGORIES.map((cat, catIdx) => {
          const catTools = cat.keys.map((k) => toolsMap[k]);
          const featuredTool = catTools.find((t) => t.badge);
          const restTools = catTools.filter((t) => t !== featuredTool);

          return (
            <div key={cat.id} className="relative">
              {/* Category header */}
              <div className="flex items-center gap-6 mb-8">
                <span className="font-display italic text-5xl md:text-6xl text-accent/30 leading-none">
                  {String(catIdx + 1).padStart(2, "0")}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] uppercase tracking-[0.36em] text-accent font-semibold">
                    {isAr ? cat.eyebrow.ar : cat.eyebrow.en}
                  </p>
                  <h3 className="font-display text-2xl md:text-3xl font-bold text-primary mt-1">
                    {isAr ? cat.title.ar : cat.title.en}
                  </h3>
                </div>
                <div className="hidden md:block flex-1 h-px bg-gradient-to-r from-border via-border to-transparent" />
              </div>

              {/* Tools grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {featuredTool && renderCard(featuredTool, counter++, true)}
                {restTools.map((tool) => renderCard(tool, counter++))}
              </div>
            </div>
          );
        })}

        <div className="mt-16 border border-dashed border-border bg-secondary/30 p-6 md:p-8 flex items-start gap-4">
          <Wand2 className="w-6 h-6 text-accent shrink-0 mt-1" />
          <div>
            <p className="eyebrow">— {t("aihub.note.eyebrow")} —</p>
            <p className="mt-2 text-sm text-muted-foreground max-w-2xl">{t("aihub.note.body")}</p>
          </div>
        </div>
      </section>

      <VoiceCoachDialog open={openTool === "voice"} onClose={() => setOpenTool(null)} />
      <StoryGeneratorDialog open={openTool === "story"} onClose={() => setOpenTool(null)} />
      <ContextTranslateDialog open={openTool === "translate"} onClose={() => setOpenTool(null)} />
      <WritingAssistDialog open={openTool === "writing"} onClose={() => setOpenTool(null)} />
      <DailyChallengeDialog open={openTool === "daily"} onClose={() => setOpenTool(null)} />
      <FlashcardsDialog open={openTool === "flash"} onClose={() => setOpenTool(null)} />
      <VoiceInterviewDialog open={openTool === "interview"} onClose={() => setOpenTool(null)} />
    </div>
  );
};

export default AIHub;
