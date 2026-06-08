"use client";

import { useState } from "react";
import { Shield, Lock, Eye, Trash2, Mail, ChevronDown, ChevronUp, Calendar, Database, Share2 } from "lucide-react";
import IslamicPattern from "@/components/ui/IslamicPattern";
import { useLanguage } from "@/context/LanguageContext";

const rights = {
  fr: [
    { icon: Eye, title: "Droit d'accès", desc: "Demandez à tout moment une copie de vos données personnelles détenues par NUQTA.MR." },
    { icon: Lock, title: "Droit de rectification", desc: "Corrigez toute donnée inexacte vous concernant directement depuis vos paramètres." },
    { icon: Trash2, title: "Droit à l'effacement", desc: "Supprimez votre compte et toutes vos données depuis Paramètres > Supprimer le compte." },
    { icon: Share2, title: "Droit à la portabilité", desc: "Exportez vos données dans un format lisible (JSON) depuis votre tableau de bord." },
    { icon: Database, title: "Droit d'opposition", desc: "Refusez l'utilisation de vos données à des fins de marketing ou de profilage." },
    { icon: Shield, title: "Droit à la limitation", desc: "Demandez la limitation du traitement de vos données en cas de litige." },
  ],
  ar: [
    { icon: Eye, title: "حق الوصول", desc: "اطلب في أي وقت نسخة من بياناتك الشخصية المحتفظ بها في نقطة.مر." },
    { icon: Lock, title: "حق التصحيح", desc: "صحّح أي بيانات غير دقيقة مباشرة من الإعدادات." },
    { icon: Trash2, title: "حق الحذف", desc: "احذف حسابك وجميع بياناتك من الإعدادات > حذف الحساب." },
    { icon: Share2, title: "حق نقل البيانات", desc: "صدّر بياناتك بتنسيق JSON من لوحة التحكم." },
    { icon: Database, title: "حق الاعتراض", desc: "ارفض استخدام بياناتك لأغراض التسويق أو التنميط." },
    { icon: Shield, title: "حق التقييد", desc: "اطلب تقييد معالجة بياناتك في حالة النزاع." },
  ],
};

const sections = {
  fr: [
    { title: "Données collectées", content: "Nous collectons : numéro de téléphone, nom d'utilisateur, photos de profil, annonces publiées, messages (chiffrés), localisation approximative (si autorisée), données de navigation anonymisées, et historique des transactions." },
    { title: "Utilisation des données", content: "Vos données sont utilisées pour : afficher vos annonces, faciliter les transactions, personnaliser votre expérience, envoyer des notifications pertinentes, lutter contre la fraude, et améliorer nos services. Nous n'utilisons jamais vos données à des fins publicitaires tierces sans consentement." },
    { title: "Partage des données", content: "Vos données ne sont jamais vendues. Elles peuvent être partagées avec : nos prestataires techniques (hébergement, paiement), les autorités mauritaniennes sur demande légale, et votre contrepartie lors d'une transaction Escrow (données minimales uniquement)." },
    { title: "Sécurité", content: "Nous utilisons le chiffrement TLS pour toutes les communications, le hachage bcrypt pour les mots de passe, et des audits de sécurité réguliers. En cas de violation de données, vous serez notifié dans les 72 heures." },
    { title: "Cookies", content: "Nous utilisons des cookies essentiels (session, préférences de langue) et des cookies analytiques anonymisés. Vous pouvez gérer vos préférences cookies depuis les paramètres de votre navigateur ou notre gestionnaire de cookies." },
    { title: "Conservation", content: "Données de compte : conservées jusqu'à suppression. Données de transactions : 5 ans (obligations légales mauritaniennes). Logs de navigation : 90 jours maximum. En cas de suppression du compte, toutes les données personnelles sont effacées sous 30 jours." },
  ],
  ar: [
    { title: "البيانات المجمّعة", content: "نجمع: رقم الهاتف، اسم المستخدم، صور الملف، الإعلانات المنشورة، الرسائل (مشفّرة)، الموقع التقريبي (إذا سُمح)، بيانات التصفح المجهولة، وتاريخ المعاملات." },
    { title: "استخدام البيانات", content: "تُستخدم بياناتك لـ: عرض إعلاناتك، تسهيل المعاملات، تخصيص تجربتك، إرسال إشعارات ملائمة، مكافحة الاحتيال، وتحسين خدماتنا. لا نستخدم بياناتك للإعلانات للأطراف الثالثة دون موافقة." },
    { title: "مشاركة البيانات", content: "بياناتك لا تُباع أبداً. قد تُشارك مع: مزودي الخدمات التقنية (الاستضافة والدفع)، السلطات الموريتانية بموجب طلب قانوني، والطرف المقابل في معاملة الضمان (حد أدنى من البيانات فقط)." },
    { title: "الأمان", content: "نستخدم تشفير TLS لجميع الاتصالات، وتجزئة bcrypt لكلمات المرور، وعمليات تدقيق أمني منتظمة. في حالة خرق البيانات، ستُخطَر خلال 72 ساعة." },
    { title: "ملفات الارتباط", content: "نستخدم ملفات ارتباط أساسية (الجلسة وتفضيلات اللغة) وملفات تحليلية مجهولة. يمكنك إدارة تفضيلاتك من إعدادات المتصفح أو مدير ملفات الارتباط لدينا." },
    { title: "الاحتفاظ بالبيانات", content: "بيانات الحساب: تُحتفظ حتى الحذف. بيانات المعاملات: 5 سنوات (الالتزامات القانونية الموريتانية). سجلات التصفح: 90 يوماً كحد أقصى. عند حذف الحساب، تُمحى جميع البيانات خلال 30 يوماً." },
  ],
};

export default function ConfidentialitePage() {
  const { isRTL, locale } = useLanguage();
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const rightsList = rights[locale];
  const sectionList = sections[locale];

  return (
    <div className="min-h-screen bg-sand-gradient">
      <div className="relative py-14 overflow-hidden" style={{ background: "linear-gradient(135deg, #1B4A3A, #2D6A4F)" }}>
        <IslamicPattern opacity={0.04} />
        <div className={`relative max-w-3xl mx-auto px-4 sm:px-6 text-center ${isRTL ? "font-arabic" : ""}`}>
          <Shield size={32} className="text-green-200 mx-auto mb-4" />
          <h1 className="text-3xl font-display font-bold text-white mb-2">
            {isRTL ? "سياسة الخصوصية" : "Politique de Confidentialité"}
          </h1>
          <div className={`flex items-center justify-center gap-2 text-green-200/60 text-xs mt-3 ${isRTL ? "flex-row-reverse" : ""}`}>
            <Calendar size={12} />
            <span>{isRTL ? "آخر تحديث: 1 يناير 2025" : "Dernière mise à jour : 1er janvier 2025"}</span>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        {/* Rights */}
        <div>
          <h2 className={`text-lg font-bold text-night-500 mb-4 ${isRTL ? "text-right font-arabic" : ""}`}>
            {isRTL ? "حقوقك" : "Vos droits"}
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {rightsList.map((r, i) => (
              <div key={i} className={`bg-white rounded-2xl p-4 shadow-sm flex gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                <div className="w-9 h-9 rounded-xl bg-islamic-50 flex items-center justify-center flex-shrink-0">
                  <r.icon size={16} className="text-islamic-400" />
                </div>
                <div className={isRTL ? "text-right" : ""}>
                  <p className={`font-bold text-night-500 text-sm mb-0.5 ${isRTL ? "font-arabic" : ""}`}>{r.title}</p>
                  <p className={`text-xs text-night-400/70 leading-relaxed ${isRTL ? "font-arabic" : ""}`}>{r.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sections accordion */}
        <div>
          <h2 className={`text-lg font-bold text-night-500 mb-4 ${isRTL ? "text-right font-arabic" : ""}`}>
            {isRTL ? "تفاصيل السياسة" : "Détail de la politique"}
          </h2>
          <div className="space-y-3">
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
          </div>
        </div>

        {/* DPO contact */}
        <div className={`bg-night-500 rounded-2xl p-5 flex items-center gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
          <Mail size={20} className="text-sand-400 flex-shrink-0" />
          <div className={`flex-1 ${isRTL ? "text-right font-arabic" : ""}`}>
            <p className="font-bold text-white text-sm">
              {isRTL ? "مسؤول حماية البيانات (DPO)" : "Délégué à la Protection des Données (DPO)"}
            </p>
            <p className="text-sand-300/70 text-xs mt-0.5">
              <a href="mailto:dpo@nuqta.mr" className="text-sand-400">dpo@nuqta.mr</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
