// Site content store: localStorage-backed, JSON export/import for full control.
import type { Language } from "@/contexts/LanguageContext";

export type Localized = { en: string; ar: string; tr: string; es?: string };

export const pickLocalized = (
  value: Localized | string | undefined | null,
  lang: Language,
  fallback = ""
): string => {
  if (!value) return fallback;
  if (typeof value === "string") return value || fallback;
  return value[lang] || value.en || value.ar || value.tr || fallback;
};

export type Teacher = { id: string; name: string; title: string; city: string; bio: string; avatar?: string };
export type Course = { id: string; slug: string; title: string; level: string; lessons: number; description: string; published: boolean };
export type FAQItem = { id: string; question: string; answer: string; category?: string };

export type AiPersona = {
  hubName: Localized;
  hubTagline: Localized;
  tutorName: Localized;
  tutorTitle: Localized;
  tutorAccent: Localized;
  tutorGreeting: Localized;
};

export type SiteSettings = {
  siteName: string;
  tagline: string;
  heroTitle: string;
  heroDescription: string;
  primaryColor: string;
  accentColor: string;
  contactEmail: string;
  socialTwitter: string;
  socialInstagram: string;
  maintenanceMode: boolean;
  announcementBar: string;
  aiPersona: AiPersona;
};
export type Announcement = { id: string; message: string; type: "info" | "warning" | "success"; createdAt: string };

type Store = {
  teachers: Teacher[];
  courses: Course[];
  faqs: FAQItem[];
  settings: SiteSettings;
  announcements: Announcement[];
};

const KEY = "lugha_admin_content_v1";

const DEFAULT_PERSONA: AiPersona = {
  hubName: {
    ar: "مجلس لُغة",
    en: "Lugha Council",
    tr: "Lugha Meclisi",
  },
  hubTagline: {
    ar: "مركز لُغة الذكي — كل أدوات الذكاء الاصطناعي في مكان واحد.",
    en: "Lugha's intelligent center — every AI companion, in one place.",
    tr: "Lugha'nın akıllı merkezi — tüm yapay zeka araçları tek yerde.",
  },
  tutorName: {
    ar: "سِراج",
    en: "Siraj",
    tr: "Siraj",
  },
  tutorTitle: {
    ar: "رفيقك الذكي في تعلّم العربية",
    en: "Your smart companion for learning Arabic",
    tr: "Arapça öğrenmede akıllı yol arkadaşın",
  },
  tutorAccent: {
    ar: "أردني",
    en: "Jordanian",
    tr: "Ürdün lehçesi",
  },
  tutorGreeting: {
    ar: "أهلاً وسهلاً! أنا سِراج، جاهز نحكي عربي سوا.",
    en: "Hello! I'm Siraj — ready to speak Arabic together.",
    tr: "Merhaba! Ben Siraj — birlikte Arapça konuşmaya hazırım.",
  },
};

const DEFAULTS: Store = {
  teachers: [
    { id: "t1", name: "Dr. Fatima Al-Zahra", title: "Master of Classical Arabic", city: "Damascus", bio: "20+ years teaching classical Arabic literature and grammar." },
    { id: "t2", name: "Ustadh Kareem Rahman", title: "Voice & Recitation", city: "Cairo", bio: "Specialist in tajweed and elegant recitation." },
    { id: "t3", name: "Sayyida Layla Osman", title: "Modern Standard Arabic", city: "Istanbul", bio: "Bridges MSA and dialects for global learners." },
  ],
  courses: [
    { id: "c1", slug: "alphabet", title: "The Alphabet", level: "Beginner", lessons: 28, description: "From Alif to Yaa — form, sound, and hand.", published: true },
    { id: "c2", slug: "greetings", title: "Greetings & Salutations", level: "Beginner", lessons: 12, description: "Speak from the first meeting.", published: true },
    { id: "c3", slug: "numbers", title: "Numbers", level: "Beginner", lessons: 10, description: "Count, price, and time.", published: true },
  ],
  faqs: [
    { id: "f1", question: "How long until I can hold a conversation?", answer: "With daily practice, most learners reach basic conversation in 8–12 weeks.", category: "Learning" },
    { id: "f2", question: "Do you offer certificates?", answer: "Yes — each completed course grants a Lugha certificate of study.", category: "Courses" },
    { id: "f3", question: "Can I switch teachers?", answer: "Absolutely. You may request a new teacher any time from your dashboard.", category: "Teachers" },
  ],
  settings: {
    siteName: "Lugha",
    tagline: "The Art of Learning Arabic",
    heroTitle: "Learn Arabic as an art",
    heroDescription: "Lugha is a modern school for the Arabic language — structured courses, immersive stories, and teachers who make you speak from day one.",
    primaryColor: "158 78% 17%",
    accentColor: "43 51% 54%",
    contactEmail: "hello@lugha.school",
    socialTwitter: "@lugha",
    socialInstagram: "@lugha.school",
    maintenanceMode: false,
    announcementBar: "",
    aiPersona: DEFAULT_PERSONA,
  },
  announcements: [],
};

const normalizeLocalized = (
  value: unknown,
  fallback: Localized
): Localized => {
  if (typeof value === "string") {
    // migrate legacy single-string value into all three languages
    return { ar: value, en: value, tr: value };
  }
  if (value && typeof value === "object") {
    const v = value as Partial<Localized>;
    return {
      ar: v.ar ?? fallback.ar,
      en: v.en ?? fallback.en,
      tr: v.tr ?? fallback.tr,
    };
  }
  return { ...fallback };
};

const normalizePersona = (raw: any): AiPersona => {
  const src = raw ?? {};
  return {
    hubName: normalizeLocalized(src.hubName, DEFAULT_PERSONA.hubName),
    hubTagline: normalizeLocalized(src.hubTagline, DEFAULT_PERSONA.hubTagline),
    tutorName: normalizeLocalized(src.tutorName, DEFAULT_PERSONA.tutorName),
    tutorTitle: normalizeLocalized(src.tutorTitle, DEFAULT_PERSONA.tutorTitle),
    tutorAccent: normalizeLocalized(src.tutorAccent, DEFAULT_PERSONA.tutorAccent),
    tutorGreeting: normalizeLocalized(src.tutorGreeting, DEFAULT_PERSONA.tutorGreeting),
  };
};

function read(): Store {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return structuredClone(DEFAULTS);
    const parsed = JSON.parse(raw);
    const base = structuredClone(DEFAULTS);
    return {
      ...base,
      ...parsed,
      settings: {
        ...base.settings,
        ...(parsed.settings ?? {}),
        aiPersona: normalizePersona(parsed.settings?.aiPersona),
      },
    };
  } catch {
    return structuredClone(DEFAULTS);
  }
}

function write(s: Store) {
  localStorage.setItem(KEY, JSON.stringify(s));
  window.dispatchEvent(new CustomEvent("lugha:content-updated"));
}

export const content = {
  getAll: read,
  save: write,
  reset() { localStorage.removeItem(KEY); window.dispatchEvent(new CustomEvent("lugha:content-updated")); },
  export(): string { return JSON.stringify(read(), null, 2); },
  import(json: string): boolean {
    try {
      const p = JSON.parse(json);
      const merged: Store = {
        ...DEFAULTS,
        ...p,
        settings: {
          ...DEFAULTS.settings,
          ...(p.settings ?? {}),
          aiPersona: normalizePersona(p.settings?.aiPersona),
        },
      };
      write(merged);
      return true;
    } catch { return false; }
  },
  uid() { return "id_" + Math.random().toString(36).slice(2, 10); },
};
