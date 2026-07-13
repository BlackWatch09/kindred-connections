import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import {
  Trophy, Flame, Star, BookOpen, CheckCircle, ArrowRight, Play, RotateCcw,
  Target, TrendingUp, Award, Bell, Download, Settings, Lock, FileText,
  Gamepad2, Headphones, PenTool, BookMarked, Globe, ToggleLeft
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

const Dashboard = () => {
  const { t, language } = useLanguage();

  // Placeholder user data
  const userName = "Ahmed";
  const currentLevel = t("courses.beginner");

  const statCards = [
    { icon: Target, label: t("dashboard.overallProgress"), value: "42%", color: "text-accent" },
    { icon: TrendingUp, label: t("dashboard.avgScore"), value: "78%", trend: "up", color: "text-accent" },
    { icon: Flame, label: t("dashboard.learningStreak"), value: "7", sub: t("dashboard.days"), color: "text-destructive" },
    { icon: Award, label: t("dashboard.badgesEarned"), value: "4", sub: t("dashboard.lastBadge") + ": 🔥", color: "text-accent" },
  ];

  const courses = [
    {
      name: t("courses.beginner"),
      progress: 85,
      totalLessons: 12,
      completedLessons: 10,
      latestLesson: "Lesson 10: Basic Sentences",
      nextLesson: "Lesson 11: Numbers",
      score: 82,
      status: "active" as const,
    },
    {
      name: t("courses.intermediate"),
      progress: 30,
      totalLessons: 18,
      completedLessons: 5,
      latestLesson: "Lesson 5: Verb Conjugation",
      nextLesson: "Lesson 6: Past Tense",
      score: 74,
      status: "active" as const,
    },
    {
      name: t("courses.advanced"),
      progress: 0,
      totalLessons: 24,
      completedLessons: 0,
      latestLesson: "-",
      nextLesson: "Lesson 1: Literary Arabic",
      score: 0,
      status: "locked" as const,
      unlockReq: t("dashboard.unlockReq", { course: t("courses.intermediate") }),
    },
  ];

  const recentQuizzes = [
    { name: "Alphabet Quiz", date: "2026-02-10", score: 95, passed: true },
    { name: "Basic Grammar", date: "2026-02-08", score: 82, passed: true },
    { name: "Verb Forms", date: "2026-02-06", score: 60, passed: false },
    { name: "Vocabulary Set 3", date: "2026-02-04", score: 88, passed: true },
  ];

  const skills = [
    { key: "reading", label: t("dashboard.reading"), value: 75, icon: BookOpen },
    { key: "vocabulary", label: t("dashboard.vocabulary"), value: 68, icon: BookMarked },
    { key: "grammar", label: t("dashboard.grammar"), value: 55, icon: FileText },
    { key: "writing", label: t("dashboard.writing"), value: 40, icon: PenTool },
    { key: "listening", label: t("dashboard.listening"), value: 30, icon: Headphones },
  ];

  const notifications = [
    { icon: "📚", text: "New blog article: 'Common Arabic Mistakes'", time: "2h ago" },
    { icon: "🔓", text: "You unlocked Intermediate Lesson 6!", time: "1d ago" },
    { icon: "🏆", text: "Achievement earned: 7-Day Streak!", time: "2d ago" },
  ];

  const weeklyGoal = { target: 3, done: 2 };

  return (
    <div className="relative z-10 py-8 px-4">
      <div className="container mx-auto max-w-6xl">

        {/* Welcome Header */}
        <div
          className="bg-card border border-border rounded-2xl p-6 md:p-8 mb-8"
          style={{ animation: "fade-in-up 0.5s ease-out" }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                {t("dashboard.welcome")}, {userName} 👋
              </h1>
              <p className="text-muted-foreground mt-1">
                {t("dashboard.level")}: <span className="font-semibold text-accent">{currentLevel}</span>
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/learn"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-gold text-accent-foreground font-semibold hover:opacity-90 transition-opacity shadow-md"
              >
                <Play className="w-4 h-4" /> {t("dashboard.continue")}
              </Link>
              <Link
                to="/learn"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border text-foreground font-medium hover:bg-secondary transition-colors"
              >
                <RotateCcw className="w-4 h-4" /> {t("dashboard.placementAgain")}
              </Link>
              <Link
                to="/courses"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border text-foreground font-medium hover:bg-secondary transition-colors"
              >
                <BookOpen className="w-4 h-4" /> {t("dashboard.browseCourses")}
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((s, i) => (
            <div
              key={i}
              className="bg-card border border-border rounded-xl p-5 text-center hover:shadow-md transition-shadow"
              style={{ animation: `fade-in-up 0.5s ease-out ${i * 0.08}s both` }}
            >
              <s.icon className={`w-6 h-6 ${s.color} mx-auto mb-2`} />
              <p className="text-2xl font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
              {s.sub && <p className="text-xs text-muted-foreground mt-0.5">{s.sub}</p>}
            </div>
          ))}
        </div>

        {/* Course Performance */}
        <section className="mb-8" style={{ animation: "fade-in-up 0.6s ease-out 0.3s both" }}>
          <h2 className="font-display text-2xl font-bold text-foreground mb-4">{t("dashboard.coursePerformance")}</h2>
          <div className="space-y-4">
            {courses.map((c, i) => (
              <div key={i} className={`bg-card border border-border rounded-xl p-5 ${c.status === "locked" ? "opacity-60" : ""}`}>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      {c.status === "locked" && <Lock className="w-4 h-4 text-muted-foreground" />}
                      <h3 className="font-semibold text-foreground text-lg">{c.name}</h3>
                      <span className="text-xs text-muted-foreground">
                        {c.completedLessons}/{c.totalLessons} {t("dashboard.lessonsCompleted")}
                      </span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2.5 mb-3">
                      <div
                        className="h-2.5 rounded-full gradient-gold transition-all"
                        style={{ width: `${c.progress}%` }}
                      />
                    </div>
                    <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-muted-foreground">
                      <span>{t("dashboard.latestLesson")}: {c.latestLesson}</span>
                      <span>{t("dashboard.nextLesson")}: {c.nextLesson}</span>
                      <span>{t("dashboard.courseScore")}: <span className="font-semibold text-foreground">{c.score}%</span></span>
                    </div>
                    {c.unlockReq && (
                      <p className="text-xs text-destructive mt-2 flex items-center gap-1">
                        <Lock className="w-3 h-3" /> {c.unlockReq}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 shrink-0">
                    {c.status === "active" && (
                      <>
                        <Link to="/learn" className="px-4 py-2 rounded-lg gradient-gold text-accent-foreground text-sm font-semibold hover:opacity-90 transition-opacity">
                          {t("dashboard.resume")}
                        </Link>
                        {c.progress > 50 && (
                          <Link to="/courses" className="px-4 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-secondary transition-colors">
                            {t("dashboard.review")}
                          </Link>
                        )}
                      </>
                    )}
                    {c.status === "locked" && (
                      <span className="px-4 py-2 rounded-lg bg-muted text-muted-foreground text-sm font-medium">
                        {t("dashboard.locked")}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Quizzes */}
          <section style={{ animation: "fade-in-up 0.6s ease-out 0.4s both" }}>
            <h2 className="font-display text-xl font-bold text-foreground mb-4">{t("dashboard.recentQuizzes")}</h2>
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground">
                      <th className="text-start p-3 font-medium">{t("dashboard.quizName")}</th>
                      <th className="text-start p-3 font-medium">{t("dashboard.date")}</th>
                      <th className="text-start p-3 font-medium">{t("dashboard.score")}</th>
                      <th className="text-start p-3 font-medium">{t("dashboard.status")}</th>
                      <th className="p-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentQuizzes.map((q, i) => (
                      <tr key={i} className="border-b border-border last:border-0">
                        <td className="p-3 font-medium text-foreground">{q.name}</td>
                        <td className="p-3 text-muted-foreground">{q.date}</td>
                        <td className="p-3 font-semibold text-foreground">{q.score}%</td>
                        <td className="p-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${q.passed ? "bg-accent/20 text-accent-foreground" : "bg-destructive/20 text-destructive"}`}>
                            {q.passed ? t("dashboard.passed") : t("dashboard.needsReview")}
                          </span>
                        </td>
                        <td className="p-3">
                          <button className="text-xs text-accent hover:underline font-medium">
                            {t("dashboard.reviewAnswers")}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Placement Test Result */}
            <div className="bg-card border border-border rounded-xl p-5 mt-4">
              <h3 className="font-semibold text-foreground mb-2">{t("dashboard.placementResult")}</h3>
              <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted-foreground mb-3">
                <span>{t("dashboard.score")}: <span className="font-semibold text-foreground">72%</span></span>
                <span>{t("dashboard.recommendedLevel")}: <span className="font-semibold text-accent">{t("courses.beginner")}</span></span>
                <span>{t("dashboard.dateTaken")}: 2026-01-15</span>
              </div>
              <Link to="/learn" className="text-sm font-semibold text-accent hover:underline inline-flex items-center gap-1">
                <RotateCcw className="w-3.5 h-3.5" /> {t("dashboard.retake")}
              </Link>
            </div>
          </section>

          {/* Skills Breakdown */}
          <section style={{ animation: "fade-in-up 0.6s ease-out 0.45s both" }}>
            <h2 className="font-display text-xl font-bold text-foreground mb-4">{t("dashboard.skills")}</h2>
            <div className="bg-card border border-border rounded-xl p-5 space-y-5">
              {skills.map((s) => (
                <div key={s.key}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-foreground flex items-center gap-2">
                      <s.icon className="w-4 h-4 text-accent" /> {s.label}
                    </span>
                    <span className="text-sm font-semibold text-foreground">{s.value}%</span>
                  </div>
                  <Progress value={s.value} className="h-2.5" />
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Study Plan */}
          <section style={{ animation: "fade-in-up 0.6s ease-out 0.5s both" }}>
            <h2 className="font-display text-xl font-bold text-foreground mb-4">{t("dashboard.studyPlan")}</h2>
            <div className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-foreground">{t("dashboard.weeklyGoal")}</span>
                <span className="text-sm font-semibold text-accent">{weeklyGoal.target} {t("dashboard.lessonsPerWeek")}</span>
              </div>
              <Progress value={(weeklyGoal.done / weeklyGoal.target) * 100} className="h-3 mb-2" />
              <p className="text-xs text-muted-foreground">
                {t("dashboard.goalProgress", { done: String(weeklyGoal.done), total: String(weeklyGoal.target) })}
              </p>
            </div>

            {/* Next Steps */}
            <div className="bg-card border border-border rounded-xl p-5 mt-4">
              <h3 className="font-semibold text-foreground mb-3">{t("dashboard.nextSteps")}</h3>
              <div className="space-y-3">
                <Link to="/learn" className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-secondary transition-colors">
                  <BookOpen className="w-5 h-5 text-accent shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{t("dashboard.nextLessonLabel")}</p>
                    <p className="text-xs text-muted-foreground">Lesson 11: Numbers</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground ms-auto" />
                </Link>
                <Link to="/learn" className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-secondary transition-colors">
                  <CheckCircle className="w-5 h-5 text-accent shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{t("dashboard.recommendedQuiz")}</p>
                    <p className="text-xs text-muted-foreground">Numbers & Counting</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground ms-auto" />
                </Link>
                <Link to="/learn" className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-secondary transition-colors">
                  <Gamepad2 className="w-5 h-5 text-accent shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{t("dashboard.suggestedExercise")}</p>
                    <p className="text-xs text-muted-foreground">Flashcards: Greetings</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground ms-auto" />
                </Link>
              </div>
            </div>
          </section>

          {/* Notifications */}
          <section style={{ animation: "fade-in-up 0.6s ease-out 0.55s both" }}>
            <h2 className="font-display text-xl font-bold text-foreground mb-4">{t("dashboard.notifications")}</h2>
            <div className="bg-card border border-border rounded-xl p-5 space-y-3">
              {notifications.map((n, i) => (
                <div key={i} className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-secondary transition-colors">
                  <span className="text-xl shrink-0">{n.icon}</span>
                  <div className="min-w-0">
                    <p className="text-sm text-foreground">{n.text}</p>
                    <p className="text-xs text-muted-foreground">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Certificate */}
            <div className="bg-card border border-border rounded-xl p-5 mt-4 text-center">
              <Trophy className="w-8 h-8 text-accent mx-auto mb-2" />
              <h3 className="font-semibold text-foreground mb-1">{t("dashboard.courseComplete")}</h3>
              <p className="text-xs text-muted-foreground mb-3">Beginner Level — Completed</p>
              <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg gradient-gold text-accent-foreground text-sm font-semibold hover:opacity-90 transition-opacity">
                <Download className="w-4 h-4" /> {t("dashboard.downloadCert")}
              </button>
            </div>
          </section>

          {/* Quick Settings */}
          <section style={{ animation: "fade-in-up 0.6s ease-out 0.6s both" }}>
            <h2 className="font-display text-xl font-bold text-foreground mb-4">{t("dashboard.profileSettings")}</h2>
            <div className="bg-card border border-border rounded-xl p-5 space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground flex items-center gap-2 mb-2">
                  <Globe className="w-4 h-4 text-accent" /> {t("dashboard.preferredLang")}
                </label>
                <div className="flex gap-2">
                  {(["en", "ar", "tr"] as const).map((lang) => (
                    <button
                      key={lang}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${language === lang ? "gradient-gold text-accent-foreground" : "bg-secondary text-foreground hover:bg-muted"}`}
                    >
                      {lang === "en" ? "English" : lang === "ar" ? "العربية" : "Türkçe"}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <ToggleLeft className="w-4 h-4 text-accent" /> {t("dashboard.autoTranslate")}
                </label>
                <div className="w-10 h-5 bg-accent rounded-full relative cursor-pointer">
                  <div className="absolute top-0.5 end-0.5 w-4 h-4 bg-accent-foreground rounded-full" />
                </div>
              </div>
            </div>

            {/* Achievements Grid */}
            <div className="mt-4">
              <h3 className="font-semibold text-foreground mb-3">{t("dashboard.achievements")}</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: "🎯", title: "First Quiz" },
                  { icon: "🔥", title: "7-Day Streak" },
                  { icon: "📚", title: "Alphabet Master" },
                  { icon: "⭐", title: "1000 Points" },
                ].map((a, i) => (
                  <div key={i} className="bg-card border border-border rounded-xl p-3 text-center hover:shadow-md transition-shadow">
                    <span className="text-2xl">{a.icon}</span>
                    <p className="font-medium text-foreground text-xs mt-1">{a.title}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
