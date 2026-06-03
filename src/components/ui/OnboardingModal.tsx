"use client";

import { useState, useEffect } from "react";
import { X, ArrowRight, ArrowLeft, Tag, MessageCircle, Shield, Smartphone } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";

const steps = {
  fr: [
    {
      icon: "🏪",
      title: "Bienvenue sur SOUQ.MR !",
      desc: "La première marketplace mauritanienne. Achetez, vendez et négociez en toute confiance.",
      cta: "Commencer →",
    },
    {
      icon: "🔍",
      title: "Trouvez n'importe quoi",
      desc: "Voitures, téléphones, vêtements, animaux — des milliers d'annonces dans toute la Mauritanie.",
      cta: "Suivant →",
    },
    {
      icon: "🤝",
      title: "Négociez comme au souk",
      desc: "Faites une offre, recevez une contre-offre. Le vrai esprit marchand mauritanien, digitalisé.",
      cta: "Suivant →",
    },
    {
      icon: "🛡️",
      title: "100% sécurisé",
      desc: "Vendeurs vérifiés, Escrow intégré, paiement à la livraison. Vous êtes protégé.",
      cta: "C'est parti !",
    },
  ],
  ar: [
    {
      icon: "🏪",
      title: "مرحباً في سوق.مر!",
      desc: "أول سوق رقمي موريتاني. اشترِ وبِع وتفاوض بثقة كاملة.",
      cta: "ابدأ ←",
    },
    {
      icon: "🔍",
      title: "ابحث عن أي شيء",
      desc: "سيارات وهواتف وملابس وحيوانات — آلاف الإعلانات في كل موريتانيا.",
      cta: "التالي ←",
    },
    {
      icon: "🤝",
      title: "تفاوض كما في السوق",
      desc: "قدّم عرضاً، تلقَّ عرضاً مضاداً. روح السوق الموريتاني الأصيلة، بشكل رقمي.",
      cta: "التالي ←",
    },
    {
      icon: "🛡️",
      title: "آمن 100%",
      desc: "بائعون موثقون، ضمان مالي مدمج، دفع عند الاستلام. أنت محمي.",
      cta: "هيا نبدأ!",
    },
  ],
};

export default function OnboardingModal() {
  const { isRTL, locale } = useLanguage();
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(0);
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  useEffect(() => {
    if (typeof window === "undefined") return;
    const seen = localStorage.getItem("souq-onboarding-seen");
    if (!seen) {
      const timer = setTimeout(() => setShow(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismiss = () => {
    setShow(false);
    localStorage.setItem("souq-onboarding-seen", "1");
  };

  const next = () => {
    if (step < steps[locale].length - 1) {
      setStep((s) => s + 1);
    } else {
      dismiss();
    }
  };

  if (!show) return null;

  const current = steps[locale][step];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-night-500/70 backdrop-blur-sm">
      <div className={`bg-white rounded-3xl p-8 max-w-sm w-full relative shadow-gold-lg ${isRTL ? "text-right" : "text-center"}`}>
        {/* Close */}
        <button onClick={dismiss} className="absolute top-4 right-4 p-1.5 text-night-400/40 hover:text-night-400 transition-colors rounded-lg">
          <X size={16} />
        </button>

        {/* Logo */}
        <div className="text-5xl mb-4 text-center">{current.icon}</div>

        <h2 className={`text-xl font-bold text-night-500 mb-2 ${isRTL ? "font-arabic" : "font-display"}`}>
          {current.title}
        </h2>
        <p className={`text-sm text-night-400/70 mb-8 leading-relaxed ${isRTL ? "font-arabic" : ""}`}>
          {current.desc}
        </p>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {steps[locale].map((_, i) => (
            <div key={i}
              className={`h-1.5 rounded-full transition-all ${i === step ? "w-6 bg-sand-400" : "w-1.5 bg-sand-200"}`} />
          ))}
        </div>

        <button
          onClick={next}
          className={`w-full py-3.5 rounded-2xl text-sm font-bold text-night-500 flex items-center justify-center gap-2 ${isRTL ? "flex-row-reverse font-arabic" : ""}`}
          style={{ background: "linear-gradient(135deg, #C9A84C, #B8922E)" }}
        >
          {current.cta}
        </button>

        {step === 0 && (
          <button onClick={dismiss} className={`w-full mt-3 text-xs text-night-400/50 hover:text-night-400/80 transition-colors ${isRTL ? "font-arabic" : ""}`}>
            {isRTL ? "تخطي المقدمة" : "Passer l'introduction"}
          </button>
        )}
      </div>
    </div>
  );
}
