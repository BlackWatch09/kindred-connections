import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import logo from "@/assets/lugha-logo.png";
import heroImg from "@/assets/lugha-hero.jpg";
import patternImg from "@/assets/lugha-pattern.jpg";
import manuscriptImg from "@/assets/lugha-manuscript.jpg";
import WhyArabicSection from "@/components/WhyArabicSection";
import FAQSection from "@/components/FAQSection";

const Index = () => {
  const { t } = useLanguage();

  const dispatches = [
    {
      no: "N° 01",
      kind: "Foundations",
      title: "The Alphabet, unhurried",
      lead: "Twenty-eight letters, learned as one learns a face — by returning until it becomes familiar.",
      href: "/course/alphabet",
    },
    {
      no: "N° 02",
      kind: "Conversation",
      title: "Greetings that carry weight",
      lead: "Salām is not hello. It is a wish, given and received. Begin the lexicon of everyday grace.",
      href: "/course/greetings",
    },
    {
      no: "N° 03",
      kind: "Numeracy",
      title: "Numerals of the market",
      lead: "The digits the world writes with — Arabic in origin — restored to the tongue that named them.",
      href: "/course/numbers",
    },
  ];

  const pillars = [
    { k: "01", t: "Study", d: "Structured curricula from the letter Alif to literary Arabic, paced for return, not rush." },
    { k: "02", t: "Voice", d: "Immersive story-worlds where you speak with characters and are gently corrected." },
    { k: "03", t: "Teachers", d: "A small house of tutors from Damascus, Cairo, Istanbul — booked one-to-one." },
  ];

  return (
    <div className="relative z-10">
      {/* ============ MASTHEAD ============ */}
      <section className="border-b border-border">
        <div className="container mx-auto px-4 pt-10 pb-6">
          <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
            <span>Volume I · Issue 001</span>
            <span className="hidden md:inline">The Craft of Arabic — A Quiet Manual</span>
            <span>{new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })}</span>
          </div>
        </div>

        {/* Hero split */}
        <div className="container mx-auto px-4 pb-20 grid md:grid-cols-12 gap-8 items-end">
          <div className="md:col-span-7" style={{ animation: "fade-in-up 0.9s ease-out" }}>
            <span className="eyebrow">The Lugha Manual —</span>
            <h1 className="font-display text-[13vw] md:text-[9rem] leading-[0.9] font-bold text-primary mt-4 tracking-[-0.04em]">
              Learn <span className="italic font-normal text-accent">Arabic</span><br />
              as an art.
            </h1>
            <div className="mt-8 flex items-start gap-6">
              <span className="rule-gold mt-3 shrink-0" />
              <p className="text-lg md:text-xl text-foreground/75 max-w-xl leading-relaxed">
                Lugha is a slow, editorial school for the Arabic language — courses laid out like chapters,
                teachers who speak as masters, and stories that teach you to answer back.
              </p>
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                to="/courses"
                className="group inline-flex items-center gap-3 bg-primary text-primary-foreground px-7 py-4 text-sm font-semibold uppercase tracking-[0.18em] hover:bg-emerald transition-colors"
              >
                Begin reading
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/placement-test"
                className="inline-flex items-center gap-3 border border-primary text-primary px-7 py-4 text-sm font-semibold uppercase tracking-[0.18em] hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                Placement
              </Link>
            </div>

            <dl className="mt-14 grid grid-cols-3 gap-6 border-t border-border pt-6 max-w-lg">
              <div>
                <dt className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Lessons</dt>
                <dd className="serif-numeral text-3xl font-bold text-primary mt-1">200+</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Teachers</dt>
                <dd className="serif-numeral text-3xl font-bold text-primary mt-1">18</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Cities</dt>
                <dd className="serif-numeral text-3xl font-bold text-primary mt-1">07</dd>
              </div>
            </dl>
          </div>

          <div className="md:col-span-5 relative" style={{ animation: "fade-in-up 1.1s ease-out" }}>
            <div className="relative aspect-[4/5] overflow-hidden">
              <img
                src={heroImg}
                alt="An Arabic manuscript at the window"
                className="w-full h-full object-cover"
                width={1600}
                height={1200}
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-primary/10" />
              <div className="absolute top-4 left-4 bg-ivory/95 backdrop-blur px-3 py-1.5 text-[10px] uppercase tracking-[0.28em] text-primary">
                Plate I
              </div>
            </div>
            <p className="mt-3 text-xs text-muted-foreground italic max-w-xs leading-relaxed">
              A page from an early primer — the letters, patient at the window.
            </p>
          </div>
        </div>
      </section>

      {/* ============ MARQUEE / CREED ============ */}
      <section className="bg-primary text-primary-foreground overflow-hidden py-6 border-y border-accent/30">
        <div className="flex whitespace-nowrap animate-[marquee_40s_linear_infinite]">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-center gap-10 pr-10">
              {["Read", "Listen", "Speak", "Write", "Return", "لُغة", "Read", "Listen", "Speak", "Write"].map((w, j) => (
                <span key={j} className="font-display text-4xl md:text-6xl font-bold tracking-tight">
                  {w}
                  <span className="text-accent mx-6">·</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ============ THE THREE PILLARS ============ */}
      <section className="container mx-auto px-4 py-24">
        <div className="grid md:grid-cols-12 gap-8 mb-14">
          <div className="md:col-span-4">
            <span className="eyebrow">The House —</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-primary mt-4 leading-[1.05]">
              Three rooms,<br /> one language.
            </h2>
          </div>
          <p className="md:col-span-7 md:col-start-6 text-lg text-foreground/75 leading-relaxed self-end">
            Lugha is built like a house of study, not a stream of content. You may enter through any door —
            the manuscript room, the speaking room, or the master's parlour. Most learners come to know all three.
          </p>
        </div>

        <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border border-y border-border">
          {pillars.map((p, i) => (
            <div key={p.k} className="p-8 md:p-10 group hover:bg-secondary/50 transition-colors" style={{ animation: `fade-in-up 0.6s ease-out ${i * 0.12}s both` }}>
              <div className="flex items-baseline justify-between mb-6">
                <span className="serif-numeral text-5xl font-bold text-accent">{p.k}</span>
                <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:-translate-y-1 group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="font-display text-2xl font-bold text-primary mb-3">{p.t}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{p.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============ FEATURED DISPATCH ============ */}
      <section className="border-y border-border bg-secondary/40">
        <div className="container mx-auto px-4 py-24 grid md:grid-cols-12 gap-10">
          <div className="md:col-span-5 relative">
            <img
              src={manuscriptImg}
              alt="Arabic manuscript pages"
              className="w-full aspect-[4/3] object-cover"
              width={1400}
              height={1000}
              loading="lazy"
            />
            <div className="absolute -bottom-4 -right-4 bg-accent text-accent-foreground px-4 py-2 text-[10px] uppercase tracking-[0.28em] font-semibold shadow-lg">
              Feature — 12 min read
            </div>
          </div>
          <div className="md:col-span-6 md:col-start-7 flex flex-col justify-center">
            <span className="eyebrow">Featured Chapter —</span>
            <h2 className="font-display text-4xl md:text-6xl font-bold text-primary leading-[1] mt-4">
              How to read a<br />
              <span className="italic font-normal text-accent">single word</span> slowly.
            </h2>
            <p className="text-lg text-foreground/75 mt-6 leading-relaxed max-w-xl">
              An essay-lesson on the word <span className="font-arabic text-2xl text-primary">كتاب</span> — book —
              and everything held inside it. Root, form, family, and the quiet grammar of learning
              one thing at a time.
            </p>
            <Link
              to="/learn"
              className="inline-flex items-center gap-2 mt-8 text-primary font-semibold text-sm uppercase tracking-[0.2em] hover:text-accent transition-colors w-fit border-b-2 border-primary hover:border-accent pb-1"
            >
              Read the chapter <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ============ DISPATCHES / COURSE INDEX ============ */}
      <section className="container mx-auto px-4 py-24">
        <div className="hairline pb-6 mb-10 flex items-end justify-between">
          <div>
            <span className="eyebrow">Index of Lessons —</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary mt-3">The current curriculum</h2>
          </div>
          <Link to="/courses" className="text-xs uppercase tracking-[0.2em] text-primary hover:text-accent border-b border-primary hover:border-accent pb-0.5 font-semibold">
            All courses
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-x-8 gap-y-14">
          {dispatches.map((d, i) => (
            <Link
              key={d.no}
              to={d.href}
              className="group block"
              style={{ animation: `fade-in-up 0.6s ease-out ${i * 0.12}s both` }}
            >
              <div className="flex items-baseline justify-between mb-3 text-xs uppercase tracking-[0.24em]">
                <span className="text-accent font-semibold">{d.no}</span>
                <span className="text-muted-foreground">{d.kind}</span>
              </div>
              <div className="h-px w-full bg-primary mb-5" />
              <h3 className="font-display text-2xl md:text-3xl font-bold text-primary leading-[1.1] group-hover:text-accent transition-colors">
                {d.title}
              </h3>
              <p className="text-sm text-foreground/70 mt-4 leading-relaxed">{d.lead}</p>
              <span className="inline-flex items-center gap-1 mt-5 text-xs uppercase tracking-[0.2em] text-primary group-hover:gap-2 transition-all">
                Read <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ============ WHY ARABIC (kept) ============ */}
      <WhyArabicSection />

      {/* ============ TEACHERS PARLOUR ============ */}
      <section className="container mx-auto px-4 py-24">
        <div className="grid md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-5 relative">
            <img
              src={patternImg}
              alt="Andalusian geometric star"
              className="w-full aspect-square object-cover"
              width={1200}
              height={1024}
              loading="lazy"
            />
          </div>
          <div className="md:col-span-6 md:col-start-7">
            <span className="eyebrow">The Parlour —</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-primary leading-[1.05] mt-4">
              {t("home.teachers.title")}
            </h2>
            <p className="text-lg text-foreground/75 mt-6 leading-relaxed">
              {t("home.teachers.desc")}
            </p>

            <ul className="mt-8 divide-y divide-border border-y border-border">
              {[
                { name: "Fatima Al-Zahra", city: "Damascus", spec: "Classical grammar" },
                { name: "Omar Hassan", city: "Cairo", spec: "Everyday conversation" },
                { name: "Leyla Yılmaz", city: "Istanbul", spec: "Tajwīd & recitation" },
              ].map((teach) => (
                <li key={teach.name} className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-4">
                    <span className="w-10 h-10 bg-primary text-primary-foreground flex items-center justify-center font-display font-bold">
                      {teach.name[0]}
                    </span>
                    <div>
                      <p className="font-display font-semibold text-primary">{teach.name}</p>
                      <p className="text-xs text-muted-foreground">{teach.city} · {teach.spec}</p>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
                </li>
              ))}
            </ul>

            <Link
              to="/teachers"
              className="inline-flex items-center gap-3 mt-8 bg-primary text-primary-foreground px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] hover:bg-emerald transition-colors"
            >
              Meet the house <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQSection />

      {/* ============ CLOSING PLATE ============ */}
      <section className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-28 text-center">
          <img src={logo} alt="" className="w-16 h-16 mx-auto mb-8 opacity-90 brightness-0 invert" />
          <span className="eyebrow text-accent">Colophon —</span>
          <h2 className="font-display text-5xl md:text-7xl font-bold mt-6 leading-[0.95] max-w-4xl mx-auto tracking-tight">
            A language deserves<br />
            <span className="italic font-normal text-accent">a beautiful room</span> to be learned in.
          </h2>
          <p className="text-primary-foreground/70 mt-8 max-w-lg mx-auto text-lg leading-relaxed">
            Open the first chapter today. There is no hurry — only return.
          </p>
          <Link
            to="/login?mode=signup"
            className="inline-flex items-center gap-3 mt-12 bg-accent text-accent-foreground px-10 py-5 text-sm font-bold uppercase tracking-[0.2em] hover:opacity-90 transition-opacity"
          >
            Enter Lugha <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
