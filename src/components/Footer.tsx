import { useLanguage } from "@/contexts/LanguageContext";
import logo from "@/assets/lugha-logo.png";
import { Link } from "react-router-dom";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="relative z-10 bg-primary text-primary-foreground mt-24">
      <div className="border-b border-primary-foreground/10">
        <div className="container mx-auto px-4 py-16 grid md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-5">
              <img src={logo} alt="Lugha" className="w-12 h-12 object-contain invert-0" />
              <div>
                <h3 className="font-display text-2xl font-bold tracking-tight">Lugha</h3>
                <p className="text-sm uppercase tracking-[0.24em] text-primary-foreground/70">لُغة · {t("footer.est")}</p>
              </div>
            </div>
            <p className="text-base text-primary-foreground/75 max-w-sm leading-relaxed">
              {t("footer.tagline")}
            </p>
          </div>

          <div className="md:col-span-2">
            <p className="text-sm uppercase tracking-[0.22em] text-accent mb-4 font-semibold">{t("footer.study")}</p>
            <ul className="space-y-2 text-[15px] text-primary-foreground/85">
              <li><Link to="/courses" className="hover:text-accent transition-colors">{t("nav.courses")}</Link></li>
              <li><Link to="/learn" className="hover:text-accent transition-colors">{t("nav.learn")}</Link></li>
              <li><Link to="/placement-test" className="hover:text-accent transition-colors">{t("footer.placement")}</Link></li>
            </ul>
          </div>



          <div className="md:col-span-2">
            <p className="text-sm uppercase tracking-[0.22em] text-accent mb-4 font-semibold">{t("footer.house")}</p>
            <ul className="space-y-2 text-[15px] text-primary-foreground/85">
              <li><Link to="/teachers" className="hover:text-accent transition-colors">{t("nav.teachers")}</Link></li>
              <li><Link to="/support" className="hover:text-accent transition-colors">{t("nav.support")}</Link></li>
              <li><Link to="/faq" className="hover:text-accent transition-colors">{t("nav.faq")}</Link></li>
              <li><Link to="/dashboard" className="hover:text-accent transition-colors">{t("nav.dashboard")}</Link></li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <p className="text-sm uppercase tracking-[0.22em] text-accent mb-4 font-semibold">{t("footer.correspondence")}</p>
            <p className="text-[15px] text-primary-foreground/75 leading-relaxed">
              {t("footer.corrDesc")}
            </p>
            <form className="mt-4 flex border border-primary-foreground/20">
              <input
                type="email"
                placeholder={t("footer.emailPh")}
                className="flex-1 bg-transparent px-3 py-2 text-sm placeholder:text-primary-foreground/40 focus:outline-none"
              />
              <button className="px-4 bg-accent text-accent-foreground text-sm font-semibold uppercase tracking-wider">{t("footer.join")}</button>
            </form>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between text-sm uppercase tracking-[0.16em] text-primary-foreground/70">
        <span>© 2026 Lugha · {t("footer.rights")}</span>
        <span className="mt-2 md:mt-0">{t("footer.crafted")}</span>

      </div>
    </footer>
  );
};

export default Footer;
