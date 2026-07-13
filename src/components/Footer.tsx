import { useLanguage } from "@/contexts/LanguageContext";
import logo from "@/assets/logo.png";
import { Link } from "react-router-dom";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="relative z-10 bg-primary text-primary-foreground py-12 mt-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src={logo} alt="AlifXpert" className="w-12 h-12 object-contain" />
            <div>
              <h3 className="font-display text-lg font-bold">AlifXpert</h3>
              <p className="text-sm opacity-80">{t("footer.tagline")}</p>
            </div>
          </div>
          <div className="flex gap-6 text-sm opacity-80">
            <Link to="/courses" className="hover:opacity-100 transition-opacity">{t("nav.courses")}</Link>
            <Link to="/learn" className="hover:opacity-100 transition-opacity">{t("nav.learn")}</Link>
            <Link to="/blog" className="hover:opacity-100 transition-opacity">{t("nav.blog")}</Link>
            <Link to="/support" className="hover:opacity-100 transition-opacity">{t("nav.support")}</Link>
          </div>
        </div>
        <div className="text-center text-sm opacity-60 mt-8">
          © 2026 AlifXpert. {t("footer.rights")}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
