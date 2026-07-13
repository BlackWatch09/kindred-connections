import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles, Mic, MessageCircle, BookOpen, Languages, PenLine,
  Wand2, Calendar, Layers, Compass, GraduationCap, Radio,
} from "lucide-react";
import { pickLocalized } from "@/lib/siteContent";
import { useAiPersona } from "@/hooks/useAiPersona";
import { useLanguage } from "@/contexts/LanguageContext";
import { openSiraj } from "@/components/SirajCompanion";
import VoiceCoachDialog from "@/components/ai-tools/VoiceCoachDialog";
import StoryGeneratorDialog from "@/components/ai-tools/StoryGeneratorDialog";
import WritingAssistDialog from "@/components/ai-tools/WritingAssistDialog";
import ContextTranslateDialog from "@/components/ai-tools/ContextTranslateDialog";

type Tool = {
  key: string;
  icon: any;
  title: string;
  desc: string;
  cta: string;
  href?: string;
  badge?: string;
};

const AIHub = () => {
  const { t, language } = useLanguage();
  const persona = useAiPersona();
  const hubName = pickLocalized(persona.hubName, language);
  const hubTagline = pickLocalized(persona.hubTagline, language);
  const tutorName = pickLocalized(persona.tutorName, language);
  const tutorTitle = pickLocalized(persona.tutorTitle, language);
  const tutorGreeting = pickLocalized(persona.tutorGreeting, language);

  const [openTool, setOpenTool] = useState<null | "voice" | "story" | "translate" | "writing">(null);

  const tools: Tool[] = [
    { key: "tutor",     icon: MessageCircle, title: `${t("aihub.tools.tutor")} — ${tutorName}`, desc: t("aihub.tools.tutor.desc"), cta: t("aihub.cta.talk"), badge: t("aihub.badge.flagship") },
    { key: "voice",     icon: Mic,           title: t("aihub.tools.voice"),  desc: t("aihub.tools.voice.desc"),  cta: t("aihub.cta.record") },
    { key: "placement", icon: GraduationCap, title: t("aihub.tools.placement"), desc: t("aihub.tools.placement.desc"), cta: t("aihub.cta.start"), href: "/placement-test" },
    { key: "story",     icon: BookOpen,      title: t("aihub.tools.story"),  desc: t("aihub.tools.story.desc"),  cta: t("aihub.cta.create") },
    { key: "translate", icon: Languages,     title: t("aihub.tools.translate"), desc: t("aihub.tools.translate.desc"), cta: t("aihub.cta.open") },
    { key: "writing",   icon: PenLine,       title: t("aihub.tools.writing"), desc: t("aihub.tools.writing.desc"), cta: t("aihub.cta.write") },
    { key: "daily",     icon: Calendar,      title: t("aihub.tools.daily"),   desc: t("aihub.tools.daily.desc"),   cta: t("aihub.cta.today") },
    { key: "flash",     icon: Layers,        title: t("aihub.tools.flash"),   desc: t("aihub.tools.flash.desc"),   cta: t("aihub.cta.review") },
    { key: "interview", icon: Radio,         title: t("aihub.tools.interview"), desc: t("aihub.tools.interview.desc"), cta: t("aihub.cta.begin") },
  ];

  const isAr = language === "ar";

  return (
    <div className="min-h-screen">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border bg-primary text-primary-foreground">
        <div className="absolute inset-0 opacity-[0.08] pointer-events-none" style={{
          backgroundImage: `radial-gradient(circle at 15% 20%, hsl(var(--accent)) 0px, transparent 45%), radial-gradient(circle at 85% 80%, hsl(var(--accent)) 0px, transparent 45%)`,
        }} />
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

      {/* TOOL CARDS */}
      <section className="container mx-auto px-4 py-16 md:py-20">
        <div className="mb-10 flex items-end justify-between flex-wrap gap-4">
          <div>
            <p className="eyebrow">— {t("aihub.section.eyebrow")} —</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-primary mt-2">{t("aihub.section.title")}</h2>
          </div>
          <p className="text-sm text-muted-foreground max-w-sm">{t("aihub.section.hint")}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {tools.map(({ key, icon: Icon, title, desc, cta, href, badge }) => {
            const CardBody = (
              <div className="group relative h-full border border-border bg-card hover:border-accent transition-all p-6 flex flex-col overflow-hidden">
                <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-accent/5 group-hover:bg-accent/15 transition-colors" />
                {badge && (
                  <span className="absolute top-4 right-4 text-[9px] uppercase tracking-[0.24em] bg-accent text-accent-foreground px-2 py-1 font-bold">{badge}</span>
                )}
                <div className="w-12 h-12 bg-primary text-primary-foreground flex items-center justify-center mb-5 group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-display text-2xl font-bold text-primary leading-tight">{title}</h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed flex-1">{desc}</p>
                <div className="mt-5 pt-4 border-t border-border flex items-center justify-between text-sm font-semibold text-accent">
                  <span>{cta}</span>
                  <span className="group-hover:translate-x-1 transition-transform">{isAr ? "←" : "→"}</span>
                </div>
              </div>
            );
            if (href) return <Link key={key} to={href}>{CardBody}</Link>;
            if (key === "tutor") {
              return (
                <button key={key} type="button" onClick={openSiraj} className="text-start">
                  {CardBody}
                </button>
              );
            }
            return <div key={key} className="cursor-pointer">{CardBody}</div>;
          })}
        </div>

        <div className="mt-16 border border-dashed border-border bg-secondary/30 p-6 md:p-8 flex items-start gap-4">
          <Wand2 className="w-6 h-6 text-accent shrink-0 mt-1" />
          <div>
            <p className="eyebrow">— {t("aihub.note.eyebrow")} —</p>
            <p className="mt-2 text-sm text-muted-foreground max-w-2xl">{t("aihub.note.body")}</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AIHub;
