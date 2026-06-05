"use client";

import { useState, useEffect } from "react";
import { Search, MapPin, Star, CheckCircle2, MessageCircle, Heart, ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";

import type { Seller } from "@/data/mockData";
import IslamicPattern from "@/components/ui/IslamicPattern";
import { useLanguage } from "@/context/LanguageContext";
import { useFavorites } from "@/context/FavoritesContext";

type SortBy = "rating" | "listings" | "recent";
type FilterBadge = "all" | "pro" | "verified";

// Shape returned from /api/sellers (DbProfile fields)
interface SellerRow {
  id: string;
  name: string;
  name_ar: string;
  avatar: string | null;
  badge: "regular" | "verified" | "pro";
  rating: number;
  reviews_count: number;
  listings_count: number;
  is_active: boolean;
  created_at: string;
  phone: string;
  response_time?: string;
}

function toSeller(r: SellerRow): Seller {
  return {
    id: r.id,
    name: r.name,
    nameAr: r.name_ar,
    avatar: r.avatar ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${r.id}`,
    badge: r.badge,
    rating: r.rating,
    reviews: r.reviews_count,
    listings: r.listings_count,
    joinedAt: r.created_at,
    phone: r.phone ?? "",
    responseTime: r.response_time,
  };
}

export default function VendeursPage() {
  const { isRTL, locale } = useLanguage();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortBy>("rating");
  const [badge, setBadge] = useState<FilterBadge>("all");
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiSort = sort === "recent" ? "newest" : sort;
    fetch(`/api/sellers?sort=${apiSort}&limit=50`)
      .then((r) => r.json())
      .then((json) => {
        const raw: SellerRow[] = json.data ?? [];
        // If response has camelCase fields (mockData fallback), handle both
        const normalized = raw.map((r: any) => {
          if (r.name_ar !== undefined) return toSeller(r as SellerRow);
          // Already a Seller shape (mockData fallback)
          return r as Seller;
        });
        setSellers(normalized);
      })
      .catch(() => setSellers([]))
      .finally(() => setLoading(false));
  }, [sort]);

  const filtered = sellers
    .filter((s) => {
      const q = search.toLowerCase();
      const matchSearch = !q || s.name.toLowerCase().includes(q) || s.nameAr.includes(search);
      const matchBadge = badge === "all" || s.badge === badge;
      return matchSearch && matchBadge;
    });

  const sortLabels: Record<SortBy, { fr: string; ar: string }> = {
    rating: { fr: "Mieux notés", ar: "الأعلى تقييماً" },
    listings: { fr: "Plus d'annonces", ar: "أكثر إعلانات" },
    recent: { fr: "Récents", ar: "الأحدث" },
  };

  const badgeLabels: Record<FilterBadge, { fr: string; ar: string }> = {
    all: { fr: "Tous", ar: "الكل" },
    pro: { fr: "Marchands Pro", ar: "تجار محترفون" },
    verified: { fr: "Vérifiés", ar: "موثقون" },
  };

  const badgeStyle: Record<string, { bg: string; color: string; label: { fr: string; ar: string } }> = {
    pro: { bg: "linear-gradient(135deg, #C9A84C30, #B8922E20)", color: "#9A7822", label: { fr: "Pro", ar: "محترف" } },
    verified: { bg: "#E8F4EE", color: "#2D6A4F", label: { fr: "Vérifié", ar: "موثق" } },
    regular: { bg: "#F5F0E8", color: "#9A7822", label: { fr: "Habitué", ar: "زبون دائم" } },
  };

  return (
    <div className="min-h-screen bg-sand-gradient">
      {/* Header */}
      <div className="relative py-14 overflow-hidden" style={{ background: "linear-gradient(135deg, #1B2A4A, #2D4A7A)" }}>
        <IslamicPattern opacity={0.05} />
        <div className={`relative max-w-5xl mx-auto px-4 sm:px-6 text-center ${isRTL ? "font-arabic" : ""}`}>
          <h1 className="text-3xl font-display font-bold text-white mb-2">
            {isRTL ? "استكشف البائعين" : "Découvrez nos vendeurs"}
          </h1>
          <p className="text-sand-300/70 text-sm">
            {isRTL ? "ابحث عن بائع موثوق ومتخصص في ما تحتاجه" : "Trouvez le vendeur fiable spécialisé dans ce que vous cherchez"}
          </p>
          <div className="mt-5 flex items-center justify-center gap-3 flex-wrap">
            {[
              { n: sellers.filter((s) => s.badge === "pro").length, l: { fr: "Marchands Pro", ar: "تاجر محترف" } },
              { n: sellers.filter((s) => s.badge === "verified").length, l: { fr: "Vendeurs Vérifiés", ar: "بائع موثق" } },
              { n: sellers.length, l: { fr: "Vendeurs actifs", ar: "بائع نشط" } },
            ].map((s, i) => (
              <div key={i} className="px-4 py-2 bg-white/10 rounded-xl text-center">
                <span className="font-display font-bold text-sand-400 text-lg mr-1">{s.n}</span>
                <span className={`text-sand-300/70 text-xs ${isRTL ? "font-arabic" : ""}`}>{s.l[locale]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Filters */}
        <div className={`flex flex-col sm:flex-row gap-3 mb-6 ${isRTL ? "sm:flex-row-reverse" : ""}`}>
          <div className="relative flex-1">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={isRTL ? "ابحث عن بائع..." : "Rechercher un vendeur..."}
              dir={isRTL ? "rtl" : "ltr"}
              className="w-full border border-sand-200 rounded-xl px-4 py-2.5 text-sm text-night-500 outline-none focus:border-sand-400 bg-white"
            />
            <Search size={14} className={`absolute top-1/2 -translate-y-1/2 text-sand-400 ${isRTL ? "left-3" : "right-3"}`} />
          </div>

          <div className={`flex gap-1 bg-sand-100 rounded-xl p-1 flex-shrink-0 ${isRTL ? "flex-row-reverse" : ""}`}>
            {(["all", "pro", "verified"] as FilterBadge[]).map((b) => (
              <button key={b} onClick={() => setBadge(b)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  badge === b ? "bg-white text-night-500 shadow-sm" : "text-night-400/60"
                } ${isRTL ? "font-arabic" : ""}`}>
                {badgeLabels[b][locale]}
              </button>
            ))}
          </div>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortBy)}
            className="border border-sand-200 rounded-xl px-3 py-2.5 text-sm text-night-500 bg-white outline-none focus:border-sand-400 flex-shrink-0"
          >
            {(["rating", "listings", "recent"] as SortBy[]).map((s) => (
              <option key={s} value={s}>{sortLabels[s][locale]}</option>
            ))}
          </select>
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
                <div className="h-24 bg-sand-100" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-sand-100 rounded w-3/4" />
                  <div className="h-3 bg-sand-100 rounded w-1/2" />
                  <div className="h-8 bg-sand-100 rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Sellers grid */}
        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((seller) => {
              const style = badgeStyle[seller.badge] ?? badgeStyle.regular;
              return (
                <div key={seller.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-card transition-all">
                  {/* Avatar banner placeholder */}
                  <div className="h-24 bg-gradient-to-br from-sand-100 to-sand-200 relative">
                    <img
                      src={seller.avatar}
                      alt=""
                      className="absolute bottom-0 left-4 translate-y-1/2 w-12 h-12 rounded-xl object-cover border-2 border-white shadow-sm"
                    />
                  </div>

                  <div className="p-4 pt-8">
                    {/* Name + badge */}
                    <div className={`flex items-center gap-1.5 mb-2 ${isRTL ? "flex-row-reverse justify-end" : ""}`}>
                      <p className={`font-bold text-night-500 text-sm ${isRTL ? "font-arabic" : ""}`}>
                        {isRTL ? seller.nameAr : seller.name}
                      </p>
                      <span className="px-1.5 py-0.5 rounded-lg text-xs font-bold flex-shrink-0"
                        style={{ background: style.bg, color: style.color }}>
                        {style.label[locale]}
                      </span>
                    </div>

                    {/* Stats */}
                    <div className={`flex items-center gap-3 text-xs text-night-400/60 mb-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                      <span className={`flex items-center gap-1 ${isRTL ? "flex-row-reverse" : ""}`}>
                        <Star size={11} className="text-sand-400 fill-sand-400" />{seller.rating}
                      </span>
                      <span>({seller.reviews})</span>
                      <span>•</span>
                      <span>{seller.listings} {isRTL ? "إعلان" : "annonces"}</span>
                      {seller.responseTime && (
                        <>
                          <span>•</span>
                          <span>⚡ {seller.responseTime}</span>
                        </>
                      )}
                    </div>

                    {/* Actions */}
                    <div className={`flex gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                      <Link href={seller.badge === "pro" ? `/boutique/${seller.id}` : `/profil/${seller.id}`}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold text-night-500 border border-sand-200 hover:border-sand-400 transition-all ${isRTL ? "flex-row-reverse font-arabic" : ""}`}>
                        {isRTL ? "عرض الملف" : "Voir profil"}
                        <Arrow size={12} />
                      </Link>
                      <Link href={`/messages?seller=${seller.id}`}
                        className="p-2 border border-sand-200 rounded-xl text-night-400 hover:border-sand-400 hover:text-sand-500 transition-all">
                        <MessageCircle size={15} />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center shadow-card">
            <Search size={32} className="text-sand-300 mx-auto mb-3" />
            <p className={`text-night-400/60 ${isRTL ? "font-arabic" : ""}`}>
              {isRTL ? "لا يوجد بائعون يطابقون بحثك" : "Aucun vendeur ne correspond à votre recherche"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
