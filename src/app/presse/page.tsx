"use client";

import {
  Newspaper,
  Download,
  Mail,
  Phone,
  ExternalLink,
  FileText,
  Image,
  BookOpen,
  Calendar,
  Tag,
  Users,
  BarChart2,
  MapPin,
  Star,
} from "lucide-react";
import Link from "next/link";
import IslamicPattern from "@/components/ui/IslamicPattern";
import { useLanguage } from "@/context/LanguageContext";

/* ------------------------------------------------------------------ */
/* Data                                                                  */
/* ------------------------------------------------------------------ */

const stats = {
  fr: [
    { icon: Users, value: "200K+", label: "Utilisateurs actifs" },
    { icon: FileText, value: "50K+", label: "Annonces publiées" },
    { icon: MapPin, value: "15+", label: "Wilayas couvertes" },
    { icon: Star, value: "98%", label: "Taux de satisfaction" },
  ],
  ar: [
    { icon: Users, value: "+200K", label: "مستخدم نشط" },
    { icon: FileText, value: "+50K", label: "إعلان منشور" },
    { icon: MapPin, value: "+15", label: "ولاية مغطاة" },
    { icon: Star, value: "98%", label: "نسبة الرضا" },
  ],
};

const pressReleases = [
  {
    date: { fr: "15 mai 2025", ar: "15 مايو 2025" },
    category: { fr: "Financement", ar: "تمويل" },
    categoryColor: "bg-emerald-100 text-emerald-700",
    title: {
      fr: "SOUQ.MR lève 2 millions USD pour accélérer son expansion en Mauritanie",
      ar: "SOUQ.MR تجمع 2 مليون دولار لتسريع توسعها في موريتانيا",
    },
    excerpt: {
      fr: "La plateforme mauritanienne annonce une levée de fonds stratégique pour renforcer ses infrastructures technologiques et étendre sa présence dans toutes les wilayas du pays.",
      ar: "تعلن المنصة الموريتانية عن جولة تمويلية استراتيجية لتعزيز بنيتها التحتية التكنولوجية وتوسيع نطاق خدماتها في جميع ولايات البلاد.",
    },
  },
  {
    date: { fr: "3 mars 2025", ar: "3 مارس 2025" },
    category: { fr: "Produit", ar: "منتج" },
    categoryColor: "bg-blue-100 text-blue-700",
    title: {
      fr: "Lancement de SOUQ.MR Pay : le paiement sécurisé intégré à la marketplace",
      ar: "إطلاق SOUQ.MR Pay: الدفع الآمن المدمج في المنصة",
    },
    excerpt: {
      fr: "SOUQ.MR dévoile sa solution de paiement intégrée permettant aux acheteurs et vendeurs de finaliser leurs transactions en toute sécurité directement sur la plateforme.",
      ar: "تكشف SOUQ.MR عن حل الدفع المتكامل الذي يتيح للمشترين والبائعين إتمام معاملاتهم بأمان تام مباشرة على المنصة.",
    },
  },
  {
    date: { fr: "18 janvier 2025", ar: "18 يناير 2025" },
    category: { fr: "Croissance", ar: "نمو" },
    categoryColor: "bg-amber-100 text-amber-700",
    title: {
      fr: "SOUQ.MR franchit le cap des 200 000 utilisateurs actifs en Mauritanie",
      ar: "SOUQ.MR تتجاوز 200,000 مستخدم نشط في موريتانيا",
    },
    excerpt: {
      fr: "Un an après son lancement, la marketplace mauritanienne atteint un jalon majeur avec 200 000 utilisateurs actifs et plus de 50 000 annonces publiées chaque mois.",
      ar: "بعد عام من إطلاقها، تصل المنصة الموريتانية إلى معلم بارز مع 200,000 مستخدم نشط وأكثر من 50,000 إعلان ينشر شهرياً.",
    },
  },
  {
    date: { fr: "5 novembre 2024", ar: "5 نوفمبر 2024" },
    category: { fr: "Partenariat", ar: "شراكة" },
    categoryColor: "bg-purple-100 text-purple-700",
    title: {
      fr: "SOUQ.MR signe un partenariat stratégique avec la Chambre de Commerce de Mauritanie",
      ar: "SOUQ.MR تبرم شراكة استراتيجية مع غرفة تجارة موريتانيا",
    },
    excerpt: {
      fr: "Ce partenariat vise à digitaliser le commerce mauritanien en accompagnant les PME locales dans leur transition vers le e-commerce via la plateforme SOUQ.MR.",
      ar: "تهدف هذه الشراكة إلى رقمنة التجارة الموريتانية من خلال مرافقة الشركات الصغيرة والمتوسطة المحلية في تحولها نحو التجارة الإلكترونية.",
    },
  },
];

const mediaKitItems = {
  fr: [
    { icon: Image, title: "Logo pack", subtitle: "SVG / PNG — fonds clairs & sombres", size: "2.4 MB" },
    { icon: BarChart2, title: "Kit médias", subtitle: "Photos, captures d'écran HD", size: "18 MB" },
    { icon: BookOpen, title: "Charte graphique", subtitle: "PDF — couleurs, typographies, règles", size: "4.1 MB" },
  ],
  ar: [
    { icon: Image, title: "حزمة الشعار", subtitle: "SVG / PNG — خلفيات فاتحة وداكنة", size: "2.4 MB" },
    { icon: BarChart2, title: "مجموعة الوسائط", subtitle: "صور، لقطات شاشة عالية الدقة", size: "18 MB" },
    { icon: BookOpen, title: "دليل العلامة التجارية", subtitle: "PDF — الألوان، الخطوط، القواعد", size: "4.1 MB" },
  ],
};

const pressMentions = [
  {
    outlet: "La Tribune de Mauritanie",
    date: { fr: "20 mai 2025", ar: "20 مايو 2025" },
    title: {
      fr: "SOUQ.MR révolutionne le commerce en ligne en Mauritanie",
      ar: "SOUQ.MR تُحدث ثورة في التجارة الإلكترونية بموريتانيا",
    },
    flag: "🇲🇷",
  },
  {
    outlet: "RIM Actualités",
    date: { fr: "4 mars 2025", ar: "4 مارس 2025" },
    title: {
      fr: "La fintech mauritanienne SOUQ.MR facilite les paiements locaux",
      ar: "شركة التكنولوجيا المالية الموريتانية SOUQ.MR تُيسّر المدفوعات المحلية",
    },
    flag: "🇲🇷",
  },
  {
    outlet: "Sahara Media",
    date: { fr: "22 janvier 2025", ar: "22 يناير 2025" },
    title: {
      fr: "200 000 Mauritaniens font confiance à SOUQ.MR pour leurs achats",
      ar: "200,000 موريتاني يثقون في SOUQ.MR لمشترياتهم",
    },
    flag: "🌍",
  },
  {
    outlet: "TechAfrica",
    date: { fr: "10 novembre 2024", ar: "10 نوفمبر 2024" },
    title: {
      fr: "Les startups d'Afrique de l'Ouest à suivre en 2025 : SOUQ.MR en tête",
      ar: "شركات ناشئة في غرب أفريقيا يجب متابعتها في 2025: SOUQ.MR في المقدمة",
    },
    flag: "🌍",
  },
];

/* ------------------------------------------------------------------ */
/* Page                                                                  */
/* ------------------------------------------------------------------ */

export default function PressePage() {
  const { isRTL, locale } = useLanguage();
  const t = locale;
  const dir = isRTL ? "rtl" : "ltr";
  const arabicClass = isRTL ? "font-arabic" : "";

  return (
    <div className="min-h-screen bg-sand-gradient" dir={dir}>
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <div
        className="relative py-20 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1B2A4A 0%, #0C1426 100%)" }}
      >
        <IslamicPattern opacity={0.06} />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur mb-6">
            <Newspaper size={32} className="text-[#C9A84C]" />
          </div>
          <h1
            className={`text-4xl md:text-5xl font-display font-bold text-white mb-4 ${arabicClass}`}
          >
            {t === "ar" ? "الصحافة والإعلام" : "Espace Presse"}
          </h1>
          <p className={`text-lg text-white/60 max-w-2xl mx-auto leading-relaxed ${arabicClass}`}>
            {t === "ar"
              ? "جميع الموارد الإعلامية، البلاغات الصحفية وبيانات التواصل للصحفيين والمدونين والشركاء الإعلاميين."
              : "Toutes les ressources médias, communiqués de presse et contacts pour les journalistes, blogueurs et partenaires médias."}
          </p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <a
              href="mailto:presse@souq.mr"
              className="btn-gold inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm"
            >
              <Mail size={16} />
              {t === "ar" ? "تواصل مع فريق الإعلام" : "Contacter l'équipe presse"}
            </a>
            <a
              href="#kit"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              <Download size={16} />
              {t === "ar" ? "تحميل مجموعة الوسائط" : "Télécharger le kit médias"}
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 space-y-16">
        {/* ── Key Stats ─────────────────────────────────────────────── */}
        <section>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats[t].map((stat, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 shadow-card text-center flex flex-col items-center gap-3"
              >
                <div className="w-12 h-12 rounded-xl bg-[#C9A84C]/10 flex items-center justify-center">
                  <stat.icon size={22} className="text-[#C9A84C]" />
                </div>
                <p className="text-3xl font-display font-bold text-night-500">{stat.value}</p>
                <p className={`text-sm text-night-400/70 ${arabicClass}`}>{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Press Releases ────────────────────────────────────────── */}
        <section>
          <h2
            className={`text-2xl font-display font-bold text-night-500 mb-8 ${arabicClass}`}
          >
            {t === "ar" ? "البلاغات الصحفية" : "Communiqués de presse"}
          </h2>
          <div className="space-y-5">
            {pressReleases.map((pr, i) => (
              <article
                key={i}
                className={`bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all group ${
                  isRTL ? "text-right" : ""
                }`}
              >
                <div
                  className={`flex items-center gap-3 mb-3 ${isRTL ? "flex-row-reverse" : ""}`}
                >
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full ${pr.categoryColor}`}
                  >
                    <Tag size={11} />
                    {pr.category[t]}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-night-400/50">
                    <Calendar size={11} />
                    {pr.date[t]}
                  </span>
                </div>
                <h3
                  className={`text-lg font-display font-semibold text-night-500 mb-2 group-hover:text-[#B8922E] transition-colors ${arabicClass}`}
                >
                  {pr.title[t]}
                </h3>
                <p className={`text-sm text-night-400/70 leading-relaxed mb-4 ${arabicClass}`}>
                  {pr.excerpt[t]}
                </p>
                <Link
                  href="#"
                  className={`inline-flex items-center gap-1.5 text-sm font-semibold text-[#C9A84C] hover:text-[#B8922E] transition-colors ${arabicClass} ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}
                >
                  {t === "ar" ? "قراءة البلاغ" : "Lire le communiqué"}
                  <ExternalLink size={13} />
                </Link>
              </article>
            ))}
          </div>
        </section>

        {/* ── Media Kit ─────────────────────────────────────────────── */}
        <section id="kit">
          <div className="bg-night-500 rounded-3xl p-8 md:p-10 relative overflow-hidden">
            <IslamicPattern opacity={0.05} />
            <div className="relative">
              <div className="mb-8">
                <h2
                  className={`text-2xl font-display font-bold text-white mb-2 ${arabicClass}`}
                >
                  {t === "ar" ? "مجموعة الوسائط الإعلامية" : "Kit médias SOUQ.MR"}
                </h2>
                <p className={`text-white/60 text-sm ${arabicClass}`}>
                  {t === "ar"
                    ? "تحميل الشعارات، الصور ودليل الهوية البصرية لاستخدامها في تغطياتكم الإعلامية."
                    : "Téléchargez nos logos, visuels et charte graphique pour vos articles et reportages."}
                </p>
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                {mediaKitItems[t].map((item, i) => (
                  <div
                    key={i}
                    className={`bg-white/10 backdrop-blur rounded-2xl p-5 flex flex-col gap-4 ${
                      isRTL ? "text-right items-end" : ""
                    }`}
                  >
                    <div className="w-11 h-11 rounded-xl bg-[#C9A84C]/20 flex items-center justify-center">
                      <item.icon size={20} className="text-[#C9A84C]" />
                    </div>
                    <div className="flex-1">
                      <p className={`font-semibold text-white text-sm ${arabicClass}`}>
                        {item.title}
                      </p>
                      <p className={`text-white/50 text-xs mt-1 ${arabicClass}`}>
                        {item.subtitle}
                      </p>
                      <p className="text-white/30 text-xs mt-1">{item.size}</p>
                    </div>
                    <button className="w-full inline-flex items-center justify-center gap-2 bg-[#C9A84C] hover:bg-[#B8922E] text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors">
                      <Download size={13} />
                      {t === "ar" ? "تحميل" : "Télécharger"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Press Mentions ────────────────────────────────────────── */}
        <section>
          <h2
            className={`text-2xl font-display font-bold text-night-500 mb-8 ${arabicClass}`}
          >
            {t === "ar" ? "SOUQ.MR في الإعلام" : "SOUQ.MR dans les médias"}
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {pressMentions.map((mention, i) => (
              <Link
                key={i}
                href="#"
                className={`bg-white rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all group block ${
                  isRTL ? "text-right" : ""
                }`}
              >
                <div
                  className={`flex items-center justify-between mb-3 ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}
                >
                  <span className="text-xl">{mention.flag}</span>
                  <span className="text-xs text-night-400/50">{mention.date[t]}</span>
                </div>
                <p className="text-xs font-bold text-[#C9A84C] uppercase tracking-wide mb-2">
                  {mention.outlet}
                </p>
                <p
                  className={`text-sm font-semibold text-night-500 group-hover:text-[#B8922E] transition-colors leading-snug ${arabicClass}`}
                >
                  {mention.title[t]}
                </p>
                <div
                  className={`mt-3 flex items-center gap-1 text-xs text-[#C9A84C] ${
                    isRTL ? "flex-row-reverse justify-end" : ""
                  }`}
                >
                  {t === "ar" ? "قراءة المقال" : "Lire l'article"}
                  <ExternalLink size={11} />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Press Contact ─────────────────────────────────────────── */}
        <section>
          <div
            className={`bg-white rounded-3xl shadow-card p-8 md:p-10 flex flex-col md:flex-row items-center gap-8 ${
              isRTL ? "md:flex-row-reverse text-right" : ""
            }`}
          >
            <div className="flex-shrink-0 w-20 h-20 rounded-2xl bg-[#C9A84C]/10 flex items-center justify-center">
              <Newspaper size={36} className="text-[#C9A84C]" />
            </div>
            <div className="flex-1">
              <h2
                className={`text-2xl font-display font-bold text-night-500 mb-2 ${arabicClass}`}
              >
                {t === "ar" ? "تواصل مع فريق الصحافة" : "Contact presse"}
              </h2>
              <p className={`text-sm text-night-400/70 mb-5 ${arabicClass}`}>
                {t === "ar"
                  ? "هل أنت صحفي أو مدوّن أو شريك إعلامي؟ فريقنا مستعد للإجابة على جميع استفساراتكم وتزويدكم بالمعلومات اللازمة."
                  : "Vous êtes journaliste, blogueur ou partenaire média ? Notre équipe est disponible pour répondre à toutes vos demandes d'information et interviews."}
              </p>
              <div
                className={`flex flex-wrap gap-3 ${isRTL ? "justify-end" : ""}`}
              >
                <a
                  href="mailto:presse@souq.mr"
                  className="inline-flex items-center gap-2 btn-gold px-5 py-3 rounded-xl text-sm font-semibold"
                >
                  <Mail size={15} />
                  presse@souq.mr
                </a>
                <a
                  href="tel:+22200000000"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold bg-night-500/5 text-night-500 hover:bg-night-500/10 transition-colors"
                >
                  <Phone size={15} />
                  +222 XX XX XX XX
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
