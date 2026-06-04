"use client";

import Link from "next/link";
import { Map, ExternalLink } from "lucide-react";
import IslamicPattern from "@/components/ui/IslamicPattern";
import { useLanguage } from "@/context/LanguageContext";

const siteMap = [
  {
    titleFr: "Marketplace", titleAr: "السوق",
    links: [
      { href: "/", fr: "Accueil", ar: "الرئيسية" },
      { href: "/annonces", fr: "Toutes les annonces", ar: "كل الإعلانات" },
      { href: "/categories", fr: "Catégories", ar: "الأقسام" },
      { href: "/promotions", fr: "Promotions", ar: "التخفيضات" },
      { href: "/coupons", fr: "Codes promo", ar: "أكواد الخصم" },
      { href: "/vendre", fr: "Déposer une annonce", ar: "نشر إعلان" },
      { href: "/pro", fr: "Espace Pro", ar: "مساحة المحترفين" },
      { href: "/vendeurs", fr: "Annuaire vendeurs", ar: "دليل البائعين" },
      { href: "/classement", fr: "Classement", ar: "الترتيب" },
      { href: "/carte", fr: "Carte des annonces", ar: "خريطة الإعلانات" },
    ],
  },
  {
    titleFr: "Fonctionnalités", titleAr: "الميزات",
    links: [
      { href: "/bazaar-live", fr: "Bazaar Live", ar: "بازار مباشر" },
      { href: "/souk-vocal", fr: "Souk Vocal", ar: "السوق الصوتي" },
      { href: "/escrow", fr: "Service Escrow", ar: "الضمان المالي" },
      { href: "/tontine", fr: "Tontine numérique", ar: "الادخار الجماعي" },
      { href: "/parrainage", fr: "Parrainage", ar: "برنامج الإحالة" },
      { href: "/alertes", fr: "Alertes prix", ar: "تنبيهات الأسعار" },
      { href: "/portefeuille", fr: "Portefeuille", ar: "المحفظة" },
      { href: "/offres", fr: "Mes offres", ar: "عروضي" },
      { href: "/ramadan", fr: "Mode Ramadan", ar: "وضع رمضان" },
      { href: "/comparer", fr: "Comparateur", ar: "المقارنة" },
    ],
  },
  {
    titleFr: "Mon Compte", titleAr: "حسابي",
    links: [
      { href: "/connexion", fr: "Se connecter", ar: "تسجيل الدخول" },
      { href: "/inscription", fr: "Créer un compte", ar: "إنشاء حساب" },
      { href: "/tableau-de-bord", fr: "Tableau de bord", ar: "لوحة التحكم" },
      { href: "/profil/s1", fr: "Mon profil", ar: "ملفي الشخصي" },
      { href: "/messages", fr: "Messages", ar: "الرسائل" },
      { href: "/favoris", fr: "Favoris", ar: "المفضلة" },
      { href: "/notifications", fr: "Notifications", ar: "الإشعارات" },
      { href: "/verification", fr: "Vérification", ar: "التحقق من الهوية" },
      { href: "/suivi", fr: "Suivi de commande", ar: "تتبع الطلب" },
    ],
  },
  {
    titleFr: "Aide & Sécurité", titleAr: "المساعدة والأمان",
    links: [
      { href: "/aide", fr: "Centre d'aide", ar: "مركز المساعدة" },
      { href: "/faq", fr: "FAQ", ar: "الأسئلة الشائعة" },
      { href: "/securite", fr: "Guide anti-arnaque", ar: "دليل الأمان" },
      { href: "/paiement", fr: "Modes de paiement", ar: "طرق الدفع" },
      { href: "/livraison", fr: "Livraison", ar: "التوصيل" },
      { href: "/contact", fr: "Contact", ar: "تواصل معنا" },
    ],
  },
  {
    titleFr: "Ressources", titleAr: "الموارد",
    links: [
      { href: "/actualites", fr: "Actualités & Blog", ar: "الأخبار والمدونة" },
      { href: "/statistiques", fr: "Statistiques marché", ar: "إحصائيات السوق" },
      { href: "/application", fr: "Application mobile", ar: "تطبيق الجوال" },
    ],
  },
  {
    titleFr: "Compagnie", titleAr: "الشركة",
    links: [
      { href: "/a-propos", fr: "À propos", ar: "من نحن" },
      { href: "/recrutement", fr: "Recrutement", ar: "الوظائف" },
      { href: "/partenaires", fr: "Partenaires", ar: "الشركاء" },
      { href: "/investisseurs", fr: "Investisseurs", ar: "المستثمرون" },
      { href: "/presse", fr: "Presse", ar: "الصحافة" },
      { href: "/conditions", fr: "CGU", ar: "شروط الاستخدام" },
      { href: "/confidentialite", fr: "Confidentialité", ar: "الخصوصية" },
      { href: "/accessibilite", fr: "Accessibilité", ar: "إمكانية الوصول" },
    ],
  },
];

export default function PlanDuSitePage() {
  const { isRTL, locale } = useLanguage();

  return (
    <div className="min-h-screen bg-sand-gradient">
      <div className="relative py-12 overflow-hidden" style={{ background: "linear-gradient(135deg, #1B2A4A, #0C1426)" }}>
        <IslamicPattern opacity={0.04} />
        <div className={`relative max-w-5xl mx-auto px-4 sm:px-6 text-center ${isRTL ? "font-arabic" : ""}`}>
          <Map size={28} className="text-sand-400 mx-auto mb-3" />
          <h1 className="text-2xl font-display font-bold text-white mb-1">
            {isRTL ? "خريطة الموقع" : "Plan du site"}
          </h1>
          <p className="text-sand-300/60 text-sm">
            {isRTL ? `${siteMap.reduce((s, c) => s + c.links.length, 0)} pages disponibles` : `${siteMap.reduce((s, c) => s + c.links.length, 0)} pages disponibles`}
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {siteMap.map((section, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-sm">
              <h2 className={`font-bold text-night-500 mb-4 text-sm uppercase tracking-wider ${isRTL ? "font-arabic text-right" : ""}`}>
                {isRTL ? section.titleAr : section.titleFr}
              </h2>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href}
                      className={`flex items-center gap-1.5 text-sm text-night-400/70 hover:text-sand-500 transition-colors group ${isRTL ? "flex-row-reverse justify-end font-arabic" : ""}`}>
                      <ExternalLink size={11} className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                      {locale === "ar" ? link.ar : link.fr}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
