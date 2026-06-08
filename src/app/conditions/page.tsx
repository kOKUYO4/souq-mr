"use client";

import { useState } from "react";
import { FileText, ChevronDown, ChevronUp, Calendar } from "lucide-react";
import IslamicPattern from "@/components/ui/IslamicPattern";
import { useLanguage } from "@/context/LanguageContext";

const sections = {
  fr: [
    { title: "1. Acceptation des conditions", content: "En utilisant NUQTA.MR, vous acceptez les présentes CGU. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre service. NUQTA.MR se réserve le droit de modifier ces conditions à tout moment avec notification sur la plateforme." },
    { title: "2. Description du service", content: "NUQTA.MR est une plateforme de petites annonces permettant aux utilisateurs mauritaniens d'acheter, vendre et échanger biens et services. NUQTA.MR agit comme intermédiaire et n'est pas partie aux transactions, sauf dans le cadre du service Escrow." },
    { title: "3. Inscription et compte", content: "Pour les fonctionnalités complètes, vous devez créer un compte avec un numéro de téléphone mauritanien valide. Vous êtes responsable de la confidentialité de votre mot de passe et de toutes les activités depuis votre compte." },
    { title: "4. Publication d'annonces", content: "Seuls les biens légaux peuvent être publiés. Sont interdits : armes, drogues, contrefaçons, contenus illicites. Chaque annonce est modérée sous 2h. NUQTA.MR peut supprimer toute annonce sans préavis." },
    { title: "5. Frais et commission", content: "5 premières annonces gratuites. Abonnement Pro à partir de 4 990 MRU/mois. Service Escrow : gratuit acheteur, 1% vendeur. Boosts d'annonces selon grille tarifaire de l'Espace Pro." },
    { title: "6. Responsabilité", content: "NUQTA.MR ne garantit pas l'exactitude des informations des vendeurs. En cas d'arnaque signalée, NUQTA.MR répond sous 1h ouvrée et assiste les parties." },
    { title: "7. Propriété intellectuelle", content: "Tous les contenus de NUQTA.MR sont protégés. Toute reproduction sans autorisation est interdite. Les utilisateurs conservent leurs droits sur leurs publications et accordent à NUQTA.MR une licence d'affichage." },
    { title: "8. Résiliation", content: "Suppression de compte possible à tout moment dans les paramètres. En cas de résiliation, annonces désactivées et solde Escrow remboursé sous 7 jours ouvrés." },
    { title: "9. Droit applicable", content: "Ces CGU sont régies par le droit mauritanien. Tout litige est soumis à la juridiction de Nouakchott. Règlement amiable encouragé via notre service de médiation." },
    { title: "10. Contact légal", content: "legal@nuqta.mr | NUQTA.MR SARL, Tevragh-Zeina, Nouakchott, Mauritanie | +222 XX XX XX XX" },
  ],
  ar: [
    { title: "1. قبول الشروط", content: "باستخدام نقطة.مر فإنك تقبل شروط الاستخدام. إذا كنت لا توافق، يُرجى عدم استخدام الخدمة. تحتفظ نقطة.مر بحق التعديل مع إشعار على المنصة." },
    { title: "2. وصف الخدمة", content: "نقطة.مر منصة إعلانات مبوبة للمستخدمين الموريتانيين. تعمل كوسيط فقط ولا تكون طرفاً في المعاملات إلا في إطار خدمة الضمان المالي." },
    { title: "3. التسجيل والحساب", content: "يتطلب استخدام الميزات الكاملة حساباً برقم هاتف موريتاني صالح. أنت مسؤول عن سرية كلمة مرورك وجميع أنشطة حسابك." },
    { title: "4. نشر الإعلانات", content: "السلع القانونية فقط. يُحظر: الأسلحة والمخدرات والمنتجات المقلدة. كل إعلان يُراجع خلال ساعتين. يحق لنقطة.مر حذف أي إعلان دون إشعار." },
    { title: "5. الرسوم والعمولة", content: "أول 5 إعلانات مجانية. اشتراك محترف من 4,990 أوقية/شهر. الضمان المالي: مجاني للمشتري، 1% للبائع. تعزيز الإعلانات حسب جدول الأسعار." },
    { title: "6. المسؤولية", content: "لا تضمن نقطة.مر دقة معلومات البائعين. عند الإبلاغ عن احتيال، ترد نقطة.مر خلال ساعة عمل وتساعد الأطراف." },
    { title: "7. الملكية الفكرية", content: "جميع محتويات نقطة.مر محمية. يُحظر الاستنساخ دون إذن. يحتفظ المستخدمون بحقوق منشوراتهم ويمنحون ترخيص عرض لنقطة.مر." },
    { title: "8. الإنهاء", content: "حذف الحساب ممكن في أي وقت. عند الإنهاء: تُعطَّل الإعلانات ويُردّ رصيد الضمان خلال 7 أيام عمل." },
    { title: "9. القانون المطبق", content: "تخضع الشروط للقانون الموريتاني. النزاعات تُحال لمحكمة نواكشوط. نشجع التسوية الودية عبر خدمة الوساطة." },
    { title: "10. التواصل القانوني", content: "legal@nuqta.mr | نقطة.مر ش.م.ر، تيفرغ زينة، نواكشوط، موريتانيا | +222 XX XX XX XX" },
  ],
};

export default function ConditionsPage() {
  const { isRTL, locale } = useLanguage();
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const sectionList = sections[locale];

  return (
    <div className="min-h-screen bg-sand-gradient">
      <div className="relative py-14 overflow-hidden" style={{ background: "linear-gradient(135deg, #1B2A4A, #0C1426)" }}>
        <IslamicPattern opacity={0.04} />
        <div className={`relative max-w-3xl mx-auto px-4 sm:px-6 text-center ${isRTL ? "font-arabic" : ""}`}>
          <FileText size={32} className="text-sand-400 mx-auto mb-4" />
          <h1 className="text-3xl font-display font-bold text-white mb-2">
            {isRTL ? "شروط الاستخدام" : "Conditions Générales d'Utilisation"}
          </h1>
          <div className={`flex items-center justify-center gap-2 text-sand-300/60 text-xs mt-3 ${isRTL ? "flex-row-reverse" : ""}`}>
            <Calendar size={12} />
            <span>{isRTL ? "آخر تحديث: 1 يناير 2025" : "Dernière mise à jour : 1er janvier 2025"}</span>
          </div>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-3">
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-700 mb-6">
          <p className={isRTL ? "font-arabic text-right" : ""}>
            {isRTL ? "يُرجى قراءة هذه الشروط بعناية قبل استخدام منصة نقطة.مر." : "Veuillez lire attentivement ces conditions avant d'utiliser NUQTA.MR."}
          </p>
        </div>
        {sectionList.map((section, i) => (
          <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm">
            <button onClick={() => setOpenIdx(openIdx === i ? null : i)}
              className={`w-full flex items-center justify-between px-6 py-4 ${isRTL ? "flex-row-reverse text-right" : "text-left"}`}>
              <span className={`font-semibold text-night-500 text-sm ${isRTL ? "font-arabic" : ""}`}>{section.title}</span>
              {openIdx === i ? <ChevronUp size={16} className="text-sand-400 flex-shrink-0" /> : <ChevronDown size={16} className="text-sand-400 flex-shrink-0" />}
            </button>
            {openIdx === i && (
              <div className="px-6 pb-5 border-t border-sand-100 pt-4">
                <p className={`text-sm text-night-400/80 leading-relaxed ${isRTL ? "font-arabic text-right" : ""}`}>{section.content}</p>
              </div>
            )}
          </div>
        ))}
        <div className="bg-night-500 rounded-2xl p-5 text-center mt-4">
          <p className={`text-sand-300/70 text-sm ${isRTL ? "font-arabic" : ""}`}>
            {isRTL ? "أسئلة؟ تواصل معنا: " : "Questions ? "}<a href="mailto:legal@nuqta.mr" className="text-sand-400 font-semibold">legal@nuqta.mr</a>
          </p>
        </div>
      </div>
    </div>
  );
}
