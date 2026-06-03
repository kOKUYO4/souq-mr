"use client";

import { useState } from "react";
import { Shield, CheckCircle2, Clock, ArrowRight, ArrowLeft, Lock, CreditCard, Truck, ThumbsUp } from "lucide-react";
import Link from "next/link";
import IslamicPattern from "@/components/ui/IslamicPattern";
import { useLanguage } from "@/context/LanguageContext";

const steps = {
  fr: [
    { icon: CreditCard, title: "Acheteur paie", desc: "L'acheteur verse le montant sur le compte escrow sécurisé SOUQ.MR — pas directement au vendeur." },
    { icon: Lock, title: "Fonds bloqués", desc: "L'argent est sécurisé. Le vendeur est notifié et prépare l'article pour expédition ou remise." },
    { icon: Truck, title: "Livraison / Remise", desc: "L'article est livré ou remis en main propre. L'acheteur a 48h pour vérifier et confirmer." },
    { icon: ThumbsUp, title: "Confirmation", desc: "Une fois confirmé, les fonds sont libérés au vendeur. En cas de litige, SOUQ.MR arbitre." },
  ],
  ar: [
    { icon: CreditCard, title: "المشتري يدفع", desc: "يودع المشتري المبلغ في حساب الضمان المالي الآمن لسوق.مر — وليس مباشرة للبائع." },
    { icon: Lock, title: "الأموال مجمَّدة", desc: "المال آمن. يتلقى البائع إشعاراً ويجهز المنتج للشحن أو التسليم." },
    { icon: Truck, title: "التسليم", desc: "يُسلَّم المنتج. يملك المشتري 48 ساعة للتحقق والتأكيد." },
    { icon: ThumbsUp, title: "التأكيد", desc: "بعد التأكيد، تُحرَّر الأموال للبائع. في حال النزاع، يتحكيم سوق.مر." },
  ],
};

const faqs = {
  fr: [
    { q: "À partir de quel montant l'escrow est-il recommandé ?", a: "Pour toute transaction supérieure à 50 000 MRU. En dessous, le paiement à la livraison suffit." },
    { q: "Quel est le délai de remise des fonds au vendeur ?", a: "48h après confirmation de l'acheteur, ou automatiquement 5 jours après livraison sans litige." },
    { q: "Quels sont les frais escrow ?", a: "1,5% du montant de la transaction, avec un minimum de 500 MRU et un maximum de 15 000 MRU." },
    { q: "Que se passe-t-il en cas de litige ?", a: "Notre équipe médiation traite le dossier sous 72h. En cas de fraude avérée, l'acheteur est intégralement remboursé." },
  ],
  ar: [
    { q: "ابتداءً من أي مبلغ يُنصح بالضمان المالي؟", a: "لأي معاملة تتجاوز 50,000 أوقية. أما دون ذلك، فالدفع عند الاستلام يكفي." },
    { q: "ما هي مهلة تحرير الأموال للبائع؟", a: "48 ساعة بعد تأكيد المشتري، أو تلقائياً بعد 5 أيام من التسليم بدون نزاع." },
    { q: "ما هي رسوم الضمان المالي؟", a: "1.5% من قيمة المعاملة، بحد أدنى 500 أوقية وحد أقصى 15,000 أوقية." },
    { q: "ماذا يحدث في حالة النزاع؟", a: "يعالج فريق الوساطة لدينا الملف خلال 72 ساعة. في حالة الاحتيال المثبت، يُعاد المبلغ كاملاً للمشتري." },
  ],
};

export default function EscrowPage() {
  const { isRTL, locale } = useLanguage();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  const stepList = steps[locale];
  const faqList = faqs[locale];

  return (
    <div className="min-h-screen bg-sand-gradient">
      {/* Header */}
      <div className="relative py-20 overflow-hidden" style={{ background: "linear-gradient(135deg, #1B2A4A, #0C1426)" }}>
        <IslamicPattern opacity={0.05} />
        <div className={`relative max-w-4xl mx-auto px-4 sm:px-6 text-center ${isRTL ? "font-arabic" : ""}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-islamic-400/20 border border-islamic-400/30 text-islamic-200 text-sm mb-6">
            <Shield size={14} />
            {isRTL ? "مدفوعات آمنة 100%" : "Paiements 100% sécurisés"}
          </div>
          <h1 className="text-4xl font-display font-bold text-white mb-4">
            {isRTL ? "خدمة الضمان المالي" : "Service Escrow SOUQ.MR"}
          </h1>
          <p className="text-sand-300/70 max-w-xl mx-auto">
            {isRTL
              ? "احمِ معاملاتك الكبيرة مع نظام الضمان المالي المدمج"
              : "Protégez vos grandes transactions avec notre système d'escrow intégré"}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 space-y-16">
        {/* How it works */}
        <div>
          <h2 className={`text-2xl font-bold text-night-500 text-center mb-10 ${isRTL ? "font-arabic" : "font-display"}`}>
            {isRTL ? "كيف يعمل الضمان المالي؟" : "Comment fonctionne l'escrow ?"}
          </h2>
          <div className="grid sm:grid-cols-4 gap-4 relative">
            {/* Connector line */}
            <div className="hidden sm:block absolute top-10 left-[12.5%] right-[12.5%] h-0.5 bg-sand-200" />

            {stepList.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className={`relative bg-white rounded-2xl p-5 shadow-card text-center ${isRTL ? "font-arabic" : ""}`}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3 relative z-10"
                    style={{ background: "linear-gradient(135deg, #1B2A4A, #2D3E6A)" }}>
                    <Icon size={18} className="text-sand-400" />
                  </div>
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-night-500"
                    style={{ background: "linear-gradient(135deg, #C9A84C, #B8922E)" }}>
                    {i + 1}
                  </div>
                  <h4 className="font-bold text-night-500 text-sm mb-2">{s.title}</h4>
                  <p className="text-xs text-night-400/70 leading-relaxed">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Trust stats */}
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            { n: "98.7%", labelFr: "Taux de satisfaction", labelAr: "معدل الرضا" },
            { n: "72h", labelFr: "Résolution des litiges", labelAr: "حل النزاعات" },
            { n: "500K+", labelFr: "MRU sécurisés/mois", labelAr: "أوقية مؤمَّنة/شهر" },
          ].map((stat, i) => (
            <div key={i} className={`bg-white rounded-2xl p-6 shadow-card text-center ${isRTL ? "font-arabic" : ""}`}>
              <p className="text-3xl font-display font-bold text-sand-500 mb-1">{stat.n}</p>
              <p className="text-sm text-night-400/70">{isRTL ? stat.labelAr : stat.labelFr}</p>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div>
          <h2 className={`text-xl font-bold text-night-500 mb-6 ${isRTL ? "font-arabic text-right" : ""}`}>
            {isRTL ? "أسئلة شائعة" : "Questions fréquentes"}
          </h2>
          <div className="space-y-3">
            {faqList.map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className={`w-full flex items-center justify-between px-5 py-4 ${isRTL ? "flex-row-reverse text-right" : ""}`}
                >
                  <span className={`text-sm font-semibold text-night-500 ${isRTL ? "font-arabic" : ""}`}>{faq.q}</span>
                  <span className={`text-sand-400 flex-shrink-0 ml-2 transition-transform ${openFaq === i ? "rotate-90" : ""}`}>
                    <Arrow size={16} />
                  </span>
                </button>
                {openFaq === i && (
                  <div className={`px-5 pb-4 text-sm text-night-400/80 leading-relaxed border-t border-sand-50 pt-3 ${isRTL ? "font-arabic text-right" : ""}`}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-2xl p-8 text-center" style={{ background: "linear-gradient(135deg, #1B2A4A, #2D3E6A)" }}>
          <Shield size={32} className="text-sand-400 mx-auto mb-4" />
          <h3 className={`text-xl font-bold text-white mb-2 ${isRTL ? "font-arabic" : "font-display"}`}>
            {isRTL ? "هل أنت مستعد للتداول بأمان؟" : "Prêt à trader en toute sécurité ?"}
          </h3>
          <p className="text-sand-300/70 text-sm mb-6">
            {isRTL ? "ابدأ بنشر إعلانك الآن" : "Commencez par déposer votre annonce dès maintenant"}
          </p>
          <div className={`flex items-center justify-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
            <Link href="/vendre" className="btn-gold text-sm py-3 px-6">
              {isRTL ? "أبيع الآن" : "Vendre maintenant"}
            </Link>
            <Link href="/securite" className="px-6 py-3 text-sm font-semibold text-sand-300 border border-sand-400/30 rounded-xl hover:border-sand-400/60 transition-colors">
              {isRTL ? "دليل الأمان" : "Guide sécurité"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
