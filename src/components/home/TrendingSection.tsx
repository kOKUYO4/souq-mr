"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { TrendingUp, ArrowRight, ArrowLeft, Eye, Flame } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface TrendingListing {
  id: string;
  title: string;
  titleAr: string;
  price: number;
  images: string[];
  views: number;
}

const formatPrice = (p: number) => new Intl.NumberFormat("fr-MR", { style: "decimal", maximumFractionDigits: 0 }).format(p);

export default function TrendingSection() {
  const { isRTL } = useLanguage();
  const Arrow = isRTL ? ArrowLeft : ArrowRight;
  const [trending, setTrending] = useState<TrendingListing[]>([]);

  useEffect(() => {
    fetch("/api/listings?limit=8&sort=popular")
      .then((r) => r.ok ? r.json() : { listings: [] })
      .then((data) => setTrending(data.listings ?? data ?? []))
      .catch(() => {});
  }, []);

  return (
    <section className="py-12 bg-night-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className={`flex items-center justify-between mb-6 ${isRTL ? "flex-row-reverse" : ""}`}>
          <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
            <TrendingUp size={18} className="text-sand-400" />
            <div className={isRTL ? "text-right" : ""}>
              <p className="text-xs text-sand-400/60 uppercase tracking-widest font-semibold">
                {isRTL ? "الأكثر مشاهدة اليوم" : "Tendances du jour"}
              </p>
              <h2 className={`text-lg font-bold text-white ${isRTL ? "font-arabic" : "font-display"}`}>
                {isRTL ? "إعلانات رائجة" : "Ce qui buzze"}
              </h2>
            </div>
          </div>
          <Link href="/annonces?sort=popular"
            className={`flex items-center gap-1 text-sand-400 text-xs font-semibold hover:text-sand-300 transition-colors ${isRTL ? "flex-row-reverse" : ""}`}>
            {isRTL ? "عرض الكل" : "Tout voir"}
            <Arrow size={13} />
          </Link>
        </div>

        <div className="overflow-x-auto scrollbar-hide">
          <div className={`flex gap-3 pb-2 ${isRTL ? "flex-row-reverse" : ""}`}>
            {trending.map((l, i) => (
              <Link
                key={l.id}
                href={`/annonce/${l.id}`}
                className="flex-shrink-0 w-44 bg-night-600/40 border border-night-400/30 rounded-2xl overflow-hidden hover:bg-night-600/70 transition-all group"
              >
                <div className="relative">
                  <img src={l.images[0]} alt="" className="w-full h-28 object-cover" />
                  <div className="absolute top-2 left-2 flex items-center gap-1 px-1.5 py-0.5 rounded-lg bg-black/50 backdrop-blur-sm text-white text-[10px] font-bold">
                    <Flame size={9} className="text-orange-400" />
                    #{i + 1}
                  </div>
                  <div className="absolute bottom-2 right-2 flex items-center gap-1 px-1.5 py-0.5 rounded-lg bg-black/50 backdrop-blur-sm text-white text-[10px]">
                    <Eye size={9} />
                    {l.views}
                  </div>
                </div>
                <div className={`p-3 ${isRTL ? "text-right" : ""}`}>
                  <p className={`text-xs font-semibold text-white line-clamp-2 leading-snug mb-1.5 group-hover:text-sand-300 transition-colors ${isRTL ? "font-arabic" : ""}`}>
                    {isRTL ? l.titleAr : l.title}
                  </p>
                  <p className="text-sand-400 text-xs font-bold">{formatPrice(l.price)} MRU</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
