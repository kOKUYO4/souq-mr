"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, User, Phone, Lock } from "lucide-react";
import Logo from "@/components/ui/Logo";
import IslamicPattern from "@/components/ui/IslamicPattern";
import { useLanguage } from "@/context/LanguageContext";

const steps = [
  { fr: "Téléphone", ar: "الهاتف" },
  { fr: "Vérification", ar: "التحقق" },
  { fr: "Profil", ar: "الملف" },
];

export default function InscriptionPage() {
  const { isRTL } = useLanguage();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ phone: "", otp: ["", "", "", "", "", ""], name: "", nameAr: "" });

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0C1426 0%, #1B2A4A 100%)" }}
    >
      <IslamicPattern opacity={0.05} />

      <div className="relative w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Logo size="lg" />
        </div>

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
              : step === 1 ? (isRTL ? "أدخل الرمز المرسل" : `Code envoyé au ${form.phone}`)
              : (isRTL ? "أكمل ملفك الشخصي" : "Complétez votre profil")}
          </p>

          {step === 0 && (
            <div className="space-y-4">
              <div className="relative">
                <input type="tel" placeholder="+222 XX XX XX XX" dir="ltr" required
                  value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="input-field pl-12" />
                <div className="absolute left-3 top-1/2 -translate-y-1/2"><span className="text-base">🇲🇷</span></div>
              </div>
              <button onClick={() => form.phone && setStep(1)} className="w-full btn-gold py-3.5 text-sm font-bold">
                {isRTL ? "أرسل رمز التحقق" : "Envoyer le code"}
              </button>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <div className="flex gap-2 justify-center" dir="ltr">
                {form.otp.map((d, i) => (
                  <input key={i} id={`reg-otp-${i}`} type="text" maxLength={1} value={d}
                    onChange={(e) => {
                      const otp = [...form.otp]; otp[i] = e.target.value;
                      setForm({ ...form, otp });
                      if (e.target.value && i < 5) (document.getElementById(`reg-otp-${i + 1}`) as HTMLInputElement)?.focus();
                    }}
                    className="w-12 h-12 text-center text-xl font-bold border-2 border-sand-200 rounded-xl focus:border-sand-400 outline-none text-night-500" />
                ))}
              </div>
              <button onClick={() => setStep(2)} className="w-full btn-gold py-3.5 text-sm font-bold">
                {isRTL ? "تأكيد" : "Valider"}
              </button>
              <button onClick={() => setStep(0)} className="w-full text-xs text-night-400/50 hover:text-sand-500">
                {isRTL ? "← تغيير الرقم" : "← Modifier le numéro"}
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className={`text-xs text-night-400/60 mb-1 block ${isRTL ? "text-right" : ""}`}>
                  {isRTL ? "اسمك (بالفرنسية)" : "Votre nom (français)"}
                </label>
                <input type="text" placeholder="Mohamed Ould Saleck"
                  value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input-field" />
              </div>
              <div>
                <label className={`text-xs text-night-400/60 mb-1 block text-right`}>
                  اسمك (بالعربية)
                </label>
                <input type="text" dir="rtl" placeholder="محمد ولد سالك"
                  value={form.nameAr} onChange={(e) => setForm({ ...form, nameAr: e.target.value })}
                  className="input-field font-arabic text-right" />
              </div>
              <Link href="/" className="w-full btn-gold py-3.5 text-sm font-bold flex items-center justify-center">
                {isRTL ? "إنشاء الحساب 🎉" : "Créer mon compte 🎉"}
              </Link>
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
