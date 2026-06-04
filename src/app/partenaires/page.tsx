"use client";

import { useState } from "react";
import { Handshake, CheckCircle2, Mail, ArrowRight, ArrowLeft, Globe, Truck, Radio } from "lucide-react";
import IslamicPattern from "@/components/ui/IslamicPattern";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/context/ToastContext";

const partners = {
  payment: {
    labelFr: "Paiement Mobile", labelAr: "الدفع بالجوال",
    items: [
      { name: "Bankily", initials: "BK", color: "#2D6A4F", descFr: "Partenaire principal Mobile Money — paiements instantanés pour 1.2M d'utilisateurs Bankily.", descAr: "الشريك الرئيسي للدفع المحمول — مدفوعات فورية لـ 1.2 مليون مستخدم بانكيلي." },
      { name: "Masrvi", initials: "MV", color: "#C9A84C", descFr: "Intégration complète Masrvi pour transactions sécurisées et paiement à la livraison.", descAr: "تكامل كامل مع مصرفي للمعاملات الآمنة والدفع عند الاستلام." },
      { name: "Mauritanie Pay", initials: "MP", color: "#9B4B8A", descFr: "Solution de paiement en ligne pour Visa/Mastercard mauritaniens.", descAr: "حل للدفع الإلكتروني لبطاقات فيزا/ماستركارد الموريتانية." },
    ],
  },
  logistics: {
    labelFr: "Logistique & Livraison", labelAr: "الخدمات اللوجستية",
    items: [
      { name: "Mauritanie Post", initials: "MP", color: "#1B2A4A", descFr: "Partenariat Mauritanie Post pour la livraison nationale dans toutes les wilayas.", descAr: "شراكة مع بريد موريتانيا للتوصيل الوطني في جميع الولايات." },
      { name: "Moto Express", initials: "ME", color: "#E53E3E", descFr: "Livraison express moto dans Nouakchott — délai 1h en zone urbaine.", descAr: "توصيل سريع بالدراجة في نواكشوط — مهلة ساعة في المنطقة الحضرية." },
    ],
  },
  media: {
    labelFr: "Médias & Communication", labelAr: "الإعلام والتواصل",
    items: [
      { name: "RIM Actualités", initials: "RA", color: "#2D3E6A", descFr: "Partenaire médias officiel pour la couverture des événements SOUQ.MR.", descAr: "الشريك الإعلامي الرسمي لتغطية فعاليات سوق.مر." },
      { name: "Sahara FM", initials: "SF", color: "#6B2060", descFr: "Radio partenaire pour nos campagnes publicitaires nationales.", descAr: "راديو شريك لحملاتنا الإعلانية الوطنية." },
      { name: "TechAfrica", initials: "TA", color: "#B8922E", descFr: "Média tech panafricain couvrant l'écosystème startup mauritanien.", descAr: "وسيلة إعلامية تقنية أفريقية تغطي منظومة الشركات الناشئة الموريتانية." },
    ],
  },
};

const partnershipTypes = [
  { icon: Globe, fr: "Intégration API", ar: "تكامل API", descFr: "Intégrez SOUQ.MR dans votre application via notre API publique. Documentation complète disponible.", descAr: "ادمج سوق.مر في تطبيقك عبر API العامة. وثائق كاملة متاحة." },
  { icon: Truck, fr: "Partenaire Logistique", ar: "شريك لوجستي", descFr: "Rejoignez notre réseau de livraison et servez des milliers d'acheteurs mauritaniens.", descAr: "انضم لشبكة التوصيل لدينا وخدم آلاف المشترين الموريتانيين." },
  { icon: Radio, fr: "Partenaire Médias", ar: "شريك إعلامي", descFr: "Partenariats éditoriaux, affiliation et co-marketing pour médias mauritaniens.", descAr: "شراكات تحريرية وتابعة وتسويق مشترك للإعلام الموريتاني." },
];

type PartnerCategory = "payment" | "logistics" | "media";

export default function PartenairesPage() {
  const { isRTL, locale } = useLanguage();
  const { success } = useToast();
  const [activeCategory, setActiveCategory] = useState<PartnerCategory>("payment");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  const active = partners[activeCategory];

  const handleSubmit = () => {
    if (!email.trim()) return;
    setSubmitted(true);
    success(isRTL ? "تم استلام طلبك!" : "Demande reçue !");
  };

  const catTabs: { id: PartnerCategory; fr: string; ar: string }[] = [
    { id: "payment", fr: "💳 Paiement", ar: "💳 الدفع" },
    { id: "logistics", fr: "🚚 Logistique", ar: "🚚 لوجستي" },
    { id: "media", fr: "📡 Médias", ar: "📡 إعلام" },
  ];

  return (
    <div className="min-h-screen bg-sand-gradient">
      <div className="relative py-16 overflow-hidden" style={{ background: "linear-gradient(135deg, #6B2060, #9B4B8A)" }}>
        <IslamicPattern opacity={0.05} />
        <div className={`relative max-w-4xl mx-auto px-4 sm:px-6 text-center ${isRTL ? "font-arabic" : ""}`}>
          <Handshake size={36} className="text-purple-200 mx-auto mb-4" />
          <h1 className="text-3xl font-display font-bold text-white mb-2">
            {isRTL ? "الشركاء والنظام البيئي" : "Partenaires & Écosystème"}
          </h1>
          <p className="text-purple-100/70 text-sm max-w-lg mx-auto">
            {isRTL ? "سوق.مر تعمل مع أفضل الشركاء لتقديم تجربة متكاملة للمستخدمين الموريتانيين" : "SOUQ.MR collabore avec les meilleurs partenaires pour offrir une expérience complète aux utilisateurs mauritaniens"}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-10">
        {/* Partner categories */}
        <div>
          <h2 className={`text-xl font-bold text-night-500 mb-5 ${isRTL ? "text-right font-arabic" : ""}`}>
            {isRTL ? "شركاؤنا" : "Nos partenaires"}
          </h2>
          <div className={`flex gap-1 bg-sand-100 rounded-xl p-1 w-fit mb-6 ${isRTL ? "flex-row-reverse" : ""}`}>
            {catTabs.map((t) => (
              <button key={t.id} onClick={() => setActiveCategory(t.id)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeCategory === t.id ? "bg-white text-night-500 shadow-sm" : "text-night-400/60 hover:text-night-500"} ${isRTL ? "font-arabic" : ""}`}>
                {isRTL ? t.ar : t.fr}
              </button>
            ))}
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {active.items.map((p, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-card transition-all">
                <div className={`flex items-center gap-3 mb-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                    style={{ background: `linear-gradient(135deg, ${p.color}, ${p.color}99)` }}>
                    {p.initials}
                  </div>
                  <p className="font-bold text-night-500">{p.name}</p>
                </div>
                <p className={`text-xs text-night-400/70 leading-relaxed ${isRTL ? "font-arabic text-right" : ""}`}>
                  {isRTL ? p.descAr : p.descFr}
                </p>
                <div className={`flex items-center gap-1 mt-3 text-xs text-islamic-500 font-semibold ${isRTL ? "flex-row-reverse" : ""}`}>
                  <CheckCircle2 size={12} />
                  {isRTL ? "شريك معتمد" : "Partenaire certifié"}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Become a partner */}
        <div>
          <h2 className={`text-xl font-bold text-night-500 mb-5 ${isRTL ? "text-right font-arabic" : ""}`}>
            {isRTL ? "كيف تصبح شريكاً؟" : "Devenir partenaire"}
          </h2>
          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            {partnershipTypes.map((pt, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center mb-3">
                  <pt.icon size={18} className="text-purple-500" />
                </div>
                <p className={`font-bold text-night-500 mb-2 ${isRTL ? "font-arabic text-right" : ""}`}>{isRTL ? pt.ar : pt.fr}</p>
                <p className={`text-xs text-night-400/70 leading-relaxed ${isRTL ? "font-arabic text-right" : ""}`}>{isRTL ? pt.descAr : pt.descFr}</p>
              </div>
            ))}
          </div>

          {/* Contact form */}
          <div className="bg-night-500 rounded-2xl p-6 relative overflow-hidden">
            <IslamicPattern opacity={0.05} />
            <div className="relative">
              <h3 className={`font-bold text-white mb-1 ${isRTL ? "font-arabic text-right" : ""}`}>
                {isRTL ? "هل أنت مهتم بالشراكة؟" : "Intéressé par un partenariat ?"}
              </h3>
              <p className={`text-sand-300/70 text-sm mb-4 ${isRTL ? "font-arabic text-right" : ""}`}>
                {isRTL ? "أرسل بريدك الإلكتروني وسيتواصل فريقنا معك خلال 24 ساعة" : "Laissez votre email et notre équipe vous recontacte sous 24h"}
              </p>
              {submitted ? (
                <div className={`flex items-center gap-2 text-islamic-400 text-sm ${isRTL ? "flex-row-reverse justify-end font-arabic" : ""}`}>
                  <CheckCircle2 size={16} />
                  {isRTL ? "تم استلام طلبك! سنتواصل معك قريباً" : "Demande reçue ! Nous vous recontactons bientôt."}
                </div>
              ) : (
                <div className={`flex gap-2 flex-wrap ${isRTL ? "flex-row-reverse" : ""}`}>
                  <input value={email} onChange={(e) => setEmail(e.target.value)}
                    type="email" placeholder={isRTL ? "بريدك الإلكتروني" : "Votre email professionnel"}
                    dir={isRTL ? "rtl" : "ltr"}
                    className="flex-1 min-w-0 px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-sand-400/50 text-sm outline-none focus:border-sand-400/50" />
                  <button onClick={handleSubmit}
                    className={`btn-gold text-sm flex-shrink-0 gap-1.5 ${isRTL ? "flex-row-reverse font-arabic" : ""}`}>
                    {isRTL ? "إرسال" : "Envoyer"}
                    <Arrow size={14} />
                  </button>
                </div>
              )}
              <p className="text-sand-400/50 text-xs mt-3">
                <a href="mailto:partenaires@souq.mr" className="hover:text-sand-300">partenaires@souq.mr</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
