"use client";

import { Shield, AlertTriangle, CheckCircle2, XCircle, Phone, CreditCard, MapPin, Eye } from "lucide-react";
import Link from "next/link";
import IslamicPattern from "@/components/ui/IslamicPattern";
import { useLanguage } from "@/context/LanguageContext";

const redFlags = {
  fr: [
    "Prix anormalement bas pour un article de valeur",
    "Vendeur qui demande un virement avant la rencontre",
    "Profil créé récemment avec peu d'avis",
    "Vendeur qui refuse de montrer l'article en vrai",
    "Demande de paiement par coupons ou crypto",
    "Pression pour conclure rapidement la vente",
  ],
  ar: [
    "سعر منخفض بشكل غير طبيعي لعنصر ذي قيمة",
    "بائع يطلب تحويلاً مالياً قبل اللقاء",
    "ملف شخصي تم إنشاؤه مؤخراً مع عدد قليل من التقييمات",
    "بائع يرفض إظهار المنتج شخصياً",
    "طلب الدفع عبر قسائم أو عملات مشفرة",
    "ضغط لإتمام عملية البيع بسرعة",
  ],
};

const tips = {
  fr: [
    { icon: MapPin, color: "#2D6A4F", bg: "#E8F4EE", title: "Rencontrez-vous en lieu public", desc: "Choisissez toujours un endroit fréquenté comme un café, une banque ou un marché connu. Évitez les rendez-vous isolés, surtout le soir." },
    { icon: Eye, color: "#C9A84C", bg: "#FDF6E3", title: "Vérifiez l'article avant de payer", desc: "Testez le produit, vérifiez le numéro de série, demandez la facture d'origine. Pour les voitures, exigez les papiers complets." },
    { icon: CreditCard, color: "#1B2A4A", bg: "#EEF1F7", title: "Utilisez le paiement sécurisé", desc: "Pour les transactions > 50 000 MRU, utilisez notre système Escrow. Évitez les virements bancaires sans garantie." },
    { icon: Shield, color: "#2D6A4F", bg: "#E8F4EE", title: "Vérifiez le badge vendeur", desc: "Les vendeurs avec badge ✓ Vérifié ont été validés par notre équipe. Les marchands Pro ont un contrat signé avec NUQTA.MR." },
    { icon: Phone, color: "#C9A84C", bg: "#FDF6E3", title: "Ne partagez pas vos codes OTP", desc: "NUQTA.MR ne vous demandera JAMAIS votre code OTP par téléphone. Si quelqu'un vous le demande, c'est une arnaque." },
    { icon: AlertTriangle, color: "#E53E3E", bg: "#FFF5F5", title: "Signalez les arnaques", desc: "Utilisez le bouton « Signaler » sur chaque annonce. Notre équipe répond sous 1h. Vous protégez la communauté." },
  ],
  ar: [
    { icon: MapPin, color: "#2D6A4F", bg: "#E8F4EE", title: "التقِ في أماكن عامة", desc: "اختر دائماً مكاناً مكتظاً كمقهى أو بنك أو سوق معروف. تجنب المواعيد المنعزلة، خاصةً في المساء." },
    { icon: Eye, color: "#C9A84C", bg: "#FDF6E3", title: "تحقق من المنتج قبل الدفع", desc: "اختبر المنتج، تحقق من الرقم التسلسلي، اطلب الفاتورة الأصلية. للسيارات، اشترط الأوراق الكاملة." },
    { icon: CreditCard, color: "#1B2A4A", bg: "#EEF1F7", title: "استخدم الدفع الآمن", desc: "للمعاملات التي تتجاوز 50,000 أوقية، استخدم نظام الضمان المالي. تجنب التحويلات البنكية بدون ضمان." },
    { icon: Shield, color: "#2D6A4F", bg: "#E8F4EE", title: "تحقق من شارة البائع", desc: "البائعون بشارة ✓ موثق تم التحقق منهم من قِبل فريقنا. التجار المحترفون لديهم عقد موقع مع نقطة.مر." },
    { icon: Phone, color: "#C9A84C", bg: "#FDF6E3", title: "لا تشارك رموز OTP", desc: "لن يطلب منك نقطة.مر أبداً رمز OTP عبر الهاتف. إذا طلبه أحد، فهذا احتيال." },
    { icon: AlertTriangle, color: "#E53E3E", bg: "#FFF5F5", title: "أبلغ عن عمليات الاحتيال", desc: "استخدم زر «الإبلاغ» في كل إعلان. يستجيب فريقنا خلال ساعة. أنت تحمي المجتمع." },
  ],
};

export default function SecuritePage() {
  const { isRTL, locale } = useLanguage();
  const tipList = tips[locale];
  const redFlagList = redFlags[locale];

  return (
    <div className="min-h-screen bg-sand-gradient">
      <div className="relative py-14 overflow-hidden" style={{ background: "linear-gradient(135deg, #1B2A4A, #0C1426)" }}>
        <IslamicPattern opacity={0.05} />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <div className="w-14 h-14 rounded-2xl bg-sand-400/20 flex items-center justify-center mx-auto mb-4">
            <Shield size={28} className="text-sand-400" />
          </div>
          <h1 className={`text-4xl font-display font-bold text-white mb-3 ${isRTL ? "font-arabic" : ""}`}>
            {isRTL ? "دليل مكافحة الاحتيال" : "Guide anti-arnaque"}
          </h1>
          <p className={`text-sand-300/70 ${isRTL ? "font-arabic" : ""}`}>
            {isRTL ? "كيف تتعاملون بأمان على نقطة.مر" : "Comment acheter et vendre en toute sécurité sur NUQTA.MR"}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-12">
        {/* Tips */}
        <div>
          <h2 className={`text-xl font-bold text-night-500 mb-6 ${isRTL ? "text-right font-arabic" : ""}`}>
            {isRTL ? "نصائح السلامة الأساسية" : "Conseils de sécurité essentiels"}
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {tipList.map((tip, i) => (
              <div key={i} className={`bg-white rounded-2xl p-5 shadow-card flex gap-4 ${isRTL ? "flex-row-reverse text-right" : ""}`}>
                <div className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ background: tip.bg }}>
                  <tip.icon size={20} style={{ color: tip.color }} />
                </div>
                <div>
                  <h3 className={`font-bold text-night-500 text-sm mb-1 ${isRTL ? "font-arabic" : ""}`}>{tip.title}</h3>
                  <p className={`text-xs text-night-400/70 leading-relaxed ${isRTL ? "font-arabic" : ""}`}>{tip.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Red flags */}
        <div className="bg-red-50 border border-red-100 rounded-2xl p-6">
          <div className={`flex items-center gap-3 mb-5 ${isRTL ? "flex-row-reverse" : ""}`}>
            <AlertTriangle size={20} className="text-red-500 flex-shrink-0" />
            <h2 className={`text-lg font-bold text-red-700 ${isRTL ? "font-arabic" : ""}`}>
              {isRTL ? "علامات تحذيرية — كن حذراً!" : "Signaux d'alarme — Méfiez-vous !"}
            </h2>
          </div>
          <ul className="space-y-2.5">
            {redFlagList.map((flag, i) => (
              <li key={i} className={`flex items-start gap-3 ${isRTL ? "flex-row-reverse text-right" : ""}`}>
                <XCircle size={15} className="text-red-400 flex-shrink-0 mt-0.5" />
                <span className={`text-sm text-red-700 ${isRTL ? "font-arabic" : ""}`}>{flag}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Escrow */}
        <div className="bg-night-500 rounded-2xl p-8 relative overflow-hidden">
          <IslamicPattern opacity={0.05} />
          <div className={`relative flex flex-col sm:flex-row items-start gap-6 ${isRTL ? "sm:flex-row-reverse text-right" : ""}`}>
            <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-sand-400/20 flex items-center justify-center">
              <Shield size={28} className="text-sand-400" />
            </div>
            <div className="flex-1">
              <h3 className={`text-lg font-bold text-white mb-2 ${isRTL ? "font-arabic" : ""}`}>
                {isRTL ? "نظام الضمان المالي (Escrow)" : "Système de paiement sécurisé (Escrow)"}
              </h3>
              <p className={`text-sand-300/70 text-sm mb-4 ${isRTL ? "font-arabic" : ""}`}>
                {isRTL
                  ? "للمعاملات التي تتجاوز 50,000 أوقية، يُجمّد نقطة.مر المبلغ حتى تأكيد الاستلام. البائع يحصل على المال فقط بعد رضا المشتري."
                  : "Pour les transactions > 50 000 MRU, NUQTA.MR bloque les fonds jusqu'à confirmation de réception. Le vendeur reçoit le paiement uniquement après la satisfaction de l'acheteur."}
              </p>
              <div className={`flex gap-3 flex-wrap ${isRTL ? "flex-row-reverse" : ""}`}>
                <div className={`flex items-center gap-2 text-xs text-islamic-400 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <CheckCircle2 size={14} />{isRTL ? "مجاني للمشترين" : "Gratuit pour les acheteurs"}
                </div>
                <div className={`flex items-center gap-2 text-xs text-islamic-400 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <CheckCircle2 size={14} />{isRTL ? "1% فقط للبائعين" : "1% seulement pour les vendeurs"}
                </div>
                <div className={`flex items-center gap-2 text-xs text-islamic-400 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <CheckCircle2 size={14} />{isRTL ? "استرداد مضمون" : "Remboursement garanti"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA signalement */}
        <div className={`flex flex-col sm:flex-row items-center gap-4 bg-white rounded-2xl p-6 shadow-card ${isRTL ? "sm:flex-row-reverse text-right" : ""}`}>
          <div className="flex-1">
            <h3 className={`font-bold text-night-500 mb-1 ${isRTL ? "font-arabic" : ""}`}>
              {isRTL ? "تعرضت لاحتيال؟" : "Vous avez été victime d'une arnaque ?"}
            </h3>
            <p className={`text-sm text-night-400/70 ${isRTL ? "font-arabic" : ""}`}>
              {isRTL ? "تواصل معنا فوراً — نتدخل خلال ساعة" : "Contactez-nous immédiatement — nous intervenons sous 1h"}
            </p>
          </div>
          <div className={`flex gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
            <a href="tel:+22200000000" className="btn-gold text-sm py-2.5">
              {isRTL ? "اتصل الآن" : "Appeler"}
            </a>
            <Link href="/contact" className="btn-outline text-sm py-2.5">
              {isRTL ? "راسلنا" : "Écrire"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
