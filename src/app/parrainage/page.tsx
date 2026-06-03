"use client";

import { useState } from "react";
import { Users, Copy, CheckCircle2, Gift, ArrowRight, ArrowLeft, Share2 } from "lucide-react";
import IslamicPattern from "@/components/ui/IslamicPattern";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/context/ToastContext";

const REFERRAL_CODE = "SOUQ-MR-7X4K";

const rewards = {
  fr: [
    { who: "Vous", amount: "2 000 MRU", desc: "Pour chaque ami qui s'inscrit via votre lien" },
    { who: "Votre ami", amount: "1 000 MRU", desc: "Offerts à votre ami à sa première annonce publiée" },
    { who: "Bonus Vendeur Pro", amount: "3 mois gratuits", desc: "Si votre filleul devient Marchand Pro dans les 30 jours" },
  ],
  ar: [
    { who: "أنت", amount: "2,000 أوقية", desc: "لكل صديق يسجل عبر رابطك" },
    { who: "صديقك", amount: "1,000 أوقية", desc: "تُمنح لصديقك عند نشر أول إعلان" },
    { who: "مكافأة التاجر المحترف", amount: "3 أشهر مجاناً", desc: "إذا أصبح المُحال تاجراً محترفاً خلال 30 يوماً" },
  ],
};

const stats = [
  { n: "2 341", labelFr: "Filleuls actifs", labelAr: "مُحال نشط" },
  { n: "4.7M", labelFr: "MRU distribués", labelAr: "أوقية موزعة" },
  { n: "1 892", labelFr: "Vendeurs Pro parrainés", labelAr: "تاجر محترف مُحال" },
];

export default function ParrainagePage() {
  const { isRTL, locale } = useLanguage();
  const { success } = useToast();
  const [copied, setCopied] = useState(false);
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  const rewardList = rewards[locale];

  const copyCode = () => {
    navigator.clipboard.writeText(REFERRAL_CODE).then(() => {
      setCopied(true);
      success(isRTL ? "تم نسخ رمز الإحالة ✓" : "Code de parrainage copié ✓");
      setTimeout(() => setCopied(false), 3000);
    });
  };

  const shareLink = () => {
    const url = `https://souq.mr?ref=${REFERRAL_CODE}`;
    const text = isRTL
      ? `استخدم رمز الإحالة ${REFERRAL_CODE} على سوق.مر واحصل على 1,000 أوقية مجاناً!`
      : `Utilise mon code parrainage ${REFERRAL_CODE} sur SOUQ.MR et obtiens 1 000 MRU offerts !`;
    if (navigator.share) {
      navigator.share({ title: "SOUQ.MR Parrainage", text, url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${text} ${url}`).then(() =>
        success(isRTL ? "تم نسخ رابط الإحالة" : "Lien de parrainage copié")
      );
    }
  };

  return (
    <div className="min-h-screen bg-sand-gradient">
      {/* Header */}
      <div className="relative py-20 overflow-hidden" style={{ background: "linear-gradient(135deg, #9B4B8A, #6B2060)" }}>
        <IslamicPattern opacity={0.05} />
        <div className={`relative max-w-4xl mx-auto px-4 sm:px-6 text-center ${isRTL ? "font-arabic" : ""}`}>
          <div className="text-6xl mb-6">🎁</div>
          <h1 className="text-4xl font-display font-bold text-white mb-4">
            {isRTL ? "أحِل أصدقاءك واكسب معهم" : "Parrainez vos amis et gagnez ensemble"}
          </h1>
          <p className="text-purple-200/70 max-w-xl mx-auto">
            {isRTL
              ? "شارك SOUQ.MR مع أصدقائك وكلاكما يكسب مكافأة فورية"
              : "Partagez SOUQ.MR avec vos proches et gagnez tous les deux une récompense immédiate"}
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-10">
        {/* Code section */}
        <div className="bg-white rounded-3xl p-8 shadow-card text-center">
          <p className={`text-sm font-semibold text-night-400/60 mb-3 ${isRTL ? "font-arabic" : ""}`}>
            {isRTL ? "رمز الإحالة الخاص بك" : "Votre code de parrainage"}
          </p>
          <div className="flex items-center justify-center gap-3 mb-6">
            <code className="text-3xl font-display font-bold text-night-500 tracking-widest bg-sand-100 px-6 py-3 rounded-2xl">
              {REFERRAL_CODE}
            </code>
            <button onClick={copyCode}
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${copied ? "bg-islamic-400" : "bg-sand-100 hover:bg-sand-200"}`}>
              {copied ? <CheckCircle2 size={20} className="text-white" /> : <Copy size={20} className="text-sand-500" />}
            </button>
          </div>
          <div className="flex gap-3 justify-center">
            <button onClick={shareLink}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-night-500 ${isRTL ? "flex-row-reverse font-arabic" : ""}`}
              style={{ background: "linear-gradient(135deg, #C9A84C, #B8922E)" }}>
              <Share2 size={15} />
              {isRTL ? "شارك الرابط" : "Partager le lien"}
            </button>
          </div>
        </div>

        {/* Rewards */}
        <div>
          <h2 className={`font-bold text-night-500 text-xl mb-5 ${isRTL ? "font-arabic text-right" : ""}`}>
            {isRTL ? "ماذا تكسب؟" : "Qu'est-ce que vous gagnez ?"}
          </h2>
          <div className="space-y-3">
            {rewardList.map((r, i) => (
              <div key={i} className={`flex items-center gap-4 bg-white rounded-2xl p-5 shadow-sm ${isRTL ? "flex-row-reverse" : ""}`}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, #9B4B8A20, #6B206010)", border: "1px solid #9B4B8A30" }}>
                  <Gift size={18} className="text-purple-500" />
                </div>
                <div className={`flex-1 ${isRTL ? "text-right" : ""}`}>
                  <p className={`text-xs font-semibold text-purple-500 mb-0.5 ${isRTL ? "font-arabic" : ""}`}>{r.who}</p>
                  <p className="text-lg font-bold text-sand-500">{r.amount}</p>
                  <p className={`text-xs text-night-400/70 ${isRTL ? "font-arabic" : ""}`}>{r.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {stats.map((s, i) => (
            <div key={i} className={`bg-white rounded-2xl p-4 shadow-sm text-center ${isRTL ? "font-arabic" : ""}`}>
              <p className="text-2xl font-display font-bold text-sand-500">{s.n}</p>
              <p className="text-xs text-night-400/60 mt-0.5">{isRTL ? s.labelAr : s.labelFr}</p>
            </div>
          ))}
        </div>

        {/* How it works */}
        <div className="bg-white rounded-2xl p-6 shadow-card">
          <h2 className={`font-bold text-night-500 text-lg mb-5 ${isRTL ? "font-arabic text-right" : ""}`}>
            {isRTL ? "كيف يعمل؟" : "Comment ça marche ?"}
          </h2>
          <div className="space-y-3">
            {[
              { fr: "Partagez votre code avec vos amis par WhatsApp, SMS ou Facebook", ar: "شارك رمزك مع أصدقائك عبر واتساب أو SMS أو فيسبوك" },
              { fr: "Votre ami s'inscrit sur SOUQ.MR et entre votre code", ar: "يسجل صديقك في سوق.مر ويُدخل رمزك" },
              { fr: "Dès sa première annonce publiée, vous recevez tous les deux vos récompenses", ar: "بعد نشر أول إعلان، يستلم كلاكما المكافأة فوراً" },
            ].map((s, i) => (
              <div key={i} className={`flex items-start gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, #9B4B8A, #6B2060)" }}>
                  {i + 1}
                </div>
                <p className={`text-sm text-night-400/80 pt-1 ${isRTL ? "font-arabic text-right" : ""}`}>
                  {isRTL ? s.ar : s.fr}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
