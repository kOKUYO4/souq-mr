"use client";

import { useState } from "react";
import { CreditCard, Smartphone, Truck, Shield, CheckCircle2, ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import IslamicPattern from "@/components/ui/IslamicPattern";
import { useLanguage } from "@/context/LanguageContext";

const methods = {
  fr: [
    {
      id: "cod",
      icon: Truck,
      title: "Paiement à la livraison (COD)",
      color: "#2D6A4F",
      bg: "#E8F4EE",
      pros: ["Aucun risque en ligne", "Vérifiez avant de payer", "Idéal pour les petits montants"],
      cons: ["Disponible en ville uniquement", "Le livreur doit avoir la monnaie"],
      tip: "Recommandé pour les achats < 50 000 MRU dans Nouakchott et Nouadhibou.",
    },
    {
      id: "bankily",
      icon: Smartphone,
      title: "Bankily (Mauritel)",
      color: "#E53E3E",
      bg: "#FEF2F2",
      pros: ["Transfert instantané", "Disponible 24h/24", "Disponible sur tout le territoire"],
      cons: ["Frais de transfert (0.5-1%)", "Limite journalière 200 000 MRU"],
      tip: "Numérotez le vendeur depuis l'app Bankily. Entrez son numéro et confirmez par code PIN.",
    },
    {
      id: "masrvi",
      icon: Smartphone,
      title: "Masrvi (Mattel)",
      color: "#1B2A4A",
      bg: "#EEF2FF",
      pros: ["Réseau Mattel nationwide", "Interface simple", "Rechargement facile"],
      cons: ["Frais de transfert", "Limite mensuelle"],
      tip: "Composez *444# ou utilisez l'app Masrvi pour envoyer de l'argent instantanément.",
    },
    {
      id: "escrow",
      icon: Shield,
      title: "Escrow NUQTA.MR",
      color: "#C9A84C",
      bg: "#FDF6E3",
      pros: ["100% sécurisé", "Argent bloqué jusqu'à réception", "Protection acheteur & vendeur"],
      cons: ["Frais 1.5%", "Traitement 48h"],
      tip: "Recommandé pour tout achat > 50 000 MRU. Vos fonds sont protégés jusqu'à confirmation de réception.",
    },
  ],
  ar: [
    {
      id: "cod",
      icon: Truck,
      title: "الدفع عند الاستلام (COD)",
      color: "#2D6A4F",
      bg: "#E8F4EE",
      pros: ["لا مخاطر إلكترونية", "التحقق قبل الدفع", "مثالي للمبالغ الصغيرة"],
      cons: ["متاح في المدينة فقط", "السائق يحتاج الفكة"],
      tip: "موصى به للمشتريات أقل من 50,000 أوقية في نواكشوط ونواذيبو.",
    },
    {
      id: "bankily",
      icon: Smartphone,
      title: "بانكيلي (موريتل)",
      color: "#E53E3E",
      bg: "#FEF2F2",
      pros: ["تحويل فوري", "متاح 24/7", "في كل أنحاء البلاد"],
      cons: ["رسوم تحويل (0.5-1%)", "حد يومي 200,000 أوقية"],
      tip: "حوّل للبائع من تطبيق بانكيلي. أدخل رقمه وأكد بالرمز السري.",
    },
    {
      id: "masrvi",
      icon: Smartphone,
      title: "مصرفي (ماتل)",
      color: "#1B2A4A",
      bg: "#EEF2FF",
      pros: ["شبكة ماتل الوطنية", "واجهة بسيطة", "إعادة الشحن سهلة"],
      cons: ["رسوم تحويل", "حد شهري"],
      tip: "اطلب *444# أو استخدم تطبيق مصرفي لإرسال المال فوراً.",
    },
    {
      id: "escrow",
      icon: Shield,
      title: "الضمان المالي نقطة.مر",
      color: "#C9A84C",
      bg: "#FDF6E3",
      pros: ["أمان 100%", "الأموال محجوزة حتى الاستلام", "حماية للمشتري والبائع"],
      cons: ["رسوم 1.5%", "معالجة 48 ساعة"],
      tip: "موصى به لأي شراء أكثر من 50,000 أوقية. أموالك محمية حتى تأكيد الاستلام.",
    },
  ],
};

export default function PaiementPage() {
  const { isRTL, locale } = useLanguage();
  const [selected, setSelected] = useState<string | null>(null);
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  const methodList = methods[locale];

  return (
    <div className="min-h-screen bg-sand-gradient">
      {/* Header */}
      <div className="relative py-16 overflow-hidden" style={{ background: "linear-gradient(135deg, #1B2A4A, #0C1426)" }}>
        <IslamicPattern opacity={0.05} />
        <div className={`relative max-w-4xl mx-auto px-4 sm:px-6 text-center ${isRTL ? "font-arabic" : ""}`}>
          <h1 className="text-4xl font-display font-bold text-white mb-4">
            {isRTL ? "طرق الدفع" : "Modes de paiement"}
          </h1>
          <p className="text-sand-300/70 max-w-lg mx-auto">
            {isRTL
              ? "اختر طريقة الدفع المناسبة لكل معاملة"
              : "Choisissez le mode de paiement adapté à chaque transaction"}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid sm:grid-cols-2 gap-5 mb-12">
          {methodList.map((m) => {
            const Icon = m.icon;
            const isOpen = selected === m.id;
            return (
              <div
                key={m.id}
                className={`bg-white rounded-2xl overflow-hidden shadow-card cursor-pointer transition-all ${isOpen ? "ring-2 ring-sand-400" : "hover:shadow-card-hover"}`}
                onClick={() => setSelected(isOpen ? null : m.id)}
              >
                <div className="p-5">
                  <div className={`flex items-center gap-3 mb-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: m.bg }}>
                      <Icon size={20} style={{ color: m.color }} />
                    </div>
                    <h3 className={`font-bold text-night-500 ${isRTL ? "font-arabic" : ""}`}>{m.title}</h3>
                    <Arrow size={14} className={`ml-auto text-sand-300 transition-transform ${isOpen ? "rotate-90" : ""}`} />
                  </div>

                  {isOpen && (
                    <div className={`mt-3 space-y-3 ${isRTL ? "text-right" : ""}`}>
                      <div>
                        <p className="text-xs font-semibold text-islamic-400 mb-1.5">{isRTL ? "المزايا ✓" : "Avantages ✓"}</p>
                        <ul className="space-y-1">
                          {m.pros.map((p, i) => (
                            <li key={i} className={`flex items-start gap-2 text-xs text-night-400/80 ${isRTL ? "flex-row-reverse font-arabic" : ""}`}>
                              <CheckCircle2 size={12} className="text-islamic-400 flex-shrink-0 mt-0.5" />
                              {p}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-red-400 mb-1.5">{isRTL ? "القيود ✗" : "Limites ✗"}</p>
                        <ul className="space-y-1">
                          {m.cons.map((c, i) => (
                            <li key={i} className={`text-xs text-night-400/60 ${isRTL ? "font-arabic text-right" : ""}`}>• {c}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-sand-50 rounded-xl p-3">
                        <p className={`text-xs text-night-400/80 leading-relaxed ${isRTL ? "font-arabic" : ""}`}>
                          💡 {m.tip}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Decision guide */}
        <div className="bg-white rounded-2xl p-6 shadow-card">
          <h2 className={`font-bold text-night-500 text-lg mb-5 ${isRTL ? "font-arabic text-right" : ""}`}>
            {isRTL ? "كيف تختار؟" : "Comment choisir ?"}
          </h2>
          <div className="space-y-3">
            {[
              { cond: isRTL ? "المبلغ < 50,000 أوقية وفي المدينة" : "Montant < 50 000 MRU en ville", rec: isRTL ? "الدفع عند الاستلام" : "Paiement à la livraison" },
              { cond: isRTL ? "تحويل سريع لأي مكان" : "Transfert rapide partout en Mauritanie", rec: isRTL ? "بانكيلي أو مصرفي" : "Bankily ou Masrvi" },
              { cond: isRTL ? "المبلغ > 50,000 أوقية" : "Montant > 50 000 MRU", rec: isRTL ? "ضمان مالي نقطة.مر" : "Escrow NUQTA.MR" },
              { cond: isRTL ? "سيارة أو عقار" : "Voiture ou bien immobilier", rec: isRTL ? "ضمان مالي مطلقاً" : "Escrow obligatoire" },
            ].map((row, i) => (
              <div key={i} className={`flex items-start gap-4 py-3 border-b border-sand-50 last:border-0 ${isRTL ? "flex-row-reverse" : ""}`}>
                <div className={`flex-1 text-sm text-night-400/70 ${isRTL ? "font-arabic text-right" : ""}`}>{row.cond}</div>
                <Arrow size={14} className="text-sand-300 flex-shrink-0 mt-0.5" />
                <div className={`flex-1 text-sm font-semibold text-sand-500 ${isRTL ? "font-arabic text-right" : ""}`}>{row.rec}</div>
              </div>
            ))}
          </div>
        </div>

        <div className={`flex gap-3 mt-8 ${isRTL ? "flex-row-reverse" : ""}`}>
          <Link href="/escrow" className="btn-gold text-sm py-3 px-6">
            {isRTL ? "اعرف أكثر عن الضمان المالي" : "En savoir plus sur l'Escrow"}
          </Link>
          <Link href="/securite" className="btn-night text-sm py-3 px-6">
            {isRTL ? "دليل الأمان" : "Guide sécurité"}
          </Link>
        </div>
      </div>
    </div>
  );
}
