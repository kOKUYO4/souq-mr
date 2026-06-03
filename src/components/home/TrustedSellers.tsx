"use client";

import Link from "next/link";
import { Star, ShieldCheck, Store, CheckCircle2, MessageCircle } from "lucide-react";
import { sellers } from "@/data/mockData";
import { useLanguage } from "@/context/LanguageContext";

const badgeConfig = {
  pro: { label: { fr: "Marchand Pro", ar: "تاجر محترف" }, icon: <Star size={12} fill="currentColor" />, style: { background: "linear-gradient(135deg, #C9A84C, #B8922E)" }, textColor: "text-night-500" },
  verified: { label: { fr: "Vérifié", ar: "موثق" }, icon: <ShieldCheck size={12} />, style: { background: "#E8F4EE" }, textColor: "text-islamic-400" },
  regular: { label: { fr: "Habitué", ar: "زبون دائم" }, icon: <Store size={12} />, style: { background: "#F5EDD9" }, textColor: "text-sand-600" },
};

export default function TrustedSellers() {
  const { t, isRTL, locale } = useLanguage();

  return (
    <section className="py-16 bg-sand-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* En-tête */}
        <div className={`text-center mb-12 ${isRTL ? "font-arabic" : ""}`}>
          <p className="text-sand-500 text-sm font-semibold uppercase tracking-widest mb-1">
            {isRTL ? "ثقة وأمان" : "Confiance & Sécurité"}
          </p>
          <h2 className="section-title mb-2">{t.trust.title}</h2>
          <p className="text-night-400/70 text-sm max-w-lg mx-auto">{t.trust.subtitle}</p>
        </div>

        {/* Grille vendeurs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          {sellers.map((seller) => {
            const badge = badgeConfig[seller.badge];
            return (
              <Link
                key={seller.id}
                href={`/profil/${seller.id}`}
                className="bg-white rounded-2xl p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover group"
                style={{ boxShadow: "0 2px 16px rgba(27,42,74,0.08)" }}
              >
                {/* Avatar */}
                <div className="relative mx-auto w-14 h-14 mb-3">
                  <img
                    src={seller.avatar}
                    alt={seller.name}
                    className="w-full h-full rounded-full bg-sand-100"
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white flex items-center justify-center">
                    <CheckCircle2 size={14} className="text-islamic-400" />
                  </div>
                  {/* Online indicator */}
                  <div className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white bg-islamic-400" />
                </div>

                {/* Nom */}
                <p className={`text-xs font-semibold text-night-500 mb-1 line-clamp-1 ${isRTL ? "font-arabic" : ""}`}>
                  {isRTL ? seller.nameAr : seller.name}
                </p>

                {/* Badge */}
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${badge.textColor}`}
                  style={badge.style}
                >
                  {badge.icon}
                  {badge.label[locale]}
                </span>

                {/* Note */}
                <div className="flex items-center justify-center gap-1 mt-2">
                  <Star size={11} className="text-sand-400 fill-sand-400" />
                  <span className="text-xs font-bold text-night-500">{seller.rating}</span>
                  <span className="text-[10px] text-night-400/50">({seller.reviews})</span>
                </div>

                {/* Nombre d'annonces + response time */}
                <p className="text-[10px] text-night-400/50 mt-1">
                  {seller.listings} {isRTL ? "إعلان" : "annonces"}
                </p>
                <p className="text-[10px] text-islamic-400 mt-0.5">
                  ⚡ {seller.responseTime || "< 2h"}
                </p>
              </Link>
            );
          })}
        </div>

        {/* Bandeau confiance */}
        <div
          className="rounded-2xl p-8 text-white"
          style={{ background: "linear-gradient(135deg, #1B2A4A 0%, #2D3E6A 100%)" }}
        >
          <div className={`grid sm:grid-cols-3 gap-6 text-center ${isRTL ? "font-arabic" : ""}`}>
            {[
              { icon: "🛡️", titleFr: "Paiement sécurisé", titleAr: "دفع آمن", descFr: "Escrow intégré pour les grandes transactions", descAr: "ضمان مالي للمعاملات الكبيرة" },
              { icon: "✅", titleFr: "Vendeurs vérifiés", titleAr: "بائعون موثقون", descFr: "Identité confirmée par numéro mauritanien", descAr: "هوية موثقة برقم هاتف موريتاني" },
              { icon: "🤝", titleFr: "Parrainage communautaire", titleAr: "ضمان مجتمعي", descFr: "Un membre vérifié peut cautionner un nouveau", descAr: "عضو موثق يضمن عضواً جديداً" },
            ].map((item, i) => (
              <div key={i}>
                <div className="text-3xl mb-3">{item.icon}</div>
                <h4 className="font-semibold text-sand-300 mb-1">
                  {isRTL ? item.titleAr : item.titleFr}
                </h4>
                <p className="text-sand-400/60 text-sm">
                  {isRTL ? item.descAr : item.descFr}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
