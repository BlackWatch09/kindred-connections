import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Users, BookOpen, HelpCircle, Settings, Shield,
  Database, Megaphone, LogOut, Plus, Trash2, Save, Download, Upload,
  Eye, EyeOff, Lock, Sparkles, TrendingUp, Bell, Palette,
} from "lucide-react";
import { toast } from "sonner";
import {
  ensureDefaultPassword, verifyPassword, changePassword,
  startSession, isAuthed, endSession,
} from "@/lib/adminAuth";
import { content, type Teacher, type Course, type FAQItem, type Announcement } from "@/lib/siteContent";
import logo from "@/assets/lugha-logo.png";

type Section = "overview" | "teachers" | "courses" | "faqs" | "announcements" | "settings" | "security" | "backup";

const Admin = () => {
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
    if (ok) { startSession(); setAuthed(true); setPw(""); toast.success("مرحباً في لوحة التحكم"); }
    else toast.error("كلمة السر غير صحيحة");
  };

  const handleLogout = () => { endSession(); setAuthed(false); navigate("/"); };

  if (!authed) return <LoginGate pw={pw} setPw={setPw} showPw={showPw} setShowPw={setShowPw} onSubmit={handleLogin} loading={loading} />;

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar section={section} setSection={setSection} onLogout={handleLogout} />
      <div className="flex-1 min-w-0">
        <TopBar section={section} data={data} />
        <div className="p-6 md:p-10 max-w-6xl">
          {section === "overview" && <Overview data={data} setSection={setSection} />}
          {section === "teachers" && <TeachersManager data={data} setData={setData} />}
          {section === "courses" && <CoursesManager data={data} setData={setData} />}
          {section === "faqs" && <FAQManager data={data} setData={setData} />}
          {section === "announcements" && <AnnouncementsManager data={data} setData={setData} />}
          {section === "settings" && <SiteSettingsPanel data={data} setData={setData} />}
          {section === "security" && <SecurityPanel />}
          {section === "backup" && <BackupPanel setData={setData} />}
        </div>
      </div>
    </div>
  );
};

// ==================== LOGIN GATE ====================
const LoginGate = ({ pw, setPw, showPw, setShowPw, onSubmit, loading }: any) => (
  <div className="min-h-screen bg-primary text-primary-foreground flex items-center justify-center px-4 relative overflow-hidden">
    <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{
      backgroundImage: `radial-gradient(circle at 20% 30%, hsl(var(--accent)) 0px, transparent 40%), radial-gradient(circle at 80% 70%, hsl(var(--accent)) 0px, transparent 40%)`,
    }} />
    <div className="relative w-full max-w-md">
      <div className="text-center mb-10">
        <img src={logo} alt="Lugha" className="w-16 h-16 mx-auto mb-4 opacity-90" />
        <p className="text-xs uppercase tracking-[0.4em] text-accent font-semibold mb-3">— Administration —</p>
        <h1 className="font-display text-5xl italic font-semibold tracking-tight">Lugha Atelier</h1>
        <p className="mt-3 text-sm text-primary-foreground/60 font-arabic text-base">لوحة تحكم الموقع</p>
      </div>
      <form onSubmit={onSubmit} className="bg-primary-foreground/5 border border-primary-foreground/15 backdrop-blur-sm p-8">
        <label className="block text-xs uppercase tracking-[0.24em] text-accent font-semibold mb-3">
          <Lock className="w-3.5 h-3.5 inline mr-2" /> Passphrase
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
          {loading ? "..." : "Enter Atelier →"}
        </button>
        <Link to="/" className="block text-center mt-5 text-xs uppercase tracking-widest text-primary-foreground/50 hover:text-accent">
          ← Return to site
        </Link>
      </form>
    </div>
  </div>
);

// ==================== SIDEBAR ====================
const nav: { key: Section; label: string; icon: any }[] = [
  { key: "overview", label: "Overview", icon: LayoutDashboard },
  { key: "teachers", label: "Teachers", icon: Users },
  { key: "courses", label: "Courses", icon: BookOpen },
  { key: "faqs", label: "FAQ", icon: HelpCircle },
  { key: "announcements", label: "Announcements", icon: Megaphone },
  { key: "settings", label: "Site Settings", icon: Settings },
  { key: "security", label: "Security", icon: Shield },
  { key: "backup", label: "Backup & Data", icon: Database },
];

const Sidebar = ({ section, setSection, onLogout }: { section: Section; setSection: (s: Section) => void; onLogout: () => void }) => (
  <aside className="w-64 shrink-0 min-h-screen bg-primary text-primary-foreground p-6 flex flex-col sticky top-0 h-screen">
    <Link to="/" className="flex items-center gap-3 pb-6 border-b border-primary-foreground/10">
      <img src={logo} alt="Lugha" className="w-9 h-9" />
      <div>
        <p className="font-display italic text-xl font-semibold leading-none">Lugha</p>
        <p className="text-[10px] uppercase tracking-[0.28em] text-accent mt-1.5">Atelier</p>
      </div>
    </Link>
    <nav className="flex-1 mt-6 space-y-1">
      {nav.map(({ key, label, icon: Icon }) => (
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
          {label}
        </button>
      ))}
    </nav>
    <button onClick={onLogout} className="mt-6 flex items-center gap-2 px-3 py-2.5 text-sm text-primary-foreground/60 hover:text-destructive border-t border-primary-foreground/10 pt-4">
      <LogOut className="w-4 h-4" /> Sign out
    </button>
  </aside>
);

const TopBar = ({ section, data }: { section: Section; data: any }) => {
  const title = nav.find((n) => n.key === section)?.label ?? "";
  return (
    <div className="border-b border-border bg-card/50 px-6 md:px-10 py-5 flex items-center justify-between sticky top-0 z-10 backdrop-blur-sm">
      <div>
        <p className="text-[11px] uppercase tracking-[0.3em] text-accent font-semibold">— Section —</p>
        <h2 className="font-display text-3xl italic font-semibold text-primary mt-1">{title}</h2>
      </div>
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="hidden md:flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-accent" /> Live edits</span>
        <span>{new Date().toLocaleDateString()}</span>
      </div>
    </div>
  );
};

// ==================== OVERVIEW ====================
const Overview = ({ data, setSection }: any) => {
  const stats = [
    { k: "Teachers", v: data.teachers.length, sub: `${data.teachers.length} active`, jump: "teachers" as Section },
    { k: "Courses", v: data.courses.length, sub: `${data.courses.filter((c: Course) => c.published).length} published`, jump: "courses" as Section },
    { k: "FAQ Entries", v: data.faqs.length, sub: "Public knowledge base", jump: "faqs" as Section },
    { k: "Announcements", v: data.announcements.length, sub: data.settings.maintenanceMode ? "⚠ Maintenance ON" : "Site live", jump: "announcements" as Section },
  ];
  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8">
        <p className="eyebrow">— The House at a glance —</p>
        <h3 className="font-display text-4xl md:text-5xl font-bold text-primary mt-2 leading-tight">
          Welcome back, <span className="italic text-accent">master</span>.
        </h3>
        <p className="mt-3 text-lg text-muted-foreground max-w-xl">Every part of Lugha — teachers, lessons, voice, and settings — under your hand.</p>
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
          <p className="eyebrow">— Quick actions —</p>
          <h4 className="font-display text-2xl font-bold text-primary mt-2 mb-4">Shape the site</h4>
          <div className="space-y-2">
            {[
              { s: "teachers" as Section, l: "Add a new teacher", i: Users },
              { s: "courses" as Section, l: "Publish a course", i: BookOpen },
              { s: "announcements" as Section, l: "Post an announcement", i: Megaphone },
              { s: "settings" as Section, l: "Edit hero & tagline", i: Palette },
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
          <p className="text-[11px] uppercase tracking-[0.28em] text-accent font-semibold">— System health —</p>
          <h4 className="font-display text-2xl italic font-semibold mt-2 mb-4">All rooms in order</h4>
          <ul className="space-y-3 text-sm text-primary-foreground/85">
            <li className="flex items-center justify-between"><span>Content store</span><span className="text-accent">● Healthy</span></li>
            <li className="flex items-center justify-between"><span>Maintenance mode</span><span className={data.settings.maintenanceMode ? "text-destructive" : "text-accent"}>{data.settings.maintenanceMode ? "● ON" : "● OFF"}</span></li>
            <li className="flex items-center justify-between"><span>Announcement bar</span><span className={data.settings.announcementBar ? "text-accent" : "text-primary-foreground/40"}>{data.settings.announcementBar ? "● Visible" : "○ Empty"}</span></li>
            <li className="flex items-center justify-between"><span>Storage backend</span><span className="text-primary-foreground/60">Local (browser)</span></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// ==================== TEACHERS ====================
const TeachersManager = ({ data, setData }: any) => {
  const update = (teachers: Teacher[]) => { const next = { ...data, teachers }; content.save(next); setData(next); };
  const add = () => update([...data.teachers, { id: content.uid(), name: "", title: "", city: "", bio: "" }]);
  const remove = (id: string) => { update(data.teachers.filter((t: Teacher) => t.id !== id)); toast.success("تم الحذف"); };
  const patch = (id: string, f: Partial<Teacher>) => update(data.teachers.map((t: Teacher) => (t.id === id ? { ...t, ...f } : t)));

  return (
    <SectionShell title="Teachers of the House" desc="A small atelier of tutors — add, edit, or dismiss." onAdd={add} addLabel="+ New teacher">
      <div className="grid md:grid-cols-2 gap-4">
        {data.teachers.map((t: Teacher) => (
          <div key={t.id} className="border border-border bg-card p-5 group">
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 bg-primary text-primary-foreground flex items-center justify-center font-display text-xl font-bold">
                {t.name.charAt(0) || "?"}
              </div>
              <button onClick={() => remove(t.id)} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <Field label="Name" value={t.name} onChange={(v) => patch(t.id, { name: v })} />
            <Field label="Title" value={t.title} onChange={(v) => patch(t.id, { title: v })} />
            <Field label="City" value={t.city} onChange={(v) => patch(t.id, { city: v })} />
            <Field label="Bio" value={t.bio} onChange={(v) => patch(t.id, { bio: v })} textarea />
          </div>
        ))}
      </div>
      {data.teachers.length === 0 && <Empty label="No teachers yet. Add the first master." />}
    </SectionShell>
  );
};

// ==================== COURSES ====================
const CoursesManager = ({ data, setData }: any) => {
  const update = (courses: Course[]) => { const next = { ...data, courses }; content.save(next); setData(next); };
  const add = () => update([...data.courses, { id: content.uid(), slug: "new-course", title: "", level: "Beginner", lessons: 1, description: "", published: false }]);
  const remove = (id: string) => { update(data.courses.filter((c: Course) => c.id !== id)); toast.success("تم الحذف"); };
  const patch = (id: string, f: Partial<Course>) => update(data.courses.map((c: Course) => (c.id === id ? { ...c, ...f } : c)));

  return (
    <SectionShell title="Course catalogue" desc="The index of lessons — draft, edit, and publish." onAdd={add} addLabel="+ New course">
      <div className="space-y-3">
        {data.courses.map((c: Course, i: number) => (
          <div key={c.id} className="border border-border bg-card p-5 grid md:grid-cols-12 gap-4 items-start group">
            <div className="md:col-span-1 serif-numeral text-4xl font-bold text-accent">{String(i + 1).padStart(2, "0")}</div>
            <div className="md:col-span-8 space-y-2">
              <Field label="Title" value={c.title} onChange={(v) => patch(c.id, { title: v })} />
              <div className="grid grid-cols-3 gap-2">
                <Field label="Slug" value={c.slug} onChange={(v) => patch(c.id, { slug: v })} />
                <Field label="Level" value={c.level} onChange={(v) => patch(c.id, { level: v })} />
                <Field label="Lessons" value={String(c.lessons)} onChange={(v) => patch(c.id, { lessons: parseInt(v) || 0 })} />
              </div>
              <Field label="Description" value={c.description} onChange={(v) => patch(c.id, { description: v })} textarea />
            </div>
            <div className="md:col-span-3 flex md:flex-col gap-2 items-end md:items-stretch">
              <button
                onClick={() => patch(c.id, { published: !c.published })}
                className={`px-3 py-2 text-xs uppercase tracking-widest font-semibold ${c.published ? "bg-accent text-accent-foreground" : "border border-border text-muted-foreground"}`}
              >
                {c.published ? "● Published" : "○ Draft"}
              </button>
              <button onClick={() => remove(c.id)} className="text-xs text-destructive hover:underline flex items-center gap-1"><Trash2 className="w-3 h-3" /> Delete</button>
            </div>
          </div>
        ))}
      </div>
      {data.courses.length === 0 && <Empty label="No courses. Draft your first." />}
    </SectionShell>
  );
};

// ==================== FAQ ====================
const FAQManager = ({ data, setData }: any) => {
  const update = (faqs: FAQItem[]) => { const next = { ...data, faqs }; content.save(next); setData(next); };
  const add = () => update([...data.faqs, { id: content.uid(), question: "", answer: "", category: "General" }]);
  const remove = (id: string) => update(data.faqs.filter((f: FAQItem) => f.id !== id));
  const patch = (id: string, f: Partial<FAQItem>) => update(data.faqs.map((x: FAQItem) => (x.id === id ? { ...x, ...f } : x)));

  return (
    <SectionShell title="Frequently asked" desc="Answers, ordered like a chapter." onAdd={add} addLabel="+ New question">
      <div className="space-y-3">
        {data.faqs.map((f: FAQItem, i: number) => (
          <div key={f.id} className="border border-border bg-card p-5 group">
            <div className="flex items-start justify-between gap-4">
              <span className="serif-numeral text-2xl font-bold text-accent shrink-0">Q{i + 1}</span>
              <div className="flex-1 space-y-2">
                <Field label="Question" value={f.question} onChange={(v) => patch(f.id, { question: v })} />
                <Field label="Answer" value={f.answer} onChange={(v) => patch(f.id, { answer: v })} textarea />
                <Field label="Category" value={f.category || ""} onChange={(v) => patch(f.id, { category: v })} />
              </div>
              <button onClick={() => remove(f.id)} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
      {data.faqs.length === 0 && <Empty label="No questions yet." />}
    </SectionShell>
  );
};

// ==================== ANNOUNCEMENTS ====================
const AnnouncementsManager = ({ data, setData }: any) => {
  const [msg, setMsg] = useState("");
  const [type, setType] = useState<"info" | "warning" | "success">("info");
  const post = () => {
    if (!msg.trim()) return;
    const next = { ...data, announcements: [{ id: content.uid(), message: msg, type, createdAt: new Date().toISOString() }, ...data.announcements] };
    content.save(next); setData(next); setMsg(""); toast.success("تم النشر");
  };
  const remove = (id: string) => {
    const next = { ...data, announcements: data.announcements.filter((a: Announcement) => a.id !== id) };
    content.save(next); setData(next);
  };
  return (
    <SectionShell title="Announcements" desc="Speak to everyone at once.">
      <div className="border border-border bg-card p-6 mb-6">
        <p className="eyebrow mb-3">— New announcement —</p>
        <textarea value={msg} onChange={(e) => setMsg(e.target.value)} rows={3} placeholder="Write your message…" className="w-full bg-background border border-border p-3 text-sm focus:border-accent outline-none" />
        <div className="flex items-center justify-between mt-3">
          <div className="flex gap-2">
            {(["info", "success", "warning"] as const).map((tt) => (
              <button key={tt} onClick={() => setType(tt)} className={`px-3 py-1.5 text-xs uppercase tracking-wider font-semibold ${type === tt ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground"}`}>{tt}</button>
            ))}
          </div>
          <button onClick={post} className="bg-accent text-accent-foreground px-5 py-2 text-xs font-bold uppercase tracking-widest flex items-center gap-2"><Bell className="w-3.5 h-3.5" /> Post</button>
        </div>
      </div>
      <div className="space-y-2">
        {data.announcements.map((a: Announcement) => (
          <div key={a.id} className={`border-l-4 p-4 bg-card border border-border flex items-start justify-between gap-4 ${a.type === "warning" ? "border-l-destructive" : a.type === "success" ? "border-l-accent" : "border-l-primary"}`}>
            <div className="flex-1">
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">{a.type} · {new Date(a.createdAt).toLocaleString()}</span>
              <p className="text-sm text-foreground mt-1">{a.message}</p>
            </div>
            <button onClick={() => remove(a.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
        {data.announcements.length === 0 && <Empty label="Silence. No announcements posted." />}
      </div>
    </SectionShell>
  );
};

// ==================== SITE SETTINGS ====================
const SiteSettingsPanel = ({ data, setData }: any) => {
  const [s, setS] = useState(data.settings);
  useEffect(() => setS(data.settings), [data.settings]);
  const save = () => { const next = { ...data, settings: s }; content.save(next); setData(next); toast.success("تم الحفظ"); };
  const patch = (f: any) => setS({ ...s, ...f });
  return (
    <SectionShell title="Site settings" desc="Voice, colour, and posture of Lugha.">
      <div className="space-y-6 max-w-3xl">
        <Card title="Identity">
          <Field label="Site name" value={s.siteName} onChange={(v) => patch({ siteName: v })} />
          <Field label="Tagline" value={s.tagline} onChange={(v) => patch({ tagline: v })} />
        </Card>
        <Card title="Hero">
          <Field label="Hero title" value={s.heroTitle} onChange={(v) => patch({ heroTitle: v })} />
          <Field label="Hero description" value={s.heroDescription} onChange={(v) => patch({ heroDescription: v })} textarea />
        </Card>
        <Card title="Palette (HSL — h s% l%)">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Field label="Primary" value={s.primaryColor} onChange={(v) => patch({ primaryColor: v })} />
              <div className="h-8 mt-1" style={{ background: `hsl(${s.primaryColor})` }} />
            </div>
            <div>
              <Field label="Accent" value={s.accentColor} onChange={(v) => patch({ accentColor: v })} />
              <div className="h-8 mt-1" style={{ background: `hsl(${s.accentColor})` }} />
            </div>
          </div>
        </Card>
        <Card title="Contact & Social">
          <Field label="Contact email" value={s.contactEmail} onChange={(v) => patch({ contactEmail: v })} />
          <Field label="Twitter" value={s.socialTwitter} onChange={(v) => patch({ socialTwitter: v })} />
          <Field label="Instagram" value={s.socialInstagram} onChange={(v) => patch({ socialInstagram: v })} />
        </Card>
        <Card title="Public">
          <Field label="Announcement bar (empty to hide)" value={s.announcementBar} onChange={(v) => patch({ announcementBar: v })} />
          <label className="flex items-center gap-3 mt-3 text-sm">
            <input type="checkbox" checked={s.maintenanceMode} onChange={(e) => patch({ maintenanceMode: e.target.checked })} className="w-4 h-4 accent-primary" />
            Maintenance mode (hide site from public)
          </label>
        </Card>
        <button onClick={save} className="bg-primary text-primary-foreground px-8 py-3 text-sm font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-emerald transition-colors"><Save className="w-4 h-4" /> Save settings</button>
      </div>
    </SectionShell>
  );
};

// ==================== SECURITY ====================
const SecurityPanel = () => {
  const [cur, setCur] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (next !== confirm) return toast.error("كلمتا السر الجديدتان غير متطابقتين");
    if (next.length < 6) return toast.error("كلمة السر يجب أن تكون 6 أحرف على الأقل");
    setBusy(true);
    const ok = await changePassword(cur, next);
    setBusy(false);
    if (ok) { toast.success("تم تغيير كلمة السر"); setCur(""); setNext(""); setConfirm(""); }
    else toast.error("كلمة السر الحالية غير صحيحة");
  };

  return (
    <SectionShell title="Security" desc="Change the atelier passphrase.">
      <form onSubmit={handle} className="max-w-md border border-border bg-card p-6 space-y-4">
        <Field label="Current passphrase" value={cur} onChange={setCur} type="password" />
        <Field label="New passphrase" value={next} onChange={setNext} type="password" />
        <Field label="Confirm new passphrase" value={confirm} onChange={setConfirm} type="password" />
        <button disabled={busy} className="bg-primary text-primary-foreground w-full py-3 text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-emerald disabled:opacity-50">
          <Shield className="w-4 h-4" /> Update passphrase
        </button>
        <p className="text-xs text-muted-foreground">The passphrase is stored as a SHA-256 hash in this browser. Clearing browser data resets it to the default.</p>
      </form>
    </SectionShell>
  );
};

// ==================== BACKUP ====================
const BackupPanel = ({ setData }: { setData: any }) => {
  const exportNow = () => {
    const blob = new Blob([content.export()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `lugha-backup-${new Date().toISOString().slice(0, 10)}.json`; a.click();
    URL.revokeObjectURL(url);
    toast.success("تم التصدير");
  };
  const importFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      const ok = content.import(String(r.result));
      if (ok) { setData(content.getAll()); toast.success("تم الاستيراد"); }
      else toast.error("ملف غير صالح");
    };
    r.readAsText(f);
  };
  const reset = () => {
    if (!confirm("Reset all content to defaults? This cannot be undone.")) return;
    content.reset(); setData(content.getAll()); toast.success("تمت الاستعادة");
  };
  return (
    <SectionShell title="Backup & data" desc="Export, import, or reset the entire site content.">
      <div className="grid md:grid-cols-3 gap-4 max-w-4xl">
        <button onClick={exportNow} className="border border-border bg-card p-6 text-left hover:border-accent transition-colors group">
          <Download className="w-8 h-8 text-accent mb-3" />
          <h4 className="font-display text-xl font-bold text-primary group-hover:text-accent">Export JSON</h4>
          <p className="text-xs text-muted-foreground mt-2">Download every teacher, course, FAQ, and setting.</p>
        </button>
        <label className="border border-border bg-card p-6 text-left hover:border-accent transition-colors group cursor-pointer">
          <Upload className="w-8 h-8 text-accent mb-3" />
          <h4 className="font-display text-xl font-bold text-primary group-hover:text-accent">Import JSON</h4>
          <p className="text-xs text-muted-foreground mt-2">Restore from a previous backup.</p>
          <input type="file" accept="application/json" onChange={importFile} className="hidden" />
        </label>
        <button onClick={reset} className="border border-destructive/40 bg-card p-6 text-left hover:border-destructive transition-colors group">
          <Trash2 className="w-8 h-8 text-destructive mb-3" />
          <h4 className="font-display text-xl font-bold text-destructive">Reset all</h4>
          <p className="text-xs text-muted-foreground mt-2">Return every section to factory defaults.</p>
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

export default Admin;
