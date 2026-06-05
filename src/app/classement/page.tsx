"use client";
const formatPrice = (p: number) => p.toLocaleString("fr-FR");

import { useState, useEffect } from "react";
import { Trophy, Star, TrendingUp, Crown } from "lucide-react";
import Link from "next/link";

import type { Seller } from "@/data/mockData";
import IslamicPattern from "@/components/ui/IslamicPattern";
import { useLanguage } from "@/context/LanguageContext";

type Period = "week" | "month" | "alltime";
type Category = "sellers" | "products";

const periodLabels: Record<Period, { fr: string; ar: string }> = {
  week: { fr: "Cette semaine", ar: "هذا الأسبوع" },
  month: { fr: "Ce mois", ar: "هذا الشهر" },
  alltime: { fr: "Tout temps", ar: "كل الأوقات" },
};

interface RankedSeller extends Seller {
  sales: number;
  revenue: number;
  badge: string; // rank badge emoji or number string
}

interface RankedProduct {
  id: string;
  title: string;
  titleAr: string;
  price: number;
  images: string[];
  views: number;
  rank: number;
}

function normalizeSellerRow(r: any): Seller {
  if (r.name_ar !== undefined) {
    return {
      id: r.id,
      name: r.name,
      nameAr: r.name_ar,
      avatar: r.avatar ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${r.id}`,
      badge: r.badge,
      rating: r.rating,
      reviews: r.reviews_count ?? r.reviews ?? 0,
      listings: r.listings_count ?? r.listings ?? 0,
      joinedAt: r.created_at ?? r.joinedAt ?? "",
      phone: r.phone ?? "",
      responseTime: r.response_time ?? r.responseTime,
    };
  }
  return r as Seller;
}

export default function ClassementPage() {
  const { isRTL, locale } = useLanguage();
  const [period, setPeriod] = useState<Period>("month");
  const [category, setCategory] = useState<Category>("sellers");

  const [topSellers, setTopSellers] = useState<RankedSeller[]>([]);
  const [topProducts, setTopProducts] = useState<RankedProduct[]>([]);
  const [loadingSellers, setLoadingSellers] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    setLoadingSellers(true);
    fetch("/api/sellers?sort=rating&limit=50")
      .then((r) => r.json())
      .then((json) => {
        const raw: any[] = json.data ?? [];
        const medals = ["🥇", "🥈", "🥉"];
        const ranked: RankedSeller[] = raw.map((r, i) => ({
          ...normalizeSellerRow(r),
          sales: r.sales_count ?? 0,
          revenue: r.revenue ?? 0,
          badge: i < 3 ? medals[i] : String(i + 1),
        }));
        setTopSellers(ranked);
      })
      .catch(() => setTopSellers([]))
      .finally(() => setLoadingSellers(false));
  }, [period]);

  useEffect(() => {
    setLoadingProducts(true);
    fetch("/api/listings?sort=popular&limit=10")
      .then((r) => r.json())
      .then((json) => {
        const raw: any[] = json.data ?? [];
        const ranked: RankedProduct[] = raw.map((l, i) => ({
          id: l.id,
          title: l.title,
          titleAr: l.title_ar ?? l.titleAr ?? "",
          price: l.price,
          images: l.images ?? [],
          views: l.views ?? 0,
          rank: i + 1,
        }));
        setTopProducts(ranked);
      })
      .catch(() => setTopProducts([]))
      .finally(() => setLoadingProducts(false));
  }, [period]);

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
            {loadingSellers ? (
              <div className="flex justify-center py-16">
                <div className="w-8 h-8 border-2 border-sand-400 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <>
                {/* Podium top 3 */}
                {podium.length >= 3 && (
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
                        <img src={podium[0].avatar} alt="" className="rounded-2xl object-cover border-2 border-sand-400 mb-2" style={{ width: 72, height: 72 }} />
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
                )}

                {/* Full rankings */}
                <div className="space-y-3">
                  {rest.map((seller, i) => (
                    <Link key={seller.id} href={`/profil/${seller.id}`}
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
          </>
        )}

        {category === "products" && (
          <>
            {loadingProducts ? (
              <div className="flex justify-center py-16">
                <div className="w-8 h-8 border-2 border-sand-400 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="space-y-3">
                {topProducts.map((product) => (
                  <Link key={product.id} href={`/annonce/${product.id}`}
                    className={`flex items-center gap-4 bg-white rounded-2xl p-4 shadow-sm hover:shadow-card transition-all ${isRTL ? "flex-row-reverse" : ""}`}>
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-bold ${
                      product.rank <= 3 ? "text-sand-400" : "bg-sand-100 text-sand-500"
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
          </>
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
