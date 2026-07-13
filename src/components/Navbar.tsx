import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLanguage, Language } from "@/contexts/LanguageContext";
import { Globe, Menu, X, LogOut, User as UserIcon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import logo from "@/assets/lugha-logo.png";

const langLabels: Record<Language, string> = { en: "EN", ar: "عربي", tr: "TR" };

const Navbar = () => {
  const { language, setLanguage, t } = useLanguage();
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const location = useLocation();
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
    { to: "/support", label: t("nav.support") },
    { to: "/dashboard", label: t("nav.dashboard") },
    { to: "/teachers", label: t("nav.teachers") },
    { to: "/faq", label: t("nav.faq") },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-background/85 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 flex items-center justify-between h-14">
        <Link to="/" className="flex items-center gap-2.5">
          <img src={logo} alt="Lugha" className="w-9 h-9 object-contain" />
          <div className="leading-none">
            <span className="font-display text-xl font-bold text-primary tracking-tight">Lugha</span>
            <span className="block text-[9px] uppercase tracking-[0.32em] text-muted-foreground mt-0.5">لُغة</span>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-7">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-[13px] font-medium tracking-wide transition-colors hover:text-primary relative ${
                isActive(link.to) ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {link.label}
              {isActive(link.to) && (
                <span className="absolute -bottom-1.5 left-0 right-0 h-px bg-accent" />
              )}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-foreground hover:text-accent transition-colors"
            >
              <Globe className="w-3.5 h-3.5" />
              {langLabels[language]}
            </button>
            {langOpen && (
              <div className="absolute top-full mt-1 right-0 bg-card border border-border shadow-lg py-1 min-w-[100px]">
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

          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserOpen(!userOpen)}
                className="flex items-center gap-2 pl-1 pr-3 py-1 border border-border hover:border-accent transition-colors"
              >
                <span className="w-7 h-7 rounded-none bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                  {initial}
                </span>
                <span className="text-xs font-medium text-foreground max-w-[110px] truncate">{displayName}</span>
              </button>
              {userOpen && (
                <div className="absolute top-full mt-1 right-0 bg-card border border-border shadow-lg py-1 min-w-[180px] z-50">
                  <Link
                    to="/dashboard"
                    onClick={() => setUserOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-secondary transition-colors"
                  >
                    <UserIcon className="w-4 h-4" /> {t("nav.dashboard")}
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-secondary transition-colors"
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
                className="px-3 py-2 text-xs font-medium uppercase tracking-widest text-foreground hover:text-accent transition-colors"
              >
                {t("nav.login")}
              </Link>
              <Link
                to="/login?mode=signup"
                className="px-5 py-2.5 text-xs font-semibold uppercase tracking-widest bg-primary text-primary-foreground hover:bg-emerald transition-colors"
              >
                {t("nav.signup")}
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

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
                className={`px-3 py-1 text-sm border ${
                  language === lang
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-foreground"
                }`}
              >
                {langLabels[lang]}
              </button>
            ))}
          </div>
          {user ? (
            <button
              onClick={handleSignOut}
              className="w-full mt-3 flex items-center justify-center gap-2 py-2 border border-destructive text-destructive text-sm font-medium"
            >
              <LogOut className="w-4 h-4" /> {t("nav.logout") || "Log out"}
            </button>
          ) : (
            <div className="flex gap-2 mt-3">
              <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1 text-center py-2 text-sm border border-border text-foreground">
                {t("nav.login")}
              </Link>
              <Link to="/login?mode=signup" onClick={() => setMobileOpen(false)} className="flex-1 text-center py-2 text-sm bg-primary text-primary-foreground font-semibold">
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
