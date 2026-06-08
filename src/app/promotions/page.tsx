"use client";

import { useState, useEffect } from "react";
import { Zap, Clock, Tag, TrendingDown, ArrowRight, ArrowLeft, Flame } from "lucide-react";
import Link from "next/link";
import IslamicPattern from "@/components/ui/IslamicPattern";
import { useLanguage } from "@/context/LanguageContext";
import ListingCard from "@/components/listings/ListingCard";

function formatPrice(n: number) { return n?.toLocaleString() ?? "0"; }

function useCountdown(endHour: number) {
  const [time, setTime] = useState({ h: 0, m: 0, s: 0 });
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const end = new Date();
      end.setHours(endHour, 0, 0, 0);
      if (now > end) end.setDate(end.getDate() + 1);
      const diff = end.getTime() - now.getTime();
      setTime({
        h: Math.floor(diff / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [endHour]);
  return time;
}

export default function PromotionsPage() {
  const { isRTL, locale } = useLanguage();
  const flashTime = useCountdown(12);
  const weekTime = useCountdown(18);
  const Arrow = isRTL ? ArrowLeft : ArrowRight;
  const [listings, setListings] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/listings?limit=12")
      .then((r) => r.json())
      .then((json) => setListings(json.data?.listings ?? json.listings ?? []))
      .catch(() => {});
  }, []);

  const pad = (n: number) => n.toString().padStart(2, "0");

  const dealOfDay = listings.find((l) => l.original_price && l.original_price > l.price) ?? listings[0];
  const flashDeals = listings.filter((l) => l.original_price && l.original_price > l.price).slice(0, 6);
  const weekDeals = listings.filter((l) => l.featured).slice(0, 8);
  const clearanceItems = listings
    .filter((l) => l.condition === "used")
    .slice(0, 4);

  if (!dealOfDay) return (
    <div className="min-h-screen bg-sand-gradient flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-sand-200 border-t-sand-400 rounded-full animate-spin" />
    </div>
  );
  const dealDiscount = dealOfDay.original_price
    ? Math.round(((dealOfDay.original_price - dealOfDay.price) / dealOfDay.original_price) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-sand-gradient">
      {/* Header */}
      <div className="relative py-14 overflow-hidden bg-night-500">
        <IslamicPattern opacity={0.05} />
        <div className={`relative max-w-5xl mx-auto px-4 sm:px-6 text-center ${isRTL ? "font-arabic" : ""}`}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-500/20 rounded-full text-red-400 text-sm font-bold mb-4">
            <Flame size={16} />
            {isRTL ? "عروض حصرية" : "Offres exclusives"}
          </div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">
            {isRTL ? "تخفيضات اليوم" : "Promotions du jour"}
          </h1>
          <p className="text-sand-300/70 text-sm">
            {isRTL ? "أفضل الأسعار على نقطة.مر — تحديث يومي" : "Les meilleurs prix sur NUQTA.MR — mise à jour quotidienne"}
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-12">
        {/* Deal of the Day */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-card">
          <div className="p-4 text-center" style={{ background: "linear-gradient(135deg, #1B2A4A, #2D3E6A)" }}>
            <div className={`flex items-center justify-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
              <Zap size={16} className="text-sand-400" />
              <span className={`text-sand-300 text-sm font-bold ${isRTL ? "font-arabic" : ""}`}>
                {isRTL ? "صفقة اليوم" : "Affaire du jour"}
              </span>
              <span className="text-sand-400/50">•</span>
              <span className={`flex items-center gap-2 text-sand-300 text-sm ${isRTL ? "flex-row-reverse" : ""}`}>
                <Clock size={14} />
                {pad(flashTime.h)}:{pad(flashTime.m)}:{pad(flashTime.s)}
              </span>
            </div>
          </div>
          <div className={`flex flex-col sm:flex-row gap-6 p-6 ${isRTL ? "sm:flex-row-reverse" : ""}`}>
            <div className="relative sm:w-64 flex-shrink-0">
              <img src={dealOfDay.images?.[0]} alt="" className="w-full sm:w-64 h-48 object-cover rounded-2xl" />
              <div className="absolute top-3 left-3 px-3 py-1 rounded-xl text-sm font-bold text-white"
                style={{ background: "linear-gradient(135deg, #E53E3E, #C53030)" }}>
                -{dealDiscount}%
              </div>
            </div>
            <div className={`flex-1 flex flex-col justify-center ${isRTL ? "text-right" : ""}`}>
              <p className="text-xs font-semibold text-sand-500 uppercase tracking-wider mb-2">
                {isRTL ? (dealOfDay.title_ar || dealOfDay.titleAr || "").slice(0, 20) : dealOfDay.category}
              </p>
              <h2 className={`text-xl font-display font-bold text-night-500 mb-3 ${isRTL ? "font-arabic" : ""}`}>
                {isRTL ? (dealOfDay.title_ar || dealOfDay.titleAr) : dealOfDay.title}
              </h2>
              <p className={`text-sm text-night-400/70 mb-4 line-clamp-2 ${isRTL ? "font-arabic" : ""}`}>
                {isRTL ? (dealOfDay.description_ar || dealOfDay.descriptionAr) : dealOfDay.description}
              </p>
              <div className={`flex items-center gap-3 mb-5 ${isRTL ? "flex-row-reverse" : ""}`}>
                <span className="text-2xl font-display font-bold text-sand-500">{formatPrice(dealOfDay.price)} MRU</span>
                {dealOfDay.original_price && (
                  <span className="text-base text-night-400/40 line-through">{formatPrice(dealOfDay.original_price)} MRU</span>
                )}
              </div>
              <Link href={`/annonce/${dealOfDay.id}`}
                className={`btn-gold w-fit gap-2 ${isRTL ? "flex-row-reverse self-end font-arabic" : ""}`}>
                {isRTL ? "احصل على العرض" : "Saisir l'offre"}
                <Arrow size={16} />
              </Link>
            </div>
          </div>
        </div>

        {/* Flash deals */}
        {flashDeals.length > 0 && (
          <div>
            <div className={`flex items-center justify-between mb-5 ${isRTL ? "flex-row-reverse" : ""}`}>
              <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                <div className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center">
                  <Zap size={16} className="text-red-500" />
                </div>
                <h2 className={`font-bold text-night-500 ${isRTL ? "font-arabic" : ""}`}>
                  {isRTL ? "تخفيضات سريعة" : "Ventes flash"}
                </h2>
                <div className={`flex items-center gap-1 text-xs text-red-500 font-bold ${isRTL ? "flex-row-reverse" : ""}`}>
                  <Clock size={12} />
                  {pad(flashTime.h)}:{pad(flashTime.m)}:{pad(flashTime.s)}
                </div>
              </div>
              <Link href="/annonces?sort=promo" className={`flex items-center gap-1 text-sm text-sand-500 font-semibold hover:text-sand-600 ${isRTL ? "flex-row-reverse font-arabic" : ""}`}>
                {isRTL ? "عرض الكل" : "Voir tout"}
                <Arrow size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {flashDeals.slice(0, 4).map((l) => <ListingCard key={l.id} listing={l} />)}
            </div>
          </div>
        )}

        {/* Weekly promotions */}
        <div>
          <div className={`flex items-center justify-between mb-5 ${isRTL ? "flex-row-reverse" : ""}`}>
            <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "#C9A84C20" }}>
                <Tag size={16} className="text-sand-500" />
              </div>
              <h2 className={`font-bold text-night-500 ${isRTL ? "font-arabic" : ""}`}>
                {isRTL ? "عروض الأسبوع" : "Promotions de la semaine"}
              </h2>
              <div className={`flex items-center gap-1 text-xs text-sand-500 font-bold ${isRTL ? "flex-row-reverse" : ""}`}>
                <Clock size={12} />
                {pad(weekTime.h)}:{pad(weekTime.m)}:{pad(weekTime.s)}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {weekDeals.map((l) => <ListingCard key={l.id} listing={l} />)}
          </div>
        </div>

        {/* Clearance/destockage */}
        <div>
          <div className={`flex items-center gap-2 mb-5 ${isRTL ? "flex-row-reverse" : ""}`}>
            <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center">
              <TrendingDown size={16} className="text-purple-500" />
            </div>
            <h2 className={`font-bold text-night-500 ${isRTL ? "font-arabic" : ""}`}>
              {isRTL ? "تصفية المخزون" : "Déstockage"}
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {clearanceItems.map((l) => (
              <Link key={l.id} href={`/annonce/${l.id}`}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-card transition-all group">
                <div className="relative h-32">
                  <img src={l.images?.[0]} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-night-500/50 to-transparent" />
                  {l.original_price && (
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded-lg text-xs font-bold text-white bg-purple-500">
                      -{Math.round(((l.original_price - l.price) / l.original_price) * 100)}%
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p className={`text-xs font-semibold text-night-500 line-clamp-1 mb-1 ${isRTL ? "font-arabic" : ""}`}>
                    {isRTL ? (l.title_ar || l.titleAr) : l.title}
                  </p>
                  <p className="text-sm font-bold text-sand-500">{formatPrice(l.price)} <span className="text-xs text-night-400/60">MRU</span></p>
                  {l.original_price && (
                    <p className="text-xs text-night-400/40 line-through">{formatPrice(l.original_price)} MRU</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* CTA subscribe to alerts */}
        <div className={`bg-night-500 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-5 ${isRTL ? "sm:flex-row-reverse" : ""}`}>
          <div className={`flex-1 ${isRTL ? "text-right" : ""}`}>
            <p className={`font-bold text-white mb-1 ${isRTL ? "font-arabic" : ""}`}>
              {isRTL ? "لا تفوّت أي عرض!" : "Ne ratez plus aucune promo !"}
            </p>
            <p className={`text-sm text-sand-300/70 ${isRTL ? "font-arabic" : ""}`}>
              {isRTL ? "فعّل التنبيهات وكن أول من يعلم بالتخفيضات الجديدة" : "Activez les alertes et soyez le premier informé des nouvelles promotions"}
            </p>
          </div>
          <Link href="/alertes" className="btn-gold text-sm flex-shrink-0">
            {isRTL ? "تفعيل التنبيهات" : "Activer les alertes"}
          </Link>
        </div>
      </div>
    </div>
  );
}
