"use client";

import { useState } from "react";
import { CheckCircle2, Copy, Ticket, Gift, Clock, Tag, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/context/ToastContext";
import IslamicPattern from "@/components/ui/IslamicPattern";

interface Coupon {
  code: string;
  discountFR: string;
  discountAR: string;
  descriptionFR: string;
  descriptionAR: string;
  expiryFR: string;
  expiryAR: string;
  categoryFR: string;
  categoryAR: string;
  badge: string;
}

const coupons: Coupon[] = [
  {
    code: "BIENVENUE",
    discountFR: "-15%",
    discountAR: "‎-15%",
    descriptionFR: "Réduction sur votre première commande",
    descriptionAR: "خصم على طلبك الأول",
    expiryFR: "Expire dans 7 jours",
    expiryAR: "تنتهي خلال 7 أيام",
    categoryFR: "Nouveaux clients",
    categoryAR: "عملاء جدد",
    badge: "bg-blue-100 text-blue-700",
  },
  {
    code: "RAMADAN25",
    discountFR: "-25%",
    discountAR: "‎-25%",
    descriptionFR: "Offre spéciale pendant le Ramadan — 42 utilisations restantes",
    descriptionAR: "عرض خاص خلال رمضان — 42 استخدامًا متبقيًا",
    expiryFR: "Limité à 100 utilisations",
    expiryAR: "محدود بـ 100 استخدام",
    categoryFR: "Ramadan",
    categoryAR: "رمضان",
    badge: "bg-green-100 text-green-700",
  },
  {
    code: "PROPACK",
    discountFR: "3 mois Pro",
    discountAR: "3 أشهر برو",
    descriptionFR: "3 mois Pro gratuits pour les nouveaux vendeurs pro",
    descriptionAR: "3 أشهر مجانية من الاشتراك الاحترافي للبائعين الجدد",
    expiryFR: "Nouveaux vendeurs pro",
    expiryAR: "البائعون الاحترافيون الجدد",
    categoryFR: "Vendeurs",
    categoryAR: "البائعون",
    badge: "bg-purple-100 text-purple-700",
  },
  {
    code: "LIVRAISON",
    discountFR: "Livraison gratuite",
    discountAR: "توصيل مجاني",
    descriptionFR: "Livraison gratuite dans la zone de Nouakchott",
    descriptionAR: "توصيل مجاني داخل نواكشوط",
    expiryFR: "Zone Nouakchott uniquement",
    expiryAR: "نواكشوط فقط",
    categoryFR: "Livraison",
    categoryAR: "التوصيل",
    badge: "bg-orange-100 text-orange-700",
  },
  {
    code: "BAZAAR10",
    discountFR: "-10%",
    discountAR: "‎-10%",
    descriptionFR: "Réduction exclusive via Bazaar Live",
    descriptionAR: "خصم حصري عبر بازار لايف",
    expiryFR: "Via Bazaar Live",
    expiryAR: "عبر بازار لايف",
    categoryFR: "Bazaar Live",
    categoryAR: "بازار لايف",
    badge: "bg-pink-100 text-pink-700",
  },
  {
    code: "TONTINE5",
    discountFR: "-5%",
    discountAR: "‎-5%",
    descriptionFR: "Réduction avec paiement par tontine",
    descriptionAR: "خصم عند الدفع بالتونتين",
    expiryFR: "Paiement tontine",
    expiryAR: "الدفع بالتونتين",
    categoryFR: "Tontine",
    categoryAR: "التونتين",
    badge: "bg-teal-100 text-teal-700",
  },
];

export default function CouponsPage() {
  const { isRTL, locale } = useLanguage();
  const { success } = useToast();

  const [inputCode, setInputCode] = useState("");
  const [appliedCode, setAppliedCode] = useState<string | null>(null);
  const [inputError, setInputError] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const isFR = locale === "fr";

  const handleApply = () => {
    if (inputCode.trim().length >= 4) {
      setAppliedCode(inputCode.trim().toUpperCase());
      setInputError(false);
    } else {
      setInputError(true);
    }
  };

  const handleClearApplied = () => {
    setAppliedCode(null);
    setInputCode("");
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopiedCode(code);
    success(isFR ? `Code ${code} copié !` : `تم نسخ الكود ${code}!`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const steps = isFR
    ? [
        { icon: <Copy className="w-6 h-6" />, title: "Copiez le code", desc: "Cliquez sur «Copier» sur le coupon de votre choix" },
        { icon: <Tag className="w-6 h-6" />, title: "Collez à la caisse", desc: "Entrez le code dans le champ prévu lors du paiement" },
        { icon: <Gift className="w-6 h-6" />, title: "Profitez de la réduction", desc: "La remise est appliquée automatiquement sur votre commande" },
      ]
    : [
        { icon: <Copy className="w-6 h-6" />, title: "انسخ الكود", desc: "انقر على «نسخ» على القسيمة التي تختارها" },
        { icon: <Tag className="w-6 h-6" />, title: "الصقه عند الدفع", desc: "أدخل الكود في الحقل المخصص عند الدفع" },
        { icon: <Gift className="w-6 h-6" />, title: "استمتع بالخصم", desc: "يُطبَّق الخصم تلقائيًا على طلبك" },
      ];

  return (
    <div className={`min-h-screen bg-sand-gradient ${isRTL ? "rtl" : "ltr"}`}>
      {/* Hero */}
      <section
        className="relative overflow-hidden py-16 px-4"
        style={{ background: "linear-gradient(135deg, #C9A84C 0%, #8B6914 100%)" }}
      >
        <IslamicPattern opacity={0.1} />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
              <Ticket className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className={`text-3xl md:text-4xl font-bold text-white mb-3 ${isRTL ? "font-arabic" : "font-display"}`}>
            {isFR ? "Codes Promo & Coupons" : "أكواد الخصم والقسائم"}
          </h1>
          <p className="text-white/85 text-lg">
            {isFR
              ? "Économisez sur chaque achat grâce à nos offres exclusives"
              : "وفّر في كل عملية شراء بفضل عروضنا الحصرية"}
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">
        {/* Coupon input section */}
        <div className="bg-white rounded-2xl shadow-card p-6">
          <h2 className={`text-xl font-bold text-[#1B2A4A] mb-4 ${isRTL ? "font-arabic" : "font-display"}`}>
            {isFR ? "Avez-vous un code promo ?" : "هل لديك كود خصم؟"}
          </h2>

          {appliedCode ? (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-[#d4edda] border border-[#28a745]">
              <CheckCircle2 className="w-5 h-5 text-[#28a745] flex-shrink-0" />
              <p className="flex-1 font-semibold text-[#155724]">
                {isFR
                  ? `✓ Code ${appliedCode} appliqué — 20% de réduction`
                  : `✓ تم تطبيق الكود ${appliedCode} — خصم 20%`}
              </p>
              <button
                onClick={handleClearApplied}
                className="text-[#155724] hover:text-[#0b3a1a] transition-colors"
                aria-label="Supprimer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex gap-3 flex-col sm:flex-row">
              <input
                type="text"
                value={inputCode}
                onChange={(e) => { setInputCode(e.target.value); setInputError(false); }}
                onKeyDown={(e) => e.key === "Enter" && handleApply()}
                placeholder={isFR ? "Entrez votre code promo..." : "أدخل كود الخصم..."}
                className={`flex-1 border rounded-xl px-4 py-3 text-[#1B2A4A] placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#C9A84C] transition-all font-mono ${
                  inputError ? "border-red-400 bg-red-50" : "border-gray-200"
                } ${isRTL ? "text-right" : "text-left"}`}
              />
              <button
                onClick={handleApply}
                className="btn-gold px-6 py-3 rounded-xl font-semibold whitespace-nowrap"
              >
                {isFR ? "Appliquer" : "تطبيق"}
              </button>
            </div>
          )}

          {inputError && !appliedCode && (
            <p className="mt-2 text-sm text-red-500">
              {isFR ? "Veuillez entrer un code valide (4 caractères minimum)" : "يرجى إدخال كود صحيح (4 أحرف على الأقل)"}
            </p>
          )}
        </div>

        {/* Available coupons */}
        <div>
          <h2 className={`text-2xl font-bold text-[#1B2A4A] mb-6 ${isRTL ? "font-arabic" : "font-display"}`}>
            {isFR ? "Coupons disponibles" : "القسائم المتاحة"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {coupons.map((coupon) => {
              const isCopied = copiedCode === coupon.code;
              return (
                <div
                  key={coupon.code}
                  className="bg-white rounded-2xl shadow-card p-5 border border-gray-100 flex flex-col gap-3 hover:shadow-lg transition-shadow"
                >
                  {/* Top row: code + discount */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono font-bold text-[#1B2A4A] text-lg tracking-wider">
                      {coupon.code}
                    </span>
                    <span
                      className="px-3 py-1 rounded-full text-sm font-bold"
                      style={{ background: "#FDF3DC", color: "#8B6914" }}
                    >
                      {isFR ? coupon.discountFR : coupon.discountAR}
                    </span>
                  </div>

                  {/* Description */}
                  <p className={`text-sm text-gray-600 ${isRTL ? "font-arabic" : ""}`}>
                    {isFR ? coupon.descriptionFR : coupon.descriptionAR}
                  </p>

                  {/* Expiry / usage */}
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{isFR ? coupon.expiryFR : coupon.expiryAR}</span>
                  </div>

                  {/* Footer: category + copy button */}
                  <div className="flex items-center justify-between mt-1">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${coupon.badge}`}>
                      <Tag className="inline w-3 h-3 mr-1" />
                      {isFR ? coupon.categoryFR : coupon.categoryAR}
                    </span>
                    <button
                      onClick={() => handleCopy(coupon.code)}
                      className={`flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl transition-all ${
                        isCopied
                          ? "bg-green-100 text-green-700"
                          : "bg-[#FDF3DC] text-[#8B6914] hover:bg-[#C9A84C] hover:text-white"
                      }`}
                    >
                      {isCopied ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          {isFR ? "COPIÉ ✓" : "تم النسخ ✓"}
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          {isFR ? "Copier" : "نسخ"}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* How it works */}
        <div className="bg-white rounded-2xl shadow-card p-6">
          <h2 className={`text-2xl font-bold text-[#1B2A4A] mb-6 text-center ${isRTL ? "font-arabic" : "font-display"}`}>
            {isFR ? "Comment ça marche ?" : "كيف يعمل؟"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center text-center gap-3">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-white relative"
                  style={{ background: "linear-gradient(135deg, #C9A84C 0%, #8B6914 100%)" }}
                >
                  {step.icon}
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#1B2A4A] text-white text-xs font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                </div>
                <h3 className={`font-bold text-[#1B2A4A] ${isRTL ? "font-arabic" : "font-display"}`}>
                  {step.title}
                </h3>
                <p className={`text-sm text-gray-500 ${isRTL ? "font-arabic" : ""}`}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
