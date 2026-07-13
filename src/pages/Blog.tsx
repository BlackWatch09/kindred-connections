import { useState, useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { blogPosts } from "@/data/blogPosts";
import { Link } from "react-router-dom";
import { Search, Calendar, ArrowRight, Globe } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Blog = () => {
  const { language } = useLanguage();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [blogLang, setBlogLang] = useState<"en" | "tr">("en");

  const categories = useMemo(() => {
    const cats = new Set(blogPosts.map((p) => p.category.en));
    return Array.from(cats);
  }, []);

  const filtered = useMemo(() => {
    return blogPosts.filter((post) => {
      const matchSearch =
        post.title[blogLang].toLowerCase().includes(search.toLowerCase()) ||
        post.excerpt[blogLang].toLowerCase().includes(search.toLowerCase());
      const matchCat = category === "all" || post.category.en === category;
      return matchSearch && matchCat;
    });
  }, [search, category, blogLang]);

  return (
    <div className="relative z-10 py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-3">
            {blogLang === "en" ? "Learn Arabic the Easy Way" : "Arapça'yı Kolay Yoldan Öğrenin"}
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {blogLang === "en"
              ? "Explore articles, tips, and cultural insights to boost your Arabic learning journey."
              : "Arapça öğrenme yolculuğunuzu hızlandırmak için makaleleri, ipuçlarını ve kültürel bilgileri keşfedin."}
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3 mb-10 items-center justify-between">
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={blogLang === "en" ? "Search articles..." : "Makale ara..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-3 items-center">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={blogLang === "en" ? "All Categories" : "Tüm Kategoriler"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{blogLang === "en" ? "All Categories" : "Tüm Kategoriler"}</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {blogLang === "en" ? cat : blogPosts.find((p) => p.category.en === cat)?.category.tr || cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <button
              onClick={() => setBlogLang(blogLang === "en" ? "tr" : "en")}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md border border-input bg-background text-sm font-medium hover:bg-accent/20 transition-colors"
              title="Toggle Turkish translation"
            >
              <Globe className="w-4 h-4" />
              {blogLang === "en" ? "TR" : "EN"}
            </button>
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-16">
            {blogLang === "en" ? "No articles found." : "Makale bulunamadı."}
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((post, i) => (
              <Link
                key={post.slug}
                to={`/blog/${post.slug}`}
                className="group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300"
                style={{ animation: `fade-in-up 0.5s ease-out ${i * 0.1}s both` }}
              >
                <div className="overflow-hidden h-48">
                  <img
                    src={post.image}
                    alt={post.title[blogLang]}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full gradient-gold text-accent-foreground">
                      {post.category[blogLang]}
                    </span>
                  </div>
                  <h2 className="font-display text-lg font-bold text-foreground mb-2 group-hover:text-accent transition-colors line-clamp-2">
                    {post.title[blogLang]}
                  </h2>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {post.excerpt[blogLang]}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{post.author}</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {post.date}
                    </span>
                  </div>
                  <div className="mt-4 text-accent text-sm font-semibold inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                    {blogLang === "en" ? "Read More" : "Devamını Oku"} <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
