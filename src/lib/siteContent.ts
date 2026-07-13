// Site content store: localStorage-backed, JSON export/import for full control.
export type Teacher = { id: string; name: string; title: string; city: string; bio: string; avatar?: string };
export type Course = { id: string; slug: string; title: string; level: string; lessons: number; description: string; published: boolean };
export type FAQItem = { id: string; question: string; answer: string; category?: string };
export type SiteSettings = {
  siteName: string;
  tagline: string;
  heroTitle: string;
  heroDescription: string;
  primaryColor: string; // hsl string like "158 78% 17%"
  accentColor: string;
  contactEmail: string;
  socialTwitter: string;
  socialInstagram: string;
  maintenanceMode: boolean;
  announcementBar: string;
  aiPersona: {
    hubName: string;      // e.g. "المِحراب"
    hubTagline: string;   // short tagline shown under hub title
    tutorName: string;    // e.g. "سِراج"
    tutorTitle: string;   // e.g. "رفيقك في تعلّم العربية"
    tutorAccent: string;  // e.g. "أردني"
    tutorGreeting: string;// opening line
  };
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
    aiPersona: {
      hubName: "المِحراب",
      hubTagline: "مركز لُغة الذكي — كل أدوات الذكاء الاصطناعي في مكان واحد.",
      tutorName: "سِراج",
      tutorTitle: "رفيقك الذكي في تعلّم العربية",
      tutorAccent: "أردني",
      tutorGreeting: "أهلاً وسهلاً! أنا سِراج، جاهز نحكي عربي سوا.",
    },
  },
  announcements: [],
};

function read(): Store {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return structuredClone(DEFAULTS);
    const parsed = JSON.parse(raw);
    return { ...structuredClone(DEFAULTS), ...parsed };
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
    try { const p = JSON.parse(json); write({ ...DEFAULTS, ...p }); return true; } catch { return false; }
  },
  uid() { return "id_" + Math.random().toString(36).slice(2, 10); },
};
