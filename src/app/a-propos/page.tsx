"use client";

import { Users, TrendingUp, MapPin, Star, Handshake, Smartphone } from "lucide-react";
import IslamicPattern from "@/components/ui/IslamicPattern";
import Logo from "@/components/ui/Logo";
import { useLanguage } from "@/context/LanguageContext";

const stats = {
  fr: [
    { value: "24 000+", label: "Annonces actives" },
    { value: "8 500+", label: "Vendeurs inscrits" },
    { value: "15", label: "Villes couvertes" },
    { value: "98%", label: "Taux de satisfaction" },
  ],
  ar: [
    { value: "+24,000", label: "إعلان نشط" },
    { value: "+8,500", label: "بائع مسجل" },
    { value: "15", label: "مدينة مغطاة" },
    { value: "98%", label: "معدل الرضا" },
  ],
};

const values = {
  fr: [
    { icon: Handshake, title: "Confiance", desc: "Vérification des vendeurs, système Escrow et communauté de notation pour des échanges sécurisés." },
    { icon: MapPin, title: "Local & Hyperlocal", desc: "Livraison par quartier à Nouakchott, des prix adaptés au marché mauritanien, en MRU." },
    { icon: Smartphone, title: "Mobile First", desc: "Conçu pour les smartphones mauritaniens — fonctionne même avec une connexion limitée." },
    { icon: Star, title: "Culturellement adapté", desc: "Hassaniya, Escrow, négociation souk, Ramadan Mode — NUQTA.MR parle mauritanien." },
  ],
  ar: [
    { icon: Handshake, title: "الثقة", desc: "التحقق من البائعين ونظام الضمان المالي ومجتمع التقييم لتبادلات آمنة." },
    { icon: MapPin, title: "المحلية والأحياء", desc: "توصيل بالحي في نواكشوط وأسعار تتناسب مع السوق الموريتانية بالأوقية." },
    { icon: Smartphone, title: "الجوال أولاً", desc: "مصمم للهواتف الموريتانية — يعمل حتى مع اتصال محدود." },
    { icon: Star, title: "متكيف ثقافياً", desc: "الحسانية والضمان المالي والتفاوض في السوق ووضع رمضان — نقطة.مر يتكلم الموريتانية." },
  ],
};

const team = [
  { name: "Ahmed Vall", nameAr: "أحمد ولد", role: { fr: "Co-fondateur & CEO", ar: "المؤسس المشارك والرئيس التنفيذي" }, city: { fr: "Nouakchott", ar: "نواكشوط" } },
  { name: "Fatimata Ba", nameAr: "فاطماتا با", role: { fr: "Co-fondatrice & CTO", ar: "المؤسسة المشاركة ومديرة التقنية" }, city: { fr: "Nouakchott", ar: "نواكشوط" } },
  { name: "Moussa Camara", nameAr: "موسى كامارا", role: { fr: "Directeur des opérations", ar: "مدير العمليات" }, city: { fr: "Nouadhibou", ar: "نواذيبو" } },
];

export default function AProposPage() {
  const { isRTL, locale } = useLanguage();
  const statList = stats[locale];
  const valueList = values[locale];

  return (
    <div className="min-h-screen bg-sand-gradient">
      {/* Hero */}
      <div className="relative py-20 overflow-hidden" style={{ background: "linear-gradient(135deg, #1B2A4A, #0C1426)" }}>
        <IslamicPattern opacity={0.06} />
        <div className="absolute inset-0 opacity-20"
          style={{ background: "radial-gradient(ellipse at 50% 80%, #C9A84C33, transparent)" }} />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-6"><Logo size="md" /></div>
          <h1 className={`text-4xl font-display font-bold text-white mb-4 ${isRTL ? "font-arabic" : ""}`}>
            {isRTL ? "سوق موريتانيا الرقمي الكبير" : "Le grand souk numérique de Mauritanie"}
          </h1>
          <p className={`text-sand-300/80 text-lg leading-relaxed ${isRTL ? "font-arabic" : ""}`}>
            {isRTL
              ? "أول منصة موريتانية للتجارة الإلكترونية تجمع بين روح السوق التقليدي وأحدث التقنيات الرقمية"
              : "La première marketplace mauritanienne qui allie l'esprit du souk traditionnel aux meilleures technologies numériques."}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-5xl mx-auto px-4 -mt-8 mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statList.map((s, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 text-center shadow-card">
              <div className="text-2xl font-display font-bold text-night-500 mb-1"
                style={{ background: "linear-gradient(135deg, #C9A84C, #B8922E)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                {s.value}
              </div>
              <p className={`text-xs text-night-400/70 ${isRTL ? "font-arabic" : ""}`}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-16 pb-16">
        {/* Mission */}
        <div className={`text-center max-w-2xl mx-auto ${isRTL ? "font-arabic" : ""}`}>
          <h2 className={`text-2xl font-bold text-night-500 mb-4 ${isRTL ? "" : "font-display"}`}>
            {isRTL ? "مهمتنا" : "Notre mission"}
          </h2>
          <p className="text-night-500/70 leading-relaxed">
            {isRTL
              ? "نؤمن بأن كل موريتاني يستحق أسواقاً رقمية آمنة وسهلة الاستخدام. هدفنا هو تمكين البائعين الصغار والتجار المحليين من الوصول إلى آلاف المشترين عبر هواتفهم."
              : "Nous croyons que chaque Mauritanien mérite un marché numérique sûr et facile à utiliser. Notre mission est de permettre aux petits vendeurs et commerçants locaux d'atteindre des milliers d'acheteurs depuis leur téléphone."}
          </p>
        </div>

        {/* Valeurs */}
        <div>
          <h2 className={`text-2xl font-bold text-night-500 mb-8 text-center ${isRTL ? "font-arabic" : "font-display"}`}>
            {isRTL ? "قيمنا" : "Nos valeurs"}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {valueList.map((v, i) => (
              <div key={i} className={`bg-white rounded-2xl p-5 shadow-card ${isRTL ? "text-right" : ""}`}>
                <div className="w-11 h-11 rounded-xl bg-sand-100 flex items-center justify-center mb-3">
                  <v.icon size={20} className="text-sand-500" />
                </div>
                <h3 className={`font-bold text-night-500 mb-2 ${isRTL ? "font-arabic" : ""}`}>{v.title}</h3>
                <p className={`text-sm text-night-400/70 leading-relaxed ${isRTL ? "font-arabic" : ""}`}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Équipe */}
        <div>
          <h2 className={`text-2xl font-bold text-night-500 mb-8 text-center ${isRTL ? "font-arabic" : "font-display"}`}>
            {isRTL ? "الفريق" : "L'équipe"}
          </h2>
          <div className="grid sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
            {team.map((m, i) => (
              <div key={i} className={`bg-white rounded-2xl p-5 shadow-card text-center`}>
                <div className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl font-bold text-white"
                  style={{ background: `linear-gradient(135deg, ${["#C9A84C","#2D6A4F","#1B2A4A"][i]}, ${["#B8922E","#1D4D38","#0C1426"][i]})` }}>
                  {(isRTL ? m.nameAr : m.name).charAt(0)}
                </div>
                <h3 className={`font-bold text-night-500 text-sm ${isRTL ? "font-arabic" : ""}`}>
                  {isRTL ? m.nameAr : m.name}
                </h3>
                <p className={`text-xs text-sand-500 mt-0.5 ${isRTL ? "font-arabic" : ""}`}>
                  {isRTL ? m.role.ar : m.role.fr}
                </p>
                <p className={`text-xs text-night-400/50 mt-1 flex items-center justify-center gap-1 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <MapPin size={10} />{isRTL ? m.city.ar : m.city.fr}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-night-500 rounded-2xl p-10 text-center relative overflow-hidden">
          <IslamicPattern opacity={0.05} />
          <div className="relative">
            <h2 className={`text-2xl font-bold text-white mb-3 ${isRTL ? "font-arabic" : "font-display"}`}>
              {isRTL ? "انضم إلى نقطة.مر اليوم" : "Rejoignez NUQTA.MR aujourd'hui"}
            </h2>
            <p className={`text-sand-300/70 mb-6 text-sm ${isRTL ? "font-arabic" : ""}`}>
              {isRTL ? "ابدأ البيع مجاناً في أكبر سوق رقمي موريتاني" : "Commencez à vendre gratuitement sur le plus grand marché numérique mauritanien"}
            </p>
            <div className={`flex gap-3 justify-center ${isRTL ? "flex-row-reverse" : ""}`}>
              <a href="/vendre" className="btn-gold">{isRTL ? "ضع إعلاناً" : "Déposer une annonce"}</a>
              <a href="/inscription" className="px-6 py-3 rounded-xl border border-sand-400/30 text-sand-300 hover:border-sand-400 transition-all text-sm font-semibold">
                {isRTL ? "إنشاء حساب" : "Créer un compte"}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
