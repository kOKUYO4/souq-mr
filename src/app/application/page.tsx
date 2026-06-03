"use client";

import { CheckCircle2, Star, Download, Bell, Shield, Zap, Smartphone } from "lucide-react";
import IslamicPattern from "@/components/ui/IslamicPattern";
import { useLanguage } from "@/context/LanguageContext";

const features = [
  { icon: Bell, color: "#C9A84C", fr: "Notifications push instantanées", ar: "إشعارات فورية" },
  { icon: Zap, color: "#2D6A4F", fr: "Application ultra-rapide", ar: "تطبيق فائق السرعة" },
  { icon: Shield, color: "#1B2A4A", fr: "Mode hors-ligne disponible", ar: "وضع عدم الاتصال متاح" },
  { icon: Star, color: "#9B4B8A", fr: "Interface optimisée mobile", ar: "واجهة مُحسَّنة للجوال" },
];

const reviews = [
  { name: "Mohamed O. Sidi", nameAr: "محمد ولد سيدي", rating: 5, fr: "L'app est incroyable ! J'ai vendu ma voiture en 2 jours.", ar: "التطبيق رائع! بعت سيارتي في يومين.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=m1" },
  { name: "Fatimetou M.", nameAr: "فاطيمتو منت", rating: 5, fr: "Interface claire, négociation facile. Je recommande !", ar: "واجهة واضحة، التفاوض سهل. أنصح به!", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=f1" },
  { name: "Abdallahi B.", nameAr: "عبد الله باه", rating: 4, fr: "Très pratique pour acheter des téléphones d'occasion.", ar: "مفيد جداً لشراء هواتف مستعملة.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=a1" },
];

const screenshots = [
  "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=200&q=80",
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&q=80",
  "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=200&q=80",
];

export default function ApplicationPage() {
  const { isRTL, locale } = useLanguage();

  return (
    <div className="min-h-screen bg-sand-gradient">
      {/* Hero */}
      <div className="relative py-20 overflow-hidden" style={{ background: "linear-gradient(135deg, #1B2A4A, #0C1426)" }}>
        <IslamicPattern opacity={0.06} />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
          <div className={`flex flex-col md:flex-row items-center gap-10 ${isRTL ? "md:flex-row-reverse" : ""}`}>
            <div className={`flex-1 ${isRTL ? "text-right font-arabic" : ""}`}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-sand-400/20 rounded-xl text-sand-300 text-xs font-semibold mb-5">
                <Smartphone size={14} />
                {isRTL ? "تطبيق سوق.مر" : "App SOUQ.MR"}
              </div>
              <h1 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
                {isRTL ? "احمل السوق في جيبك" : "Le souk dans votre poche"}
              </h1>
              <p className="text-sand-300/70 text-sm leading-relaxed mb-7 max-w-md">
                {isRTL
                  ? "تطبيق سوق.مر لأنظمة iOS و Android — سريع، آمن، ومتاح بالعربية والفرنسية"
                  : "L'app SOUQ.MR pour iOS & Android — rapide, sécurisée et disponible en arabe et en français"}
              </p>

              <div className={`flex flex-wrap gap-3 mb-8 ${isRTL ? "flex-row-reverse" : ""}`}>
                {[
                  { store: "App Store", icon: "🍎", rating: "4.8", reviews: "2.3K avis" },
                  { store: "Google Play", icon: "▶️", rating: "4.7", reviews: "5.1K avis" },
                ].map((s) => (
                  <button key={s.store}
                    className="flex items-center gap-3 px-5 py-3 bg-white/10 border border-white/20 rounded-xl hover:bg-white/15 transition-all">
                    <span className="text-2xl">{s.icon}</span>
                    <div className={isRTL ? "text-right" : ""}>
                      <p className="text-white font-bold text-sm">{s.store}</p>
                      <p className="text-sand-300/60 text-xs">⭐ {s.rating} · {s.reviews}</p>
                    </div>
                  </button>
                ))}
              </div>

              <div className={`flex flex-wrap gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                {[
                  { n: "200K+", l: { fr: "Téléchargements", ar: "تحميل" } },
                  { n: "4.8★", l: { fr: "Note moyenne", ar: "متوسط التقييم" } },
                  { n: "99%", l: { fr: "Satisfaction", ar: "رضا المستخدمين" } },
                ].map((s) => (
                  <div key={s.n} className="text-center">
                    <p className="text-xl font-display font-bold text-sand-400">{s.n}</p>
                    <p className={`text-xs text-sand-300/60 ${isRTL ? "font-arabic" : ""}`}>{s.l[locale]}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Phone mockup */}
            <div className="flex-shrink-0 relative">
              <div className="w-52 h-96 rounded-[2.5rem] border-4 border-white/20 overflow-hidden shadow-2xl bg-sand-50 relative">
                <div className="absolute inset-0 flex flex-col">
                  <div className="h-8 bg-night-500 rounded-t-[2rem]" />
                  <div className="flex-1 bg-sand-50 overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&q=80"
                      alt=""
                      className="w-full h-full object-cover opacity-80"
                    />
                  </div>
                </div>
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-16 h-1.5 bg-white/30 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-12">
        {/* Features */}
        <div>
          <h2 className={`text-xl font-bold text-night-500 mb-6 ${isRTL ? "text-right font-arabic" : ""}`}>
            {isRTL ? "مميزات التطبيق" : "Fonctionnalités de l'app"}
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {features.map((f, i) => (
              <div key={i} className={`bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${f.color}15` }}>
                  <f.icon size={20} style={{ color: f.color }} />
                </div>
                <span className={`font-semibold text-night-500 ${isRTL ? "font-arabic" : ""}`}>
                  {isRTL ? f.ar : f.fr}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* What's included */}
        <div className="bg-white rounded-2xl p-6 shadow-card">
          <h2 className={`font-bold text-night-500 mb-5 ${isRTL ? "text-right font-arabic" : ""}`}>
            {isRTL ? "كل شيء في تطبيق واحد" : "Tout en une seule app"}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {(isRTL ? [
              "بحث بالصوت (صوقي)",
              "بازار مباشر",
              "تفاوض مدمج",
              "ضمان مالي",
              "توصيل ومتابعة",
              "دفع بالجوال",
              "محفظة رقمية",
              "تنبيهات الأسعار",
              "ادخار جماعي (Tontine)",
            ] : [
              "Recherche vocale (Souk Vocal)",
              "Bazaar Live",
              "Négociation intégrée",
              "Paiement Escrow",
              "Livraison & suivi",
              "Paiement mobile",
              "Portefeuille digital",
              "Alertes de prix",
              "Tontine numérique",
            ]).map((item, i) => (
              <div key={i} className={`flex items-center gap-2 text-sm text-night-500 ${isRTL ? "flex-row-reverse font-arabic" : ""}`}>
                <CheckCircle2 size={14} className="text-islamic-400 flex-shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Reviews */}
        <div>
          <h2 className={`text-xl font-bold text-night-500 mb-5 ${isRTL ? "text-right font-arabic" : ""}`}>
            {isRTL ? "آراء المستخدمين" : "Avis des utilisateurs"}
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {reviews.map((r, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 shadow-sm">
                <div className={`flex items-center gap-2 mb-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <img src={r.avatar} alt="" className="w-8 h-8 rounded-xl" />
                  <div className={isRTL ? "text-right" : ""}>
                    <p className={`text-xs font-bold text-night-500 ${isRTL ? "font-arabic" : ""}`}>{isRTL ? r.nameAr : r.name}</p>
                    <div className="flex">{"★".repeat(r.rating).split("").map((s, j) => <span key={j} className="text-sand-400 text-xs">{s}</span>)}</div>
                  </div>
                </div>
                <p className={`text-xs text-night-400/70 leading-relaxed ${isRTL ? "font-arabic text-right" : ""}`}>
                  {isRTL ? r.ar : r.fr}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Download CTA */}
        <div className="bg-night-500 rounded-2xl p-8 text-center relative overflow-hidden">
          <IslamicPattern opacity={0.05} />
          <div className="relative">
            <Download size={28} className="text-sand-400 mx-auto mb-3" />
            <h2 className={`text-xl font-display font-bold text-white mb-2 ${isRTL ? "font-arabic" : ""}`}>
              {isRTL ? "حمّل التطبيق مجاناً" : "Téléchargez l'app gratuitement"}
            </h2>
            <p className={`text-sand-300/70 text-sm mb-6 ${isRTL ? "font-arabic" : ""}`}>
              {isRTL ? "متاح لـ iOS و Android — أكثر من 200,000 تحميل" : "Disponible sur iOS & Android — plus de 200 000 téléchargements"}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <button className="flex items-center gap-3 px-6 py-3 bg-white/15 border border-white/25 rounded-xl hover:bg-white/20 transition-all">
                <span className="text-2xl">🍎</span>
                <div className="text-left">
                  <p className="text-white/60 text-[10px]">{isRTL ? "حمّل من" : "Télécharger sur l'"}</p>
                  <p className="text-white font-bold text-sm">App Store</p>
                </div>
              </button>
              <button className="flex items-center gap-3 px-6 py-3 bg-white/15 border border-white/25 rounded-xl hover:bg-white/20 transition-all">
                <span className="text-2xl">▶️</span>
                <div className="text-left">
                  <p className="text-white/60 text-[10px]">{isRTL ? "احصل عليه من" : "Disponible sur"}</p>
                  <p className="text-white font-bold text-sm">Google Play</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
