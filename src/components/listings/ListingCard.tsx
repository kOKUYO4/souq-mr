"use client";

import Link from "next/link";
import { Heart, MapPin, Eye, MessageCircle, CheckCircle2 } from "lucide-react";
import type { Listing } from "@/data/mockData";
import { formatPrice, timeAgo } from "@/data/mockData";
import Badge from "@/components/ui/Badge";
import { useLanguage } from "@/context/LanguageContext";
import { useFavorites } from "@/context/FavoritesContext";
import { useToast } from "@/context/ToastContext";

interface ListingCardProps {
  listing: Listing;
  featured?: boolean;
}

export default function ListingCard({ listing, featured = false }: ListingCardProps) {
  const { t, locale, isRTL } = useLanguage();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { success } = useToast();
  const liked = isFavorite(listing.id);

  const sellerBadgeLabel = {
    pro: t.trust.pro,
    verified: t.trust.verified,
    regular: t.trust.regular,
  }[listing.seller.badge];

  return (
    <div className="listing-card group">
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
          </div>

          {/* Bouton favori */}
          <button
            onClick={(e) => { e.preventDefault(); toggleFavorite(listing.id); success(liked ? (isRTL ? "تمت الإزالة من المفضلة" : "Retiré des favoris") : (isRTL ? "تمت الإضافة إلى المفضلة ❤️" : "Ajouté aux favoris ❤️")); }}
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
        <button
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border-2 border-sand-300 text-sand-500 text-xs font-semibold hover:bg-sand-50 transition-colors"
        >
          💬 {t.listings.makeOffer}
        </button>
      </div>
    </div>
  );
}
