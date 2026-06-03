"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Phone, Globe, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import Logo from "@/components/ui/Logo";
import IslamicPattern from "@/components/ui/IslamicPattern";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

export default function ConnexionPage() {
  const { isRTL } = useLanguage();
  const { sendOtp, verifyOtp } = useAuth();
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [devOtp, setDevOtp] = useState("");

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await sendOtp(phone);
    setLoading(false);
    if (res.success) {
      setStep("otp");
      if (res.devOtp) setDevOtp(res.devOtp);
    } else {
      setError(res.error ?? "Erreur lors de l'envoi du code");
    }
  };

  const handleVerify = async (code: string) => {
    setError("");
    setLoading(true);
    const res = await verifyOtp(phone, code);
    setLoading(false);
    if (res.success) {
      router.push("/tableau-de-bord");
    } else {
      setError(res.error ?? "Code invalide");
    }
  };

  const handleOtpInput = (value: string, i: number) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...otp];
    next[i] = value;
    setOtp(next);
    if (value && i < 5) (document.getElementById(`otp-${i + 1}`) as HTMLInputElement)?.focus();
    if (next.every((d) => d !== "") && next.join("").length === 6) handleVerify(next.join(""));
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0C1426, #1B2A4A)" }}>
      <IslamicPattern opacity={0.05} />

      <div className="relative w-full max-w-md">
        <div className="flex justify-center mb-8"><Logo size="lg" /></div>

        <div className="bg-white rounded-2xl p-8 shadow-gold-lg">
          <h2 className={`text-2xl font-display font-bold text-night-500 mb-1 ${isRTL ? "text-right font-arabic" : ""}`}>
            {isRTL ? "مرحباً بعودتك" : "Bon retour !"}
          </h2>
          <p className={`text-sm text-night-400/60 mb-6 ${isRTL ? "text-right" : ""}`}>
            {step === "phone"
              ? (isRTL ? "أدخل رقم هاتفك الموريتاني" : "Connectez-vous avec votre numéro mauritanien")
              : (isRTL ? `رمز التحقق أُرسل إلى ${phone}` : `Code envoyé au ${phone}`)}
          </p>

          {/* Dev hint */}
          {devOtp && (
            <div className="flex items-center gap-2 bg-islamic-50 border border-islamic-100 rounded-xl px-4 py-2.5 mb-4 text-sm text-islamic-500">
              <CheckCircle2 size={14} />
              <span>Dev OTP : <strong className="font-mono">{devOtp}</strong></span>
            </div>
          )}

          {/* Erreur */}
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5 mb-4 text-sm text-red-600">
              <AlertCircle size={14} />
              {error}
            </div>
          )}

          {step === "phone" ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="relative">
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                  placeholder="+222 XX XX XX XX" dir="ltr" required
                  className="input-field pl-12 text-base tracking-wide" />
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <span className="text-lg">🇲🇷</span>
                </div>
              </div>
              <button type="submit" disabled={loading} className="w-full btn-gold py-3.5 font-bold disabled:opacity-60">
                {loading ? <Loader2 size={18} className="animate-spin mx-auto" /> : (isRTL ? "أرسل رمز التحقق" : "Envoyer le code OTP")}
              </button>

              <div className="relative flex items-center my-2">
                <div className="flex-1 h-px bg-sand-200" />
                <span className="px-3 text-xs text-night-400/40">{isRTL ? "أو" : "ou"}</span>
                <div className="flex-1 h-px bg-sand-200" />
              </div>

              <button type="button" className="w-full flex items-center justify-center gap-3 py-3 border-2 border-sand-200 rounded-xl text-sm font-semibold text-night-500 hover:border-sand-300 hover:bg-sand-50 transition-all">
                <Globe size={18} className="text-blue-500" />
                {isRTL ? "الدخول بجوجل" : "Continuer avec Google"}
              </button>

              <p className={`text-center text-xs text-night-400/50 ${isRTL ? "font-arabic" : ""}`}>
                {isRTL ? "ليس لديك حساب؟ " : "Pas de compte ? "}
                <Link href="/inscription" className="text-sand-500 font-semibold hover:underline">{isRTL ? "إنشاء حساب" : "S'inscrire"}</Link>
              </p>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex gap-2 justify-center" dir="ltr">
                {otp.map((d, i) => (
                  <input key={i} id={`otp-${i}`} type="text" inputMode="numeric" maxLength={1} value={d}
                    onChange={(e) => handleOtpInput(e.target.value, i)}
                    onKeyDown={(e) => e.key === "Backspace" && !d && i > 0 && (document.getElementById(`otp-${i - 1}`) as HTMLInputElement)?.focus()}
                    className="w-12 h-12 text-center text-xl font-bold border-2 border-sand-200 rounded-xl focus:border-sand-400 outline-none transition-all text-night-500" />
                ))}
              </div>

              {loading && (
                <div className="flex justify-center">
                  <Loader2 size={24} className="animate-spin text-sand-400" />
                </div>
              )}

              <button onClick={() => handleVerify(otp.join(""))} disabled={otp.join("").length < 6 || loading}
                className="w-full btn-gold py-3.5 font-bold disabled:opacity-50">
                {isRTL ? "تأكيد" : "Valider"}
              </button>
              <div className={`flex items-center justify-between text-xs ${isRTL ? "flex-row-reverse" : ""}`}>
                <button onClick={() => setStep("phone")} className="text-night-400/50 hover:text-sand-500">
                  {isRTL ? "← تغيير الرقم" : "← Modifier le numéro"}
                </button>
                <button onClick={() => handleSendOtp({ preventDefault: () => {} } as any)} className="text-sand-500 font-semibold hover:underline">
                  {isRTL ? "إعادة الإرسال" : "Renvoyer le code"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
