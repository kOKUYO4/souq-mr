"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, ArrowLeft, Flame } from "lucide-react";
import ListingCard from "@/components/listings/ListingCard";
import { useLanguage } from "@/context/LanguageContext";

export default function FeaturedListings() {
  const { t, isRTL } = useLanguage();
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  const [featured, setFeatured] = useState<any[]>([]);
  const [recent, setRecent] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/listings?limit=4&featured=true")
      .then((r) => r.json())
      .then(({ data }) => setFeatured(data?.listings ?? data ?? []))
      .catch(() => {});

    fetch("/api/listings?limit=8&sort=newest")
      .then((r) => r.json())
      .then(({ data }) => setRecent(data?.listings ?? data ?? []))
      .catch(() => {});
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Annonces vedettes */}
        <div className={`flex items-end justify-between mb-8 ${isRTL ? "flex-row-reverse" : ""}`}>
          <div className={isRTL ? "text-right" : ""}>
            <p className="text-sand-500 text-sm font-semibold uppercase tracking-widest mb-1 flex items-center gap-1.5">
              <Flame size={14} className="text-sand-400" />
              {isRTL ? "مميزة" : "En vedette"}
            </p>
            <h2 className="section-title">{t.listings.featured}</h2>
          </div>
          <Link
            href="/annonces"
            className={`hidden sm:flex items-center gap-1.5 text-sand-500 text-sm font-semibold hover:gap-2.5 transition-all ${isRTL ? "flex-row-reverse" : ""}`}
          >
            {t.listings.seeAll}
            <Arrow size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-14">
          {featured.map((listing) => (
            <ListingCard key={listing.id} listing={listing} featured />
          ))}
        </div>

        {/* Annonces récentes */}
        <div className={`flex items-end justify-between mb-8 ${isRTL ? "flex-row-reverse" : ""}`}>
          <div className={isRTL ? "text-right" : ""}>
            <p className="text-sand-500 text-sm font-semibold uppercase tracking-widest mb-1">
              {isRTL ? "أحدث" : "Récentes"}
            </p>
            <h2 className="section-title">{t.listings.recent}</h2>
          </div>
          <Link
            href="/annonces"
            className={`hidden sm:flex items-center gap-1.5 text-sand-500 text-sm font-semibold hover:gap-2.5 transition-all ${isRTL ? "flex-row-reverse" : ""}`}
          >
            {t.listings.seeAll}
            <Arrow size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {recent.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>

        {/* Bouton voir tout */}
        <div className="text-center mt-10">
          <Link href="/annonces" className="btn-night inline-flex px-8 py-3.5">
            {t.listings.seeAll}
            <Arrow size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
