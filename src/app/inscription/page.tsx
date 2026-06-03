"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import Logo from "@/components/ui/Logo";
import IslamicPattern from "@/components/ui/IslamicPattern";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

const steps = [
  { fr: "Téléphone", ar: "الهاتف" },
  { fr: "Vérification", ar: "التحقق" },
  { fr: "Profil", ar: "الملف" },
];

export default function InscriptionPage() {
  const { isRTL } = useLanguage();
  const { sendOtp, verifyOtp, token } = useAuth();
  const { success, error: toastError } = useToast();
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [name, setName] = useState("");
  const [nameAr, setNameAr] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [devOtp, setDevOtp] = useState("");

  const handleSendOtp = async () => {
    if (!phone.trim()) return;
    setError("");
    setLoading(true);
    const res = await sendOtp(phone);
    setLoading(false);
    if (res.success) {
      setStep(1);
      if (res.devOtp) setDevOtp(res.devOtp);
    } else {
      setError(res.error ?? "Erreur lors de l'envoi du code");
    }
  };

  const handleVerifyOtp = async (code: string) => {
    setError("");
    setLoading(true);
    const res = await verifyOtp(phone, code);
    setLoading(false);
    if (res.success) {
      setStep(2);
    } else {
      setError(res.error ?? "Code invalide");
    }
  };

  const handleOtpInput = (val: string, i: number) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (val && i < 5) (document.getElementById(`reg-otp-${i + 1}`) as HTMLInputElement)?.focus();
    if (next.every((d) => d !== "") && next.join("").length === 6) handleVerifyOtp(next.join(""));
  };

  const handleFinish = async () => {
    if (!name.trim()) return;
    setLoading(true);
    try {
      await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ name, nameAr }),
      });
      success(isRTL ? "مرحباً بك في سوق.مر! 🎉" : "Bienvenue sur SOUQ.MR ! 🎉");
      router.push("/tableau-de-bord");
    } catch {
      toastError(isRTL ? "خطأ في إنشاء الحساب" : "Erreur lors de la création du compte");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0C1426 0%, #1B2A4A 100%)" }}>
      <IslamicPattern opacity={0.05} />

      <div className="relative w-full max-w-md">
        <div className="flex justify-center mb-8"><Logo size="lg" /></div>

        {/* Étapes */}
        <div className={`flex items-center justify-center gap-2 mb-8 ${isRTL ? "flex-row-reverse" : ""}`}>
          {steps.map((s, i) => (
            <div key={i} className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
              <div className={`flex items-center gap-1.5 ${isRTL ? "flex-row-reverse" : ""}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  i < step ? "bg-islamic-400 text-white" : i === step ? "text-night-500" : "bg-night-400/30 text-sand-400/40"
                }`}
                  style={i === step ? { background: "linear-gradient(135deg, #C9A84C, #B8922E)" } : undefined}>
                  {i < step ? <CheckCircle2 size={14} /> : i + 1}
                </div>
                <span className={`text-xs hidden sm:block ${i === step ? "text-sand-300" : "text-sand-400/40"}`}>
                  {isRTL ? s.ar : s.fr}
                </span>
              </div>
              {i < steps.length - 1 && <div className={`w-8 h-px ${i < step ? "bg-islamic-400" : "bg-night-400/30"}`} />}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-gold-lg">
          <h2 className={`text-2xl font-display font-bold text-night-500 mb-1 ${isRTL ? "text-right font-arabic" : ""}`}>
            {step === 0 ? (isRTL ? "إنشاء حساب" : "Créer un compte")
              : step === 1 ? (isRTL ? "التحقق" : "Vérification")
              : (isRTL ? "أخبرنا عنك" : "Votre profil")}
          </h2>
          <p className={`text-sm text-night-400/60 mb-6 ${isRTL ? "text-right" : ""}`}>
            {step === 0 ? (isRTL ? "أدخل رقم هاتفك الموريتاني" : "Entrez votre numéro mauritanien (+222)")
              : step === 1 ? (isRTL ? `رمز التحقق أُرسل إلى ${phone}` : `Code envoyé au ${phone}`)
              : (isRTL ? "أكمل ملفك الشخصي" : "Complétez votre profil")}
          </p>

          {devOtp && (
            <div className="flex items-center gap-2 bg-islamic-50 border border-islamic-100 rounded-xl px-4 py-2.5 mb-4 text-sm text-islamic-500">
              <CheckCircle2 size={14} />
              <span>Dev OTP : <strong className="font-mono">{devOtp}</strong></span>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5 mb-4 text-sm text-red-600">
              <AlertCircle size={14} />{error}
            </div>
          )}

          {step === 0 && (
            <div className="space-y-4">
              <div className="relative">
                <input type="tel" placeholder="+222 XX XX XX XX" dir="ltr" required
                  value={phone} onChange={(e) => setPhone(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
                  className="input-field pl-12 text-base tracking-wide" />
                <div className="absolute left-3 top-1/2 -translate-y-1/2"><span className="text-lg">🇲🇷</span></div>
              </div>
              <button onClick={handleSendOtp} disabled={loading || !phone.trim()}
                className="w-full btn-gold py-3.5 text-sm font-bold disabled:opacity-60">
                {loading ? <Loader2 size={18} className="animate-spin mx-auto" /> : (isRTL ? "أرسل رمز التحقق" : "Envoyer le code OTP")}
              </button>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <div className="flex gap-2 justify-center" dir="ltr">
                {otp.map((d, i) => (
                  <input key={i} id={`reg-otp-${i}`} type="text" inputMode="numeric" maxLength={1} value={d}
                    onChange={(e) => handleOtpInput(e.target.value, i)}
                    onKeyDown={(e) => e.key === "Backspace" && !d && i > 0 && (document.getElementById(`reg-otp-${i - 1}`) as HTMLInputElement)?.focus()}
                    className="w-12 h-12 text-center text-xl font-bold border-2 border-sand-200 rounded-xl focus:border-sand-400 outline-none transition-all text-night-500" />
                ))}
              </div>
              {loading && <div className="flex justify-center"><Loader2 size={24} className="animate-spin text-sand-400" /></div>}
              <button onClick={() => handleVerifyOtp(otp.join(""))} disabled={otp.join("").length < 6 || loading}
                className="w-full btn-gold py-3.5 text-sm font-bold disabled:opacity-50">
                {isRTL ? "تأكيد" : "Valider"}
              </button>
              <div className={`flex items-center justify-between text-xs ${isRTL ? "flex-row-reverse" : ""}`}>
                <button onClick={() => { setStep(0); setOtp(["","","","","",""]); }} className="text-night-400/50 hover:text-sand-500">
                  {isRTL ? "← تغيير الرقم" : "← Modifier le numéro"}
                </button>
                <button onClick={handleSendOtp} className="text-sand-500 font-semibold hover:underline">
                  {isRTL ? "إعادة الإرسال" : "Renvoyer le code"}
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className={`text-xs text-night-400/60 mb-1.5 block ${isRTL ? "text-right" : ""}`}>
                  {isRTL ? "اسمك (بالفرنسية)" : "Votre nom (français)"}
                </label>
                <input type="text" placeholder="Mohamed Ould Saleck"
                  value={name} onChange={(e) => setName(e.target.value)}
                  className="input-field" />
              </div>
              <div>
                <label className="text-xs text-night-400/60 mb-1.5 block text-right">
                  اسمك (بالعربية)
                </label>
                <input type="text" dir="rtl" placeholder="محمد ولد سالك"
                  value={nameAr} onChange={(e) => setNameAr(e.target.value)}
                  className="input-field font-arabic text-right" />
              </div>
              <button onClick={handleFinish} disabled={loading || !name.trim()}
                className="w-full btn-gold py-3.5 text-sm font-bold disabled:opacity-60">
                {loading ? <Loader2 size={18} className="animate-spin mx-auto" /> : (isRTL ? "إنشاء الحساب 🎉" : "Créer mon compte 🎉")}
              </button>
            </div>
          )}

          <p className={`text-center text-xs text-night-400/50 mt-4 ${isRTL ? "font-arabic" : ""}`}>
            {isRTL ? "لديك حساب؟ " : "Déjà un compte ? "}
            <Link href="/connexion" className="text-sand-500 font-semibold hover:underline">
              {isRTL ? "تسجيل الدخول" : "Se connecter"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
