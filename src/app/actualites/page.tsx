"use client";

import { useState } from "react";
import Link from "next/link";
import { Calendar, Clock, Tag, ArrowRight, ArrowLeft, TrendingUp, Eye } from "lucide-react";
import IslamicPattern from "@/components/ui/IslamicPattern";
import { useLanguage } from "@/context/LanguageContext";

interface Article {
  id: string;
  titleFr: string;
  titleAr: string;
  excerptFr: string;
  excerptAr: string;
  category: "market" | "tips" | "feature" | "mauritania";
  date: string;
  readTime: number;
  views: number;
  featured: boolean;
  image: string;
}

const articles: Article[] = [
  {
    id: "a1",
    titleFr: "Le marché automobile mauritanien en forte croissance en 2025",
    titleAr: "سوق السيارات الموريتاني في نمو قوي في 2025",
    excerptFr: "Les ventes de véhicules d'occasion ont bondi de 34% sur SOUQ.MR ce trimestre, portées par la demande en Toyota Hilux et Nissan Patrol.",
    excerptAr: "قفزت مبيعات السيارات المستعملة بنسبة 34% على سوق.مر هذا الربع، مدفوعةً بالطلب على تويوتا هايلوكس ونيسان باترول.",
    category: "market", date: "2025-01-15", readTime: 4, views: 2341, featured: true,
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&q=80",
  },
  {
    id: "a2",
    titleFr: "5 conseils pour vendre plus vite sur SOUQ.MR",
    titleAr: "5 نصائح للبيع الأسرع على سوق.مر",
    excerptFr: "Photos HD, prix juste, description bilingue et réponse rapide : les 5 facteurs qui font vendre une annonce en moins de 24h.",
    excerptAr: "صور عالية الدقة، وسعر مناسب، ووصف ثنائي اللغة، واستجابة سريعة: العوامل الخمسة التي تبيع الإعلان في أقل من 24 ساعة.",
    category: "tips", date: "2025-01-12", readTime: 3, views: 1876, featured: true,
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80",
  },
  {
    id: "a3",
    titleFr: "Lancement du Bazaar Live : vendez en direct depuis chez vous",
    titleAr: "إطلاق بازار لايف: بع مباشرة من منزلك",
    excerptFr: "La nouvelle fonctionnalité Bazaar Live permet aux vendeurs de diffuser en direct leurs produits et de recevoir des offres en temps réel.",
    excerptAr: "تتيح ميزة بازار لايف الجديدة للبائعين بث منتجاتهم مباشرة وتلقي العروض في الوقت الفعلي.",
    category: "feature", date: "2025-01-10", readTime: 2, views: 3102, featured: false,
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&q=80",
  },
  {
    id: "a4",
    titleFr: "Nouakchott : les quartiers les plus actifs sur le marché immobilier",
    titleAr: "نواكشوط: أكثر الأحياء نشاطاً في سوق العقارات",
    excerptFr: "Tevragh-Zeina et Ryad concentrent 67% des annonces immobilières. Analyse des prix au m² par quartier.",
    excerptAr: "تيفرغ زينة والرياض يستحوذان على 67% من إعلانات العقارات. تحليل الأسعار بالمتر المربع حسب الحي.",
    category: "mauritania", date: "2025-01-08", readTime: 5, views: 987, featured: false,
    image: "https://images.unsplash.com/photo-1582407947304-fd86f28f1909?w=600&q=80",
  },
  {
    id: "a5",
    titleFr: "Comment éviter les arnaques lors d'une vente de smartphone",
    titleAr: "كيف تتجنب الاحتيال عند بيع هاتف ذكي",
    excerptFr: "Guide pratique pour vérifier l'IMEI, tester la batterie et sécuriser votre transaction lors de l'achat d'un téléphone d'occasion.",
    excerptAr: "دليل عملي للتحقق من رقم IMEI واختبار البطارية وتأمين معاملتك عند شراء هاتف مستعمل.",
    category: "tips", date: "2025-01-05", readTime: 4, views: 1543, featured: false,
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&q=80",
  },
  {
    id: "a6",
    titleFr: "SOUQ.MR dépasse 50 000 annonces actives",
    titleAr: "سوق.مر يتجاوز 50,000 إعلان نشط",
    excerptFr: "Milestone historique pour SOUQ.MR : 50 000 annonces actives, 200 000 utilisateurs enregistrés et présence dans toutes les wilayas.",
    excerptAr: "معلم تاريخي لسوق.مر: 50,000 إعلان نشط، و200,000 مستخدم مسجل، وتواجد في جميع الولايات.",
    category: "feature", date: "2025-01-02", readTime: 2, views: 4217, featured: false,
    image: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=600&q=80",
  },
];

const catColors: Record<Article["category"], { bg: string; text: string; label: { fr: string; ar: string } }> = {
  market: { bg: "#E8F4EE", text: "#2D6A4F", label: { fr: "Marché", ar: "السوق" } },
  tips: { bg: "#FDF6E3", text: "#9A7822", label: { fr: "Conseils", ar: "نصائح" } },
  feature: { bg: "#EEF1F7", text: "#1B2A4A", label: { fr: "Nouveauté", ar: "جديد" } },
  mauritania: { bg: "#F4EAF0", text: "#6B2060", label: { fr: "Mauritanie", ar: "موريتانيا" } },
};

type CategoryFilter = "all" | Article["category"];

export default function ActualitesPage() {
  const { isRTL, locale } = useLanguage();
  const [filter, setFilter] = useState<CategoryFilter>("all");
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  const featured = articles.filter((a) => a.featured);
  const filtered = filter === "all" ? articles : articles.filter((a) => a.category === filter);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return isRTL
      ? d.toLocaleDateString("ar-MA", { day: "numeric", month: "long", year: "numeric" })
      : d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  };

  return (
    <div className="min-h-screen bg-sand-gradient">
      {/* Header */}
      <div className="relative py-14 overflow-hidden" style={{ background: "linear-gradient(135deg, #1B2A4A, #2D3E6A)" }}>
        <IslamicPattern opacity={0.05} />
        <div className={`relative max-w-5xl mx-auto px-4 sm:px-6 ${isRTL ? "text-right font-arabic" : ""}`}>
          <h1 className="text-3xl font-display font-bold text-white mb-2">
            {isRTL ? "أخبار السوق والمدونة" : "Actualités & Blog"}
          </h1>
          <p className="text-sand-300/70 text-sm">
            {isRTL ? "آخر أخبار سوق.مر وتحليلات السوق الموريتاني" : "Les dernières nouvelles de SOUQ.MR et analyses du marché mauritanien"}
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        {/* Featured articles */}
        {featured.length > 0 && (
          <div className="grid sm:grid-cols-2 gap-6 mb-10">
            {featured.map((article) => {
              const cat = catColors[article.category];
              return (
                <div key={article.id} className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all group">
                  <div className="relative h-48 overflow-hidden">
                    <img src={article.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-night-500/60 to-transparent" />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-xl text-xs font-bold"
                      style={{ background: cat.bg, color: cat.text }}>
                      {cat.label[locale]}
                    </span>
                  </div>
                  <div className="p-5">
                    <h2 className={`font-bold text-night-500 text-base mb-2 line-clamp-2 ${isRTL ? "font-arabic text-right" : ""}`}>
                      {isRTL ? article.titleAr : article.titleFr}
                    </h2>
                    <p className={`text-xs text-night-400/70 mb-4 line-clamp-2 ${isRTL ? "font-arabic text-right" : ""}`}>
                      {isRTL ? article.excerptAr : article.excerptFr}
                    </p>
                    <div className={`flex items-center justify-between text-xs text-night-400/50 ${isRTL ? "flex-row-reverse" : ""}`}>
                      <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                        <span className={`flex items-center gap-1 ${isRTL ? "flex-row-reverse" : ""}`}>
                          <Calendar size={11} />{formatDate(article.date)}
                        </span>
                        <span className={`flex items-center gap-1 ${isRTL ? "flex-row-reverse" : ""}`}>
                          <Clock size={11} />{article.readTime} min
                        </span>
                      </div>
                      <span className={`flex items-center gap-1 ${isRTL ? "flex-row-reverse" : ""}`}>
                        <Eye size={11} />{article.views.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Filter tabs */}
        <div className={`flex flex-wrap gap-2 mb-6 ${isRTL ? "flex-row-reverse" : ""}`}>
          <button onClick={() => setFilter("all")}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              filter === "all" ? "bg-night-500 text-sand-300 border-night-500" : "border-sand-200 text-night-400/70 hover:border-sand-300"
            } ${isRTL ? "font-arabic" : ""}`}>
            {isRTL ? "الكل" : "Tout"}
          </button>
          {(Object.entries(catColors) as [Article["category"], typeof catColors[keyof typeof catColors]][]).map(([id, c]) => (
            <button key={id} onClick={() => setFilter(id)}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                filter === id ? "border-transparent" : "border-sand-200 text-night-400/70 hover:border-sand-300"
              } ${isRTL ? "font-arabic" : ""}`}
              style={filter === id ? { background: c.bg, color: c.text, borderColor: "transparent" } : {}}>
              {c.label[locale]}
            </button>
          ))}
        </div>

        {/* Article list */}
        <div className="space-y-4">
          {filtered.map((article) => {
            const cat = catColors[article.category];
            return (
              <div key={article.id} className={`bg-white rounded-2xl p-5 shadow-sm hover:shadow-card transition-all flex gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                <img src={article.image} alt="" className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
                <div className={`flex-1 ${isRTL ? "text-right" : ""}`}>
                  <div className={`flex items-center gap-2 mb-2 ${isRTL ? "flex-row-reverse justify-end" : ""}`}>
                    <span className="px-2 py-0.5 rounded-lg text-xs font-semibold"
                      style={{ background: cat.bg, color: cat.text }}>
                      {cat.label[locale]}
                    </span>
                    <span className="text-xs text-night-400/50">{formatDate(article.date)}</span>
                  </div>
                  <h3 className={`font-bold text-night-500 text-sm mb-1 line-clamp-1 ${isRTL ? "font-arabic" : ""}`}>
                    {isRTL ? article.titleAr : article.titleFr}
                  </h3>
                  <p className={`text-xs text-night-400/60 line-clamp-1 mb-2 ${isRTL ? "font-arabic" : ""}`}>
                    {isRTL ? article.excerptAr : article.excerptFr}
                  </p>
                  <div className={`flex items-center gap-3 text-xs text-night-400/50 ${isRTL ? "flex-row-reverse justify-end" : ""}`}>
                    <span className={`flex items-center gap-1 ${isRTL ? "flex-row-reverse" : ""}`}>
                      <Clock size={10} />{article.readTime} min
                    </span>
                    <span className={`flex items-center gap-1 ${isRTL ? "flex-row-reverse" : ""}`}>
                      <Eye size={10} />{article.views.toLocaleString()}
                    </span>
                    <span className={`flex items-center gap-1 font-semibold text-sand-500 hover:text-sand-600 cursor-pointer ${isRTL ? "flex-row-reverse" : ""}`}>
                      {isRTL ? "اقرأ المزيد" : "Lire la suite"}
                      <Arrow size={11} />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Newsletter inline */}
        <div className="mt-10 bg-night-500 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-5">
          <div className={`flex-1 ${isRTL ? "text-right" : ""}`}>
            <p className={`font-bold text-white mb-1 ${isRTL ? "font-arabic" : ""}`}>
              {isRTL ? "اشترك في نشرتنا الأسبوعية" : "Abonnez-vous à notre newsletter hebdo"}
            </p>
            <p className={`text-sm text-sand-300/70 ${isRTL ? "font-arabic" : ""}`}>
              {isRTL ? "أفضل الأخبار والتحليلات كل أسبوع مباشرة في بريدك" : "Les meilleures actus et analyses chaque semaine dans votre boîte"}
            </p>
          </div>
          <div className={`flex gap-2 flex-shrink-0 ${isRTL ? "flex-row-reverse" : ""}`}>
            <input
              type="email"
              placeholder={isRTL ? "بريدك الإلكتروني" : "Votre email"}
              dir={isRTL ? "rtl" : "ltr"}
              className="px-4 py-2 rounded-xl text-sm bg-night-400/40 border border-sand-400/20 text-white placeholder-sand-400/50 outline-none focus:border-sand-400/50 w-48"
            />
            <button className="btn-gold text-sm py-2">
              {isRTL ? "اشترك" : "S'abonner"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
