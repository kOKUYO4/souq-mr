"use client";

import { useState } from "react";
import { Trophy, Star, TrendingUp, Crown, Medal, Award } from "lucide-react";
import Link from "next/link";
import { sellers, listings, formatPrice } from "@/data/mockData";
import IslamicPattern from "@/components/ui/IslamicPattern";
import { useLanguage } from "@/context/LanguageContext";

type Period = "week" | "month" | "alltime";
type Category = "sellers" | "buyers" | "products";

const periodLabels: Record<Period, { fr: string; ar: string }> = {
  week: { fr: "Cette semaine", ar: "هذا الأسبوع" },
  month: { fr: "Ce mois", ar: "هذا الشهر" },
  alltime: { fr: "Tout temps", ar: "كل الأوقات" },
};

const topSellers = [
  { ...sellers[0], sales: 142, revenue: 3420000, badge: "🥇" },
  { ...sellers[1], sales: 98, revenue: 1850000, badge: "🥈" },
  { ...sellers[2], sales: 76, revenue: 1240000, badge: "🥉" },
  { ...sellers[3], sales: 54, revenue: 890000, badge: "4" },
  { ...sellers[4], sales: 41, revenue: 650000, badge: "5" },
  { ...sellers[0], id: "s6", name: "Abdallahi Ould Ahmed", nameAr: "عبد الله ولد أحمد", sales: 33, revenue: 520000, badge: "6" },
  { ...sellers[1], id: "s7", name: "Khadija Mint Brahim", nameAr: "خديجة منت إبراهيم", sales: 28, revenue: 410000, badge: "7" },
  { ...sellers[2], id: "s8", name: "Mokhtar Ould Sidi", nameAr: "مختار ولد سيدي", sales: 22, revenue: 370000, badge: "8" },
  { ...sellers[3], id: "s9", name: "Fatimetou Mint El Hassen", nameAr: "فاطيمتو منت الحسن", sales: 18, revenue: 290000, badge: "9" },
  { ...sellers[4], id: "s10", name: "Niang Ibrahima", nameAr: "نيانغ إبراهيما", sales: 14, revenue: 220000, badge: "10" },
];

const topProducts = listings
  .sort((a, b) => b.views - a.views)
  .slice(0, 10)
  .map((l, i) => ({ ...l, rank: i + 1 }));

export default function ClassementPage() {
  const { isRTL, locale } = useLanguage();
  const [period, setPeriod] = useState<Period>("month");
  const [category, setCategory] = useState<Category>("sellers");

  const podium = topSellers.slice(0, 3);
  const rest = topSellers.slice(3);

  return (
    <div className="min-h-screen bg-sand-gradient">
      {/* Header */}
      <div className="relative py-16 overflow-hidden" style={{ background: "linear-gradient(135deg, #C9A84C, #8B6914)" }}>
        <IslamicPattern opacity={0.06} />
        <div className={`relative max-w-4xl mx-auto px-4 sm:px-6 text-center ${isRTL ? "font-arabic" : ""}`}>
          <div className="text-5xl mb-4">🏆</div>
          <h1 className="text-3xl font-display font-bold text-night-500 mb-2">
            {isRTL ? "أفضل بائعي سوق.مر" : "Classement SOUQ.MR"}
          </h1>
          <p className="text-night-400/70 text-sm">
            {isRTL ? "أكثر البائعين نشاطاً وموثوقية على المنصة" : "Les vendeurs les plus actifs et fiables de la plateforme"}
          </p>

          {/* Period filter */}
          <div className={`mt-5 flex items-center justify-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
            {(["week", "month", "alltime"] as Period[]).map((p) => (
              <button key={p} onClick={() => setPeriod(p)}
                className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  period === p ? "bg-night-500 text-sand-400" : "bg-night-500/20 text-night-400 hover:bg-night-500/30"
                } ${isRTL ? "font-arabic" : ""}`}>
                {periodLabels[p][locale]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        {/* Category tabs */}
        <div className={`flex gap-1 bg-sand-100 rounded-xl p-1 w-fit mb-8 ${isRTL ? "flex-row-reverse" : ""}`}>
          {([
            { id: "sellers" as const, fr: "🏪 Vendeurs", ar: "🏪 البائعون" },
            { id: "products" as const, fr: "📦 Produits", ar: "📦 المنتجات" },
          ]).map((t) => (
            <button key={t.id} onClick={() => setCategory(t.id)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                category === t.id ? "bg-white text-night-500 shadow-sm" : "text-night-400/60 hover:text-night-500"
              } ${isRTL ? "font-arabic" : ""}`}>
              {isRTL ? t.ar : t.fr}
            </button>
          ))}
        </div>

        {category === "sellers" && (
          <>
            {/* Podium top 3 */}
            <div className={`flex items-end justify-center gap-4 mb-10 ${isRTL ? "flex-row-reverse" : ""}`}>
              {/* 2nd */}
              <div className="flex flex-col items-center">
                <img src={podium[1].avatar} alt="" className="w-14 h-14 rounded-2xl object-cover border-2 border-sand-300 mb-2" />
                <p className={`text-sm font-bold text-night-500 max-w-[80px] text-center truncate ${isRTL ? "font-arabic" : ""}`}>
                  {isRTL ? podium[1].nameAr : podium[1].name}
                </p>
                <p className="text-xs text-night-400/60">{podium[1].sales} {isRTL ? "بيع" : "ventes"}</p>
                <div className="w-20 bg-sand-200 rounded-t-xl mt-2 flex items-center justify-center text-2xl" style={{ height: 60 }}>🥈</div>
              </div>
              {/* 1st */}
              <div className="flex flex-col items-center">
                <div className="relative">
                  <img src={podium[0].avatar} alt="" className="w-18 h-18 rounded-2xl object-cover border-2 border-sand-400 mb-2" style={{ width: 72, height: 72 }} />
                  <Crown size={18} className="absolute -top-2 -right-1 text-sand-400 fill-sand-400" />
                </div>
                <p className={`text-sm font-bold text-night-500 max-w-[90px] text-center truncate ${isRTL ? "font-arabic" : ""}`}>
                  {isRTL ? podium[0].nameAr : podium[0].name}
                </p>
                <p className="text-xs text-night-400/60">{podium[0].sales} {isRTL ? "بيع" : "ventes"}</p>
                <div className="w-24 rounded-t-xl mt-2 flex items-center justify-center text-2xl" style={{ height: 80, background: "linear-gradient(135deg, #C9A84C, #B8922E)" }}>🥇</div>
              </div>
              {/* 3rd */}
              <div className="flex flex-col items-center">
                <img src={podium[2].avatar} alt="" className="w-14 h-14 rounded-2xl object-cover border-2 border-sand-200 mb-2" />
                <p className={`text-sm font-bold text-night-500 max-w-[80px] text-center truncate ${isRTL ? "font-arabic" : ""}`}>
                  {isRTL ? podium[2].nameAr : podium[2].name}
                </p>
                <p className="text-xs text-night-400/60">{podium[2].sales} {isRTL ? "بيع" : "ventes"}</p>
                <div className="w-16 bg-sand-100 rounded-t-xl mt-2 flex items-center justify-center text-2xl" style={{ height: 48 }}>🥉</div>
              </div>
            </div>

            {/* Full rankings */}
            <div className="space-y-3">
              {rest.map((seller, i) => (
                <Link key={seller.id + i} href={`/profil/${seller.id}`}
                  className={`flex items-center gap-4 bg-white rounded-2xl p-4 shadow-sm hover:shadow-card transition-all ${isRTL ? "flex-row-reverse" : ""}`}>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 bg-sand-100">
                    <span className="text-sm font-bold text-sand-500">{i + 4}</span>
                  </div>
                  <img src={seller.avatar} alt="" className="w-10 h-10 rounded-xl object-cover flex-shrink-0" />
                  <div className={`flex-1 ${isRTL ? "text-right" : ""}`}>
                    <p className={`font-semibold text-night-500 text-sm ${isRTL ? "font-arabic" : ""}`}>
                      {isRTL ? seller.nameAr : seller.name}
                    </p>
                    <div className={`flex items-center gap-1 text-xs text-night-400/60 ${isRTL ? "flex-row-reverse justify-end" : ""}`}>
                      <Star size={10} className="text-sand-400 fill-sand-400" />
                      <span>{seller.rating}</span>
                      <span>•</span>
                      <span>{seller.reviews} {isRTL ? "تقييم" : "avis"}</span>
                    </div>
                  </div>
                  <div className={`text-right ${isRTL ? "text-left" : ""}`}>
                    <p className="text-sm font-bold text-sand-500">{seller.sales} {isRTL ? "بيع" : "ventes"}</p>
                    <p className="text-xs text-night-400/50">{formatPrice(seller.revenue)} MRU</p>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

        {category === "products" && (
          <div className="space-y-3">
            {topProducts.map((product) => (
              <Link key={product.id} href={`/annonce/${product.id}`}
                className={`flex items-center gap-4 bg-white rounded-2xl p-4 shadow-sm hover:shadow-card transition-all ${isRTL ? "flex-row-reverse" : ""}`}>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-bold ${
                  product.rank === 1 ? "text-sand-400" :
                  product.rank === 2 ? "text-sand-300" :
                  product.rank === 3 ? "text-sand-200" : "bg-sand-100 text-sand-500"
                }`} style={product.rank <= 3 ? { background: "linear-gradient(135deg, #C9A84C, #B8922E)" } : {}}>
                  {product.rank <= 3 ? ["🥇","🥈","🥉"][product.rank - 1] : product.rank}
                </div>
                <img src={product.images[0]} alt="" className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                <div className={`flex-1 ${isRTL ? "text-right" : ""}`}>
                  <p className={`font-semibold text-night-500 text-sm line-clamp-1 ${isRTL ? "font-arabic" : ""}`}>
                    {isRTL ? product.titleAr : product.title}
                  </p>
                  <p className="text-xs text-night-400/60">
                    {product.views.toLocaleString()} {isRTL ? "مشاهدة" : "vues"}
                  </p>
                </div>
                <div className={`text-right ${isRTL ? "text-left" : ""}`}>
                  <p className="text-sm font-bold text-sand-500">{formatPrice(product.price)}</p>
                  <p className="text-xs text-night-400/50">MRU</p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-10 bg-night-500 rounded-2xl p-6 text-center">
          <TrendingUp size={24} className="text-sand-400 mx-auto mb-3" />
          <p className={`font-bold text-white mb-1 ${isRTL ? "font-arabic" : ""}`}>
            {isRTL ? "هل تريد أن تظهر في الترتيب؟" : "Vous voulez apparaître dans le classement ?"}
          </p>
          <p className={`text-sm text-sand-300/70 mb-4 ${isRTL ? "font-arabic" : ""}`}>
            {isRTL ? "انشر إعلانات أكثر وعزّز بيعك للوصول إلى القمة" : "Publiez plus d'annonces et boostez vos ventes pour atteindre le top"}
          </p>
          <Link href="/vendre" className="btn-gold text-sm">
            {isRTL ? "انشر إعلاناً الآن" : "Publier une annonce"}
          </Link>
        </div>
      </div>
    </div>
  );
}
