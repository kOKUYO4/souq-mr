"use client";

import { TrendingUp, Users, Globe, Shield, ArrowRight, BarChart3, CheckCircle2, Mail } from "lucide-react";
import IslamicPattern from "@/components/ui/IslamicPattern";
import { useLanguage } from "@/context/LanguageContext";

const metrics = [
  { n: "200K+", fr: "Utilisateurs actifs", ar: "مستخدم نشط", trend: "+24% MoM" },
  { n: "50K+", fr: "Annonces actives", ar: "إعلان نشط", trend: "+18% MoM" },
  { n: "4.8M", fr: "MRU transactés/mois", ar: "أوقية معاملات/شهر", trend: "+31% MoM" },
  { n: "15+", fr: "Wilayas couvertes", ar: "ولاية مغطاة", trend: "Mauritanie" },
];

const opportunities = [
  {
    emojiIcon: "💳",
    fr: "Fintech & Mobile Money",
    ar: "التكنولوجيا المالية",
    descFr: "Intégration Bankily/Masrvi, développement d'un wallet propriétaire, et extension vers le crédit à la consommation.",
    descAr: "تكامل بانكيلي/مصرفي، تطوير محفظة خاصة، وتوسع نحو الائتمان الاستهلاكي.",
  },
  {
    emojiIcon: "🚚",
    fr: "Logistique & Livraison",
    ar: "الخدمات اللوجستية",
    descFr: "Réseau de livraison propriétaire dans les 15 wilayas + service d'entreposage pour les marchands Pro.",
    descAr: "شبكة توصيل خاصة في 15 ولاية + خدمة التخزين للتجار المحترفين.",
  },
  {
    emojiIcon: "🤖",
    fr: "IA & Personalisation",
    ar: "الذكاء الاصطناعي",
    descFr: "Moteur de recommandation, reconnaissance d'image pour annonces automatiques, et assistant vocal Hassaniya.",
    descAr: "محرك توصيات، التعرف على الصور للإعلانات التلقائية، ومساعد صوتي بالحسانية.",
  },
  {
    emojiIcon: "🌍",
    fr: "Expansion Régionale",
    ar: "التوسع الإقليمي",
    descFr: "Duplication du modèle SOUQ.MR en Afrique de l'Ouest francophone : Sénégal, Mali, Côte d'Ivoire.",
    descAr: "تكرار نموذج سوق.مر في غرب أفريقيا الناطقة بالفرنسية: السنغال ومالي وكوت ديفوار.",
  },
];

const team = [
  { name: "Ahmed Ould Salem", role: { fr: "CEO & Co-fondateur", ar: "الرئيس التنفيذي والمؤسس المشارك" }, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ceo" },
  { name: "Mariem Mint Sid", role: { fr: "CTO & Co-fondatrice", ar: "المدير التقني والمؤسسة المشاركة" }, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=cto" },
  { name: "Cheikh O. Bah", role: { fr: "CFO", ar: "المدير المالي" }, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=cfo" },
  { name: "Fatimetou Mint A.", role: { fr: "COO", ar: "مدير العمليات" }, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=coo" },
];

export default function InvestisseursPage() {
  const { isRTL, locale } = useLanguage();

  return (
    <div className="min-h-screen bg-sand-gradient">
      {/* Hero */}
      <div className="relative py-20 overflow-hidden" style={{ background: "linear-gradient(135deg, #0C1426, #1B2A4A)" }}>
        <IslamicPattern opacity={0.06} />
        <div className={`relative max-w-4xl mx-auto px-4 sm:px-6 text-center ${isRTL ? "font-arabic" : ""}`}>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-sand-400/20 rounded-xl text-sand-300 text-xs font-semibold mb-5">
            <TrendingUp size={14} />
            {isRTL ? "علاقات المستثمرين" : "Relations Investisseurs"}
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
            {isRTL ? "استثمر في مستقبل التجارة الرقمية الأفريقية" : "Investissez dans le futur du commerce digital africain"}
          </h1>
          <p className="text-sand-300/70 max-w-xl mx-auto text-sm mb-8">
            {isRTL
              ? "سوق.مر هي المنصة الرائدة للتجارة الإلكترونية في موريتانيا — سوق 4.6 مليون مستهلك بنمو سنوي يتجاوز 30%"
              : "SOUQ.MR est la plateforme e-commerce leader en Mauritanie — un marché de 4,6M consommateurs avec +30% de croissance annuelle"}
          </p>
          <a href="mailto:investisseurs@souq.mr"
            className="inline-flex items-center gap-2 btn-gold text-sm">
            <Mail size={15} />
            {isRTL ? "تواصل مع فريق الاستثمار" : "Contacter l'équipe investissement"}
          </a>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-12">
        {/* Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {metrics.map((m, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-card text-center">
              <p className="text-2xl font-display font-bold text-sand-500">{m.n}</p>
              <p className={`text-xs text-night-400/70 mt-0.5 mb-2 ${isRTL ? "font-arabic" : ""}`}>{isRTL ? m.ar : m.fr}</p>
              <span className="inline-block px-2 py-0.5 text-xs font-bold text-islamic-500 bg-islamic-50 rounded-lg">{m.trend}</span>
            </div>
          ))}
        </div>

        {/* Market opportunity */}
        <div className="bg-white rounded-2xl p-6 shadow-card">
          <div className={`flex items-center gap-2 mb-5 ${isRTL ? "flex-row-reverse" : ""}`}>
            <Globe size={20} className="text-sand-500" />
            <h2 className={`font-bold text-night-500 text-lg ${isRTL ? "font-arabic" : ""}`}>
              {isRTL ? "السوق والفرصة" : "Le marché & l'opportunité"}
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            {[
              { title: { fr: "Marché addressable", ar: "السوق المستهدف" }, val: "850M USD", sub: { fr: "Commerce e-commerce Mauritanie 2030", ar: "تجارة إلكترونية موريتانيا 2030" } },
              { title: { fr: "Taux de pénétration actuel", ar: "معدل الاختراق الحالي" }, val: "4.2%", sub: { fr: "Fort potentiel de croissance", ar: "إمكانات نمو كبيرة" } },
              { title: { fr: "Croissance internet mobile", ar: "نمو الإنترنت المحمول" }, val: "+28%/an", sub: { fr: "Mauritanie, GSMA 2024", ar: "موريتانيا، GSMA 2024" } },
            ].map((s, i) => (
              <div key={i} className={`text-center p-4 bg-sand-50 rounded-xl ${isRTL ? "font-arabic" : ""}`}>
                <p className={`text-xs text-night-400/60 mb-1 ${isRTL ? "font-arabic" : ""}`}>{s.title[locale]}</p>
                <p className="text-2xl font-display font-bold text-night-500">{s.val}</p>
                <p className={`text-xs text-night-400/50 mt-1 ${isRTL ? "font-arabic" : ""}`}>{s.sub[locale]}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Growth opportunities */}
        <div>
          <h2 className={`text-xl font-bold text-night-500 mb-5 ${isRTL ? "text-right font-arabic" : ""}`}>
            {isRTL ? "محركات النمو المستقبلية" : "Leviers de croissance futurs"}
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {opportunities.map((opp, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 shadow-sm">
                <div className={`flex items-start gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <span className="text-3xl flex-shrink-0">{opp.emojiIcon}</span>
                  <div className={isRTL ? "text-right" : ""}>
                    <p className={`font-bold text-night-500 mb-1 ${isRTL ? "font-arabic" : ""}`}>{isRTL ? opp.ar : opp.fr}</p>
                    <p className={`text-xs text-night-400/70 leading-relaxed ${isRTL ? "font-arabic" : ""}`}>{isRTL ? opp.descAr : opp.descFr}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div>
          <h2 className={`text-xl font-bold text-night-500 mb-5 ${isRTL ? "text-right font-arabic" : ""}`}>
            {isRTL ? "فريق القيادة" : "Équipe dirigeante"}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {team.map((t, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 text-center shadow-sm">
                <img src={t.avatar} alt="" className="w-16 h-16 rounded-2xl mx-auto mb-3 bg-sand-100" />
                <p className="font-bold text-night-500 text-sm">{t.name}</p>
                <p className={`text-xs text-night-400/60 mt-0.5 ${isRTL ? "font-arabic" : ""}`}>{t.role[locale]}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Why invest */}
        <div className="bg-white rounded-2xl p-6 shadow-card">
          <h2 className={`font-bold text-night-500 mb-4 ${isRTL ? "text-right font-arabic" : ""}`}>
            {isRTL ? "لماذا الاستثمار في سوق.مر؟" : "Pourquoi investir dans SOUQ.MR ?"}
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {(isRTL ? [
              "السوق الأول والأكبر في موريتانيا",
              "نمو عضوي بدون إعلانات مدفوعة",
              "فريق مؤسس محلي بخبرة 10+ سنوات",
              "نموذج عمل متعدد الإيرادات (إعلانات + اشتراكات + escrow + دفع)",
              "تغطية في 15 ولاية من 13 ولاية",
              "تقنية مبنية خصيصاً للسياق الموريتاني",
            ] : [
              "N°1 sur le marché mauritanien",
              "Croissance organique sans paid marketing",
              "Équipe fondatrice locale avec 10+ ans d'expérience",
              "Modèle multi-revenus (annonces + abonnements + escrow + paiement)",
              "Couverture dans 15/13 wilayas",
              "Technologie native pour le contexte mauritanien",
            ]).map((item, i) => (
              <div key={i} className={`flex items-center gap-2 text-sm text-night-500 ${isRTL ? "flex-row-reverse font-arabic" : ""}`}>
                <CheckCircle2 size={14} className="text-islamic-400 flex-shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-night-500 rounded-2xl p-6 text-center relative overflow-hidden">
          <IslamicPattern opacity={0.05} />
          <div className="relative">
            <BarChart3 size={28} className="text-sand-400 mx-auto mb-3" />
            <p className={`font-bold text-xl text-white mb-2 ${isRTL ? "font-arabic" : ""}`}>
              {isRTL ? "مهتم بالاستثمار؟" : "Intéressé par un investissement ?"}
            </p>
            <p className={`text-sm text-sand-300/70 mb-5 ${isRTL ? "font-arabic" : ""}`}>
              {isRTL ? "يُسعدنا مشاركتك الـ pitch deck والبيانات المالية تحت اتفاقية سرية" : "Nous partageons volontiers notre pitch deck et données financières sous NDA"}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a href="mailto:investisseurs@souq.mr"
                className="flex items-center gap-2 btn-gold text-sm">
                <Mail size={15} />
                {isRTL ? "تواصل معنا" : "Nous contacter"}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
