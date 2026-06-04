"use client";

import { useState } from "react";
import { Cookie, ToggleLeft, ToggleRight, Info, Shield, BarChart2, Megaphone } from "lucide-react";
import IslamicPattern from "@/components/ui/IslamicPattern";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/context/ToastContext";

const cookieCategories = [
  {
    icon: Shield,
    fr: "Cookies essentiels",
    ar: "ملفات الارتباط الأساسية",
    descFr: "Nécessaires au fonctionnement du site. Gèrent votre session, vos préférences de langue et la sécurité. Ne peuvent pas être désactivés.",
    descAr: "ضرورية لعمل الموقع. تدير جلستك وتفضيلات اللغة والأمان. لا يمكن تعطيلها.",
    required: true,
    examples: ["session_id", "lang_pref", "csrf_token"],
  },
  {
    icon: BarChart2,
    fr: "Cookies analytiques",
    ar: "ملفات الارتباط التحليلية",
    descFr: "Nous aident à comprendre comment vous utilisez SOUQ.MR. Données anonymisées uniquement — aucune information personnelle identifiable.",
    descAr: "تساعدنا على فهم كيفية استخدامك لسوق.مر. بيانات مجهولة الهوية فقط — لا معلومات شخصية.",
    required: false,
    examples: ["_ga", "_gid", "souq_analytics"],
  },
  {
    icon: Megaphone,
    fr: "Cookies marketing",
    ar: "ملفات الارتباط التسويقية",
    descFr: "Permettent de personnaliser les annonces et promotions affichées. Partagés avec nos partenaires publicitaires mauritaniens uniquement.",
    descAr: "تتيح تخصيص الإعلانات والعروض المعروضة. مشاركة مع شركائنا الإعلانيين الموريتانيين فقط.",
    required: false,
    examples: ["souq_adtrack", "promo_seen"],
  },
];

const faqs = {
  fr: [
    { q: "Qu'est-ce qu'un cookie ?", a: "Un cookie est un petit fichier texte stocké sur votre appareil lors de votre visite sur un site web. Il permet au site de se souvenir de vos actions et préférences." },
    { q: "Comment gérer mes cookies ?", a: "Vous pouvez accepter ou refuser les cookies non essentiels via ce panneau. Vous pouvez également gérer les cookies directement depuis les paramètres de votre navigateur." },
    { q: "Mes données sont-elles partagées ?", a: "Les cookies essentiels ne sont jamais partagés. Les cookies analytiques utilisent des données anonymisées. Les cookies marketing sont partagés uniquement avec nos partenaires mauritaniens listés dans notre politique de confidentialité." },
    { q: "Combien de temps durent les cookies ?", a: "Les cookies de session expirent à la fermeture du navigateur. Les cookies persistants durent de 30 jours (analytiques) à 12 mois (marketing) selon leur type." },
  ],
  ar: [
    { q: "ما هو ملف الارتباط؟", a: "ملف الارتباط هو ملف نصي صغير يُخزَّن على جهازك عند زيارة موقع ويب. يتيح للموقع تذكر إجراءاتك وتفضيلاتك." },
    { q: "كيف أدير ملفات الارتباط؟", a: "يمكنك قبول أو رفض ملفات الارتباط غير الأساسية عبر هذه اللوحة. يمكنك أيضاً إدارتها مباشرة من إعدادات متصفحك." },
    { q: "هل تُشارَك بياناتي؟", a: "ملفات الارتباط الأساسية لا تُشارَك أبداً. تستخدم ملفات الارتباط التحليلية بيانات مجهولة. تُشارَك ملفات الارتباط التسويقية فقط مع شركائنا الموريتانيين المدرجين في سياسة الخصوصية." },
    { q: "كم تدوم ملفات الارتباط؟", a: "تنتهي ملفات ارتباط الجلسة عند إغلاق المتصفح. تدوم ملفات الارتباط الدائمة من 30 يوماً (تحليلية) إلى 12 شهراً (تسويقية) حسب نوعها." },
  ],
};

export default function PolitiqueCookiesPage() {
  const { isRTL, locale } = useLanguage();
  const { success } = useToast();
  const [prefs, setPrefs] = useState({ analytics: true, marketing: false });
  const [saved, setSaved] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqList = faqs[locale];

  const handleSave = () => {
    setSaved(true);
    success(isRTL ? "تم حفظ تفضيلاتك!" : "Préférences enregistrées !");
  };

  return (
    <div className="min-h-screen bg-sand-gradient">
      <div className="relative py-14 overflow-hidden" style={{ background: "linear-gradient(135deg, #4A3728, #7A5C3A)" }}>
        <IslamicPattern opacity={0.04} />
        <div className={`relative max-w-3xl mx-auto px-4 sm:px-6 text-center ${isRTL ? "font-arabic" : ""}`}>
          <Cookie size={32} className="text-amber-200 mx-auto mb-4" />
          <h1 className="text-3xl font-display font-bold text-white mb-2">
            {isRTL ? "سياسة ملفات الارتباط" : "Politique des Cookies"}
          </h1>
          <p className="text-amber-100/60 text-sm max-w-lg mx-auto">
            {isRTL ? "اختر ملفات الارتباط التي تقبلها لتخصيص تجربتك" : "Choisissez les cookies que vous acceptez pour personnaliser votre expérience"}
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        {/* Cookie preferences */}
        <div>
          <h2 className={`text-lg font-bold text-night-500 mb-4 ${isRTL ? "text-right font-arabic" : ""}`}>
            {isRTL ? "تفضيلاتك" : "Vos préférences"}
          </h2>
          <div className="space-y-3">
            {cookieCategories.map((cat, i) => {
              const key = i === 1 ? "analytics" : "marketing";
              const isOn = cat.required || prefs[key as keyof typeof prefs];
              return (
                <div key={i} className="bg-white rounded-2xl p-5 shadow-sm">
                  <div className={`flex items-start gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                    <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <cat.icon size={18} className="text-amber-600" />
                    </div>
                    <div className={`flex-1 ${isRTL ? "text-right" : ""}`}>
                      <div className={`flex items-center justify-between mb-1 ${isRTL ? "flex-row-reverse" : ""}`}>
                        <p className={`font-bold text-night-500 text-sm ${isRTL ? "font-arabic" : ""}`}>
                          {isRTL ? cat.ar : cat.fr}
                        </p>
                        {cat.required ? (
                          <span className={`text-xs text-islamic-500 font-semibold bg-islamic-50 px-2 py-0.5 rounded-full ${isRTL ? "font-arabic" : ""}`}>
                            {isRTL ? "مطلوب" : "Requis"}
                          </span>
                        ) : (
                          <button
                            onClick={() => setPrefs(p => ({ ...p, [key]: !p[key as keyof typeof prefs] }))}
                            className="flex-shrink-0"
                          >
                            {isOn
                              ? <ToggleRight size={28} className="text-islamic-500" />
                              : <ToggleLeft size={28} className="text-night-300" />}
                          </button>
                        )}
                      </div>
                      <p className={`text-xs text-night-400/70 leading-relaxed mb-2 ${isRTL ? "font-arabic" : ""}`}>
                        {isRTL ? cat.descAr : cat.descFr}
                      </p>
                      <div className={`flex flex-wrap gap-1 ${isRTL ? "flex-row-reverse" : ""}`}>
                        {cat.examples.map((ex) => (
                          <code key={ex} className="text-xs bg-sand-100 text-night-400 px-2 py-0.5 rounded-md">{ex}</code>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className={`flex gap-3 mt-4 ${isRTL ? "flex-row-reverse" : ""}`}>
            <button onClick={handleSave} className="btn-gold text-sm">
              {isRTL ? "حفظ التفضيلات" : "Enregistrer mes choix"}
            </button>
            <button
              onClick={() => { setPrefs({ analytics: false, marketing: false }); setSaved(false); }}
              className="px-4 py-2 text-sm text-night-400 hover:text-night-500 border border-sand-200 rounded-xl hover:border-sand-300 transition-colors"
            >
              {isRTL ? "رفض الكل" : "Tout refuser"}
            </button>
            <button
              onClick={() => { setPrefs({ analytics: true, marketing: true }); setSaved(false); }}
              className="px-4 py-2 text-sm text-night-400 hover:text-night-500 border border-sand-200 rounded-xl hover:border-sand-300 transition-colors"
            >
              {isRTL ? "قبول الكل" : "Tout accepter"}
            </button>
          </div>
          {saved && (
            <div className={`flex items-center gap-2 mt-3 text-islamic-500 text-sm ${isRTL ? "flex-row-reverse font-arabic" : ""}`}>
              <Info size={14} />
              {isRTL ? "تم حفظ تفضيلاتك بنجاح." : "Vos préférences ont bien été enregistrées."}
            </div>
          )}
        </div>

        {/* FAQ */}
        <div>
          <h2 className={`text-lg font-bold text-night-500 mb-4 ${isRTL ? "text-right font-arabic" : ""}`}>
            {isRTL ? "أسئلة شائعة" : "Questions fréquentes"}
          </h2>
          <div className="space-y-3">
            {faqList.map((item, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className={`w-full flex items-center justify-between px-6 py-4 ${isRTL ? "flex-row-reverse text-right" : "text-left"}`}
                >
                  <span className={`font-semibold text-night-500 text-sm ${isRTL ? "font-arabic" : ""}`}>{item.q}</span>
                  <span className="text-sand-400 text-lg flex-shrink-0 ml-2">{openFaq === i ? "−" : "+"}</span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 border-t border-sand-100 pt-4">
                    <p className={`text-sm text-night-400/80 leading-relaxed ${isRTL ? "font-arabic text-right" : ""}`}>{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Info banner */}
        <div className={`bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
          <Info size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <p className={`text-sm text-amber-800 leading-relaxed ${isRTL ? "font-arabic text-right" : ""}`}>
            {isRTL
              ? "لمزيد من المعلومات حول كيفية استخدامنا لبياناتك، راجع سياسة الخصوصية. للاتصال بنا: privacy@souq.mr"
              : "Pour plus d'informations sur l'utilisation de vos données, consultez notre politique de confidentialité. Contact : privacy@souq.mr"}
          </p>
        </div>
      </div>
    </div>
  );
}
