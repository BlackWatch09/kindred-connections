import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLanguage, Language } from "@/contexts/LanguageContext";
import { Globe, Menu, X, LogOut, User as UserIcon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import logo from "@/assets/logo.png";

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

          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserOpen(!userOpen)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg border border-border hover:bg-secondary transition-colors"
              >
                <span className="w-8 h-8 rounded-full gradient-gold text-accent-foreground flex items-center justify-center text-sm font-bold">
                  {initial}
                </span>
                <span className="text-sm font-medium text-foreground max-w-[120px] truncate">{displayName}</span>
              </button>
              {userOpen && (
                <div className="absolute top-full mt-1 right-0 bg-card border border-border rounded-lg shadow-lg py-1 min-w-[180px] z-50">
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
            </>
          )}
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
          {user ? (
            <button
              onClick={handleSignOut}
              className="w-full mt-3 flex items-center justify-center gap-2 py-2 rounded-lg border border-destructive text-destructive text-sm font-medium"
            >
              <LogOut className="w-4 h-4" /> {t("nav.logout") || "Log out"}
            </button>
          ) : (
            <div className="flex gap-2 mt-3">
              <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1 text-center py-2 text-sm border border-border rounded-lg text-foreground">
                {t("nav.login")}
              </Link>
              <Link to="/login?mode=signup" onClick={() => setMobileOpen(false)} className="flex-1 text-center py-2 text-sm gradient-gold rounded-lg text-accent-foreground font-semibold">
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
