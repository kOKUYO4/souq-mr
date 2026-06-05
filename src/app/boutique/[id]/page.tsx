"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Star, MapPin, CheckCircle2, MessageCircle, Share2, ShieldCheck, ArrowRight, ArrowLeft, Phone, Tag } from "lucide-react";
import type { Listing, Seller } from "@/data/mockData";
import ListingCard from "@/components/listings/ListingCard";
import IslamicPattern from "@/components/ui/IslamicPattern";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/context/ToastContext";

const bannerColors = [
  "linear-gradient(135deg, #1B2A4A, #2D3E6A)",
  "linear-gradient(135deg, #2D6A4F, #1A3F2A)",
  "linear-gradient(135deg, #C9A84C, #8B6914)",
  "linear-gradient(135deg, #9B4B8A, #6B2060)",
];

function normalizeProfile(profile: any): Seller {
  if (profile.name_ar !== undefined) {
    return {
      id: profile.id,
      name: profile.name,
      nameAr: profile.name_ar,
      avatar: profile.avatar ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.id}`,
      badge: profile.badge ?? "regular",
      rating: profile.rating ?? 0,
      reviews: profile.reviews_count ?? 0,
      listings: profile.listings_count ?? 0,
      joinedAt: profile.created_at ?? "",
      phone: profile.phone ?? "",
      responseTime: profile.response_time,
    };
  }
  return profile as Seller;
}

function normalizeListing(l: any): Listing {
  if (l.title_ar !== undefined) {
    return {
      id: l.id,
      title: l.title,
      titleAr: l.title_ar ?? "",
      price: l.price,
      originalPrice: l.original_price ?? undefined,
      category: l.category,
      subcategory: l.subcategory ?? "",
      location: l.location ?? "",
      locationAr: l.location_ar ?? "",
      images: l.images ?? [],
      condition: l.condition ?? "used",
      negotiable: l.negotiable ?? false,
      cod: l.cod ?? false,
      featured: l.featured ?? false,
      views: l.views ?? 0,
      createdAt: l.created_at ?? "",
      seller: l.profiles ? normalizeProfile(l.profiles) : { id: l.seller_id, name: "", nameAr: "", avatar: "", badge: "regular", rating: 0, reviews: 0, listings: 0, joinedAt: "", phone: "" },
      description: l.description ?? "",
      descriptionAr: l.description_ar ?? "",
      attributes: l.attributes ?? {},
    };
  }
  return l as Listing;
}

export default function BoutiquePage() {
  const { id } = useParams<{ id: string }>();
  const { isRTL, locale } = useLanguage();
  const { success } = useToast();
  const [tab, setTab] = useState<"all" | "promo" | "new">("all");
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  const [seller, setSeller] = useState<Seller | null>(null);
  const [shopListings, setShopListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/profile/${id}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.data?.profile) {
          setSeller(normalizeProfile(json.data.profile));
          setShopListings((json.data.listings ?? []).map(normalizeListing));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const promoListings = shopListings.filter((l) => l.originalPrice && l.originalPrice > l.price);
  const newListings = shopListings.filter((l) => l.condition === "new");
  const displayed = tab === "promo" ? promoListings : tab === "new" ? newListings : shopListings;

  const banner = bannerColors[Math.abs(id?.charCodeAt(0) ?? 0) % bannerColors.length];

  const handleShare = () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    navigator.clipboard.writeText(url).then(() => success(isRTL ? "تم نسخ الرابط ✓" : "Lien copié ✓")).catch(() => {});
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-sand-50 flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-sand-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="min-h-screen bg-sand-50 flex items-center justify-center">
        <div className={`text-center ${isRTL ? "font-arabic" : ""}`}>
          <p className="text-night-400/60">{isRTL ? "البائع غير موجود" : "Vendeur introuvable"}</p>
          <Link href="/vendeurs" className="btn-gold mt-4 inline-block text-sm">
            {isRTL ? "تصفح البائعين" : "Voir tous les vendeurs"}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sand-50">
      {/* Banner */}
      <div className="relative h-48 overflow-hidden" style={{ background: banner }}>
        <IslamicPattern opacity={0.08} />
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full pb-0" />
        </div>
      </div>

      {/* Profile header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="relative -mt-16 mb-6">
          <div className={`flex items-end justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
            <div className={`flex items-end gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
              {/* Avatar */}
              <div className="relative">
                <div className="w-28 h-28 rounded-2xl border-4 border-white shadow-card overflow-hidden bg-white">
                  <img src={seller.avatar} alt={seller.name} className="w-full h-full object-cover" />
                </div>
                {seller.badge === "pro" && (
                  <div className="absolute -bottom-2 -right-2 px-2 py-1 rounded-lg text-[10px] font-bold text-night-500"
                    style={{ background: "linear-gradient(135deg, #C9A84C, #B8922E)" }}>
                    PRO
                  </div>
                )}
              </div>
              {/* Info */}
              <div className={`pb-2 ${isRTL ? "text-right" : ""}`}>
                <h1 className={`text-2xl font-bold text-night-500 ${isRTL ? "font-arabic" : ""}`}>
                  {isRTL ? seller.nameAr : seller.name}
                </h1>
                <div className={`flex items-center gap-3 mt-1 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <div className={`flex items-center gap-1 ${isRTL ? "flex-row-reverse" : ""}`}>
                    <Star size={13} className="text-sand-400 fill-sand-400" />
                    <span className="text-sm font-bold text-night-500">{seller.rating}</span>
                    <span className="text-xs text-night-400/50">({seller.reviews})</span>
                  </div>
                  <div className={`flex items-center gap-1 text-xs text-night-400/60 ${isRTL ? "flex-row-reverse" : ""}`}>
                    <MapPin size={11} />
                    {isRTL ? "نواكشوط، موريتانيا" : "Nouakchott, Mauritanie"}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className={`flex items-center gap-2 pb-2 ${isRTL ? "flex-row-reverse" : ""}`}>
              <button onClick={handleShare}
                className="p-2.5 border border-sand-200 rounded-xl text-night-400 hover:border-sand-400 hover:text-sand-500 transition-all">
                <Share2 size={16} />
              </button>
              {seller.phone && (
                <a href={`tel:${seller.phone}`}
                  className="p-2.5 border border-sand-200 rounded-xl text-night-400 hover:border-sand-400 hover:text-sand-500 transition-all">
                  <Phone size={16} />
                </a>
              )}
              <Link href={`/messages?seller=${seller.id}`}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-night-500 transition-all"
                style={{ background: "linear-gradient(135deg, #C9A84C, #B8922E)" }}>
                <MessageCircle size={15} />
                {isRTL ? "تواصل" : "Contacter"}
              </Link>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { n: shopListings.length, labelFr: "Annonces", labelAr: "إعلان" },
            { n: seller.reviews, labelFr: "Avis", labelAr: "تقييم" },
            { n: seller.rating, labelFr: "Note /5", labelAr: "تقييم /5", suffix: "★" },
            { n: seller.listings, labelFr: "Ventes totales", labelAr: "مبيعات" },
          ].map((stat, i) => (
            <div key={i} className={`bg-white rounded-2xl p-4 shadow-sm text-center ${isRTL ? "font-arabic" : ""}`}>
              <p className="text-2xl font-display font-bold text-sand-500">
                {stat.suffix ? `${stat.n}${stat.suffix}` : stat.n}
              </p>
              <p className="text-xs text-night-400/60 mt-0.5">
                {isRTL ? stat.labelAr : stat.labelFr}
              </p>
            </div>
          ))}
        </div>

        {/* Trust badges */}
        <div className={`flex flex-wrap gap-2 mb-8 ${isRTL ? "flex-row-reverse" : ""}`}>
          <span className={`flex items-center gap-1.5 px-3 py-1.5 bg-islamic-50 rounded-xl text-xs font-semibold text-islamic-400 ${isRTL ? "flex-row-reverse font-arabic" : ""}`}>
            <CheckCircle2 size={12} />
            {isRTL ? "هوية موثقة" : "Identité vérifiée"}
          </span>
          {seller.badge === "pro" && (
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-night-500"
              style={{ background: "linear-gradient(135deg, #C9A84C30, #B8922E20)", border: "1px solid #C9A84C40" }}>
              <Star size={12} className="text-sand-400 fill-sand-400" />
              {isRTL ? "تاجر محترف" : "Marchand Pro"}
            </span>
          )}
          <span className={`flex items-center gap-1.5 px-3 py-1.5 bg-sand-100 rounded-xl text-xs font-semibold text-sand-600 ${isRTL ? "flex-row-reverse font-arabic" : ""}`}>
            <ShieldCheck size={12} />
            {isRTL ? "مستجيب بسرعة" : "Répond rapidement"} ⚡ {seller.responseTime || "< 2h"}
          </span>
        </div>

        {/* Tabs */}
        <div className={`flex gap-1 mb-6 bg-sand-100 rounded-xl p-1 w-fit ${isRTL ? "flex-row-reverse" : ""}`}>
          {([
            { id: "all", fr: `Tout (${shopListings.length})`, ar: `الكل (${shopListings.length})` },
            { id: "promo", fr: `Promotions (${promoListings.length})`, ar: `عروض (${promoListings.length})` },
            { id: "new", fr: `Neuf (${newListings.length})`, ar: `جديد (${newListings.length})` },
          ] as const).map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${tab === t.id ? "bg-white text-night-500 shadow-sm" : "text-night-400/60 hover:text-night-500"}`}>
              {isRTL ? t.ar : t.fr}
            </button>
          ))}
        </div>

        {/* Listings grid */}
        {displayed.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pb-12">
            {displayed.map((l) => <ListingCard key={l.id} listing={l} />)}
          </div>
        ) : (
          <div className={`text-center py-16 ${isRTL ? "font-arabic" : ""}`}>
            <Tag size={32} className="text-sand-300 mx-auto mb-3" />
            <p className="text-night-400/60">
              {isRTL ? "لا توجد إعلانات في هذا القسم" : "Aucune annonce dans cette section"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
