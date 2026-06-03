"use client";

import { MapPin, Mic, CreditCard, Moon } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function UniqueFeatures() {
  const { isRTL } = useLanguage();

  const features = isRTL
    ? [
        {
          icon: <MapPin size={24} />,
          color: "#2D6A4F",
          bg: "#E8F4EE",
          title: "توصيل بالحي",
          desc: "شبكة مناطق نواكشوط مع سائقين مستقلين. تقدير الوقت بالساعات لا الأيام.",
          tag: "📍 تسليم فوري",
        },
        {
          icon: <Mic size={24} />,
          color: "#1B2A4A",
          bg: "#E8ECF4",
          title: "سوق صوتي",
          desc: "أضف إعلانك بصوتك بالحسانية. للتجار الذين لا يتقنون الكتابة.",
          tag: "🎙️ حصري",
        },
        {
          icon: <CreditCard size={24} />,
          color: "#C9A84C",
          bg: "#F5EDD9",
          title: "ادفع كما تريد",
          desc: "دفع عند الاستلام، بانكيلي/مصرفي، أو تسديد على أقساط (تونتين رقمي).",
          tag: "💳 مرونة",
        },
        {
          icon: <Moon size={24} />,
          color: "#9B4B8A",
          bg: "#F3E8F3",
          title: "وضع رمضان والأعياد",
          desc: "واجهة خاصة في رمضان والتباسكي. تصنيفات موسمية وعروض تلقائية.",
          tag: "🌙 موسمي",
        },
      ]
    : [
        {
          icon: <MapPin size={24} />,
          color: "#2D6A4F",
          bg: "#E8F4EE",
          title: "Livraison par Quartier",
          desc: "Découpage par quartiers de Nouakchott avec livreurs géolocalisés. Délai en heures, pas en jours.",
          tag: "📍 Livraison express",
        },
        {
          icon: <Mic size={24} />,
          color: "#1B2A4A",
          bg: "#E8ECF4",
          title: "Souk Vocal",
          desc: "Créez une annonce par message vocal en Hassaniya. Pour les vendeurs peu alphabétisés.",
          tag: "🎙️ Exclusif",
        },
        {
          icon: <CreditCard size={24} />,
          color: "#C9A84C",
          bg: "#F5EDD9",
          title: "Paye Comme Tu Veux",
          desc: "Paiement à la livraison, Bankily/Masrvi, ou en plusieurs fois (tontine numérique).",
          tag: "💳 Flexible",
        },
        {
          icon: <Moon size={24} />,
          color: "#9B4B8A",
          bg: "#F3E8F3",
          title: "Mode Ramadan & Fêtes",
          desc: "Interface spéciale pendant Ramadan et Tabaski. Catégories saisonnières et promos automatiques.",
          tag: "🌙 Saisonnier",
        },
      ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className={`text-center mb-12 ${isRTL ? "font-arabic" : ""}`}>
          <p className="text-sand-500 text-sm font-semibold uppercase tracking-widest mb-1">
            {isRTL ? "ما يميزنا" : "Ce qui nous différencie"}
          </p>
          <h2 className="section-title mb-2">
            {isRTL ? "ميزات لا تجدها في أي مكان آخر" : "Des fonctionnalités uniques au monde"}
          </h2>
          <p className="text-night-400/70 text-sm max-w-lg mx-auto">
            {isRTL
              ? "صُمم خصيصاً للسوق الموريتاني"
              : "Conçu exclusivement pour le marché mauritanien"}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, i) => {
            const isVocal = feat.title === "Souk Vocal" || feat.title === "السوق الصوتي";
            const card = (
              <div
                key={i}
                className={`relative p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover ${isRTL ? "text-right" : ""} ${isVocal ? "cursor-pointer ring-1 ring-night-400/10" : ""}`}
                style={{ background: feat.bg, boxShadow: "0 2px 16px rgba(27,42,74,0.06)" }}
              >
                {/* Tag */}
                <div className="absolute top-4 right-4">
                  <span className="text-xs font-semibold text-night-400/50">{feat.tag}</span>
                </div>

                {/* Icône */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-white"
                  style={{ background: feat.color }}
                >
                  {feat.icon}
                </div>

                <h3 className="font-bold text-night-500 mb-2">{feat.title}</h3>
                <p className="text-sm text-night-400/70 leading-relaxed">{feat.desc}</p>
                {isVocal && (
                  <p className="text-xs text-sand-500 font-semibold mt-3">
                    {isRTL ? "جرّب الآن ←" : "Essayer →"}
                  </p>
                )}
              </div>
            );
            return isVocal ? <Link key={i} href="/souk-vocal">{card}</Link> : <div key={i}>{card}</div>;
          })}
        </div>
      </div>
    </section>
  );
}
