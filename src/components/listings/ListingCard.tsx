"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, MapPin, Eye, MessageCircle, CheckCircle2 } from "lucide-react";
import type { Listing } from "@/data/mockData";
import { formatPrice, timeAgo } from "@/data/mockData";
import Badge from "@/components/ui/Badge";
import HagglingModal from "@/components/social/HagglingModal";
import { useLanguage } from "@/context/LanguageContext";
import { useFavorites } from "@/context/FavoritesContext";
import { useToast } from "@/context/ToastContext";

interface ListingCardProps {
  listing: Listing;
  featured?: boolean;
  variant?: "grid" | "list";
}

export default function ListingCard({ listing, featured = false, variant = "grid" }: ListingCardProps) {
  const { t, locale, isRTL } = useLanguage();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { success } = useToast();
  const liked = isFavorite(listing.id);
  const [hagglingOpen, setHagglingOpen] = useState(false);

  const sellerBadgeLabel = {
    pro: t.trust.pro,
    verified: t.trust.verified,
    regular: t.trust.regular,
  }[listing.seller.badge];

  const toggleFav = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleFavorite(listing.id);
    success(isFavorite(listing.id)
      ? (isRTL ? "تمت الإزالة من المفضلة" : "Retiré des favoris")
      : (isRTL ? "تمت الإضافة إلى المفضلة ❤️" : "Ajouté aux favoris ❤️"));
  };

  if (variant === "list") {
    return (
      <div className="listing-card group">
        {hagglingOpen && <HagglingModal listing={listing} onClose={() => setHagglingOpen(false)} />}
        <Link href={`/annonce/${listing.id}`} className={`flex min-h-[120px] ${isRTL ? "flex-row-reverse" : ""}`}>
          {/* Image */}
          <div className="relative flex-shrink-0 w-40 sm:w-52 overflow-hidden bg-sand-100">
            <img
              src={listing.images[0]}
              alt={isRTL ? listing.titleAr : listing.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <div className={`absolute top-2 ${isRTL ? "right-2" : "left-2"} flex flex-col gap-1`}>
              <Badge type={listing.condition === "new" ? "new" : "used"} />
            </div>
            <button onClick={toggleFav}
              className={`absolute top-2 ${isRTL ? "left-2" : "right-2"} w-7 h-7 rounded-full bg-white/90 backdrop-blur flex items-center justify-center transition-all hover:scale-110`}>
              <Heart size={14} className={liked ? "fill-red-500 text-red-500" : "text-night-400"} />
            </button>
          </div>

          {/* Content */}
          <div className={`flex-1 p-4 flex flex-col justify-between min-w-0 ${isRTL ? "text-right" : ""}`}>
            <div>
              <div className={`flex items-start justify-between gap-2 mb-1 ${isRTL ? "flex-row-reverse" : ""}`}>
                <h3 className={`text-sm font-semibold text-night-500 line-clamp-2 group-hover:text-sand-500 transition-colors ${isRTL ? "font-arabic" : ""}`}>
                  {isRTL ? listing.titleAr : listing.title}
                </h3>
                <div className="flex-shrink-0 text-right">
                  <p className="font-bold text-sand-500 text-base whitespace-nowrap">{formatPrice(listing.price)} <span className="text-xs font-normal text-night-400/60">MRU</span></p>
                  {listing.originalPrice && (
                    <p className="text-xs text-night-400/40 line-through">{formatPrice(listing.originalPrice)}</p>
                  )}
                </div>
              </div>

              <div className={`flex flex-wrap gap-1 mb-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                {listing.negotiable && <Badge type="negotiate" />}
                {listing.cod && <Badge type="cod" />}
                {listing.featured && (
                  <span className="badge text-[10px] text-white px-1.5 py-0.5 rounded-full font-semibold"
                    style={{ background: "linear-gradient(135deg, #1B2A4A, #364E8F)" }}>
                    ⭐ {isRTL ? "مميز" : "Vedette"}
                  </span>
                )}
              </div>

              <p className={`text-xs text-night-400/60 line-clamp-2 mb-2 ${isRTL ? "font-arabic" : ""}`}>
                {isRTL ? listing.descriptionAr : listing.description}
              </p>
            </div>

            <div className={`flex items-center justify-between flex-wrap gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
              <div className={`flex items-center gap-3 text-xs text-night-400/60 flex-wrap ${isRTL ? "flex-row-reverse" : ""}`}>
                <span className={`flex items-center gap-1 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <MapPin size={11} />{isRTL ? listing.locationAr : listing.location}
                </span>
                <span className={`flex items-center gap-1 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <Eye size={11} />{listing.views}
                </span>
                <span>{timeAgo(listing.createdAt, locale)}</span>
              </div>
              <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                <div className={`flex items-center gap-1.5 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <img src={listing.seller.avatar} alt="" className="w-6 h-6 rounded-full" />
                  <span className="text-xs font-medium text-night-500">{isRTL ? listing.seller.nameAr : listing.seller.name}</span>
                  {listing.seller.badge !== "regular" && <CheckCircle2 size={11} className="text-islamic-400" />}
                </div>
                {listing.negotiable && (
                  <button onClick={(e) => { e.preventDefault(); setHagglingOpen(true); }}
                    className="px-2.5 py-1 rounded-lg text-[10px] font-bold text-white transition-all hover:opacity-90"
                    style={{ background: "linear-gradient(135deg, #C9A84C, #B8922E)" }}>
                    {isRTL ? "أفضل سعر؟" : "Meilleur prix ?"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </Link>
      </div>
    );
  }

  return (
    <div className="listing-card group">
      {hagglingOpen && <HagglingModal listing={listing} onClose={() => setHagglingOpen(false)} />}
      <Link href={`/annonce/${listing.id}`}>
        {/* Image */}
        <div className="relative overflow-hidden h-48 bg-sand-100">
          <img
            src={listing.images[0]}
            alt={isRTL ? listing.titleAr : listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />

          {/* Badges superposés image */}
          <div className={`absolute top-3 ${isRTL ? "right-3" : "left-3"} flex flex-col gap-1.5`}>
            <Badge type={listing.condition === "new" ? "new" : "used"} />
            {listing.featured && (
              <span className="badge text-xs text-white px-2 py-0.5 rounded-full font-semibold"
                style={{ background: "linear-gradient(135deg, #1B2A4A, #364E8F)" }}>
                ⭐ {isRTL ? "مميز" : "Vedette"}
              </span>
            )}
            {listing.originalPrice && listing.originalPrice > listing.price && (
              <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full self-start">
                -{Math.round(((listing.originalPrice - listing.price) / listing.originalPrice) * 100)}%
              </span>
            )}
          </div>

          {/* Bouton favori */}
          <button
            onClick={toggleFav}
            className={`absolute top-3 ${isRTL ? "left-3" : "right-3"} w-8 h-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center transition-all hover:scale-110`}
          >
            <Heart
              size={16}
              className={liked ? "fill-red-500 text-red-500" : "text-night-400"}
            />
          </button>

          {/* Prix — superposé en bas de l'image */}
          <div className={`absolute bottom-3 ${isRTL ? "right-3" : "left-3"}`}>
            <div className="px-3 py-1.5 rounded-xl backdrop-blur-sm font-bold text-white text-sm"
              style={{ background: "linear-gradient(135deg, rgba(201,168,76,0.95), rgba(184,146,46,0.95))" }}>
              {formatPrice(listing.price)} MRU
              {listing.originalPrice && (
                <span className="ml-2 text-white/60 line-through text-xs">
                  {formatPrice(listing.originalPrice)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Contenu */}
        <div className={`p-4 ${isRTL ? "text-right" : ""}`}>
          {/* Titre */}
          <h3 className={`text-sm font-semibold text-night-500 mb-2 line-clamp-2 leading-snug group-hover:text-sand-500 transition-colors ${isRTL ? "font-arabic" : ""}`}>
            {isRTL ? listing.titleAr : listing.title}
          </h3>

          {/* Badges */}
          <div className={`flex flex-wrap gap-1.5 mb-3 ${isRTL ? "flex-row-reverse" : ""}`}>
            {listing.negotiable && <Badge type="negotiate" />}
            {listing.cod && <Badge type="cod" />}
          </div>

          {/* Localisation + date */}
          <div className={`flex items-center justify-between text-xs text-night-400/60 mb-3 ${isRTL ? "flex-row-reverse" : ""}`}>
            <div className={`flex items-center gap-1 ${isRTL ? "flex-row-reverse" : ""}`}>
              <MapPin size={11} />
              <span className="truncate max-w-[130px]">
                {isRTL ? listing.locationAr : listing.location}
              </span>
            </div>
            <span>{timeAgo(listing.createdAt, locale)}</span>
          </div>

          {/* Vendeur + stats */}
          <div className={`flex items-center justify-between pt-3 border-t border-sand-100 ${isRTL ? "flex-row-reverse" : ""}`}>
            <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
              <img
                src={listing.seller.avatar}
                alt={listing.seller.name}
                className="w-7 h-7 rounded-full bg-sand-100"
              />
              <div className={isRTL ? "text-right" : ""}>
                <p className="text-xs font-medium text-night-500 leading-none">
                  {isRTL ? listing.seller.nameAr : listing.seller.name}
                </p>
                {listing.seller.badge !== "regular" && (
                  <div className={`flex items-center gap-0.5 mt-0.5 ${isRTL ? "flex-row-reverse" : ""}`}>
                    <CheckCircle2 size={10} className="text-islamic-400" />
                    <span className="text-[10px] text-islamic-400">{sellerBadgeLabel}</span>
                  </div>
                )}
              </div>
            </div>

            <div className={`flex items-center gap-3 text-xs text-night-400/50 ${isRTL ? "flex-row-reverse" : ""}`}>
              <span className="flex items-center gap-1">
                <Eye size={11} />
                {listing.views}
              </span>
            </div>
          </div>
        </div>
      </Link>

      {/* Bouton contact — visible au hover */}
      <div className={`px-4 pb-4 flex gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
        <Link
          href={`/messages?seller=${listing.seller.id}&listing=${listing.id}`}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-night-500 text-white text-xs font-semibold hover:bg-night-600 transition-colors"
        >
          <MessageCircle size={13} />
          {t.listings.contactSeller}
        </Link>
        {listing.negotiable ? (
          <button
            onClick={() => setHagglingOpen(true)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border-2 border-sand-300 text-sand-500 text-xs font-semibold hover:bg-sand-50 transition-colors"
          >
            💬 {t.listings.makeOffer}
          </button>
        ) : (
          <Link
            href={`/annonce/${listing.id}`}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border-2 border-sand-100 text-night-400/60 text-xs font-semibold hover:bg-sand-50 transition-colors"
          >
            {isRTL ? "التفاصيل" : "Détails"}
          </Link>
        )}
      </div>
    </div>
  );
}
