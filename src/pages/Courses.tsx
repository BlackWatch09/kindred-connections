import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Lock, BookOpen, CheckCircle2 } from "lucide-react";
import { slugify } from "@/pages/CoursePage";

const courses = [
  {
    level: "beginner",
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
    unlocked: true,
    gradient: "from-emerald-500 to-emerald-600",
  },
  {
    level: "intermediate",
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
    unlocked: false,
    gradient: "from-blue-500 to-blue-600",
  },
  {
    level: "advanced",
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
    unlocked: false,
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
  }, []);

  const handleLessonClick = (lesson: string, unlocked: boolean) => {
    if (!unlocked) return;
    navigate(`/course/${slugify(lesson)}`);
  };

  const handleStartCourse = (course: typeof courses[0]) => {
    if (!course.unlocked) return;
    const nextLesson = course.lessons.find((l) => !completedLessons.includes(l));
    if (nextLesson) {
      navigate(`/course/${slugify(nextLesson)}`);
    }
  };

  return (
    <div className="relative z-10 py-12 px-4">
      <div className="container mx-auto max-w-5xl">
        <h1 className="font-display text-4xl font-bold text-center text-foreground mb-2">
          {t("courses.title")}
        </h1>
        <p className="text-center text-muted-foreground mb-12">{t("courses.subtitle")}</p>

        <div className="space-y-10">
          {courses.map((course, ci) => {
            const allDone =
              course.unlocked && course.lessons.every((l) => completedLessons.includes(l));
            return (
              <div
                key={ci}
                className="rounded-2xl bg-card border border-border overflow-hidden"
                style={{ animation: `fade-in-up 0.6s ease-out ${ci * 0.15}s both` }}
              >
                <div
                  className={`p-6 bg-gradient-to-r ${course.gradient} text-white flex items-center justify-between`}
                >
                  <div>
                    <h2 className="font-display text-2xl font-bold">
                      {t(`courses.${course.level}`)}
                    </h2>
                    <p className="text-sm opacity-90 mt-1">
                      {t(`courses.${course.level}.desc`)}
                    </p>
                  </div>
                  <span className="text-sm font-medium opacity-80">
                    {course.lessons.length} {t("courses.lessons")}
                  </span>
                </div>
                <div className="p-6">
                  {!course.unlocked && (
                    <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4 bg-secondary rounded-lg p-3">
                      <Lock className="w-4 h-4" />
                      {t("courses.locked")}
                    </div>
                  )}
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {course.lessons.map((lesson, li) => {
                      const isDone = completedLessons.includes(lesson);
                      return (
                        <div
                          key={li}
                          onClick={() => handleLessonClick(lesson, course.unlocked)}
                          className={`flex items-center gap-2 p-3 rounded-lg border text-sm ${
                            course.unlocked
                              ? "border-border hover:bg-secondary cursor-pointer transition-colors"
                              : "border-border/50 opacity-50"
                          }`}
                        >
                          {course.unlocked ? (
                            isDone ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                            ) : (
                              <BookOpen className="w-4 h-4 text-accent flex-shrink-0" />
                            )
                          ) : (
                            <Lock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
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

                  {course.unlocked &&
                    (allDone ? (
                      <div className="mt-6 flex items-center gap-2 text-emerald-600 font-semibold">
                        <CheckCircle2 className="w-5 h-5" />
                        {t("courses.completed") || "Level Completed! 🎉"}
                      </div>
                    ) : (
                      <button
                        onClick={() => handleStartCourse(course)}
                        className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 rounded-lg gradient-gold text-accent-foreground font-semibold hover:opacity-90 transition-opacity"
                      >
                        {t("courses.start")}
                      </button>
                    ))}
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
