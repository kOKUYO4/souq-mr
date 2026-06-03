"use client";

import { useLanguage } from "@/context/LanguageContext";
import IslamicPattern from "@/components/ui/IslamicPattern";

const sections = {
  fr: [
    { title: "1. Acceptation des conditions", body: "En utilisant SOUQ.MR, vous acceptez les présentes conditions d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre plateforme." },
    { title: "2. Description du service", body: "SOUQ.MR est une marketplace mauritanienne permettant à des particuliers et professionnels de publier des annonces de vente, d'achat et d'échange de biens et services." },
    { title: "3. Inscription et compte", body: "L'inscription nécessite un numéro de téléphone mauritanien valide (+222). Vous êtes responsable de la confidentialité de votre compte. Tout usage frauduleux doit être signalé immédiatement." },
    { title: "4. Publications d'annonces", body: "Les 5 premières annonces sont gratuites. Les annonces doivent être conformes aux lois mauritaniennes. Sont interdits : armes, drogues, contrefaçons, contenu illicite. SOUQ.MR se réserve le droit de supprimer toute annonce sans préavis." },
    { title: "5. Transactions et paiements", body: "SOUQ.MR facilite la mise en relation mais n'est pas partie prenante des transactions. Le système Escrow est disponible pour les transactions supérieures à 50 000 MRU. Les paiements via Bankily et Masrvi sont sécurisés par les opérateurs respectifs." },
    { title: "6. Responsabilités", body: "SOUQ.MR n'est pas responsable des dommages résultant de transactions entre utilisateurs. Nous recommandons de vérifier l'identité des vendeurs et de privilégier les rencontres dans des lieux publics." },
    { title: "7. Propriété intellectuelle", body: "Le contenu de SOUQ.MR (logo, design, code) est protégé par le droit mauritanien. Les utilisateurs conservent la propriété de leur contenu mais accordent à SOUQ.MR une licence d'utilisation non exclusive." },
    { title: "8. Modification des conditions", body: "SOUQ.MR se réserve le droit de modifier ces conditions à tout moment. Les utilisateurs seront notifiés par SMS ou email. La poursuite de l'utilisation après modification vaut acceptation." },
  ],
  ar: [
    { title: "١. قبول الشروط", body: "باستخدامك لسوق.مر، فإنك توافق على شروط الاستخدام هذه. إذا لم توافق على هذه الشروط، يرجى عدم استخدام منصتنا." },
    { title: "٢. وصف الخدمة", body: "سوق.مر هي منصة موريتانية تتيح للأفراد والمحترفين نشر إعلانات البيع والشراء وتبادل السلع والخدمات." },
    { title: "٣. التسجيل والحساب", body: "يتطلب التسجيل رقم هاتف موريتاني صالح (+222). أنت مسؤول عن سرية حسابك. يجب الإبلاغ فوراً عن أي استخدام احتيالي." },
    { title: "٤. نشر الإعلانات", body: "أول 5 إعلانات مجانية. يجب أن تكون الإعلانات متوافقة مع القوانين الموريتانية. محظور: الأسلحة والمخدرات والتقليد والمحتوى غير المشروع." },
    { title: "٥. المعاملات والمدفوعات", body: "سوق.مر يسهل التواصل لكنه ليس طرفاً في المعاملات. نظام الضمان المالي متاح للمعاملات التي تتجاوز 50,000 أوقية." },
    { title: "٦. المسؤوليات", body: "سوق.مر غير مسؤول عن الأضرار الناجمة عن المعاملات بين المستخدمين. نوصي بالتحقق من هوية البائعين واللقاء في أماكن عامة." },
    { title: "٧. الملكية الفكرية", body: "محتوى سوق.مر محمي بموجب القانون الموريتاني. يحتفظ المستخدمون بملكية محتواهم لكنهم يمنحون سوق.مر ترخيصاً غير حصري للاستخدام." },
    { title: "٨. تعديل الشروط", body: "يحق لسوق.مر تعديل هذه الشروط في أي وقت. سيتم إخطار المستخدمين عبر رسالة نصية أو بريد إلكتروني." },
  ],
};

export default function ConditionsPage() {
  const { isRTL, locale } = useLanguage();
  const list = sections[locale];

  return (
    <div className="min-h-screen bg-sand-gradient">
      <div className="relative py-14 overflow-hidden" style={{ background: "linear-gradient(135deg, #1B2A4A, #0C1426)" }}>
        <IslamicPattern opacity={0.05} />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h1 className={`text-4xl font-display font-bold text-white mb-3 ${isRTL ? "font-arabic" : ""}`}>
            {isRTL ? "شروط الاستخدام" : "Conditions d'utilisation"}
          </h1>
          <p className="text-sand-300/70 text-sm">
            {isRTL ? "آخر تحديث: يناير 2025" : "Dernière mise à jour : Janvier 2025"}
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-8">
        {list.map((s, i) => (
          <div key={i} className={`bg-white rounded-2xl p-6 shadow-card ${isRTL ? "text-right" : ""}`}>
            <h2 className={`text-base font-bold text-night-500 mb-3 ${isRTL ? "font-arabic" : ""}`}>{s.title}</h2>
            <p className={`text-sm text-night-500/80 leading-relaxed ${isRTL ? "font-arabic" : ""}`}>{s.body}</p>
          </div>
        ))}

        <div className={`bg-sand-100 rounded-2xl p-6 text-sm text-night-400/80 ${isRTL ? "text-right font-arabic" : ""}`}>
          {isRTL
            ? "للاستفسار عن هذه الشروط: legal@souq.mr | +222 XX XX XX XX"
            : "Pour toute question sur ces conditions : legal@souq.mr | +222 XX XX XX XX"}
        </div>
      </div>
    </div>
  );
}
