import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSearchParams, Link, useNavigate, Navigate } from "react-router-dom";
import { Loader2, Mail, ShieldCheck, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import logo from "@/assets/logo.png";

const Login = () => {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, signIn, signUp } = useAuth();
  const [isSignup, setIsSignup] = useState(searchParams.get("mode") === "signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [signupSuccessEmail, setSignupSuccessEmail] = useState<string | null>(null);

  if (user) return <Navigate to="/dashboard" replace />;

  // Password strength: min 8, at least one letter and one number
  const pwHasLetter = /[A-Za-z\u0600-\u06FF]/.test(password);
  const pwHasNumber = /\d/.test(password);
  const pwLongEnough = password.length >= 8;
  const pwStrong = pwHasLetter && pwHasNumber && pwLongEnough;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    if (!email || !password || (isSignup && !name)) {
      toast.error(t("login.fillAll") || "Please fill all fields");
      return;
    }
    if (isSignup && !pwStrong) {
      toast.error(t("login.pwWeak") || "Password must be 8+ characters with letters and numbers");
      return;
    }
    setSubmitting(true);
    try {
      if (isSignup) {
        const { error } = await signUp(email, password, name);
        if (error) throw error;
        toast.success(t("login.accountCreated") || "تم إنشاء حسابك بنجاح 🎉");
        navigate("/dashboard");
      } else {
        const { error } = await signIn(email, password);
        if (error) throw error;
        toast.success(t("login.welcomeBack") || "Welcome back!");
        navigate("/dashboard");
      }
    } catch (err) {
      const raw = err instanceof Error ? err.message : "Something went wrong";
      // Friendlier messages
      const msg = /Email not confirmed/i.test(raw)
        ? t("login.errEmailNotConfirmed") || "Please confirm your email first — check your inbox."
        : /Invalid login credentials/i.test(raw)
        ? t("login.errInvalid") || "Incorrect email or password."
        : /already registered/i.test(raw)
        ? t("login.errExists") || "This email is already registered — sign in instead."
        : raw;
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // === Elegant "check your email" success screen ===
  if (signupSuccessEmail) {
    return (
      <div className="relative z-10 min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div
          className="w-full max-w-lg bg-card border border-border rounded-3xl p-10 text-center shadow-2xl"
          style={{ animation: "fade-in-up 0.6s ease-out" }}
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-full gradient-gold flex items-center justify-center shadow-lg">
            <Mail className="w-10 h-10 text-accent-foreground" />
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-3">
            {t("login.successTitle") || "تحقق من بريدك الإلكتروني"}
          </h1>
          <p className="text-muted-foreground leading-relaxed mb-6">
            {t("login.successBody") || "أرسلنا رابط تأكيد إلى"}{" "}
            <span className="font-semibold text-foreground">{signupSuccessEmail}</span>
          </p>
          <div className="bg-secondary/60 border border-border rounded-xl p-4 text-sm text-muted-foreground text-start space-y-2 mb-6">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 mt-0.5 text-accent shrink-0" />
              <span>{t("login.successStep1") || "افتح بريدك الإلكتروني وابحث عن رسالة منّا"}</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 mt-0.5 text-accent shrink-0" />
              <span>{t("login.successStep2") || "اضغط على زر تأكيد الحساب"}</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 mt-0.5 text-accent shrink-0" />
              <span>{t("login.successStep3") || "عد إلى هنا وسجّل دخولك"}</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mb-6">
            {t("login.successSpam") || "لم تجد الرسالة؟ تحقق من مجلد الرسائل غير المرغوب فيها (Spam)."}
          </p>
          <button
            onClick={() => {
              setSignupSuccessEmail(null);
              setIsSignup(false);
              setPassword("");
            }}
            className="w-full py-3 rounded-lg gradient-gold text-accent-foreground font-semibold hover:opacity-90 transition-opacity"
          >
            {t("login.backToSignin") || "الرجوع لتسجيل الدخول"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-10 min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div
        className="w-full max-w-md bg-card border border-border rounded-2xl p-8 shadow-xl"
        style={{ animation: "fade-in-up 0.5s ease-out" }}
      >
        <div className="text-center mb-8">
          <img src={logo} alt="AlifXpert" className="w-16 h-16 mx-auto mb-4 object-contain" />
          <h1 className="font-display text-2xl font-bold text-foreground">
            {isSignup ? t("login.create") : t("login.title")}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">{t("login.subtitle")}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">{t("login.name")}</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                className="w-full p-3 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          )}
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">{t("login.email")}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className="w-full p-3 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">{t("login.password")}</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={isSignup ? "new-password" : "current-password"}
                className="w-full p-3 pe-10 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute end-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-muted-foreground hover:text-foreground"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {isSignup && password.length > 0 && (
              <div className="mt-2 space-y-1 text-xs">
                <PwCheck ok={pwLongEnough} label={t("login.pwLen") || "8+ characters"} />
                <PwCheck ok={pwHasLetter} label={t("login.pwLetter") || "Contains a letter"} />
                <PwCheck ok={pwHasNumber} label={t("login.pwNumber") || "Contains a number"} />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-lg gradient-gold text-accent-foreground font-semibold hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {isSignup ? t("login.create") : t("login.signin")}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="w-3.5 h-3.5 text-accent" />
          <span>{t("login.secured") || "بياناتك محمية بتشفير كامل"}</span>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          {isSignup ? t("login.hasaccount") : t("login.noaccount")}{" "}
          <button
            onClick={() => setIsSignup(!isSignup)}
            className="text-accent font-semibold hover:underline"
          >
            {isSignup ? t("login.signin") : t("login.signup")}
          </button>
        </p>
      </div>
    </div>
  );
};

const PwCheck = ({ ok, label }: { ok: boolean; label: string }) => (
  <div className={`flex items-center gap-2 ${ok ? "text-accent" : "text-muted-foreground"}`}>
    <CheckCircle2 className={`w-3.5 h-3.5 ${ok ? "opacity-100" : "opacity-40"}`} />
    <span>{label}</span>
  </div>
);

export default Login;
