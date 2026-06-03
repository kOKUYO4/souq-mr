"use client";

import { MapPin, Clock, Truck, CheckCircle2, Phone } from "lucide-react";
import Link from "next/link";
import IslamicPattern from "@/components/ui/IslamicPattern";
import { useLanguage } from "@/context/LanguageContext";

const zones = {
  fr: [
    { zone: "Zone 1 — Centre Nouakchott", neighborhoods: ["Tevragh-Zeina", "Ksar", "Cinquième", "Capitale"], price: "500 MRU", time: "30-60 min" },
    { zone: "Zone 2 — Nouakchott Périphérie", neighborhoods: ["Arafat", "El Mina", "Ryad", "Teyarett", "Sebkha"], price: "800 MRU", time: "1-2h" },
    { zone: "Zone 3 — Nouakchott Étendue", neighborhoods: ["Dar Naim", "Toujounine", "Legrane", "Vrg"], price: "1 200 MRU", time: "2-3h" },
    { zone: "Nouadhibou", neighborhoods: ["Centre-ville", "Numerowatt", "PK5", "Cansado"], price: "2 500 MRU", time: "Lendemain" },
    { zone: "Villes intérieures", neighborhoods: ["Rosso", "Kaédi", "Kiffa", "Zouerate"], price: "Selon distance", time: "2-5 jours" },
  ],
  ar: [
    { zone: "المنطقة 1 — وسط نواكشوط", neighborhoods: ["تيفرغ زينة", "القصر", "الخامسة", "العاصمة"], price: "500 أوقية", time: "30-60 دقيقة" },
    { zone: "المنطقة 2 — أطراف نواكشوط", neighborhoods: ["عرفات", "الميناء", "الرياض", "تيارت", "السبخة"], price: "800 أوقية", time: "1-2 ساعة" },
    { zone: "المنطقة 3 — نواكشوط الموسعة", neighborhoods: ["دار النعيم", "توجنين", "لكران", "VRG"], price: "1,200 أوقية", time: "2-3 ساعات" },
    { zone: "نواذيبو", neighborhoods: ["وسط المدينة", "نوميروات", "PK5", "كانصادو"], price: "2,500 أوقية", time: "في اليوم التالي" },
    { zone: "المدن الداخلية", neighborhoods: ["روصو", "قيدي", "كيفة", "زويرات"], price: "حسب المسافة", time: "2-5 أيام" },
  ],
};

const tips = {
  fr: [
    "Vérifiez toujours l'article avant de signer la réception",
    "Le paiement à la livraison est disponible pour toutes les zones",
    "Vous pouvez suivre votre livreur en temps réel via WhatsApp",
    "En cas de problème, appelez notre service client au +222 XX XX XX",
  ],
  ar: [
    "تحقق دائماً من المنتج قبل التوقيع على الاستلام",
    "الدفع عند الاستلام متاح لجميع المناطق",
    "يمكنك متابعة السائق في الوقت الفعلي عبر واتساب",
    "في حالة مشكلة، اتصل بخدمة العملاء على +222 XX XX XX",
  ],
};

export default function LivraisonPage() {
  const { isRTL, locale } = useLanguage();

  const zoneList = zones[locale];
  const tipList = tips[locale];

  return (
    <div className="min-h-screen bg-sand-gradient">
      {/* Header */}
      <div className="relative py-16 overflow-hidden" style={{ background: "linear-gradient(135deg, #1B2A4A, #0C1426)" }}>
        <IslamicPattern opacity={0.05} />
        <div className={`relative max-w-4xl mx-auto px-4 sm:px-6 text-center ${isRTL ? "font-arabic" : ""}`}>
          <h1 className="text-4xl font-display font-bold text-white mb-4">
            {isRTL ? "التوصيل والشحن" : "Livraison & Expédition"}
          </h1>
          <p className="text-sand-300/70 max-w-lg mx-auto">
            {isRTL
              ? "نغطي جميع أحياء نواكشوط ونواذيبو والمدن الرئيسية"
              : "Nous couvrons tous les quartiers de Nouakchott, Nouadhibou et les principales villes"}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-10">
        {/* Stats rapides */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: Clock, n: "< 2h", labelFr: "En ville", labelAr: "في المدينة" },
            { icon: Truck, n: "15+", labelFr: "Villes couvertes", labelAr: "مدينة مغطاة" },
            { icon: CheckCircle2, n: "98%", labelFr: "Livraisons réussies", labelAr: "توصيلات ناجحة" },
          ].map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className={`bg-white rounded-2xl p-4 shadow-card text-center ${isRTL ? "font-arabic" : ""}`}>
                <Icon size={20} className="text-sand-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-sand-500">{s.n}</p>
                <p className="text-xs text-night-400/60">{isRTL ? s.labelAr : s.labelFr}</p>
              </div>
            );
          })}
        </div>

        {/* Zones */}
        <div>
          <h2 className={`font-bold text-night-500 text-xl mb-5 ${isRTL ? "font-arabic text-right" : ""}`}>
            {isRTL ? "أسعار التوصيل حسب المنطقة" : "Tarifs par zone de livraison"}
          </h2>
          <div className="space-y-3">
            {zoneList.map((z, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 shadow-sm">
                <div className={`flex items-start justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
                  <div className={isRTL ? "text-right" : ""}>
                    <h3 className={`font-bold text-night-500 mb-2 ${isRTL ? "font-arabic" : ""}`}>{z.zone}</h3>
                    <div className={`flex flex-wrap gap-1.5 ${isRTL ? "flex-row-reverse" : ""}`}>
                      {z.neighborhoods.map((n, j) => (
                        <span key={j} className="px-2 py-0.5 bg-sand-100 rounded-lg text-xs text-night-400/70">
                          {n}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className={`flex-shrink-0 text-${isRTL ? "left" : "right"} ml-4`}>
                    <p className="text-lg font-bold text-sand-500">{z.price}</p>
                    <div className={`flex items-center gap-1 text-xs text-night-400/60 mt-0.5 ${isRTL ? "flex-row-reverse" : ""}`}>
                      <Clock size={11} />
                      {z.time}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="bg-white rounded-2xl p-6 shadow-card">
          <h2 className={`font-bold text-night-500 text-lg mb-4 ${isRTL ? "font-arabic text-right" : ""}`}>
            {isRTL ? "نصائح الاستلام" : "Conseils de réception"}
          </h2>
          <ul className="space-y-3">
            {tipList.map((tip, i) => (
              <li key={i} className={`flex items-start gap-3 text-sm text-night-400/80 ${isRTL ? "flex-row-reverse font-arabic text-right" : ""}`}>
                <CheckCircle2 size={16} className="text-islamic-400 flex-shrink-0 mt-0.5" />
                {tip}
              </li>
            ))}
          </ul>
        </div>

        {/* CTA contact */}
        <div className={`flex flex-wrap gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
          <Link href="/contact" className="btn-night text-sm py-3 px-6">
            {isRTL ? "تواصل معنا" : "Nous contacter"}
          </Link>
          <Link href="/annonces" className="btn-gold text-sm py-3 px-6">
            {isRTL ? "تصفح الإعلانات" : "Parcourir les annonces"}
          </Link>
        </div>
      </div>
    </div>
  );
}
