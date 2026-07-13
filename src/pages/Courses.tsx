import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { BookOpen, CheckCircle2, MessagesSquare, ArrowLeft, Sparkles } from "lucide-react";
import { slugify } from "@/pages/CoursePage";

const courses = [
  {
    level: "beginner" as const,
    lessons: [
      "Arabic Alphabet (أ ب ت)",
      "Basic Greetings",
      "Numbers 1-20",
      "Simple Sentences",
      "Common Nouns",
      "Colors & Shapes",
      "Family Vocabulary",
      "Days & Months",
      "Food & Drink",
      "Basic Verbs",
      "Pronouns",
      "Review & Test",
    ],
    gradient: "from-emerald-500 to-emerald-600",
  },
  {
    level: "intermediate" as const,
    lessons: [
      "Verb Conjugation",
      "Past Tense",
      "Present Tense",
      "Future Tense",
      "Adjective Agreement",
      "Comparatives",
      "Prepositions",
      "Directions",
      "Shopping Dialogues",
      "Travel Vocabulary",
      "Formal vs Informal",
      "Reading Practice",
      "Writing Practice",
      "Conversation Skills",
      "Cultural Context",
      "Media Arabic",
      "News Vocabulary",
      "Review & Test",
    ],
    gradient: "from-blue-500 to-blue-600",
  },
  {
    level: "advanced" as const,
    lessons: [
      "Classical Arabic Intro",
      "Poetry & Literature",
      "Advanced Grammar",
      "Rhetorical Devices",
      "Dialect Overview",
      "Egyptian Arabic",
      "Levantine Arabic",
      "Gulf Arabic",
      "Business Arabic",
      "Legal Arabic",
      "Academic Writing",
      "Debate & Discussion",
      "Translation Skills",
      "Interpreting",
      "Creative Writing",
      "Research Arabic",
      "Presentation Skills",
      "Advanced Conversation",
      "Idiomatic Expressions",
      "Proverbs & Wisdom",
      "Modern Literature",
      "Journalism Arabic",
      "Revision",
      "Final Examination",
    ],
    gradient: "from-purple-500 to-purple-600",
  },
];

const PROGRESS_KEY = "course_progress";

const getCompletedLessons = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem(PROGRESS_KEY) || "[]");
  } catch {
    return [];
  }
};

const Courses = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);

  useEffect(() => {
    setCompletedLessons(getCompletedLessons());
    // Re-read on focus so return from lesson updates progress instantly
    const onFocus = () => setCompletedLessons(getCompletedLessons());
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  const overall = useMemo(() => {
    const total = courses.reduce((s, c) => s + c.lessons.length, 0);
    const done = courses.reduce(
      (s, c) => s + c.lessons.filter((l) => completedLessons.includes(l)).length,
      0
    );
    return { total, done, pct: total ? Math.round((done / total) * 100) : 0 };
  }, [completedLessons]);

  const handleLessonClick = (lesson: string) => navigate(`/course/${slugify(lesson)}`);

  const handleStartCourse = (course: (typeof courses)[number]) => {
    const nextLesson = course.lessons.find((l) => !completedLessons.includes(l));
    navigate(`/course/${slugify(nextLesson || course.lessons[0])}`);
  };

  return (
    <div className="relative z-10 py-12 px-4">
      <div className="container mx-auto max-w-5xl">
        <h1 className="font-display text-4xl font-bold text-center text-foreground mb-2">
          {t("courses.title")}
        </h1>
        <p className="text-center text-muted-foreground mb-6">{t("courses.subtitle")}</p>

        {/* Overall progress */}
        <div className="max-w-md mx-auto mb-8 bg-card border border-border rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2 font-arabic text-sm">
            <span className="text-muted-foreground">التقدّم الإجمالي</span>
            <span className="font-semibold text-foreground">
              {overall.done} / {overall.total} ({overall.pct}٪)
            </span>
          </div>
          <div className="h-2 rounded-full bg-secondary overflow-hidden">
            <div
              className="h-full gradient-gold transition-all"
              style={{ width: `${overall.pct}%` }}
            />
          </div>
        </div>

        {/* Living Story World highlight */}
        <button
          onClick={() => navigate("/story")}
          className="group relative w-full mb-10 overflow-hidden rounded-3xl border border-accent/30 text-right"
          style={{ animation: "fade-in-up 0.6s ease-out both" }}
        >
          <div className="relative p-6 md:p-8 bg-gradient-to-l from-primary via-primary to-accent/40 text-primary-foreground">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-accent/30 backdrop-blur flex items-center justify-center flex-shrink-0">
                  <MessagesSquare className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <div className="inline-block px-2 py-0.5 rounded-full bg-accent text-accent-foreground text-[10px] font-bold mb-1.5 tracking-wider">
                    جديد
                  </div>
                  <h3 className="font-arabic text-xl md:text-2xl font-bold mb-1">عالم السرد الحي</h3>
                  <p className="font-arabic text-sm text-primary-foreground/80 max-w-xl">
                    ادخل عوالم أردنية أصيلة وتحدث مع شخصياتها بالكتابة أو الصوت — كل حوار فريد لا يتكرر.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm font-arabic bg-accent text-accent-foreground px-4 py-2 rounded-full group-hover:translate-x-[-4px] transition-transform">
                ابدأ الآن <ArrowLeft className="w-4 h-4" />
              </div>
            </div>
          </div>
        </button>

        <div className="space-y-10">
          {courses.map((course, ci) => {
            const doneCount = course.lessons.filter((l) => completedLessons.includes(l)).length;
            const pct = Math.round((doneCount / course.lessons.length) * 100);
            const allDone = doneCount === course.lessons.length;
            return (
              <div
                key={ci}
                className="rounded-2xl bg-card border border-border overflow-hidden"
                style={{ animation: `fade-in-up 0.6s ease-out ${ci * 0.15}s both` }}
              >
                <div
                  className={`p-6 bg-gradient-to-r ${course.gradient} text-white`}
                >
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div>
                      <h2 className="font-display text-2xl font-bold">
                        {t(`courses.${course.level}`)}
                      </h2>
                      <p className="text-sm opacity-90 mt-1">
                        {t(`courses.${course.level}.desc`)}
                      </p>
                    </div>
                    <span className="text-sm font-medium opacity-90">
                      {doneCount} / {course.lessons.length} {t("courses.lessons")}
                    </span>
                  </div>
                  <div className="mt-4 h-1.5 rounded-full bg-white/25 overflow-hidden">
                    <div
                      className="h-full bg-white/90 transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {course.lessons.map((lesson, li) => {
                      const isDone = completedLessons.includes(lesson);
                      return (
                        <div
                          key={li}
                          onClick={() => handleLessonClick(lesson)}
                          className="flex items-center gap-2 p-3 rounded-lg border border-border hover:bg-secondary cursor-pointer transition-colors text-sm"
                        >
                          {isDone ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                          ) : (
                            <BookOpen className="w-4 h-4 text-accent flex-shrink-0" />
                          )}
                          <span
                            className={`flex-1 ${isDone ? "text-muted-foreground line-through" : "text-foreground"}`}
                          >
                            {lesson}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {allDone ? (
                    <div className="mt-6 flex items-center gap-2 text-emerald-600 font-semibold">
                      <CheckCircle2 className="w-5 h-5" />
                      {t("courses.completed") || "Level Completed! 🎉"}
                    </div>
                  ) : (
                    <button
                      onClick={() => handleStartCourse(course)}
                      className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 rounded-lg gradient-gold text-accent-foreground font-semibold hover:opacity-90 transition-opacity"
                    >
                      <Sparkles className="w-4 h-4" />
                      {doneCount > 0 ? "متابعة" : t("courses.start")}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Courses;
