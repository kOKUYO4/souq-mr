"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, ArrowRight, ArrowLeft } from "lucide-react";
import ListingCard from "@/components/listings/ListingCard";
import { useLanguage } from "@/context/LanguageContext";
type Listing = {
  id: string;
  title: string;
  titleAr: string;
  price: number;
  originalPrice?: number;
  category: string;
  location: string;
  locationAr: string;
  images: string[];
  condition: "new" | "used" | "tbh";
  negotiable: boolean;
  cod: boolean;
  featured: boolean;
  views: number;
  createdAt: string;
  seller: { id: string; name: string; nameAr: string; avatar: string; badge: "verified" | "pro" | "regular"; rating: number; reviews: number; listings: number; joinedAt: string; phone: string; responseTime?: string };
  description: string;
  descriptionAr: string;
  attributes?: Record<string, string>;
  subcategory: string;
};

export default function FavorisPage() {
  const { isRTL } = useLanguage();
  const Arrow = isRTL ? ArrowLeft : ArrowRight;
  const [favListings, setFavListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = typeof window !== "undefined"
      ? localStorage.getItem("nuqta-token") || ""
      : "";
    fetch("/api/favorites", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      credentials: "include",
    })
      .then((res) => res.json())
      .then((json) => {
        const items: { listing: Listing }[] = json.data ?? json ?? [];
        setFavListings(items.map((item) => item.listing).filter(Boolean));
      })
      .catch(() => setFavListings([]))
      .finally(() => setLoading(false));
  }, []);

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
        {loading ? (
          <div className="text-center py-20 text-night-400/60 text-sm">
            {isRTL ? "جاري التحميل..." : "Chargement..."}
          </div>
        ) : favListings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {favListings.map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
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
