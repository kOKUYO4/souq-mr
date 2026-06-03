"use client";

import { useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { MapPin, Calendar, MessageCircle, Share2, CheckCircle2, BarChart3, Star } from "lucide-react";
import { sellers, listings, reviews, formatPrice } from "@/data/mockData";
import ListingCard from "@/components/listings/ListingCard";
import ReviewCard from "@/components/social/ReviewCard";
import ReviewForm from "@/components/social/ReviewForm";
import StarRating from "@/components/social/StarRating";
import IslamicPattern from "@/components/ui/IslamicPattern";
import { useLanguage } from "@/context/LanguageContext";

const badgeStyle = {
  pro: { label: { fr: "Marchand Pro", ar: "تاجر محترف" }, bg: "linear-gradient(135deg, #C9A84C, #B8922E)", color: "#1B2A4A" },
  verified: { label: { fr: "Vendeur Vérifié", ar: "بائع موثق" }, bg: "#E8F4EE", color: "#2D6A4F" },
  regular: { label: { fr: "Habitué du Souk", ar: "زبون دائم" }, bg: "#F5EDD9", color: "#9A7822" },
};

const ratingDistrib = [
  { stars: 5, pct: 72 },
  { stars: 4, pct: 18 },
  { stars: 3, pct: 7 },
  { stars: 2, pct: 2 },
  { stars: 1, pct: 1 },
];

export default function ProfilPage() {
  const { id } = useParams<{ id: string }>();
  const { isRTL, locale, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"listings" | "reviews" | "about">("listings");
  const [reviewFormOpen, setReviewFormOpen] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  const seller = sellers.find((s) => s.id === id) || sellers[0];

  const handleShare = useCallback(() => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) { navigator.share({ title: seller.name, url }).catch(() => {}); }
    else { navigator.clipboard.writeText(url).then(() => { setShareCopied(true); setTimeout(() => setShareCopied(false), 2000); }); }
  }, [seller.name]);
  const sellerListings = listings.filter((l) => l.seller.id === seller.id);
  const sellerReviews = reviews.filter((r) => r.sellerId === seller.id);
  const badge = badgeStyle[seller.badge];

  const tabs = [
    { id: "listings", fr: `Annonces (${sellerListings.length})`, ar: `الإعلانات (${sellerListings.length})` },
    { id: "reviews", fr: `Avis (${sellerReviews.length})`, ar: `التقييمات (${sellerReviews.length})` },
    { id: "about", fr: "À propos", ar: "حول البائع" },
  ];

  return (
    <div className="min-h-screen bg-sand-50">
      {/* Bandeau de fond */}
      <div
        className="relative h-44 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1B2A4A, #2D3E6A)" }}
      >
        <IslamicPattern opacity={0.07} />
        <div className="absolute inset-0 opacity-20"
          style={{ background: "radial-gradient(ellipse at 30% 50%, #C9A84C44, transparent)" }} />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Carte profil */}
        <div className="relative -mt-20 bg-white rounded-2xl p-6 shadow-card mb-6">
          <div className={`flex flex-col sm:flex-row items-start sm:items-end gap-5 ${isRTL ? "sm:flex-row-reverse" : ""}`}>
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <img
                src={seller.avatar}
                alt={seller.name}
                className="w-28 h-28 rounded-2xl bg-sand-100 border-4 border-white shadow-lg"
              />
              {seller.badge !== "regular" && (
                <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-white flex items-center justify-center shadow">
                  <CheckCircle2 size={18} className="text-islamic-400" />
                </div>
              )}
            </div>

            <div className={`flex-1 ${isRTL ? "sm:text-right" : ""}`}>
              <div className={`flex items-center gap-2 mb-1 flex-wrap ${isRTL ? "flex-row-reverse sm:justify-end" : ""}`}>
                <h1 className="text-2xl font-bold text-night-500">
                  {isRTL ? seller.nameAr : seller.name}
                </h1>
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
                  style={{ background: badge.bg, color: badge.color }}
                >
                  {badge.label[locale]}
                </span>
              </div>

              <div className={`flex flex-wrap items-center gap-4 text-sm text-night-400/60 mb-3 ${isRTL ? "flex-row-reverse sm:justify-end" : ""}`}>
                <span className={`flex items-center gap-1 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <StarRating value={Math.floor(seller.rating)} size={14} showValue />
                  <span className="text-xs">({seller.reviews} {isRTL ? "تقييم" : "avis"})</span>
                </span>
                <span className={`flex items-center gap-1 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <MapPin size={13} />
                  {isRTL ? "نواكشوط، موريتانيا" : "Nouakchott, Mauritanie"}
                </span>
                <span className={`flex items-center gap-1 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <Calendar size={13} />
                  {isRTL ? "عضو منذ 2023" : "Membre depuis 2023"}
                </span>
              </div>

              {/* Stats rapides */}
              <div className={`flex gap-6 ${isRTL ? "flex-row-reverse sm:justify-end" : ""}`}>
                {[
                  { value: seller.listings, fr: "annonces", ar: "إعلان" },
                  { value: seller.reviews, fr: "avis", ar: "تقييم" },
                  { value: `< ${seller.responseTime || "2h"}`, fr: "délai réponse", ar: "وقت الرد" },
                ].map((s, i) => (
                  <div key={i} className={`text-center ${isRTL ? "sm:text-right" : ""}`}>
                    <p className="text-xl font-bold text-night-500 font-display">{s.value}</p>
                    <p className="text-xs text-night-400/60">{isRTL ? s.ar : s.fr}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className={`flex gap-2 flex-shrink-0 ${isRTL ? "flex-row-reverse" : ""}`}>
              <Link href={`/messages?seller=${seller.id}`} className="btn-gold py-2.5 px-5 text-sm gap-1.5">
                <MessageCircle size={15} />
                {isRTL ? "رسالة" : "Message"}
              </Link>
              <button onClick={handleShare} className="btn-outline py-2.5 px-4 text-sm" title={isRTL ? "مشاركة" : "Partager"}>
                {shareCopied ? <CheckCircle2 size={15} className="text-islamic-400" /> : <Share2 size={15} />}
              </button>
            </div>
          </div>
        </div>

        {/* Onglets */}
        <div className={`flex gap-1 border-b border-sand-200 mb-6 ${isRTL ? "flex-row-reverse" : ""}`}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors -mb-px ${
                activeTab === tab.id
                  ? "border-sand-400 text-sand-500"
                  : "border-transparent text-night-400/60 hover:text-night-500"
              }`}
            >
              {isRTL ? tab.ar : tab.fr}
            </button>
          ))}
        </div>

        {/* Contenu onglet */}
        {activeTab === "listings" && (
          <div className="mb-8">
            {sellerListings.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {sellerListings.map((l) => <ListingCard key={l.id} listing={l} />)}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl shadow-card">
                <p className="text-night-400/60">{isRTL ? "لا توجد إعلانات حالياً" : "Aucune annonce pour l'instant"}</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="mb-8 space-y-6">
            {/* Résumé note */}
            <div className="bg-white rounded-2xl p-6 shadow-card">
              <div className={`flex flex-col sm:flex-row gap-6 items-start ${isRTL ? "sm:flex-row-reverse" : ""}`}>
                {/* Note globale */}
                <div className={`text-center flex-shrink-0 ${isRTL ? "" : ""}`}>
                  <p className="text-6xl font-display font-bold text-night-500">{seller.rating}</p>
                  <StarRating value={Math.floor(seller.rating)} size={20} />
                  <p className="text-xs text-night-400/60 mt-1">
                    {seller.reviews} {isRTL ? "تقييم" : "avis"}
                  </p>
                </div>

                {/* Distribution */}
                <div className="flex-1 space-y-2">
                  {ratingDistrib.map(({ stars, pct }) => (
                    <div key={stars} className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                      <span className="text-xs text-night-400/60 w-3">{stars}</span>
                      <Star size={11} className="text-sand-400 fill-sand-400 flex-shrink-0" />
                      <div className="flex-1 h-2 bg-sand-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${pct}%`, background: "linear-gradient(90deg, #C9A84C, #B8922E)" }}
                        />
                      </div>
                      <span className="text-xs text-night-400/50 w-8 text-right">{pct}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bouton laisser un avis */}
              <div className="mt-5 pt-5 border-t border-sand-100">
                <button
                  onClick={() => setReviewFormOpen(!reviewFormOpen)}
                  className="btn-gold text-sm py-2.5 px-6"
                >
                  ⭐ {isRTL ? "اترك تقييماً" : "Laisser un avis"}
                </button>
              </div>
            </div>

            {/* Formulaire avis */}
            {reviewFormOpen && (
              <ReviewForm
                sellerId={seller.id}
                sellerName={seller.name}
                sellerNameAr={seller.nameAr}
                onSubmit={() => setReviewFormOpen(false)}
              />
            )}

            {/* Liste avis */}
            {sellerReviews.length > 0 ? (
              <div className="space-y-4">
                {sellerReviews.map((r) => <ReviewCard key={r.id} review={r} />)}
              </div>
            ) : (
              <div className="text-center py-10 bg-white rounded-2xl shadow-card">
                <p className="text-night-400/60 text-sm">{isRTL ? "لا توجد تقييمات بعد" : "Aucun avis pour l'instant"}</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "about" && (
          <div className="bg-white rounded-2xl p-6 shadow-card mb-8">
            <h3 className={`font-bold text-night-500 mb-4 ${isRTL ? "text-right" : ""}`}>
              {isRTL ? `حول ${seller.nameAr}` : `À propos de ${seller.name}`}
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { icon: BarChart3, fr: "Annonces publiées", ar: "الإعلانات المنشورة", value: seller.listings },
                { icon: Star, fr: "Note moyenne", ar: "متوسط التقييم", value: `${seller.rating}/5` },
                { icon: MessageCircle, fr: "Temps de réponse", ar: "وقت الرد", value: seller.responseTime || "< 2h" },
                { icon: Calendar, fr: "Membre depuis", ar: "عضو منذ", value: new Date(seller.joinedAt).toLocaleDateString(locale === "ar" ? "ar-SA" : "fr-FR", { year: "numeric", month: "long" }) },
              ].map(({ icon: Icon, fr, ar, value }, i) => (
                <div key={i} className={`flex items-center gap-3 p-4 bg-sand-50 rounded-xl ${isRTL ? "flex-row-reverse" : ""}`}>
                  <div className="w-10 h-10 rounded-xl bg-sand-100 flex items-center justify-center flex-shrink-0">
                    <Icon size={18} className="text-sand-500" />
                  </div>
                  <div className={isRTL ? "text-right" : ""}>
                    <p className="text-xs text-night-400/60">{isRTL ? ar : fr}</p>
                    <p className="font-semibold text-night-500 text-sm">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
