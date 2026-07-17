import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Users, BookOpen, HelpCircle, Settings, Shield,
  Database, Megaphone, LogOut, Plus, Trash2, Save, Download, Upload,
  Eye, EyeOff, Lock, Sparkles, TrendingUp, Bell, Palette, Bot, Wand2,
  LifeBuoy, RefreshCw, Mail, Loader2,
} from "lucide-react";
import { toast } from "sonner";
import {
  ensureDefaultPassword, verifyPassword, changePassword,
  startSession, isAuthed, endSession, getAdminPassword,
} from "@/lib/adminAuth";
import { content, pickLocalized, type Teacher, type Course, type FAQItem, type Announcement, type AiPersona, type Localized } from "@/lib/siteContent";
import { GEMINI_MODEL_OPTIONS, DEFAULT_GEMINI_MODEL, type GeminiModelId } from "@/lib/aiModel";
import { useLanguage, type Language } from "@/contexts/LanguageContext";
import { supabase } from "@/lib/supabase";
import logo from "@/assets/lugha-logo.png";

type Section = "overview" | "teachers" | "courses" | "faqs" | "announcements" | "ai" | "aimodel" | "aicontent" | "support" | "settings" | "security" | "backup";

const Admin = () => {
  const { t } = useLanguage();
  const [authed, setAuthed] = useState(isAuthed());
  const [pw, setPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [section, setSection] = useState<Section>("overview");
  const [data, setData] = useState(content.getAll());
  const navigate = useNavigate();

  useEffect(() => { ensureDefaultPassword(); }, []);
  useEffect(() => {
    const handler = () => setData(content.getAll());
    window.addEventListener("lugha:content-updated", handler);
    return () => window.removeEventListener("lugha:content-updated", handler);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const ok = await verifyPassword(pw);
    setLoading(false);
    if (ok) { startSession(); setAuthed(true); setPw(""); toast.success(t("admin.toast.welcome")); }
    else toast.error(t("admin.toast.wrongPw"));
  };

  const handleLogout = () => { endSession(); setAuthed(false); navigate("/"); };

  if (!authed) return <LoginGate pw={pw} setPw={setPw} showPw={showPw} setShowPw={setShowPw} onSubmit={handleLogin} loading={loading} />;

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar section={section} setSection={setSection} onLogout={handleLogout} />
      <div className="flex-1 min-w-0">
        <TopBar section={section} />
        <div className="p-6 md:p-10 max-w-6xl">
          {section === "overview" && <Overview data={data} setSection={setSection} />}
          {section === "teachers" && <TeachersManager data={data} setData={setData} />}
          {section === "courses" && <CoursesManager data={data} setData={setData} />}
          {section === "faqs" && <FAQManager data={data} setData={setData} />}
          {section === "announcements" && <AnnouncementsManager data={data} setData={setData} />}
          {section === "settings" && <SiteSettingsPanel data={data} setData={setData} />}
          {section === "ai" && <AIPersonaPanel data={data} setData={setData} />}
          {section === "aimodel" && <AIModelPanel data={data} setData={setData} />}
          {section === "aicontent" && <AIContentPanel />}
          {section === "support" && <SupportPanel />}
          {section === "security" && <SecurityPanel />}
          {section === "backup" && <BackupPanel setData={setData} />}
        </div>
      </div>
    </div>
  );
};

// ==================== LOGIN GATE ====================
const LoginGate = ({ pw, setPw, showPw, setShowPw, onSubmit, loading }: any) => {
  const { t } = useLanguage();
  return (
  <div className="min-h-screen bg-primary text-primary-foreground flex items-center justify-center px-4 relative overflow-hidden">
    <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{
      backgroundImage: `radial-gradient(circle at 20% 30%, hsl(var(--accent)) 0px, transparent 40%), radial-gradient(circle at 80% 70%, hsl(var(--accent)) 0px, transparent 40%)`,
    }} />
    <div className="relative w-full max-w-md">
      <div className="text-center mb-10">
        <img src={logo} alt="Lugha" className="w-16 h-16 mx-auto mb-4 opacity-90" />
        <p className="text-xs uppercase tracking-[0.4em] text-accent font-semibold mb-3">{t("admin.login.eyebrow")}</p>
        <h1 className="font-display text-5xl italic font-semibold tracking-tight">{t("admin.login.title")}</h1>
        <p className="mt-3 text-sm text-primary-foreground/60">{t("admin.login.subtitle")}</p>
      </div>
      <form onSubmit={onSubmit} className="bg-primary-foreground/5 border border-primary-foreground/15 backdrop-blur-sm p-8">
        <label className="block text-xs uppercase tracking-[0.24em] text-accent font-semibold mb-3">
          <Lock className="w-3.5 h-3.5 inline mr-2" /> {t("admin.login.pass")}
        </label>
        <div className="relative">
          <input
            type={showPw ? "text" : "password"}
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="••••••••••••"
            className="w-full bg-transparent border-b-2 border-primary-foreground/25 focus:border-accent outline-none py-3 pr-10 text-lg tracking-widest transition-colors"
            autoFocus
          />
          <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-0 top-3 text-primary-foreground/50 hover:text-accent">
            {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        <button
          type="submit"
          disabled={loading || !pw}
          className="mt-8 w-full bg-accent text-accent-foreground py-3.5 text-sm font-bold uppercase tracking-[0.2em] hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          {loading ? "..." : t("admin.login.enter")}
        </button>
        <Link to="/" className="block text-center mt-5 text-xs uppercase tracking-widest text-primary-foreground/50 hover:text-accent">
          {t("admin.login.return")}
        </Link>
      </form>
    </div>
  </div>
  );
};

// ==================== SIDEBAR ====================
const navItems: { key: Section; labelKey: string; icon: any }[] = [
  { key: "overview", labelKey: "admin.nav.overview", icon: LayoutDashboard },
  { key: "teachers", labelKey: "admin.nav.teachers", icon: Users },
  { key: "courses", labelKey: "admin.nav.courses", icon: BookOpen },
  { key: "faqs", labelKey: "admin.nav.faqs", icon: HelpCircle },
  { key: "announcements", labelKey: "admin.nav.announcements", icon: Megaphone },
  { key: "ai", labelKey: "admin.nav.ai", icon: Bot },
  { key: "aimodel", labelKey: "admin.nav.aiModel", icon: Sparkles },
  { key: "aicontent", labelKey: "admin.nav.aiContent", icon: Wand2 },
  { key: "support", labelKey: "admin.nav.support", icon: LifeBuoy },
  { key: "settings", labelKey: "admin.nav.settings", icon: Settings },
  { key: "security", labelKey: "admin.nav.security", icon: Shield },
  { key: "backup", labelKey: "admin.nav.backup", icon: Database },
];

const Sidebar = ({ section, setSection, onLogout }: { section: Section; setSection: (s: Section) => void; onLogout: () => void }) => {
  const { t } = useLanguage();
  return (
  <aside className="w-64 shrink-0 min-h-screen bg-primary text-primary-foreground p-6 flex flex-col sticky top-0 h-screen">
    <Link to="/" className="flex items-center gap-3 pb-6 border-b border-primary-foreground/10">
      <img src={logo} alt="Lugha" className="w-9 h-9" />
      <div>
        <p className="font-display italic text-xl font-semibold leading-none">Lugha</p>
        <p className="text-[10px] uppercase tracking-[0.28em] text-accent mt-1.5">Atelier</p>
      </div>
    </Link>
    <nav className="flex-1 mt-6 space-y-1">
      {navItems.map(({ key, labelKey, icon: Icon }) => (
        <button
          key={key}
          onClick={() => setSection(key)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-all ${
            section === key
              ? "bg-accent text-accent-foreground"
              : "text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/5"
          }`}
        >
          <Icon className="w-4 h-4" />
          {t(labelKey)}
        </button>
      ))}
    </nav>
    <button onClick={onLogout} className="mt-6 flex items-center gap-2 px-3 py-2.5 text-sm text-primary-foreground/60 hover:text-destructive border-t border-primary-foreground/10 pt-4">
      <LogOut className="w-4 h-4" /> {t("admin.signOut")}
    </button>
  </aside>
  );
};

const TopBar = ({ section }: { section: Section }) => {
  const { t } = useLanguage();
  const title = t(navItems.find((n) => n.key === section)?.labelKey ?? "");
  return (
    <div className="border-b border-border bg-card/50 px-6 md:px-10 py-5 flex items-center justify-between sticky top-0 z-10 backdrop-blur-sm">
      <div>
        <p className="text-[11px] uppercase tracking-[0.3em] text-accent font-semibold">{t("admin.section")}</p>
        <h2 className="font-display text-3xl italic font-semibold text-primary mt-1">{title}</h2>
      </div>
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="hidden md:flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-accent" /> {t("admin.liveEdits")}</span>
        <span>{new Date().toLocaleDateString()}</span>
      </div>
    </div>
  );
};

// ==================== OVERVIEW ====================
const Overview = ({ data, setSection }: any) => {
  const { t } = useLanguage();
  const stats = [
    { k: t("admin.stats.teachers"), v: data.teachers.length, sub: `${data.teachers.length} ${t("admin.stats.active")}`, jump: "teachers" as Section },
    { k: t("admin.stats.courses"), v: data.courses.length, sub: `${data.courses.filter((c: Course) => c.published).length} ${t("admin.stats.published")}`, jump: "courses" as Section },
    { k: t("admin.stats.faqs"), v: data.faqs.length, sub: t("admin.stats.knowledge"), jump: "faqs" as Section },
    { k: t("admin.stats.announcements"), v: data.announcements.length, sub: data.settings.maintenanceMode ? t("admin.stats.maint") : t("admin.stats.live"), jump: "announcements" as Section },
  ];
  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8">
        <p className="eyebrow">{t("admin.overview.eyebrow")}</p>
        <h3 className="font-display text-4xl md:text-5xl font-bold text-primary mt-2 leading-tight">
          {t("admin.overview.welcome")} <span className="italic text-accent">{t("admin.overview.master")}</span>.
        </h3>
        <p className="mt-3 text-lg text-muted-foreground max-w-xl">{t("admin.overview.sub")}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {stats.map((s) => (
          <button key={s.k} onClick={() => setSection(s.jump)} className="group text-left border border-border bg-card p-5 hover:border-accent transition-colors">
            <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground font-semibold">{s.k}</p>
            <p className="serif-numeral text-4xl font-bold text-primary mt-2 group-hover:text-accent transition-colors">{s.v}</p>
            <p className="text-xs text-muted-foreground mt-2">{s.sub}</p>
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="border border-border bg-card p-6">
          <p className="eyebrow">{t("admin.quick.eyebrow")}</p>
          <h4 className="font-display text-2xl font-bold text-primary mt-2 mb-4">{t("admin.quick.title")}</h4>
          <div className="space-y-2">
            {[
              { s: "teachers" as Section, l: t("admin.quick.addTeacher"), i: Users },
              { s: "courses" as Section, l: t("admin.quick.publishCourse"), i: BookOpen },
              { s: "announcements" as Section, l: t("admin.quick.postAnn"), i: Megaphone },
              { s: "settings" as Section, l: t("admin.quick.editHero"), i: Palette },
            ].map(({ s, l, i: Ic }) => (
              <button key={l} onClick={() => setSection(s)} className="w-full flex items-center justify-between p-3 border border-transparent hover:border-border hover:bg-secondary/50 transition-all group">
                <span className="flex items-center gap-3 text-sm font-medium text-foreground">
                  <Ic className="w-4 h-4 text-accent" /> {l}
                </span>
                <span className="text-muted-foreground group-hover:text-accent">→</span>
              </button>
            ))}
          </div>
        </div>

        <div className="border border-border bg-primary text-primary-foreground p-6 relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 opacity-10">
            <TrendingUp className="w-40 h-40" />
          </div>
          <p className="text-[11px] uppercase tracking-[0.28em] text-accent font-semibold">{t("admin.health.eyebrow")}</p>
          <h4 className="font-display text-2xl italic font-semibold mt-2 mb-4">{t("admin.health.title")}</h4>
          <ul className="space-y-3 text-sm text-primary-foreground/85">
            <li className="flex items-center justify-between"><span>{t("admin.health.store")}</span><span className="text-accent">{t("admin.health.healthy")}</span></li>
            <li className="flex items-center justify-between"><span>{t("admin.health.maint")}</span><span className={data.settings.maintenanceMode ? "text-destructive" : "text-accent"}>{data.settings.maintenanceMode ? t("admin.health.on") : t("admin.health.off")}</span></li>
            <li className="flex items-center justify-between"><span>{t("admin.health.bar")}</span><span className={data.settings.announcementBar ? "text-accent" : "text-primary-foreground/40"}>{data.settings.announcementBar ? t("admin.health.visible") : t("admin.health.empty")}</span></li>
            <li className="flex items-center justify-between"><span>{t("admin.health.backend")}</span><span className="text-primary-foreground/60">{t("admin.health.local")}</span></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// ==================== TEACHERS ====================
const TeachersManager = ({ data, setData }: any) => {
  const { t } = useLanguage();
  const update = (teachers: Teacher[]) => { const next = { ...data, teachers }; content.save(next); setData(next); };
  const add = () => update([...data.teachers, { id: content.uid(), name: "", title: "", city: "", bio: "" }]);
  const remove = (id: string) => { update(data.teachers.filter((x: Teacher) => x.id !== id)); toast.success(t("admin.toast.deleted")); };
  const patch = (id: string, f: Partial<Teacher>) => update(data.teachers.map((x: Teacher) => (x.id === id ? { ...x, ...f } : x)));

  return (
    <SectionShell title={t("admin.teachers.title")} desc={t("admin.teachers.desc")} onAdd={add} addLabel={t("admin.teachers.add")}>
      <div className="grid md:grid-cols-2 gap-4">
        {data.teachers.map((x: Teacher) => (
          <div key={x.id} className="border border-border bg-card p-5 group">
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 bg-primary text-primary-foreground flex items-center justify-center font-display text-xl font-bold">
                {x.name.charAt(0) || "?"}
              </div>
              <button onClick={() => remove(x.id)} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <Field label={t("admin.field.name")} value={x.name} onChange={(v) => patch(x.id, { name: v })} />
            <Field label={t("admin.field.title")} value={x.title} onChange={(v) => patch(x.id, { title: v })} />
            <Field label={t("admin.field.city")} value={x.city} onChange={(v) => patch(x.id, { city: v })} />
            <Field label={t("admin.field.bio")} value={x.bio} onChange={(v) => patch(x.id, { bio: v })} textarea />
          </div>
        ))}
      </div>
      {data.teachers.length === 0 && <Empty label={t("admin.teachers.empty")} />}
    </SectionShell>
  );
};

// ==================== COURSES ====================
const CoursesManager = ({ data, setData }: any) => {
  const { t } = useLanguage();
  const update = (courses: Course[]) => { const next = { ...data, courses }; content.save(next); setData(next); };
  const add = () => update([...data.courses, { id: content.uid(), slug: "new-course", title: "", level: "Beginner", lessons: 1, description: "", published: false }]);
  const remove = (id: string) => { update(data.courses.filter((c: Course) => c.id !== id)); toast.success(t("admin.toast.deleted")); };
  const patch = (id: string, f: Partial<Course>) => update(data.courses.map((c: Course) => (c.id === id ? { ...c, ...f } : c)));

  return (
    <SectionShell title={t("admin.courses.title")} desc={t("admin.courses.desc")} onAdd={add} addLabel={t("admin.courses.add")}>
      <div className="space-y-3">
        {data.courses.map((c: Course, i: number) => (
          <div key={c.id} className="border border-border bg-card p-5 grid md:grid-cols-12 gap-4 items-start group">
            <div className="md:col-span-1 serif-numeral text-4xl font-bold text-accent">{String(i + 1).padStart(2, "0")}</div>
            <div className="md:col-span-8 space-y-2">
              <Field label={t("admin.field.title")} value={c.title} onChange={(v) => patch(c.id, { title: v })} />
              <div className="grid grid-cols-3 gap-2">
                <Field label={t("admin.field.slug")} value={c.slug} onChange={(v) => patch(c.id, { slug: v })} />
                <Field label={t("admin.field.level")} value={c.level} onChange={(v) => patch(c.id, { level: v })} />
                <Field label={t("admin.field.lessons")} value={String(c.lessons)} onChange={(v) => patch(c.id, { lessons: parseInt(v) || 0 })} />
              </div>
              <Field label={t("admin.field.description")} value={c.description} onChange={(v) => patch(c.id, { description: v })} textarea />
            </div>
            <div className="md:col-span-3 flex md:flex-col gap-2 items-end md:items-stretch">
              <button
                onClick={() => patch(c.id, { published: !c.published })}
                className={`px-3 py-2 text-xs uppercase tracking-widest font-semibold ${c.published ? "bg-accent text-accent-foreground" : "border border-border text-muted-foreground"}`}
              >
                {c.published ? t("admin.courses.published") : t("admin.courses.draft")}
              </button>
              <button onClick={() => remove(c.id)} className="text-xs text-destructive hover:underline flex items-center gap-1"><Trash2 className="w-3 h-3" /> {t("admin.delete")}</button>
            </div>
          </div>
        ))}
      </div>
      {data.courses.length === 0 && <Empty label={t("admin.courses.empty")} />}
    </SectionShell>
  );
};

// ==================== FAQ ====================
const FAQManager = ({ data, setData }: any) => {
  const { t } = useLanguage();
  const update = (faqs: FAQItem[]) => { const next = { ...data, faqs }; content.save(next); setData(next); };
  const add = () => update([...data.faqs, { id: content.uid(), question: "", answer: "", category: "General" }]);
  const remove = (id: string) => update(data.faqs.filter((f: FAQItem) => f.id !== id));
  const patch = (id: string, f: Partial<FAQItem>) => update(data.faqs.map((x: FAQItem) => (x.id === id ? { ...x, ...f } : x)));

  return (
    <SectionShell title={t("admin.faqs.title")} desc={t("admin.faqs.desc")} onAdd={add} addLabel={t("admin.faqs.add")}>
      <div className="space-y-3">
        {data.faqs.map((f: FAQItem, i: number) => (
          <div key={f.id} className="border border-border bg-card p-5 group">
            <div className="flex items-start justify-between gap-4">
              <span className="serif-numeral text-2xl font-bold text-accent shrink-0">Q{i + 1}</span>
              <div className="flex-1 space-y-2">
                <Field label={t("admin.field.question")} value={f.question} onChange={(v) => patch(f.id, { question: v })} />
                <Field label={t("admin.field.answer")} value={f.answer} onChange={(v) => patch(f.id, { answer: v })} textarea />
                <Field label={t("admin.field.category")} value={f.category || ""} onChange={(v) => patch(f.id, { category: v })} />
              </div>
              <button onClick={() => remove(f.id)} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
      {data.faqs.length === 0 && <Empty label={t("admin.faqs.empty")} />}
    </SectionShell>
  );
};

// ==================== ANNOUNCEMENTS ====================
const AnnouncementsManager = ({ data, setData }: any) => {
  const { t } = useLanguage();
  const [msg, setMsg] = useState("");
  const [type, setType] = useState<"info" | "warning" | "success">("info");
  const post = () => {
    if (!msg.trim()) return;
    const next = { ...data, announcements: [{ id: content.uid(), message: msg, type, createdAt: new Date().toISOString() }, ...data.announcements] };
    content.save(next); setData(next); setMsg(""); toast.success(t("admin.toast.posted"));
  };
  const remove = (id: string) => {
    const next = { ...data, announcements: data.announcements.filter((a: Announcement) => a.id !== id) };
    content.save(next); setData(next);
  };
  const typeLabel = (tt: string) => t(`admin.ann.${tt}`);
  return (
    <SectionShell title={t("admin.ann.title")} desc={t("admin.ann.desc")}>
      <div className="border border-border bg-card p-6 mb-6">
        <p className="eyebrow mb-3">{t("admin.ann.eyebrow")}</p>
        <textarea value={msg} onChange={(e) => setMsg(e.target.value)} rows={3} placeholder={t("admin.ann.placeholder")} className="w-full bg-background border border-border p-3 text-sm focus:border-accent outline-none" />
        <div className="flex items-center justify-between mt-3">
          <div className="flex gap-2">
            {(["info", "success", "warning"] as const).map((tt) => (
              <button key={tt} onClick={() => setType(tt)} className={`px-3 py-1.5 text-xs uppercase tracking-wider font-semibold ${type === tt ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground"}`}>{typeLabel(tt)}</button>
            ))}
          </div>
          <button onClick={post} className="bg-accent text-accent-foreground px-5 py-2 text-xs font-bold uppercase tracking-widest flex items-center gap-2"><Bell className="w-3.5 h-3.5" /> {t("admin.ann.post")}</button>
        </div>
      </div>
      <div className="space-y-2">
        {data.announcements.map((a: Announcement) => (
          <div key={a.id} className={`border-l-4 p-4 bg-card border border-border flex items-start justify-between gap-4 ${a.type === "warning" ? "border-l-destructive" : a.type === "success" ? "border-l-accent" : "border-l-primary"}`}>
            <div className="flex-1">
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">{typeLabel(a.type)} · {new Date(a.createdAt).toLocaleString()}</span>
              <p className="text-sm text-foreground mt-1">{a.message}</p>
            </div>
            <button onClick={() => remove(a.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
        {data.announcements.length === 0 && <Empty label={t("admin.ann.empty")} />}
      </div>
    </SectionShell>
  );
};

// ==================== SITE SETTINGS ====================
const SiteSettingsPanel = ({ data, setData }: any) => {
  const { t } = useLanguage();
  const [s, setS] = useState(data.settings);
  useEffect(() => setS(data.settings), [data.settings]);
  const save = () => { const next = { ...data, settings: s }; content.save(next); setData(next); toast.success(t("admin.toast.saved")); };
  const patch = (f: any) => setS({ ...s, ...f });
  return (
    <SectionShell title={t("admin.settings.title")} desc={t("admin.settings.desc")}>
      <div className="space-y-6 max-w-3xl">
        <Card title={t("admin.settings.identity")}>
          <Field label={t("admin.settings.siteName")} value={s.siteName} onChange={(v) => patch({ siteName: v })} />
          <Field label={t("admin.settings.tagline")} value={s.tagline} onChange={(v) => patch({ tagline: v })} />
        </Card>
        <Card title={t("admin.settings.hero")}>
          <Field label={t("admin.settings.heroTitle")} value={s.heroTitle} onChange={(v) => patch({ heroTitle: v })} />
          <Field label={t("admin.settings.heroDesc")} value={s.heroDescription} onChange={(v) => patch({ heroDescription: v })} textarea />
        </Card>
        <Card title={t("admin.settings.palette")}>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Field label={t("admin.settings.primary")} value={s.primaryColor} onChange={(v) => patch({ primaryColor: v })} />
              <div className="h-8 mt-1" style={{ background: `hsl(${s.primaryColor})` }} />
            </div>
            <div>
              <Field label={t("admin.settings.accent")} value={s.accentColor} onChange={(v) => patch({ accentColor: v })} />
              <div className="h-8 mt-1" style={{ background: `hsl(${s.accentColor})` }} />
            </div>
          </div>
        </Card>
        <Card title={t("admin.settings.contact")}>
          <Field label={t("admin.settings.email")} value={s.contactEmail} onChange={(v) => patch({ contactEmail: v })} />
          <Field label={t("admin.settings.twitter")} value={s.socialTwitter} onChange={(v) => patch({ socialTwitter: v })} />
          <Field label={t("admin.settings.instagram")} value={s.socialInstagram} onChange={(v) => patch({ socialInstagram: v })} />
        </Card>
        <Card title={t("admin.settings.public")}>
          <Field label={t("admin.settings.annBar")} value={s.announcementBar} onChange={(v) => patch({ announcementBar: v })} />
          <label className="flex items-center gap-3 mt-3 text-sm">
            <input type="checkbox" checked={s.maintenanceMode} onChange={(e) => patch({ maintenanceMode: e.target.checked })} className="w-4 h-4 accent-primary" />
            {t("admin.settings.maintenance")}
          </label>
        </Card>
        <button onClick={save} className="bg-primary text-primary-foreground px-8 py-3 text-sm font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-emerald transition-colors"><Save className="w-4 h-4" /> {t("admin.settings.save")}</button>
      </div>
    </SectionShell>
  );
};

// ==================== SECURITY ====================
const SecurityPanel = () => {
  const { t } = useLanguage();
  const [cur, setCur] = useState("");
  const [next, setNext] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [busy, setBusy] = useState(false);

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (next !== confirmPw) return toast.error(t("admin.toast.pwMismatch"));
    if (next.length < 6) return toast.error(t("admin.toast.pwShort"));
    setBusy(true);
    const ok = await changePassword(cur, next);
    setBusy(false);
    if (ok) { toast.success(t("admin.toast.pwChanged")); setCur(""); setNext(""); setConfirmPw(""); }
    else toast.error(t("admin.toast.pwWrong"));
  };

  return (
    <SectionShell title={t("admin.security.title")} desc={t("admin.security.desc")}>
      <form onSubmit={handle} className="max-w-md border border-border bg-card p-6 space-y-4">
        <Field label={t("admin.security.current")} value={cur} onChange={setCur} type="password" />
        <Field label={t("admin.security.new")} value={next} onChange={setNext} type="password" />
        <Field label={t("admin.security.confirm")} value={confirmPw} onChange={setConfirmPw} type="password" />
        <button disabled={busy} className="bg-primary text-primary-foreground w-full py-3 text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-emerald disabled:opacity-50">
          <Shield className="w-4 h-4" /> {t("admin.security.update")}
        </button>
        <p className="text-xs text-muted-foreground">{t("admin.security.note")}</p>
      </form>
    </SectionShell>
  );
};

// ==================== BACKUP ====================
const BackupPanel = ({ setData }: { setData: any }) => {
  const { t } = useLanguage();
  const exportNow = () => {
    const blob = new Blob([content.export()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `lugha-backup-${new Date().toISOString().slice(0, 10)}.json`; a.click();
    URL.revokeObjectURL(url);
    toast.success(t("admin.toast.exported"));
  };
  const importFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      const ok = content.import(String(r.result));
      if (ok) { setData(content.getAll()); toast.success(t("admin.toast.imported")); }
      else toast.error(t("admin.toast.invalid"));
    };
    r.readAsText(f);
  };
  const reset = () => {
    if (!window.confirm(t("admin.backup.resetConfirm"))) return;
    content.reset(); setData(content.getAll()); toast.success(t("admin.toast.restored"));
  };
  return (
    <SectionShell title={t("admin.backup.title")} desc={t("admin.backup.desc")}>
      <div className="grid md:grid-cols-3 gap-4 max-w-4xl">
        <button onClick={exportNow} className="border border-border bg-card p-6 text-left hover:border-accent transition-colors group">
          <Download className="w-8 h-8 text-accent mb-3" />
          <h4 className="font-display text-xl font-bold text-primary group-hover:text-accent">{t("admin.backup.export")}</h4>
          <p className="text-xs text-muted-foreground mt-2">{t("admin.backup.exportDesc")}</p>
        </button>
        <label className="border border-border bg-card p-6 text-left hover:border-accent transition-colors group cursor-pointer">
          <Upload className="w-8 h-8 text-accent mb-3" />
          <h4 className="font-display text-xl font-bold text-primary group-hover:text-accent">{t("admin.backup.import")}</h4>
          <p className="text-xs text-muted-foreground mt-2">{t("admin.backup.importDesc")}</p>
          <input type="file" accept="application/json" onChange={importFile} className="hidden" />
        </label>
        <button onClick={reset} className="border border-destructive/40 bg-card p-6 text-left hover:border-destructive transition-colors group">
          <Trash2 className="w-8 h-8 text-destructive mb-3" />
          <h4 className="font-display text-xl font-bold text-destructive">{t("admin.backup.reset")}</h4>
          <p className="text-xs text-muted-foreground mt-2">{t("admin.backup.resetDesc")}</p>
        </button>
      </div>
    </SectionShell>
  );
};

// ==================== SHARED ====================
const SectionShell = ({ title, desc, children, onAdd, addLabel }: any) => (
  <div className="animate-in fade-in duration-500">
    <div className="mb-6 flex items-end justify-between gap-4 flex-wrap">
      <div>
        <h3 className="font-display text-3xl md:text-4xl font-bold text-primary">{title}</h3>
        {desc && <p className="text-base text-muted-foreground mt-2 max-w-2xl">{desc}</p>}
      </div>
      {onAdd && (
        <button onClick={onAdd} className="bg-accent text-accent-foreground px-5 py-2.5 text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:opacity-90">
          <Plus className="w-4 h-4" /> {addLabel}
        </button>
      )}
    </div>
    {children}
  </div>
);

const Field = ({ label, value, onChange, textarea, type = "text" }: { label: string; value: string; onChange: (v: string) => void; textarea?: boolean; type?: string }) => (
  <div className="mb-2">
    <label className="text-[10px] uppercase tracking-[0.2em] font-semibold text-muted-foreground">{label}</label>
    {textarea ? (
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={2} className="w-full mt-1 bg-background border border-border px-3 py-2 text-sm focus:border-accent outline-none transition-colors" />
    ) : (
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full mt-1 bg-background border border-border px-3 py-2 text-sm focus:border-accent outline-none transition-colors" />
    )}
  </div>
);

const Card = ({ title, children }: any) => (
  <div className="border border-border bg-card p-5">
    <p className="eyebrow mb-3">— {title} —</p>
    {children}
  </div>
);

const Empty = ({ label }: { label: string }) => (
  <div className="text-center py-16 border border-dashed border-border text-muted-foreground text-sm">{label}</div>
);

// ==================== AI PERSONA ====================
const LANG_TABS: { key: Language; label: string }[] = [
  { key: "ar", label: "العربية" },
  { key: "en", label: "English" },
  { key: "tr", label: "Türkçe" },
];

const AIPersonaPanel = ({ data, setData }: any) => {
  const { t, language } = useLanguage();
  const [p, setP] = useState<AiPersona>(data.settings.aiPersona);
  const [editLang, setEditLang] = useState<Language>(language);
  const [previewLang, setPreviewLang] = useState<Language>(language);
  useEffect(() => setP(data.settings.aiPersona), [data.settings.aiPersona]);

  const patchLoc = (field: keyof AiPersona, lang: Language, value: string) => {
    setP({ ...p, [field]: { ...p[field], [lang]: value } as Localized });
  };
  const save = () => {
    const next = { ...data, settings: { ...data.settings, aiPersona: p } };
    content.save(next); setData(next); toast.success(t("admin.toast.saved"));
  };

  const previewHub = pickLocalized(p.hubName, previewLang);
  const previewHubTag = pickLocalized(p.hubTagline, previewLang);
  const previewTutorName = pickLocalized(p.tutorName, previewLang);
  const previewTutorTitle = pickLocalized(p.tutorTitle, previewLang);
  const previewTutorGreet = pickLocalized(p.tutorGreeting, previewLang);

  const fields: { key: keyof AiPersona; label: string; textarea?: boolean }[] = [
    { key: "hubName", label: t("admin.ai.hubName") },
    { key: "hubTagline", label: t("admin.ai.hubTagline"), textarea: true },
    { key: "tutorName", label: t("admin.ai.tutorName") },
    { key: "tutorTitle", label: t("admin.ai.tutorTitle") },
    { key: "tutorAccent", label: t("admin.ai.tutorAccent") },
    { key: "tutorGreeting", label: t("admin.ai.tutorGreeting"), textarea: true },
  ];

  return (
    <SectionShell title={t("admin.ai.title")} desc={t("admin.ai.desc")}>
      <div className="grid md:grid-cols-[1fr_320px] gap-6 max-w-5xl">
        <div className="space-y-6">
          <div className="flex items-center gap-2 border-b border-border pb-2">
            <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground font-semibold mr-2">
              {t("admin.ai.editLang")}:
            </span>
            {LANG_TABS.map((l) => (
              <button
                key={l.key}
                onClick={() => setEditLang(l.key)}
                className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-widest transition-colors ${
                  editLang === l.key
                    ? "bg-primary text-primary-foreground"
                    : "border border-border text-muted-foreground hover:border-accent"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>

          {fields.map(({ key, label, textarea }) => (
            <Card key={key} title={label}>
              <Field
                label={LANG_TABS.find((l) => l.key === editLang)!.label}
                value={p[key][editLang]}
                onChange={(v) => patchLoc(key, editLang, v)}
                textarea={textarea}
              />
              <div className="mt-2 grid grid-cols-2 gap-2">
                {LANG_TABS.filter((l) => l.key !== editLang).map((l) => (
                  <div key={l.key} className="text-[11px] text-muted-foreground border-l-2 border-border pl-2">
                    <span className="uppercase tracking-widest text-accent font-semibold">{l.label}:</span>{" "}
                    <span className="text-foreground">{p[key][l.key] || <em className="text-muted-foreground">—</em>}</span>
                  </div>
                ))}
              </div>
            </Card>
          ))}

          <button onClick={save} className="bg-primary text-primary-foreground px-8 py-3 text-sm font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-emerald transition-colors">
            <Save className="w-4 h-4" /> {t("admin.ai.save")}
          </button>
        </div>

        <div className="border border-accent/40 bg-primary text-primary-foreground p-6 h-fit sticky top-24">
          <p className="text-[10px] uppercase tracking-[0.28em] text-accent font-semibold">— {t("admin.ai.livePreview")} —</p>
          <div className="flex gap-1 mt-3">
            {LANG_TABS.map((l) => (
              <button
                key={l.key}
                onClick={() => setPreviewLang(l.key)}
                className={`px-2 py-1 text-[10px] font-bold uppercase tracking-widest transition-colors ${
                  previewLang === l.key
                    ? "bg-accent text-accent-foreground"
                    : "border border-primary-foreground/20 text-primary-foreground/60 hover:border-accent"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
          <div className="mt-5 flex items-start gap-3" dir={previewLang === "ar" ? "rtl" : "ltr"}>
            <span className="w-12 h-12 bg-accent text-accent-foreground flex items-center justify-center font-display italic font-bold text-xl shrink-0">
              {previewTutorName.charAt(0) || "?"}
            </span>
            <div>
              <p className="font-display text-2xl italic font-semibold">{previewTutorName}</p>
              <p className="text-xs text-primary-foreground/70">{previewTutorTitle}</p>
            </div>
          </div>
          <p className="mt-5 text-sm text-primary-foreground/85 leading-relaxed" dir={previewLang === "ar" ? "rtl" : "ltr"}>
            "{previewTutorGreet}"
          </p>
          <div className="mt-6 pt-5 border-t border-primary-foreground/10" dir={previewLang === "ar" ? "rtl" : "ltr"}>
            <p className="text-[10px] uppercase tracking-[0.24em] text-accent font-semibold">Hub</p>
            <p className="font-display text-3xl italic font-semibold mt-1">{previewHub}</p>
            <p className="text-xs text-primary-foreground/70 mt-2">{previewHubTag}</p>
          </div>
        </div>
      </div>
    </SectionShell>
  );
};

// ==================== AI MODEL PICKER ====================
const AIModelPanel = ({ data, setData }: any) => {
  const { t } = useLanguage();
  const current: GeminiModelId = (data.settings.aiModel as GeminiModelId) || DEFAULT_GEMINI_MODEL;
  const [selected, setSelected] = useState<GeminiModelId>(current);
  useEffect(() => setSelected((data.settings.aiModel as GeminiModelId) || DEFAULT_GEMINI_MODEL), [data.settings.aiModel]);

  const save = () => {
    const next = { ...data, settings: { ...data.settings, aiModel: selected } };
    content.save(next); setData(next);
    toast.success(t("admin.aiModel.saved") || "تم حفظ نموذج الذكاء الاصطناعي");
  };

  const badgeStyle: Record<string, string> = {
    fast: "bg-accent/15 text-accent border-accent/30",
    balanced: "bg-primary/10 text-primary border-primary/25",
    premium: "bg-emerald/15 text-emerald border-emerald/30",
  };
  const badgeLabel: Record<string, string> = {
    fast: t("admin.aiModel.badge.fast") || "سريع",
    balanced: t("admin.aiModel.badge.balanced") || "متوازن",
    premium: t("admin.aiModel.badge.premium") || "متميّز",
  };

  return (
    <SectionShell
      title={t("admin.aiModel.title") || "نموذج الذكاء الاصطناعي"}
      desc={t("admin.aiModel.desc") || "اختر نموذج جيميني الذي يعمل به سِراج وجميع أدوات مجلس لُغة. التغيير فوري ولا يتطلّب إعادة نشر."}
    >
      <div className="max-w-5xl space-y-6">
        <div className="border-2 border-accent/40 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 p-6 flex items-start gap-4">
          <div className="w-14 h-14 shrink-0 bg-primary text-primary-foreground flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-accent" />
          </div>
          <div className="flex-1">
            <p className="text-[10px] uppercase tracking-[0.28em] text-accent font-semibold">
              {t("admin.aiModel.active") || "النموذج النشط"}
            </p>
            <h3 className="font-display text-2xl italic font-semibold text-primary mt-1">
              {GEMINI_MODEL_OPTIONS.find((o) => o.id === current)?.label ?? current}
            </h3>
            <p className="text-xs text-muted-foreground mt-2">
              {t("admin.aiModel.activeHint") ||
                "يستخدمه سِراج، عالم القصص، مركز لُغة الذكي، والماسح الضوئي فوراً بعد الحفظ."}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {GEMINI_MODEL_OPTIONS.map((opt) => {
            const active = selected === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setSelected(opt.id)}
                className={`text-left border-2 p-5 transition-all group ${
                  active
                    ? "border-accent bg-accent/5 shadow-[0_8px_24px_-12px_hsl(var(--accent)/0.4)]"
                    : "border-border bg-card hover:border-accent/50"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-display text-lg font-bold text-primary group-hover:text-accent transition-colors">
                      {opt.label}
                    </p>
                    <p className="text-[10px] font-mono text-muted-foreground mt-1">{opt.id}</p>
                  </div>
                  <span
                    className={`shrink-0 text-[9px] uppercase tracking-[0.2em] font-bold px-2 py-1 border ${badgeStyle[opt.badge]}`}
                  >
                    {badgeLabel[opt.badge]}
                  </span>
                </div>
                <p className="text-xs text-foreground/70 mt-3 leading-relaxed">{opt.tagline}</p>
                <div className="mt-4 flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold">
                  {active ? (
                    <span className="text-accent flex items-center gap-1.5">
                      <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                      {t("admin.aiModel.selected") || "محدّد"}
                    </span>
                  ) : (
                    <span className="text-muted-foreground group-hover:text-accent">
                      {t("admin.aiModel.pick") || "اختيار"} →
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={save}
            disabled={selected === current}
            className="bg-primary text-primary-foreground px-8 py-3 text-sm font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-emerald transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" /> {t("admin.aiModel.save") || "حفظ النموذج"}
          </button>
          {selected !== current && (
            <span className="text-xs text-accent uppercase tracking-widest font-semibold">
              {t("admin.aiModel.pending") || "تغييرات غير محفوظة"}
            </span>
          )}
        </div>

        <div className="border border-border/60 bg-muted/30 p-4 text-xs text-muted-foreground leading-relaxed">
          <p className="font-semibold text-foreground mb-1">
            {t("admin.aiModel.noteTitle") || "ملاحظة"}
          </p>
          <p>
            {t("admin.aiModel.note") ||
              "جميع النماذج من عائلة جيميني، فلا حاجة لتغيير مفتاح API. يمكنك التبديل في أي وقت بدون توقّف."}
          </p>
        </div>
      </div>
    </SectionShell>
  );
};

// ==================== AI CONTENT STUDIO ====================
const AIContentPanel = () => {
  const { t } = useLanguage();
  const tools = [
    { icon: Wand2, key: "gen" },
    { icon: Sparkles, key: "trans" },
    { icon: TrendingUp, key: "stats" },
  ];
  return (
    <SectionShell title={t("admin.aiContent.title")} desc={t("admin.aiContent.desc")}>
      <div className="grid md:grid-cols-3 gap-4 max-w-5xl">
        {tools.map(({ icon: Ic, key }) => (
          <div key={key} className="border border-border bg-card p-6 hover:border-accent transition-colors group">
            <Ic className="w-8 h-8 text-accent mb-3" />
            <h4 className="font-display text-xl font-bold text-primary group-hover:text-accent">{t(`admin.aiContent.${key}`)}</h4>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{t(`admin.aiContent.${key}.desc`)}</p>
            <button
              onClick={() => toast.info(t("admin.aiContent.launch") + " — soon")}
              className="mt-5 text-[10px] uppercase tracking-[0.24em] font-bold text-accent hover:underline"
            >
              {t("admin.aiContent.launch")} →
            </button>
          </div>
        ))}
      </div>
    </SectionShell>
  );
};

// ==================== SUPPORT TICKETS ====================
type SupportTicket = {
  id: string;
  user_id: string | null;
  name: string;
  email: string;
  message: string;
  status: string;
  created_at: string;
};

const SupportPanel = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "new" | "resolved">("all");

  const callFn = async (method: "GET" | "POST" | "DELETE", opts: { id?: string; status?: string } = {}) => {
    const pw = getAdminPassword();
    if (!pw) throw new Error("جلسة الأدمن انتهت، سجّل دخولك مجدداً.");
    const url = new URL(
      `${(import.meta as any).env?.VITE_SUPABASE_URL ?? "https://zekkojrgknpvmxskyqno.supabase.co"}/functions/v1/admin-support`,
    );
    if (method === "DELETE" && opts.id) url.searchParams.set("id", opts.id);
    const res = await fetch(url.toString(), {
      method,
      headers: {
        "Content-Type": "application/json",
        "x-admin-password": pw,
      },
      body: method === "POST" ? JSON.stringify(opts) : undefined,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
    return data;
  };

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const { tickets } = await callFn("GET");
      setTickets(tickets ?? []);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const markResolved = async (id: string, next: string) => {
    try {
      await callFn("POST", { id, status: next });
      setTickets((t) => t.map((x) => (x.id === id ? { ...x, status: next } : x)));
      toast.success("تم التحديث");
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  const remove = async (id: string) => {
    if (!window.confirm("حذف هذه الرسالة نهائياً؟")) return;
    try {
      await callFn("DELETE", { id });
      setTickets((t) => t.filter((x) => x.id !== id));
      toast.success("تم الحذف");
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  const visible = tickets.filter((t) => filter === "all" || t.status === filter);

  return (
    <SectionShell title="الدعم الفني" desc="رسائل المستخدمين المرسلة من صفحة الدعم.">
      <div className="flex items-center gap-2 mb-5 flex-wrap">
        {(["all", "new", "resolved"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 text-xs uppercase tracking-widest font-semibold ${
              filter === f ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground"
            }`}
          >
            {f === "all" ? "الكل" : f === "new" ? "جديد" : "منتهي"} ({f === "all" ? tickets.length : tickets.filter((t) => t.status === f).length})
          </button>
        ))}
        <button
          onClick={load}
          className="ms-auto text-xs uppercase tracking-widest font-semibold text-accent hover:underline flex items-center gap-1.5"
        >
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />} تحديث
        </button>
      </div>

      {error && (
        <div className="border border-destructive/40 bg-destructive/10 text-destructive text-sm p-4 mb-4">
          تعذّر تحميل الرسائل: {error}
        </div>
      )}

      <div className="space-y-3">
        {loading && tickets.length === 0 && (
          <div className="text-center py-16 text-muted-foreground text-sm flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" /> جاري التحميل…
          </div>
        )}

        {!loading && visible.length === 0 && <Empty label="لا توجد رسائل هنا." />}

        {visible.map((t) => (
          <div
            key={t.id}
            className={`border bg-card p-5 ${t.status === "new" ? "border-accent/60" : "border-border"}`}
          >
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="font-display text-lg font-semibold text-primary">{t.name}</span>
                  <span
                    className={`text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 ${
                      t.status === "new" ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {t.status === "new" ? "جديد" : "منتهي"}
                  </span>
                </div>
                <a
                  href={`mailto:${t.email}`}
                  className="text-xs text-muted-foreground flex items-center gap-1 hover:text-accent"
                >
                  <Mail className="w-3 h-3" /> {t.email}
                </a>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">
                  {new Date(t.created_at).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => markResolved(t.id, t.status === "new" ? "resolved" : "new")}
                  className="text-xs px-3 py-1.5 border border-border hover:border-accent hover:text-accent"
                >
                  {t.status === "new" ? "وضع علامة منتهي" : "إعادة فتح"}
                </button>
                <button
                  onClick={() => remove(t.id)}
                  className="text-muted-foreground hover:text-destructive p-1.5"
                  title="حذف"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="mt-3 text-sm text-foreground whitespace-pre-wrap leading-relaxed border-t border-border pt-3">
              {t.message}
            </p>
          </div>
        ))}
      </div>
    </SectionShell>
  );
};

export default Admin;
