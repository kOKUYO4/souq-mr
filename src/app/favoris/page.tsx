"use client";

import Link from "next/link";
import { Heart, ArrowRight, ArrowLeft } from "lucide-react";
import { listings } from "@/data/mockData";
import ListingCard from "@/components/listings/ListingCard";
import { useFavorites } from "@/context/FavoritesContext";
import { useLanguage } from "@/context/LanguageContext";

export default function FavorisPage() {
  const { favorites } = useFavorites();
  const { isRTL } = useLanguage();
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  /* Affiche tous les listings si aucun favori (démo) */
  const favListings = favorites.length > 0
    ? listings.filter((l) => favorites.includes(l.id))
    : listings.slice(0, 4);

  return (
    <div className="min-h-screen bg-sand-50">
      {/* Header */}
      <div
        className="relative py-12 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1B2A4A, #0C1426)" }}
      >
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
            <div className="w-12 h-12 rounded-2xl bg-red-500/20 flex items-center justify-center">
              <Heart size={22} className="text-red-400 fill-red-400" />
            </div>
            <div className={isRTL ? "text-right" : ""}>
              <h1 className={`text-3xl font-display font-bold text-white ${isRTL ? "font-arabic" : ""}`}>
                {isRTL ? "المفضلة" : "Mes favoris"}
              </h1>
              <p className="text-sand-300/70 text-sm">
                {favListings.length} {isRTL ? "إعلان محفوظ" : "annonce(s) sauvegardée(s)"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {favListings.length > 0 ? (
          <>
            {favorites.length === 0 && (
              <div className="bg-sand-100 border border-sand-200 rounded-xl px-4 py-3 mb-6 flex items-center gap-2 text-sm text-night-400/70">
                <Heart size={14} className="text-red-400 fill-red-400 flex-shrink-0" />
                <span>
                  {isRTL
                    ? "هذه إعلانات مقترحة — اضغط ❤️ على أي إعلان لحفظه"
                    : "Voici des suggestions — cliquez ❤️ sur une annonce pour la sauvegarder"}
                </span>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {favListings.map((l) => (
                <ListingCard key={l.id} listing={l} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <div className="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-5">
              <Heart size={40} className="text-red-200" />
            </div>
            <h3 className={`text-xl font-semibold text-night-500 mb-2 ${isRTL ? "font-arabic" : ""}`}>
              {isRTL ? "قائمتك المفضلة فارغة" : "Votre liste de favoris est vide"}
            </h3>
            <p className="text-night-400/60 text-sm mb-6">
              {isRTL
                ? "اضغط على ❤️ في أي إعلان لحفظه هنا"
                : "Cliquez sur ❤️ sur une annonce pour la retrouver ici"}
            </p>
            <Link href="/annonces" className="btn-gold inline-flex px-8 py-3">
              {isRTL ? "تصفح الإعلانات" : "Parcourir les annonces"}
              <Arrow size={16} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
