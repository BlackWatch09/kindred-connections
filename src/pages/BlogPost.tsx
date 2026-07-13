import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { blogPosts, BlogPost, BlogExample } from "@/data/blogPosts";
import { ArrowLeft, Volume2, Globe, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const speakArabic = (text: string) => {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "ar-SA";
    u.rate = 0.8;
    window.speechSynthesis.speak(u);
  }
};

const ExampleBlock = ({ ex }: { ex: BlogExample; lang: "en" | "tr" }) => (
  <div className="bg-secondary/50 border border-border rounded-xl p-4 my-3 flex items-start gap-3">
    <button
      onClick={() => speakArabic(ex.arabic)}
      className="mt-1 p-2 rounded-full gradient-gold text-accent-foreground hover:opacity-80 transition-opacity shrink-0"
      aria-label="Play pronunciation"
    >
      <Volume2 className="w-4 h-4" />
    </button>
    <div className="space-y-1">
      <p className="text-xl font-arabic font-bold text-foreground" dir="rtl">{ex.arabic}</p>
      <p className="text-sm text-muted-foreground italic">{ex.transliteration}</p>
      <p className="text-sm text-foreground">{ex.english}</p>
    </div>
  </div>
);

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [blogLang, setBlogLang] = useState<"en" | "tr">("en");
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState<Record<number, boolean>>({});
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="relative z-10 py-20 px-4 text-center">
        <h1 className="font-display text-3xl font-bold text-foreground mb-4">Post Not Found</h1>
        <Link to="/blog" className="text-accent hover:underline">← Back to Blog</Link>
      </div>
    );
  }

  const scrollToSection = (id: string) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleAnswer = (qIndex: number, answer: string) => {
    setAnswers((prev) => ({ ...prev, [qIndex]: answer }));
  };

  const checkAnswer = (qIndex: number) => {
    setSubmitted((prev) => ({ ...prev, [qIndex]: true }));
  };

  return (
    <div className="relative z-10 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            {blogLang === "en" ? "Back to Blog" : "Bloga Dön"}
          </Link>
          <button
            onClick={() => setBlogLang(blogLang === "en" ? "tr" : "en")}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md border border-input bg-background text-sm font-medium hover:bg-accent/20 transition-colors"
          >
            <Globe className="w-4 h-4" />
            {blogLang === "en" ? "Türkçe" : "English"}
          </button>
        </div>

        {/* Hero */}
        <div className="mb-10">
          <span className="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full gradient-gold text-accent-foreground">
            {post.category[blogLang]}
          </span>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-4 mb-3">
            {post.title[blogLang]}
          </h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{post.author}</span>
            <span>{post.date}</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Main content */}
          <article className="flex-1 min-w-0">
            <img
              src={post.image}
              alt={post.title[blogLang]}
              className="w-full h-64 object-cover rounded-2xl mb-8"
            />

            {post.sections.map((section) => (
              <section
                key={section.id}
                ref={(el) => { sectionRefs.current[section.id] = el; }}
                className="mb-10 scroll-mt-24"
              >
                <h2 className="font-display text-2xl font-bold text-foreground mb-3">
                  {section.heading[blogLang]}
                </h2>
                <p className="text-foreground/90 leading-relaxed mb-4">
                  {section.content[blogLang]}
                </p>
                {section.examples?.map((ex, i) => (
                  <ExampleBlock key={i} ex={ex} lang={blogLang} />
                ))}
              </section>
            ))}

            {/* Interactive Questions */}
            <section className="mt-14 border-t border-border pt-10">
              <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                {blogLang === "en" ? "🧠 Test Your Knowledge" : "🧠 Bilginizi Test Edin"}
              </h2>
              <div className="space-y-6">
                {post.questions.map((q, qIdx) => {
                  const isSubmitted = submitted[qIdx];
                  const userAnswer = answers[qIdx];

                  return (
                    <div
                      key={qIdx}
                      className="bg-card border border-border rounded-xl p-5"
                      style={{ animation: `fade-in-up 0.4s ease-out ${qIdx * 0.1}s both` }}
                    >
                      <p className="font-semibold text-foreground mb-3">
                        {qIdx + 1}. {q.question[blogLang]}
                      </p>

                      {q.type === "mcq" && q.options && (
                        <div className="space-y-2">
                          {q.options.map((opt, oIdx) => {
                            const isCorrect = oIdx === q.correctIndex;
                            const isSelected = userAnswer === opt;
                            let optClass = "border border-border bg-background hover:bg-secondary/50";
                            if (isSubmitted && isSelected && isCorrect) {
                              optClass = "border-green-500 bg-green-500/10";
                            } else if (isSubmitted && isSelected && !isCorrect) {
                              optClass = "border-red-500 bg-red-500/10";
                            } else if (isSubmitted && isCorrect) {
                              optClass = "border-green-500/50 bg-green-500/5";
                            }
                            return (
                              <button
                                key={oIdx}
                                onClick={() => !isSubmitted && handleAnswer(qIdx, opt)}
                                disabled={isSubmitted}
                                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all ${optClass} ${isSelected && !isSubmitted ? "ring-2 ring-accent" : ""}`}
                              >
                                <span className="flex items-center gap-2">
                                  {opt}
                                  {isSubmitted && isSelected && isCorrect && <CheckCircle2 className="w-4 h-4 text-green-600 ml-auto" />}
                                  {isSubmitted && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-red-500 ml-auto" />}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {q.type === "fill" && (
                        <Input
                          value={userAnswer || ""}
                          onChange={(e) => !isSubmitted && handleAnswer(qIdx, e.target.value)}
                          disabled={isSubmitted}
                          className="max-w-xs"
                          placeholder={blogLang === "en" ? "Type your answer..." : "Cevabınızı yazın..."}
                          dir="rtl"
                        />
                      )}

                      {!isSubmitted && userAnswer && (
                        <Button
                          onClick={() => checkAnswer(qIdx)}
                          size="sm"
                          className="mt-3 gradient-gold text-accent-foreground"
                        >
                          {blogLang === "en" ? "Check" : "Kontrol Et"}
                        </Button>
                      )}

                      {isSubmitted && q.type === "fill" && (
                        <p className={`mt-2 text-sm ${userAnswer === q.answer ? "text-green-600" : "text-red-500"}`}>
                          {userAnswer === q.answer
                            ? (blogLang === "en" ? "✅ Correct!" : "✅ Doğru!")
                            : (blogLang === "en" ? `❌ The answer is: ${q.answer}` : `❌ Cevap: ${q.answer}`)}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Back button */}
            <div className="mt-12">
              <Link to="/blog">
                <Button variant="outline" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  {blogLang === "en" ? "Back to Blog" : "Bloga Dön"}
                </Button>
              </Link>
            </div>
          </article>

          {/* Table of Contents */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24 bg-card border border-border rounded-xl p-5">
              <h3 className="font-display text-sm font-bold text-foreground uppercase tracking-wider mb-4">
                {blogLang === "en" ? "Table of Contents" : "İçindekiler"}
              </h3>
              <nav className="space-y-2">
                {post.sections.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => scrollToSection(s.id)}
                    className="block text-sm text-muted-foreground hover:text-accent transition-colors text-left w-full"
                  >
                    {s.heading[blogLang]}
                  </button>
                ))}
                <div className="border-t border-border my-2" />
                <button
                  onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })}
                  className="block text-sm text-muted-foreground hover:text-accent transition-colors text-left w-full"
                >
                  {blogLang === "en" ? "🧠 Questions" : "🧠 Sorular"}
                </button>
              </nav>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default BlogPostPage;
