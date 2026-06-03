"use client";

import { useState } from "react";
import { CheckCircle2, Star, Zap, BarChart3, Shield, Tag } from "lucide-react";
import IslamicPattern from "@/components/ui/IslamicPattern";
import { useLanguage } from "@/context/LanguageContext";

const plans = [
  {
    id: "starter",
    nameFr: "Vendeur Standard", nameAr: "بائع عادي",
    price: 0,
    period: { fr: "Gratuit", ar: "مجاناً" },
    features: {
      fr: ["5 annonces actives", "Photos standard", "Badge profil de base", "Support email"],
      ar: ["5 إعلانات نشطة", "صور عادية", "شارة ملف أساسية", "دعم بريد إلكتروني"],
    },
    cta: { fr: "Commencer gratuitement", ar: "ابدأ مجاناً" },
    highlighted: false,
    color: "#4A5568",
  },
  {
    id: "pro",
    nameFr: "Marchand Pro", nameAr: "تاجر محترف",
    price: 4990,
    period: { fr: "/mois", ar: "/شهر" },
    features: {
      fr: ["Annonces illimitées", "Photos HD + vidéo", "Badge «Marchand Pro»", "Annonces boostées x3", "Statistiques avancées", "Support prioritaire"],
      ar: ["إعلانات غير محدودة", "صور HD + فيديو", "شارة «تاجر محترف»", "إعلانات مُعززة x3", "إحصائيات متقدمة", "دعم أولوية"],
    },
    cta: { fr: "Devenir Marchand Pro", ar: "كن تاجراً محترفاً" },
    highlighted: true,
    color: "#C9A84C",
  },
  {
    id: "business",
    nameFr: "Business", nameAr: "بزنس",
    price: 14990,
    period: { fr: "/mois", ar: "/شهر" },
    features: {
      fr: ["Tout Pro inclus", "Boutique personnalisée", "API d'intégration", "Account manager dédié", "Publicité sur l'accueil", "Rapport mensuel"],
      ar: ["كل مزايا برو", "متجر مخصص", "واجهة API", "مدير حساب مخصص", "إعلان على الصفحة الرئيسية", "تقرير شهري"],
    },
    cta: { fr: "Nous contacter", ar: "تواصل معنا" },
    highlighted: false,
    color: "#1B2A4A",
  },
];

export default function ProPage() {
  const { isRTL, locale } = useLanguage();
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");
  const discount = 0.20;

  function getPrice(base: number) {
    if (base === 0) return 0;
    if (billing === "annual") return Math.round(base * (1 - discount));
    return base;
  }

  return (
    <div className="min-h-screen bg-sand-gradient">
      {/* Hero */}
      <div className="relative py-20 overflow-hidden" style={{ background: "linear-gradient(135deg, #1B2A4A, #0C1426)" }}>
        <IslamicPattern opacity={0.05} />
        <div className={`relative max-w-4xl mx-auto px-4 sm:px-6 text-center ${isRTL ? "font-arabic" : ""}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sand-400/15 border border-sand-400/20 text-sand-300 text-sm mb-6">
            <Star size={14} className="text-sand-400" />
            {isRTL ? "للتجار المحترفين" : "Pour les marchands professionnels"}
          </div>
          <h1 className="text-4xl font-display font-bold text-white mb-4">
            {isRTL ? "طوّر تجارتك على سوق.مر" : "Développez votre business sur SOUQ.MR"}
          </h1>
          <p className="text-sand-300/70 max-w-xl mx-auto">
            {isRTL
              ? "انضم إلى آلاف التجار المحترفين وزد مبيعاتك"
              : "Rejoignez des milliers de marchands pro et boostez vos ventes"}
          </p>
        </div>
      </div>

      {/* Plans tarifaires */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        {/* Toggle mensuel / annuel */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex items-center gap-1 bg-sand-100 rounded-xl p-1">
            <button
              onClick={() => setBilling("monthly")}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                billing === "monthly" ? "bg-white text-night-500 shadow-sm" : "text-night-400/70 hover:text-night-500"
              }`}
            >
              {isRTL ? "شهري" : "Mensuel"}
            </button>
            <button
              onClick={() => setBilling("annual")}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
                billing === "annual" ? "bg-white text-night-500 shadow-sm" : "text-night-400/70 hover:text-night-500"
              }`}
            >
              {isRTL ? "سنوي" : "Annuel"}
              <span className="text-[10px] text-white font-bold px-1.5 py-0.5 rounded-full" style={{ background: "linear-gradient(135deg, #2D6A4F, #1A3F2A)" }}>
                -20%
              </span>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 ${
                plan.highlighted ? "ring-2 ring-sand-400 shadow-gold-lg" : "shadow-card"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute top-0 left-0 right-0 h-1"
                  style={{ background: "linear-gradient(90deg, #C9A84C, #E8C96A, #B8922E)" }} />
              )}
              <div className={`p-6 ${plan.highlighted ? "bg-night-500 text-white" : "bg-white"}`}>
                {plan.highlighted && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-night-500 mb-3"
                    style={{ background: "linear-gradient(135deg, #C9A84C, #B8922E)" }}>
                    <Zap size={11} fill="currentColor" />
                    {isRTL ? "الأكثر شيوعاً" : "Plus populaire"}
                  </div>
                )}
                <h3 className={`font-bold text-lg mb-1 ${plan.highlighted ? "text-white" : "text-night-500"} ${isRTL ? "text-right" : ""}`}>
                  {isRTL ? plan.nameAr : plan.nameFr}
                </h3>
                <div className={`flex items-baseline gap-1 mb-6 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <span className={`text-3xl font-display font-bold ${plan.highlighted ? "text-sand-400" : "text-night-500"}`}>
                    {plan.price === 0 ? (isRTL ? "مجاني" : "Gratuit") : getPrice(plan.price).toLocaleString()}
                  </span>
                  {plan.price > 0 && (
                    <span className={`text-sm ${plan.highlighted ? "text-sand-300/70" : "text-night-400/60"}`}>
                      MRU {isRTL ? plan.period.ar : plan.period.fr}
                    </span>
                  )}
                  {plan.price > 0 && billing === "annual" && (
                    <span className={`text-xs line-through ml-1 ${plan.highlighted ? "text-sand-400/50" : "text-night-400/40"}`}>
                      {plan.price.toLocaleString()}
                    </span>
                  )}
                </div>

                <ul className="space-y-2.5 mb-6">
                  {(isRTL ? plan.features.ar : plan.features.fr).map((feat, i) => (
                    <li key={i} className={`flex items-center gap-2 text-sm ${plan.highlighted ? "text-sand-200/80" : "text-night-400/70"} ${isRTL ? "flex-row-reverse" : ""}`}>
                      <CheckCircle2 size={14} className={plan.highlighted ? "text-sand-400" : "text-islamic-400"} />
                      {feat}
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${
                    plan.highlighted
                      ? "text-night-500 hover:opacity-90"
                      : "bg-night-500 text-white hover:bg-night-600"
                  }`}
                  style={plan.highlighted ? { background: "linear-gradient(135deg, #C9A84C, #B8922E)" } : undefined}
                >
                  {isRTL ? plan.cta.ar : plan.cta.fr}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Fonctionnalités pro */}
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            { icon: BarChart3, titleFr: "Statistiques avancées", titleAr: "إحصائيات متقدمة", descFr: "Vues, clics, conversions, revenus en temps réel", descAr: "المشاهدات والنقرات والتحويلات والإيرادات لحظياً" },
            { icon: Tag, titleFr: "Boost d'annonces", titleAr: "تعزيز الإعلانات", descFr: "Mettez vos annonces en avant pour plus de visibilité", descAr: "أبرز إعلاناتك لمزيد من الظهور" },
            { icon: Shield, titleFr: "Protection vendeur", titleAr: "حماية البائع", descFr: "Escrow automatique et résolution des litiges", descAr: "ضمان مالي تلقائي وحل النزاعات" },
          ].map((feat, i) => (
            <div key={i} className={`bg-white rounded-2xl p-6 shadow-card ${isRTL ? "text-right" : ""}`}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-white"
                style={{ background: "linear-gradient(135deg, #1B2A4A, #2D3E6A)" }}>
                <feat.icon size={22} />
              </div>
              <h4 className="font-bold text-night-500 mb-1">{isRTL ? feat.titleAr : feat.titleFr}</h4>
              <p className="text-sm text-night-400/70">{isRTL ? feat.descAr : feat.descFr}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
