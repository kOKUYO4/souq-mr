"use client";

import { useParams } from "next/navigation";
import { Star, MapPin, Calendar, CheckCircle2, MessageCircle, Share2 } from "lucide-react";
import { sellers, listings, formatPrice } from "@/data/mockData";
import ListingCard from "@/components/listings/ListingCard";
import { useLanguage } from "@/context/LanguageContext";

export default function ProfilPage() {
  const { id } = useParams<{ id: string }>();
  const { isRTL, locale, t } = useLanguage();
  const seller = sellers.find((s) => s.id === id) || sellers[0];
  const sellerListings = listings.filter((l) => l.seller.id === seller.id);

  const badgeStyle = {
    pro: { label: { fr: "Marchand Pro", ar: "تاجر محترف" }, bg: "linear-gradient(135deg, #C9A84C, #B8922E)", color: "#1B2A4A" },
    verified: { label: { fr: "Vendeur Vérifié", ar: "بائع موثق" }, bg: "#E8F4EE", color: "#2D6A4F" },
    regular: { label: { fr: "Habitué du Souk", ar: "زبون دائم" }, bg: "#F5EDD9", color: "#9A7822" },
  }[seller.badge];

  return (
    <div className="min-h-screen bg-sand-50">
      {/* Hero profil */}
      <div className="relative h-48 bg-desert-gradient overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(201,168,76,0.3) 20px, rgba(201,168,76,0.3) 21px), repeating-linear-gradient(-45deg, transparent, transparent 20px, rgba(201,168,76,0.3) 20px, rgba(201,168,76,0.3) 21px)" }}
        />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Info vendeur */}
        <div className="relative -mt-16 bg-white rounded-2xl p-6 shadow-card mb-8">
          <div className={`flex flex-col sm:flex-row items-start sm:items-center gap-5 ${isRTL ? "sm:flex-row-reverse" : ""}`}>
            <img
              src={seller.avatar}
              alt={seller.name}
              className="w-24 h-24 rounded-2xl bg-sand-100 border-4 border-white shadow-md"
            />
            <div className={`flex-1 ${isRTL ? "text-right" : ""}`}>
              <div className={`flex items-center gap-2 mb-1 ${isRTL ? "flex-row-reverse justify-end" : ""}`}>
                <h1 className="text-xl font-bold text-night-500">
                  {isRTL ? seller.nameAr : seller.name}
                </h1>
                <CheckCircle2 size={18} className="text-islamic-400" />
              </div>
              <div className={`flex flex-wrap items-center gap-3 text-sm text-night-400/60 mb-3 ${isRTL ? "flex-row-reverse justify-end" : ""}`}>
                <span className="flex items-center gap-1">
                  <Star size={13} className="text-sand-400 fill-sand-400" />
                  <strong className="text-night-500">{seller.rating}</strong>
                  ({seller.reviews} {isRTL ? "تقييم" : "avis"})
                </span>
                <span className="flex items-center gap-1">
                  <MapPin size={13} />
                  {isRTL ? "نواكشوط، موريتانيا" : "Nouakchott, Mauritanie"}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={13} />
                  {isRTL ? "منذ 2023" : "Membre depuis 2023"}
                </span>
              </div>
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
                style={{ background: badgeStyle.bg, color: badgeStyle.color }}
              >
                {badgeStyle.label[locale]}
              </span>
            </div>

            {/* Stats */}
            <div className={`flex gap-6 ${isRTL ? "flex-row-reverse" : ""}`}>
              {[
                { value: seller.listings, labelFr: "annonces", labelAr: "إعلان" },
                { value: seller.reviews, labelFr: "avis", labelAr: "تقييم" },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="text-2xl font-bold text-night-500 font-display">{stat.value}</p>
                  <p className="text-xs text-night-400/60">{isRTL ? stat.labelAr : stat.labelFr}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className={`flex gap-3 mt-4 pt-4 border-t border-sand-100 ${isRTL ? "flex-row-reverse" : ""}`}>
            <button className="btn-gold py-2.5 px-5 text-sm flex items-center gap-2">
              <MessageCircle size={16} />
              {isRTL ? "رسالة" : "Envoyer un message"}
            </button>
            <button className="btn-outline py-2.5 px-4 text-sm flex items-center gap-2">
              <Share2 size={16} />
              {isRTL ? "مشاركة" : "Partager"}
            </button>
          </div>
        </div>

        {/* Annonces du vendeur */}
        <div className="mb-8">
          <h2 className={`section-title mb-6 ${isRTL ? "text-right" : ""}`}>
            {isRTL ? `إعلانات ${seller.nameAr}` : `Annonces de ${seller.name}`}
          </h2>
          {sellerListings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {sellerListings.map((l) => <ListingCard key={l.id} listing={l} />)}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl">
              <p className="text-night-400/60">{isRTL ? "لا توجد إعلانات حالياً" : "Aucune annonce pour l'instant"}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
