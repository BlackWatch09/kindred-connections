import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import heroImg from "@/assets/lugha-hero.jpg";
import manuscriptImg from "@/assets/lugha-manuscript.jpg";
import WhyArabicSection from "@/components/WhyArabicSection";

const Index = () => {
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
      {/* ============ HERO ============ */}
      <section className="border-b border-border">
        <div className="container mx-auto px-4 pt-10 md:pt-14 pb-12 md:pb-16 grid md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7" style={{ animation: "fade-in-up 0.9s ease-out" }}>
            <h1 className="font-display text-[11vw] md:text-7xl leading-[0.95] font-bold text-primary tracking-[-0.03em]">
              Learn <span className="italic font-normal text-accent">Arabic</span><br />
              as an art.
            </h1>
            <p className="mt-6 text-base md:text-lg text-foreground/75 max-w-xl leading-relaxed">
              Lugha is a modern school for the Arabic language — structured courses,
              immersive stories, and teachers who make you speak from day one.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/courses"
                className="group inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 text-sm font-semibold uppercase tracking-[0.16em] hover:bg-emerald transition-colors"
              >
                Begin
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/placement-test"
                className="inline-flex items-center gap-2 border border-primary text-primary px-6 py-3 text-sm font-semibold uppercase tracking-[0.16em] hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                Placement
              </Link>
            </div>

            <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-border pt-5 max-w-md">
              <div>
                <dt className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Lessons</dt>
                <dd className="serif-numeral text-2xl font-bold text-primary mt-1">200+</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Teachers</dt>
                <dd className="serif-numeral text-2xl font-bold text-primary mt-1">18</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Cities</dt>
                <dd className="serif-numeral text-2xl font-bold text-primary mt-1">07</dd>
              </div>
            </dl>
          </div>

          <div className="md:col-span-5 relative" style={{ animation: "fade-in-up 1.1s ease-out" }}>
            <div className="relative aspect-[4/5] overflow-hidden">
              <img
                src={heroImg}
                alt="Arabic language learning notebook with fountain pen"
                className="w-full h-full object-cover"
                width={1024}
                height={1280}
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-primary/10" />
            </div>
          </div>
        </div>
      </section>

      {/* ============ THE THREE PILLARS ============ */}
      <section className="container mx-auto px-4 py-14 md:py-20">
        <div className="grid md:grid-cols-12 gap-6 mb-10">
          <div className="md:col-span-5">
            <span className="eyebrow">The House —</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary mt-3 leading-[1.05]">
              Three rooms, one language.
            </h2>
          </div>
          <p className="md:col-span-6 md:col-start-7 text-base md:text-lg text-foreground/75 leading-relaxed self-end">
            Enter through any door — the study room, the speaking room, or one-to-one lessons with a teacher.
          </p>
        </div>

        <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border border-y border-border">
          {pillars.map((p, i) => (
            <div key={p.k} className="p-6 md:p-8 group hover:bg-secondary/50 transition-colors" style={{ animation: `fade-in-up 0.6s ease-out ${i * 0.1}s both` }}>
              <div className="flex items-baseline justify-between mb-4">
                <span className="serif-numeral text-4xl font-bold text-accent">{p.k}</span>
                <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:-translate-y-1 group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="font-display text-xl font-bold text-primary mb-2">{p.t}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{p.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============ FEATURED CHAPTER ============ */}
      <section className="border-y border-border bg-secondary/40">
        <div className="container mx-auto px-4 py-14 md:py-20 grid md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-5">
            <img
              src={manuscriptImg}
              alt="Arabic learning materials flat lay"
              className="w-full aspect-[4/3] object-cover"
              width={1024}
              height={768}
              loading="lazy"
            />
          </div>
          <div className="md:col-span-6 md:col-start-7">
            <span className="eyebrow">Featured Chapter —</span>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-primary leading-[1] mt-3">
              How to read a <span className="italic font-normal text-accent">single word</span> slowly.
            </h2>
            <p className="text-base md:text-lg text-foreground/75 mt-4 leading-relaxed max-w-xl">
              An essay-lesson on the word <span className="font-arabic text-2xl text-primary">كتاب</span> — book —
              and everything held inside it. Root, form, family.
            </p>
            <Link
              to="/learn"
              className="inline-flex items-center gap-2 mt-6 text-primary font-semibold text-sm uppercase tracking-[0.18em] hover:text-accent transition-colors w-fit border-b-2 border-primary hover:border-accent pb-1"
            >
              Read the chapter <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ============ DISPATCHES ============ */}
      <section className="container mx-auto px-4 py-14 md:py-20">
        <div className="hairline pb-5 mb-8 flex items-end justify-between">
          <div>
            <span className="eyebrow">Index of Lessons —</span>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-primary mt-2">The current curriculum</h2>
          </div>
          <Link to="/courses" className="text-xs uppercase tracking-[0.18em] text-primary hover:text-accent border-b border-primary hover:border-accent pb-0.5 font-semibold">
            All courses
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-x-8 gap-y-10">
          {dispatches.map((d, i) => (
            <Link
              key={d.no}
              to={d.href}
              className="group block"
              style={{ animation: `fade-in-up 0.6s ease-out ${i * 0.1}s both` }}
            >
              <div className="flex items-baseline justify-between mb-2 text-xs uppercase tracking-[0.22em]">
                <span className="text-accent font-semibold">{d.no}</span>
                <span className="text-muted-foreground">{d.kind}</span>
              </div>
              <div className="h-px w-full bg-primary mb-4" />
              <h3 className="font-display text-xl md:text-2xl font-bold text-primary leading-[1.15] group-hover:text-accent transition-colors">
                {d.title}
              </h3>
              <p className="text-sm text-foreground/70 mt-3 leading-relaxed">{d.lead}</p>
            </Link>
          ))}
        </div>
      </section>

      <WhyArabicSection />

      {/* ============ CLOSING ============ */}
      <section className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-16 md:py-20 text-center">
          <h2 className="font-display text-3xl md:text-5xl font-bold leading-[1] max-w-3xl mx-auto tracking-tight">
            A language deserves <span className="italic font-normal text-accent">a beautiful place</span> to be learned in.
          </h2>
          <Link
            to="/login?mode=signup"
            className="inline-flex items-center gap-3 mt-8 bg-accent text-accent-foreground px-8 py-4 text-sm font-bold uppercase tracking-[0.18em] hover:opacity-90 transition-opacity"
          >
            Enter Lugha <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
