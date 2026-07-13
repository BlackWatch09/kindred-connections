import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage, Language } from "@/contexts/LanguageContext";
import { Globe, Menu, X } from "lucide-react";
import logo from "@/assets/logo.png";

const langLabels: Record<Language, string> = { en: "EN", ar: "عربي", tr: "TR" };

const Navbar = () => {
  const { language, setLanguage, t } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const location = useLocation();

  const links = [
    { to: "/", label: t("nav.home") },
    { to: "/courses", label: t("nav.courses") },
    { to: "/learn", label: t("nav.learn") },
    { to: "/blog", label: t("nav.blog") },
    { to: "/support", label: t("nav.support") },
    { to: "/dashboard", label: t("nav.dashboard") },
    { to: "/teachers", label: t("nav.teachers") },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="AlifXpert" className="w-10 h-10 object-contain" />
          <span className="font-display text-xl font-bold text-foreground">AlifXpert</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-medium transition-colors hover:text-accent ${
                isActive(link.to) ? "text-accent" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {/* Language toggle */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-secondary transition-colors"
            >
              <Globe className="w-4 h-4" />
              {langLabels[language]}
            </button>
            {langOpen && (
              <div className="absolute top-full mt-1 right-0 bg-card border border-border rounded-lg shadow-lg py-1 min-w-[100px]">
                {(["en", "ar", "tr"] as Language[]).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => { setLanguage(lang); setLangOpen(false); }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-secondary transition-colors ${
                      language === lang ? "text-accent font-semibold" : "text-foreground"
                    }`}
                  >
                    {langLabels[lang]}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Link
            to="/login"
            className="px-4 py-2 text-sm font-medium text-foreground hover:text-accent transition-colors"
          >
            {t("nav.login")}
          </Link>
          <Link
            to="/login?mode=signup"
            className="px-4 py-2 text-sm font-semibold rounded-lg gradient-gold text-accent-foreground hover:opacity-90 transition-opacity"
          >
            {t("nav.signup")}
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-background border-b border-border px-4 pb-4">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className={`block py-2 text-sm font-medium ${
                isActive(link.to) ? "text-accent" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex items-center gap-2 pt-3 border-t border-border mt-3">
            {(["en", "ar", "tr"] as Language[]).map((lang) => (
              <button
                key={lang}
                onClick={() => { setLanguage(lang); setMobileOpen(false); }}
                className={`px-3 py-1 rounded text-sm border ${
                  language === lang
                    ? "gradient-gold text-accent-foreground border-transparent"
                    : "border-border text-foreground"
                }`}
              >
                {langLabels[lang]}
              </button>
            ))}
          </div>
          <div className="flex gap-2 mt-3">
            <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1 text-center py-2 text-sm border border-border rounded-lg text-foreground">
              {t("nav.login")}
            </Link>
            <Link to="/login?mode=signup" onClick={() => setMobileOpen(false)} className="flex-1 text-center py-2 text-sm gradient-gold rounded-lg text-accent-foreground font-semibold">
              {t("nav.signup")}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
