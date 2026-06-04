"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import IslamicPattern from "@/components/ui/IslamicPattern";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";

type FAQItem = { q: string; a: string };
type CategoryData = { fr: string; ar: string; items: { fr: FAQItem[]; ar: FAQItem[] } };

const categories: CategoryData[] = [
  {
    fr: "Général",
    ar: "عام",
    items: {
      fr: [
        { q: "Qu'est-ce que SOUQ.MR ?", a: "SOUQ.MR est la première marketplace mauritanienne bilingue (français/arabe), permettant aux particuliers et professionnels de Mauritanie d'acheter et vendre en ligne en toute sécurité." },
        { q: "Comment créer un compte ?", a: "Cliquez sur « S'inscrire », entrez votre numéro de téléphone mauritanien, confirmez par SMS et renseignez votre profil. L'inscription est gratuite et prend moins de 2 minutes." },
        { q: "SOUQ.MR est-il disponible en dehors de Mauritanie ?", a: "Le site est accessible depuis n'importe où dans le monde, mais les transactions et livraisons sont actuellement limitées à la Mauritanie." },
        { q: "Comment modifier mon profil ?", a: "Connectez-vous, accédez à « Mon compte » puis « Paramètres du profil ». Vous pouvez y modifier votre photo, nom, numéro de téléphone et préférences linguistiques." },
        { q: "Puis-je utiliser SOUQ.MR sur mobile ?", a: "Oui ! SOUQ.MR est entièrement responsive. Une application mobile Android et iOS est également disponible pour une expérience optimale." },
      ],
      ar: [
        { q: "ما هو سوق.مر؟", a: "سوق.مر هي أول سوق إلكتروني موريتاني ثنائي اللغة (فرنسي/عربي)، يتيح للأفراد والمحترفين في موريتانيا البيع والشراء عبر الإنترنت بأمان." },
        { q: "كيف أنشئ حساباً؟", a: "انقر على «التسجيل»، أدخل رقم هاتفك الموريتاني، أكّد عبر الرسالة القصيرة واملأ ملفك الشخصي. التسجيل مجاني ويستغرق أقل من دقيقتين." },
        { q: "هل سوق.مر متاح خارج موريتانيا؟", a: "الموقع متاح للوصول من أي مكان في العالم، لكن المعاملات والتوصيل محدودة حالياً بموريتانيا." },
        { q: "كيف أعدّل ملفي الشخصي؟", a: "سجّل الدخول، ثم انتقل إلى «حسابي» ثم «إعدادات الملف الشخصي». يمكنك تعديل صورتك واسمك ورقم هاتفك وتفضيلات اللغة." },
        { q: "هل يمكنني استخدام سوق.مر على الهاتف؟", a: "نعم! سوق.مر متجاوب بالكامل. يتوفر أيضاً تطبيق للهاتف على Android وiOS لتجربة مثلى." },
      ],
    },
  },
  {
    fr: "Vendre",
    ar: "البيع",
    items: {
      fr: [
        { q: "Comment publier une annonce ?", a: "Connectez-vous, cliquez sur « Vendre », choisissez une catégorie, ajoutez des photos (jusqu'à 10), rédigez votre titre et description, fixez votre prix et publiez. La modération prend moins de 2 heures." },
        { q: "Combien d'annonces puis-je publier gratuitement ?", a: "Les 5 premières annonces sont entièrement gratuites. Pour plus d'annonces, des forfaits Pro sont disponibles à partir de 4 990 MRU/mois." },
        { q: "Comment mettre mon annonce en avant ?", a: "Dans votre espace vendeur, sélectionnez votre annonce et cliquez sur « Booster ». Votre annonce apparaîtra en tête des résultats pendant 7 ou 30 jours selon le forfait choisi." },
        { q: "Puis-je modifier une annonce après publication ?", a: "Oui, vous pouvez modifier votre annonce à tout moment depuis votre espace vendeur, sauf si elle est en cours de modération ou impliquée dans une transaction active." },
        { q: "Comment gérer les négociations ?", a: "Activez « Prix négociable » sur votre annonce. Les acheteurs pourront vous soumettre des offres que vous pourrez accepter, refuser ou contrer directement depuis votre messagerie." },
      ],
      ar: [
        { q: "كيف أنشر إعلاناً؟", a: "سجّل الدخول، انقر على «أبيع»، اختر فئة، أضف صوراً (حتى 10)، اكتب عنواناً ووصفاً، حدد سعرك وانشر. تستغرق المراجعة أقل من ساعتين." },
        { q: "كم إعلاناً يمكنني نشره مجاناً؟", a: "أول 5 إعلانات مجانية تماماً. لمزيد من الإعلانات، تتوفر خطط احترافية من 4,990 أوقية/شهر." },
        { q: "كيف أبرز إعلاني؟", a: "في مساحة البائع، اختر إعلانك وانقر على «تعزيز». سيظهر إعلانك في صدارة النتائج لمدة 7 أو 30 يوماً حسب الخطة المختارة." },
        { q: "هل يمكنني تعديل إعلان بعد نشره؟", a: "نعم، يمكنك تعديل إعلانك في أي وقت من مساحة البائع، إلا إذا كان قيد المراجعة أو مرتبطاً بمعاملة نشطة." },
        { q: "كيف أدير المفاوضات؟", a: "فعّل «السعر قابل للتفاوض» في إعلانك. يمكن للمشترين تقديم عروض يمكنك قبولها أو رفضها أو الردّ عليها مباشرة من رسائلك." },
      ],
    },
  },
  {
    fr: "Acheter",
    ar: "الشراء",
    items: {
      fr: [
        { q: "Comment trouver un article ?", a: "Utilisez la barre de recherche en haut de la page ou parcourez les catégories. Vous pouvez filtrer par prix, localisation, état (neuf/occasion) et mode de livraison." },
        { q: "Comment contacter un vendeur ?", a: "Sur chaque annonce, cliquez sur « Contacter le vendeur » pour ouvrir une conversation sécurisée. Evitez de partager des informations personnelles en dehors de la plateforme." },
        { q: "Comment signaler une annonce suspecte ?", a: "Sur l'annonce concernée, cliquez sur les trois points « ... » puis « Signaler ». Notre équipe examine les signalements sous 1 heure." },
        { q: "Puis-je réserver un article ?", a: "Oui, pour certaines annonces marquées « Réservable », vous pouvez bloquer l'article pendant 24h en versant un acompte de 10% via Bankily ou Masrvi." },
        { q: "Comment évaluer un vendeur ?", a: "Après chaque transaction complétée, vous recevrez une invitation à laisser une évaluation (1-5 étoiles + commentaire). Les évaluations aident la communauté à identifier les vendeurs fiables." },
      ],
      ar: [
        { q: "كيف أجد منتجاً؟", a: "استخدم شريط البحث في أعلى الصفحة أو تصفح الفئات. يمكنك التصفية حسب السعر والموقع والحالة (جديد/مستعمل) وطريقة التوصيل." },
        { q: "كيف أتواصل مع البائع؟", a: "في كل إعلان، انقر على «تواصل مع البائع» لفتح محادثة آمنة. تجنّب مشاركة معلوماتك الشخصية خارج المنصة." },
        { q: "كيف أبلغ عن إعلان مشبوه؟", a: "في الإعلان المعني، انقر على النقاط الثلاث «...» ثم «إبلاغ». يراجع فريقنا البلاغات خلال ساعة واحدة." },
        { q: "هل يمكنني حجز منتج؟", a: "نعم، لبعض الإعلانات المُعلّمة بـ«قابل للحجز»، يمكنك تثبيت المنتج لمدة 24 ساعة بدفع دفعة أولى 10% عبر بانكيلي أو مصرفي." },
        { q: "كيف أقيّم البائع؟", a: "بعد كل معاملة مكتملة، ستتلقى دعوة لترك تقييم (1-5 نجوم + تعليق). تساعد التقييمات المجتمع على تحديد البائعين الموثوقين." },
      ],
    },
  },
  {
    fr: "Paiement",
    ar: "الدفع",
    items: {
      fr: [
        { q: "Quels modes de paiement sont acceptés ?", a: "SOUQ.MR accepte : le paiement à la livraison (COD), Bankily, Masrvi, et le virement bancaire pour les montants importants. Le système Escrow est disponible pour les transactions > 50 000 MRU." },
        { q: "Comment fonctionne le système Escrow ?", a: "Pour les grosses transactions, le montant est bloqué sur un compte séquestre après votre paiement. Les fonds ne sont libérés au vendeur qu'après votre confirmation de réception de l'article." },
        { q: "Les paiements sont-ils sécurisés ?", a: "Oui. Toutes les transactions sont cryptées (SSL/TLS). Nous ne stockons jamais vos informations de carte bancaire. Bankily et Masrvi utilisent une authentification à deux facteurs." },
        { q: "Comment obtenir un remboursement ?", a: "En cas de litige, contactez notre service client sous 48h après la livraison. Si le problème est avéré, le remboursement est effectué sur votre moyen de paiement d'origine sous 3-5 jours ouvrables." },
        { q: "Y a-t-il des frais de transaction ?", a: "Le paiement à la livraison est sans frais. Pour Bankily et Masrvi, des frais de 1,5% s'appliquent (minimum 50 MRU). Le système Escrow coûte 2% du montant total de la transaction." },
      ],
      ar: [
        { q: "ما طرق الدفع المقبولة؟", a: "يقبل سوق.مر: الدفع عند الاستلام (COD)، بانكيلي، مصرفي، والتحويل البنكي للمبالغ الكبيرة. نظام الضمان المالي متاح للمعاملات التي تتجاوز 50,000 أوقية." },
        { q: "كيف يعمل نظام الضمان المالي؟", a: "للمعاملات الكبيرة، يُجمَّد المبلغ في حساب ضمان بعد دفعك. لا تُحرَّر الأموال للبائع إلا بعد تأكيدك استلام المنتج." },
        { q: "هل المدفوعات آمنة؟", a: "نعم. جميع المعاملات مشفرة (SSL/TLS). لا نخزن أبداً معلومات بطاقتك البنكية. يستخدم بانكيلي ومصرفي مصادقة ثنائية العوامل." },
        { q: "كيف أحصل على استرداد؟", a: "في حالة نزاع، تواصل مع خدمة العملاء خلال 48 ساعة من التسليم. إذا ثبتت المشكلة، يُعاد المبلغ بطريقة دفعك الأصلية خلال 3-5 أيام عمل." },
        { q: "هل هناك رسوم معاملات؟", a: "الدفع عند الاستلام بدون رسوم. لبانكيلي ومصرفي، تُطبَّق رسوم 1.5% (بحد أدنى 50 أوقية). يكلف نظام الضمان المالي 2% من إجمالي قيمة المعاملة." },
      ],
    },
  },
  {
    fr: "Sécurité",
    ar: "الأمان",
    items: {
      fr: [
        { q: "Comment SOUQ.MR protège-t-il mes données ?", a: "Vos données sont stockées sur des serveurs sécurisés en Mauritanie, conformément à la réglementation locale. Nous ne vendons jamais vos données à des tiers. Vous pouvez demander la suppression de votre compte à tout moment." },
        { q: "Comment reconnaître une arnaque ?", a: "Méfiez-vous des offres trop belles pour être vraies, des vendeurs demandant un paiement en dehors de la plateforme, des prix anormalement bas sur des articles de luxe, et des profils créés récemment sans évaluations." },
        { q: "Que faire si mon compte est piraté ?", a: "Changez immédiatement votre mot de passe, contactez notre support via le formulaire d'urgence, et signalez l'incident. Nous bloquerons toute activité suspecte dans l'heure suivant votre signalement." },
        { q: "Comment activer la double authentification ?", a: "Dans « Mon compte » > « Sécurité », activez la vérification en deux étapes. À chaque connexion depuis un nouvel appareil, un code SMS sera envoyé à votre numéro enregistré." },
        { q: "Mes informations personnelles sont-elles partagées avec les vendeurs ?", a: "Non. Votre numéro de téléphone et email restent masqués. Les vendeurs ne voient que votre pseudo. Votre adresse de livraison est partagée uniquement lors d'une transaction confirmée." },
      ],
      ar: [
        { q: "كيف يحمي سوق.مر بياناتي؟", a: "بياناتك مخزّنة على خوادم آمنة في موريتانيا، وفقاً للأنظمة المحلية. لا نبيع بياناتك لأطراف ثالثة أبداً. يمكنك طلب حذف حسابك في أي وقت." },
        { q: "كيف أتعرف على الاحتيال؟", a: "احذر من العروض الجيدة جداً لدرجة مريبة، والبائعين الذين يطلبون الدفع خارج المنصة، والأسعار المنخفضة بشكل غير طبيعي للسلع الفاخرة، والملفات الشخصية المنشأة حديثاً دون تقييمات." },
        { q: "ماذا أفعل إذا تعرّض حسابي للاختراق؟", a: "غيّر كلمة المرور فوراً، تواصل مع دعمنا عبر نموذج الطوارئ وأبلغ عن الحادثة. سنوقف أي نشاط مشبوه في غضون ساعة من إبلاغك." },
        { q: "كيف أفعّل المصادقة الثنائية؟", a: "في «حسابي» > «الأمان»، فعّل التحقق بخطوتين. عند كل تسجيل دخول من جهاز جديد، سيُرسَل رمز SMS إلى رقمك المسجّل." },
        { q: "هل تُشارَك معلوماتي الشخصية مع البائعين؟", a: "لا. رقم هاتفك وبريدك الإلكتروني يبقيان مخفيَّين. لا يرى البائعون إلا اسمك المستعار. عنوان التسليم لا يُشارَك إلا عند تأكيد معاملة." },
      ],
    },
  },
];

export default function FAQPage() {
  const { isRTL, locale } = useLanguage();
  const [activeCategory, setActiveCategory] = useState(0);
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const cat = categories[activeCategory];
  const items = cat.items[locale];

  return (
    <div className="min-h-screen bg-sand-gradient">
      {/* Hero */}
      <div className="relative py-16 overflow-hidden" style={{ background: "linear-gradient(135deg, #1B2A4A, #0C1426)" }}>
        <IslamicPattern opacity={0.05} />
        <div className={`relative max-w-4xl mx-auto px-4 sm:px-6 text-center ${isRTL ? "font-arabic" : ""}`}>
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: "rgba(201,168,76,0.15)", border: "2px solid #C9A84C" }}>
              <HelpCircle size={32} color="#C9A84C" />
            </div>
          </div>
          <h1 className="text-4xl font-display font-bold text-white mb-3">
            {isRTL ? "الأسئلة الشائعة" : "FAQ"}
          </h1>
          <p className="text-lg" style={{ color: "#C9A84C" }}>
            {isRTL ? "إجابات على أكثر الأسئلة شيوعاً" : "Réponses aux questions les plus fréquentes"}
          </p>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="sticky top-0 z-10 border-b" style={{ background: "#1B2A4A", borderColor: "rgba(201,168,76,0.2)" }}>
        <div className={`max-w-4xl mx-auto px-4 sm:px-6 flex overflow-x-auto gap-1 py-2 ${isRTL ? "flex-row-reverse font-arabic" : ""}`}>
          {categories.map((c, i) => (
            <button
              key={i}
              onClick={() => { setActiveCategory(i); setOpenIdx(null); }}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === i ? "text-white" : "text-gray-400 hover:text-white"}`}
              style={activeCategory === i ? { background: "#C9A84C", color: "#1B2A4A" } : {}}
            >
              {isRTL ? c.ar : c.fr}
            </button>
          ))}
        </div>
      </div>

      {/* Accordion */}
      <div className={`max-w-4xl mx-auto px-4 sm:px-6 py-10 ${isRTL ? "font-arabic" : ""}`} dir={isRTL ? "rtl" : "ltr"}>
        <div className="space-y-3">
          {items.map((item, idx) => (
            <div key={idx} className="shadow-card rounded-xl overflow-hidden" style={{ background: "white" }}>
              <button
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                className="w-full flex items-center justify-between px-6 py-4 text-left gap-4"
                style={{ color: "#1B2A4A" }}
              >
                <span className="font-semibold text-base">{item.q}</span>
                {openIdx === idx ? <ChevronUp size={20} style={{ color: "#C9A84C", flexShrink: 0 }} /> : <ChevronDown size={20} style={{ color: "#C9A84C", flexShrink: 0 }} />}
              </button>
              {openIdx === idx && (
                <div className="px-6 pb-5 text-gray-600 text-sm leading-relaxed border-t" style={{ borderColor: "rgba(201,168,76,0.15)" }}>
                  <p className="pt-4">{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Link to aide */}
        <div className="mt-10 text-center">
          <p className="text-gray-500 mb-3 text-sm">
            {isRTL ? "لم تجد إجابتك؟ زر مركز المساعدة الكامل" : "Vous ne trouvez pas votre réponse ? Consultez le centre d'aide complet"}
          </p>
          <Link href="/aide" className="btn-gold inline-block px-6 py-2 rounded-full text-sm font-semibold" style={{ background: "#C9A84C", color: "#1B2A4A" }}>
            {isRTL ? "مركز المساعدة" : "Centre d\'aide"}
          </Link>
        </div>
      </div>
    </div>
  );
}
