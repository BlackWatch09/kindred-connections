import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLanguage, Language } from "@/contexts/LanguageContext";
import { Globe, Menu, X, LogOut, User as UserIcon, ChevronDown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useAiPersona } from "@/hooks/useAiPersona";
import { pickLocalized } from "@/lib/siteContent";
import logo from "@/assets/lugha-logo.png";

const langLabels: Record<Language, string> = {
  en: "English",
  ar: "العربية",
  tr: "Türkçe",
  es: "Español",
};
const langShort: Record<Language, string> = {
  en: "EN",
  ar: "AR",
  tr: "TR",
  es: "ES",
};

const Navbar = () => {
  const { language, setLanguage, t } = useLanguage();
  const { user, profile, signOut } = useAuth();
  const persona = useAiPersona();
  const hubLabel = pickLocalized(persona.hubName, language, t("nav.aihub"));
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const displayName =
    profile?.full_name ||
    (user?.user_metadata?.full_name as string | undefined) ||
    user?.email?.split("@")[0] ||
    "";
  const initial = displayName.charAt(0).toUpperCase() || "U";
  const handleSignOut = async () => {
    await signOut();
    setUserOpen(false);
    setMobileOpen(false);
    navigate("/");
  };

  const links = [
    { to: "/", label: t("nav.home") },
    { to: "/courses", label: t("nav.courses") },
    { to: "/learn", label: t("nav.learn") },
    { to: "/ai", label: hubLabel, highlight: true },
    { to: "/community", label: t("nav.community") },
    { to: "/support", label: t("nav.support") },
    { to: "/dashboard", label: t("nav.dashboard") },
    { to: "/teachers", label: t("nav.teachers") },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/95 backdrop-blur-xl shadow-[0_1px_0_hsl(var(--border)),0_20px_40px_-30px_hsl(var(--emerald-deep)/0.35)]"
          : "bg-background/80 backdrop-blur-md"
      }`}
    >
      {/* Top gilt hairline */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-accent/60 to-transparent" />

      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-20 gap-6">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-3 shrink-0 group">
            <div className="relative">
              <span className="absolute -inset-1 rounded-full bg-accent/0 group-hover:bg-accent/10 blur-md transition-all" />
              <img src={logo} alt="Lugha" className="relative w-11 h-11 object-contain" />
            </div>
            <div className="leading-none flex flex-col">
              <span
                className="font-display text-[26px] font-semibold text-primary tracking-tight italic"
                style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100' }}
              >
                Lugha
              </span>
              <span className="font-arabic text-[13px] tracking-[0.28em] text-accent/80 mt-1">
                لُغة
              </span>
            </div>
            <span className="hidden lg:block h-10 w-px bg-gradient-to-b from-transparent via-accent/40 to-transparent ms-2" />
          </Link>

          {/* Desktop links — centered pill group */}
          <div className="hidden lg:flex flex-1 justify-center">
            <div className="flex items-center gap-1 px-2 py-1.5 rounded-full border border-border/60 bg-card/40 backdrop-blur-sm">
              {links.map((link) => {
                const active = isActive(link.to);
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`relative px-3.5 py-2 text-[13px] font-medium tracking-wide rounded-full transition-all flex items-center gap-1.5 whitespace-nowrap ${
                      active
                        ? "bg-primary text-primary-foreground shadow-[0_4px_14px_-6px_hsl(var(--emerald-deep)/0.55)]"
                        : link.highlight
                        ? "text-accent hover:bg-accent/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                    }`}
                  >
                    {link.highlight && (
                      <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                    )}
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right cluster */}
          <div className="hidden lg:flex items-center gap-2 shrink-0">
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 px-3 py-2 text-[13px] font-medium text-foreground rounded-full border border-border/60 hover:border-accent/60 hover:text-accent transition-colors"
              >
                <Globe className="w-4 h-4" />
                <span className="tracking-wide">{langShort[language]}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${langOpen ? "rotate-180" : ""}`} />
              </button>
              {langOpen && (
                <div className="absolute top-full mt-2 right-0 bg-card border border-border rounded-md shadow-[0_20px_60px_-20px_hsl(var(--emerald-deep)/0.4)] py-1 min-w-[180px] z-50 overflow-hidden">
                  {(["en", "ar", "tr", "es"] as Language[]).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        setLanguage(lang);
                        setLangOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm hover:bg-secondary transition-colors flex items-center justify-between gap-3 ${
                        language === lang ? "text-accent font-semibold bg-secondary/50" : "text-foreground"
                      }`}
                    >
                      <span>{langLabels[lang]}</span>
                      <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                        {langShort[lang]}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserOpen(!userOpen)}
                  className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border border-border/60 hover:border-accent/60 transition-colors group"
                >
                  <span className="w-8 h-8 rounded-full gradient-emerald text-primary-foreground flex items-center justify-center text-xs font-bold ring-1 ring-accent/40">
                    {initial}
                  </span>
                  <span className="text-xs font-medium text-foreground max-w-[110px] truncate">
                    {displayName}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${userOpen ? "rotate-180" : ""}`} />
                </button>
                {userOpen && (
                  <div className="absolute top-full mt-2 right-0 bg-card border border-border rounded-md shadow-[0_20px_60px_-20px_hsl(var(--emerald-deep)/0.4)] py-1 min-w-[200px] z-50 overflow-hidden">
                    <Link
                      to="/dashboard"
                      onClick={() => setUserOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-secondary transition-colors"
                    >
                      <UserIcon className="w-4 h-4" /> {t("nav.dashboard")}
                    </Link>
                    <div className="h-px bg-border/60" />
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-destructive hover:bg-secondary transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> {t("nav.logout") || "Log out"}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3 py-2 text-[12px] font-semibold uppercase tracking-[0.18em] text-foreground hover:text-accent transition-colors"
                >
                  {t("nav.login")}
                </Link>
                <Link
                  to="/login?mode=signup"
                  className="relative px-5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.18em] text-primary-foreground rounded-full gradient-emerald overflow-hidden group shadow-[0_6px_20px_-8px_hsl(var(--emerald-deep)/0.65)] hover:shadow-[0_10px_28px_-8px_hsl(var(--emerald-deep)/0.75)] transition-shadow"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  <span className="relative">{t("nav.signup")}</span>
                </Link>
              </>
            )}
          </div>

          <button
            className="lg:hidden text-foreground p-2 -mr-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Bottom gilt hairline */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />

      {mobileOpen && (
        <div className="lg:hidden bg-background/98 backdrop-blur-xl border-b border-border px-4 pb-5 pt-2">
          <div className="flex flex-col">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`py-2.5 px-3 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                  isActive(link.to)
                    ? "bg-primary text-primary-foreground"
                    : link.highlight
                    ? "text-accent hover:bg-accent/10"
                    : "text-muted-foreground hover:bg-secondary"
                }`}
              >
                {link.highlight && <span className="w-1.5 h-1.5 rounded-full bg-accent" />}
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-border mt-4">
            {(["en", "ar", "tr", "es"] as Language[]).map((lang) => (
              <button
                key={lang}
                onClick={() => {
                  setLanguage(lang);
                  setMobileOpen(false);
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                  language === lang
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-foreground hover:border-accent/60"
                }`}
              >
                {langLabels[lang]}
              </button>
            ))}
          </div>
          {user ? (
            <button
              onClick={handleSignOut}
              className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 rounded-full border border-destructive/60 text-destructive text-sm font-medium hover:bg-destructive/10 transition-colors"
            >
              <LogOut className="w-4 h-4" /> {t("nav.logout") || "Log out"}
            </button>
          ) : (
            <div className="flex gap-2 mt-4">
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="flex-1 text-center py-2.5 text-sm rounded-full border border-border text-foreground"
              >
                {t("nav.login")}
              </Link>
              <Link
                to="/login?mode=signup"
                onClick={() => setMobileOpen(false)}
                className="flex-1 text-center py-2.5 text-sm rounded-full gradient-emerald text-primary-foreground font-semibold"
              >
                {t("nav.signup")}
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
