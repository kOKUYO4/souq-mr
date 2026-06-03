"use client";

import { useState } from "react";
import Link from "next/link";
import { Phone, Lock, Eye, EyeOff, Globe } from "lucide-react";
import Logo from "@/components/ui/Logo";
import IslamicPattern from "@/components/ui/IslamicPattern";
import { useLanguage } from "@/context/LanguageContext";

export default function ConnexionPage() {
  const { isRTL } = useLanguage();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [showOtp, setShowOtp] = useState(false);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone) setStep("otp");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0C1426 0%, #1B2A4A 100%)" }}
    >
      <IslamicPattern opacity={0.05} />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Logo size="lg" />
        </div>

        {/* Carte */}
        <div className="bg-white rounded-2xl p-8 shadow-gold-lg">
          <h2 className={`text-2xl font-display font-bold text-night-500 mb-1 ${isRTL ? "text-right font-arabic" : ""}`}>
            {isRTL ? "مرحباً بعودتك" : "Bon retour !"}
          </h2>
          <p className={`text-sm text-night-400/60 mb-6 ${isRTL ? "text-right" : ""}`}>
            {isRTL ? "سجّل دخولك للمتابعة" : "Connectez-vous pour continuer"}
          </p>

          {step === "phone" ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              {/* Téléphone */}
              <div>
                <label className={`text-sm text-night-400 mb-1.5 block ${isRTL ? "text-right" : ""}`}>
                  {isRTL ? "رقم الهاتف" : "Numéro de téléphone"}
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+222 XX XX XX XX"
                    dir="ltr"
                    required
                    className="input-field pl-12"
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <span className="text-base">🇲🇷</span>
                  </div>
                </div>
              </div>

              <button type="submit" className="w-full btn-gold py-3.5 text-sm font-bold">
                {isRTL ? "أرسل رمز التحقق" : "Envoyer le code OTP"}
              </button>

              <div className="relative flex items-center my-4">
                <div className="flex-1 h-px bg-sand-200" />
                <span className="px-3 text-xs text-night-400/40">{isRTL ? "أو" : "ou"}</span>
                <div className="flex-1 h-px bg-sand-200" />
              </div>

              <button type="button" className="w-full flex items-center justify-center gap-3 py-3 border-2 border-sand-200 rounded-xl text-sm font-semibold text-night-500 hover:border-sand-300 hover:bg-sand-50 transition-all">
                <Globe size={18} className="text-blue-600" />
                {isRTL ? "الدخول بفيسبوك" : "Continuer avec Facebook"}
              </button>

              <p className={`text-center text-xs text-night-400/50 ${isRTL ? "font-arabic" : ""}`}>
                {isRTL ? "ليس لديك حساب؟ " : "Pas encore de compte ? "}
                <Link href="/inscription" className="text-sand-500 font-semibold hover:underline">
                  {isRTL ? "إنشاء حساب" : "S'inscrire"}
                </Link>
              </p>
            </form>
          ) : (
            <form className="space-y-4">
              <p className={`text-sm text-night-400/70 mb-4 ${isRTL ? "text-right" : ""}`}>
                {isRTL ? `تم إرسال الرمز إلى ${phone}` : `Code envoyé au ${phone}`}
              </p>
              <div className="flex gap-2 justify-center" dir="ltr">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => {
                      const newOtp = [...otp];
                      newOtp[i] = e.target.value;
                      setOtp(newOtp);
                      if (e.target.value && i < 5) {
                        (document.getElementById(`otp-${i + 1}`) as HTMLInputElement)?.focus();
                      }
                    }}
                    id={`otp-${i}`}
                    className="w-12 h-12 text-center text-xl font-bold border-2 border-sand-200 rounded-xl focus:border-sand-400 outline-none transition-all text-night-500"
                  />
                ))}
              </div>
              <button type="submit" className="w-full btn-gold py-3.5 text-sm font-bold">
                {isRTL ? "تأكيد" : "Valider"}
              </button>
              <button type="button" onClick={() => setStep("phone")} className="w-full text-xs text-night-400/50 hover:text-sand-500 transition-colors">
                {isRTL ? "← تغيير الرقم" : "← Modifier le numéro"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
