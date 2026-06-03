"use client";

import { Shield, Lock, Eye, Trash2, Mail } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import IslamicPattern from "@/components/ui/IslamicPattern";

const points = {
  fr: [
    { icon: Eye, title: "Données collectées", body: "Nous collectons votre numéro de téléphone, nom, et les données de vos annonces. Les données de navigation sont anonymisées. Nous n'vendons jamais vos données à des tiers." },
    { icon: Lock, title: "Sécurité des données", body: "Vos données sont chiffrées en transit (TLS 1.3) et au repos (AES-256). Les tokens d'authentification expirent après 7 jours. Nous effectuons des audits de sécurité réguliers." },
    { icon: Shield, title: "Utilisation des données", body: "Vos données servent uniquement à faire fonctionner SOUQ.MR : affichage des annonces, notifications, lutte contre la fraude. Nous ne faisons pas de profilage commercial." },
    { icon: Trash2, title: "Vos droits", body: "Vous pouvez demander l'accès, la rectification ou la suppression de vos données à tout moment. Envoyez un email à privacy@souq.mr. Nous répondons sous 48h." },
    { icon: Mail, title: "Cookies", body: "Nous utilisons uniquement des cookies essentiels au fonctionnement du site (session, préférences de langue). Aucun cookie publicitaire ou de tracking tiers." },
  ],
  ar: [
    { icon: Eye, title: "البيانات المجمعة", body: "نجمع رقم هاتفك واسمك وبيانات إعلاناتك. بيانات التصفح مجهولة الهوية. نحن لا نبيع بياناتك أبداً لأطراف ثالثة." },
    { icon: Lock, title: "أمان البيانات", body: "بياناتك مشفرة أثناء النقل (TLS 1.3) وفي وضع الراحة (AES-256). تنتهي صلاحية رموز المصادقة بعد 7 أيام. نجري عمليات تدقيق أمني منتظمة." },
    { icon: Shield, title: "استخدام البيانات", body: "تُستخدم بياناتك فقط لتشغيل سوق.مر: عرض الإعلانات والإشعارات ومكافحة الاحتيال. نحن لا نقوم بأي تنميط تجاري." },
    { icon: Trash2, title: "حقوقك", body: "يمكنك طلب الوصول أو تصحيح أو حذف بياناتك في أي وقت. أرسل بريداً إلكترونياً إلى privacy@souq.mr. نرد في غضون 48 ساعة." },
    { icon: Mail, title: "ملفات تعريف الارتباط", body: "نستخدم فقط ملفات تعريف الارتباط الأساسية لعمل الموقع (الجلسة وتفضيلات اللغة). لا توجد ملفات تعريف ارتباط إعلانية أو تتبع من طرف ثالث." },
  ],
};

export default function ConfidentialitePage() {
  const { isRTL, locale } = useLanguage();
  const list = points[locale];

  return (
    <div className="min-h-screen bg-sand-gradient">
      <div className="relative py-14 overflow-hidden" style={{ background: "linear-gradient(135deg, #1B2A4A, #0C1426)" }}>
        <IslamicPattern opacity={0.05} />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h1 className={`text-4xl font-display font-bold text-white mb-3 ${isRTL ? "font-arabic" : ""}`}>
            {isRTL ? "سياسة الخصوصية" : "Politique de confidentialité"}
          </h1>
          <p className="text-sand-300/70 text-sm">
            {isRTL ? "نحن نحترم خصوصيتك" : "Votre vie privée est notre priorité"}
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-5">
        {list.map((item, i) => (
          <div key={i} className={`bg-white rounded-2xl p-6 shadow-card flex gap-5 ${isRTL ? "flex-row-reverse text-right" : ""}`}>
            <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-sand-100 flex items-center justify-center mt-0.5">
              <item.icon size={20} className="text-sand-500" />
            </div>
            <div>
              <h2 className={`text-base font-bold text-night-500 mb-2 ${isRTL ? "font-arabic" : ""}`}>{item.title}</h2>
              <p className={`text-sm text-night-500/80 leading-relaxed ${isRTL ? "font-arabic" : ""}`}>{item.body}</p>
            </div>
          </div>
        ))}

        <div className="bg-night-500 rounded-2xl p-6 text-center relative overflow-hidden">
          <IslamicPattern opacity={0.05} />
          <div className="relative">
            <p className={`text-sand-300/80 text-sm mb-3 ${isRTL ? "font-arabic" : ""}`}>
              {isRTL ? "للتواصل بشأن خصوصيتك" : "Pour toute question sur votre vie privée"}
            </p>
            <a href="mailto:privacy@souq.mr" className="btn-gold inline-flex text-sm py-2.5">
              privacy@souq.mr
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
