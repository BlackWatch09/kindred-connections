import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowLeft } from "lucide-react";
import AlphabetLearning from "@/components/AlphabetLearning";
import GreetingsLearning from "@/components/GreetingsLearning";
import NumbersLearning from "@/components/NumbersLearning";
import GenericLesson from "@/components/GenericLesson";
import { LESSONS, getLessonBySlug, LESSON_LABELS_BY_LEVEL } from "@/data/courseLessons";

const slugify = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const PROGRESS_KEY = "course_progress";

const getCompletedLessons = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem(PROGRESS_KEY) || "[]");
  } catch {
    return [];
  }
};

const markLessonComplete = (lesson: string) => {
  const completed = getCompletedLessons();
  if (!completed.includes(lesson)) {
    completed.push(lesson);
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(completed));
  }
};

// Build slug->label map from labels in courseLessons + the 3 rich lessons
const richLessons = [
  "Arabic Alphabet (أ ب ت)",
  "Basic Greetings",
  "Numbers 1-20",
];
const allLabels = [
  ...richLessons,
  ...LESSON_LABELS_BY_LEVEL.beginner,
  ...LESSON_LABELS_BY_LEVEL.intermediate,
  ...LESSON_LABELS_BY_LEVEL.advanced,
];
const lessonBySlug = new Map(allLabels.map((l) => [slugify(l), l]));

const CoursePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const lessonName = slug ? lessonBySlug.get(slug) : undefined;
  const dataLesson = slug ? getLessonBySlug(slug) : undefined;

  const handleComplete = () => {
    if (lessonName) markLessonComplete(lessonName);
    navigate("/courses");
  };

  const renderContent = () => {
    if (!lessonName && !dataLesson) {
      return (
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-foreground mb-2">Lesson not found</h2>
          <p className="text-muted-foreground">This lesson could not be found.</p>
        </div>
      );
    }

    if (lessonName === "Arabic Alphabet (أ ب ت)") return <AlphabetLearning onClose={handleComplete} />;
    if (lessonName === "Basic Greetings") return <GreetingsLearning onClose={handleComplete} />;
    if (lessonName === "Numbers 1-20") return <NumbersLearning onClose={handleComplete} />;

    if (dataLesson) {
      return (
        <div>
          <div className="text-center mb-8">
            <h1 className="font-arabic text-3xl md:text-4xl font-bold text-foreground mb-1">
              {dataLesson.titleAr}
            </h1>
            <p className="text-sm text-muted-foreground">{dataLesson.title}</p>
          </div>
          <GenericLesson lesson={dataLesson} onComplete={handleComplete} />
        </div>
      );
    }

    return (
      <div className="text-center py-20 space-y-4">
        <h2 className="font-display text-3xl font-bold text-foreground">{lessonName}</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          {t("courses.coming_soon") || "This lesson is coming soon."}
        </p>
        <button
          onClick={handleComplete}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg gradient-gold text-accent-foreground font-semibold hover:opacity-90"
        >
          {t("courses.mark_complete") || "Mark as Complete"}
        </button>
      </div>
    );
  };

  return (
    <div className="relative z-10 py-12 px-4">
      <div className="container mx-auto max-w-5xl">
        <button
          onClick={() => navigate("/courses")}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("courses.back") || "Back to Courses"}
        </button>
        {renderContent()}
      </div>
    </div>
  );
};

export { slugify };
export default CoursePage;
