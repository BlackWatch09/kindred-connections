import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { BookOpen, Star, Trophy, ArrowRight } from "lucide-react";
import logo from "@/assets/logo.png";
import WhyArabicSection from "@/components/WhyArabicSection";
import FAQSection from "@/components/FAQSection";

const Index = () => {
  const { t } = useLanguage();

  const features = [
    { icon: BookOpen, title: "Structured Courses", desc: "Beginner to advanced paths" },
    { icon: Star, title: "Interactive Quizzes", desc: "Test your knowledge" },
    { icon: Trophy, title: "Track Progress", desc: "Achievements & streaks" },
  ];

  const featuredCourses = [
    { level: t("courses.beginner"), desc: t("courses.beginner.desc"), lessons: 12, color: "from-emerald-500 to-emerald-600" },
    { level: t("courses.intermediate"), desc: t("courses.intermediate.desc"), lessons: 18, color: "from-blue-500 to-blue-600" },
    { level: t("courses.advanced"), desc: t("courses.advanced.desc"), lessons: 24, color: "from-purple-500 to-purple-600" },
  ];

  return (
    <div className="relative z-10">
      {/* Hero */}
      <section className="min-h-[80vh] flex items-center justify-center px-4 py-20">
        <div className="text-center max-w-3xl mx-auto" style={{ animation: "fade-in-up 0.8s ease-out" }}>
          <img src={logo} alt="AlifXpert" className="w-28 h-28 mx-auto mb-6 object-contain" />
          <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-4">
            {t("hero.title")}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto">
            {t("hero.subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl gradient-gold text-accent-foreground font-semibold text-lg hover:opacity-90 transition-opacity shadow-lg"
            >
              {t("hero.cta")} <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/placement-test"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl border-2 border-foreground text-foreground font-semibold text-lg hover:bg-foreground hover:text-background transition-colors"
            >
              {t("hero.placement")}
            </Link>
          </div>
        </div>
      </section>

      {/* Why Arabic is Special */}
      <WhyArabicSection />

      {/* Features */}
      <section className="py-16 px-4">
        <div className="container mx-auto grid md:grid-cols-3 gap-8 max-w-4xl">
          {features.map((f, i) => (
            <div
              key={i}
              className="text-center p-6 rounded-2xl bg-card border border-border hover:shadow-lg transition-shadow"
              style={{ animation: `fade-in-up 0.6s ease-out ${i * 0.15}s both` }}
            >
              <div className="inline-flex p-3 rounded-xl gradient-gold mb-4">
                <f.icon className="w-6 h-6 text-accent-foreground" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">{f.title}</h3>
              <p className="text-muted-foreground text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-16 px-4 bg-secondary/50">
        <div className="container mx-auto max-w-5xl">
          <h2 className="font-display text-3xl font-bold text-center text-foreground mb-2">
            {t("featured.title")}
          </h2>
          <p className="text-center text-muted-foreground mb-10">{t("featured.subtitle")}</p>
          <div className="grid md:grid-cols-3 gap-6">
            {featuredCourses.map((c, i) => (
              <div
                key={i}
                className="rounded-2xl bg-card border border-border overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1"
                style={{ animation: `fade-in-up 0.6s ease-out ${i * 0.15}s both` }}
              >
                <div className={`h-2 bg-gradient-to-r ${c.color}`} />
                <div className="p-6">
                  <span className="text-xs font-semibold uppercase tracking-wider text-accent">{c.level}</span>
                  <p className="text-muted-foreground text-sm mt-2 mb-4">{c.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{c.lessons} {t("courses.lessons")}</span>
                    <Link to="/courses" className="text-sm font-semibold text-accent hover:underline">
                      {t("courses.start")} →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Teachers Highlight */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-card border border-border rounded-2xl p-8 md:p-10">
            <div className="flex flex-col md:flex-row md:items-center gap-8">
              <div className="flex-1">
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3">
                  {t("home.teachers.title")}
                </h2>
                <p className="text-muted-foreground mb-5">{t("home.teachers.desc")}</p>
                <Link
                  to="/teachers"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl gradient-gold text-accent-foreground font-semibold hover:opacity-90 transition-opacity shadow-md"
                >
                  {t("home.teachers.cta")} <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
              <div className="flex gap-3 shrink-0">
                {[
                  { name: "Fatima Al-Zahra", spec: "Grammar" },
                  { name: "Omar Hassan", spec: "Conversation" },
                  { name: "Leyla Yilmaz", spec: "Tajweed" },
                ].map((teacher, i) => (
                  <div
                    key={i}
                    className="bg-secondary rounded-xl p-3 text-center w-24 hover:shadow-md transition-shadow"
                    style={{ animation: `fade-in-up 0.5s ease-out ${i * 0.1}s both` }}
                  >
                    <div className="w-12 h-12 rounded-full gradient-gold mx-auto mb-2 flex items-center justify-center text-accent-foreground font-bold text-lg">
                      {teacher.name[0]}
                    </div>
                    <p className="text-xs font-semibold text-foreground truncate">{teacher.name.split(" ")[0]}</p>
                    <p className="text-[10px] text-muted-foreground">{teacher.spec}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQSection />

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold text-foreground mb-4">
            Ready to master Arabic?
          </h2>
          <p className="text-muted-foreground mb-8">
            Join thousands of learners on their journey to fluency.
          </p>
          <Link
            to="/login?mode=signup"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl gradient-gold text-accent-foreground font-semibold text-lg hover:opacity-90 transition-opacity shadow-lg"
          >
            {t("login.create")} <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
