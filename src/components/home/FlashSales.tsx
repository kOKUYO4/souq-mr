"use client";

import Link from "next/link";
import { Zap, Clock, ArrowRight, ArrowLeft, Eye } from "lucide-react";
import { listings, formatPrice } from "@/data/mockData";
import { useLanguage } from "@/context/LanguageContext";

export default function FlashSales() {
  const { isRTL, locale } = useLanguage();

  const deals = listings.filter((l) => l.originalPrice && l.originalPrice > l.price).slice(0, 6);
  if (!deals.length) return null;

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className={`flex items-center justify-between mb-8 ${isRTL ? "flex-row-reverse" : ""}`}>
          <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
              <Zap size={20} className="text-red-500" />
            </div>
            <div className={isRTL ? "text-right" : ""}>
              <h2 className={`text-2xl font-bold text-night-500 ${isRTL ? "font-arabic" : "font-display"}`}>
                {isRTL ? "عروض اليوم" : "Flash Ventes"}
              </h2>
              <div className={`flex items-center gap-1.5 text-xs text-night-400/60 mt-0.5 ${isRTL ? "flex-row-reverse" : ""}`}>
                <Clock size={11} />
                <span className={isRTL ? "font-arabic" : ""}>
                  {isRTL ? "عروض لفترة محدودة" : "Offres à durée limitée"}
                </span>
              </div>
            </div>
          </div>
          <Link
            href="/annonces"
            className={`text-sm text-sand-500 font-semibold hover:underline flex items-center gap-1 ${isRTL ? "flex-row-reverse" : ""}`}
          >
            {isRTL ? "عرض الكل" : "Tout voir"}
            {isRTL ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {deals.map((listing) => {
            const discount = Math.round(((listing.originalPrice! - listing.price) / listing.originalPrice!) * 100);
            return (
              <Link
                key={listing.id}
                href={`/annonce/${listing.id}`}
                className="group bg-white border border-sand-100 rounded-2xl overflow-hidden hover:border-sand-300 hover:shadow-card transition-all"
              >
                <div className="relative aspect-square overflow-hidden bg-sand-50">
                  <img
                    src={listing.images[0]}
                    alt={listing.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    -{discount}%
                  </span>
                </div>
                <div className="p-3">
                  <p className={`text-xs font-semibold text-night-500 line-clamp-2 mb-1.5 leading-snug ${isRTL ? "font-arabic text-right" : ""}`}>
                    {isRTL ? listing.titleAr : listing.title}
                  </p>
                  <div className={`flex flex-col ${isRTL ? "items-end" : "items-start"}`}>
                    <span className="text-sm font-bold text-red-500">{formatPrice(listing.price)} MRU</span>
                    <span className="text-[10px] text-night-400/50 line-through">
                      {formatPrice(listing.originalPrice!)} MRU
                    </span>
                  </div>
                  <div className={`flex items-center gap-1 mt-1 text-[10px] text-night-400/50 ${isRTL ? "flex-row-reverse" : ""}`}>
                    <Eye size={9} />
                    {listing.views}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
