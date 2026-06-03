"use client";

import { useLanguage } from "@/context/LanguageContext";
import IslamicPattern from "@/components/ui/IslamicPattern";
import { formatPrice, listings } from "@/data/mockData";
import Image from "next/image";

/* ── Static Ramadan data ──────────────────────────────────────────────── */

const RAMADAN_DAY = 12;

const CATEGORIES = [
  { emoji: "🌴", fr: "Dattes & Nourriture",       ar: "تمور وأطعمة",          count: 248 },
  { emoji: "👘", fr: "Vêtements Ramadan",          ar: "ملابس رمضان",           count: 193 },
  { emoji: "🪔", fr: "Lampes & Décorations",       ar: "مصابيح وزينة",          count: 137 },
  { emoji: "📖", fr: "Corans & Livres",             ar: "مصاحف وكتب",            count: 112 },
  { emoji: "🌸", fr: "Parfums",                    ar: "عطور",                  count: 89  },
  { emoji: "🕌", fr: "Tapis de prière",            ar: "سجادات الصلاة",         count: 76  },
];

const PRAYER_TIMES = [
  { key: "Fajr",    fr: "Fajr (Aube)",    ar: "الفجر",   time: "05:12" },
  { key: "Dhuhr",   fr: "Dhuhr (Midi)",   ar: "الظهر",   time: "12:48" },
  { key: "Asr",     fr: "Asr (Après-midi)", ar: "العصر",  time: "16:05" },
  { key: "Maghrib", fr: "Maghrib (Iftar)", ar: "المغرب",  time: "19:27" },
  { key: "Isha",    fr: "Isha (Nuit)",    ar: "العشاء",   time: "20:52" },
];

const PROMO_LISTINGS = listings.slice(0, 4);

/* ── Component ───────────────────────────────────────────────────────── */

export default function RamadanPage() {
  const { locale, isRTL } = useLanguage();
  const ar = locale === "ar";

  return (
    <main dir={isRTL ? "rtl" : "ltr"} className="min-h-screen bg-sand-100">

      {/* ── 1. Hero ─────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #2D1B4E 0%, #1B3A4A 60%, #0D2233 100%)" }}
      >
        <IslamicPattern opacity={0.08} />

        {/* Decorative moon glow */}
        <div
          className="absolute top-8 right-16 w-40 h-40 rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(201,168,76,0.25) 0%, transparent 70%)",
            filter: "blur(12px)",
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-6 py-20 text-center">
          {/* Crescent moon SVG */}
          <div className="flex justify-center mb-6">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden="true">
              <path
                d="M55 40C55 52.7025 44.7025 63 32 63C25.4167 63 19.4688 60.3125 15 55.9375C18.125 57.2917 21.5625 58 25.1667 58C37.8692 58 48.1667 47.7025 48.1667 35C48.1667 28.4167 45.4792 22.4688 41.1042 18C46.2083 21.5625 50.2083 26.875 52.5 33.125C54.125 35.2083 55 37.5 55 40Z"
                fill="#C9A84C"
              />
              <circle cx="62" cy="18" r="2.5" fill="#C9A84C" opacity="0.6" />
              <circle cx="68" cy="28" r="1.5" fill="#C9A84C" opacity="0.4" />
              <circle cx="58" cy="10" r="1.5" fill="#C9A84C" opacity="0.4" />
            </svg>
          </div>

          {/* Title */}
          <h1
            className={`text-4xl md:text-5xl font-bold text-white mb-3 ${ar ? "font-arabic" : "font-display"}`}
            style={{ textShadow: "0 2px 20px rgba(201,168,76,0.4)" }}
          >
            {ar ? "وضع رمضان" : "Mode Ramadan"}
          </h1>

          {/* Subtitle */}
          <p className={`text-lg md:text-xl mb-6 ${ar ? "font-arabic" : ""}`} style={{ color: "#D4B896" }}>
            {ar
              ? "أفضل العروض الخاصة لشهر رمضان المبارك على سوق.مر"
              : "Les meilleures offres spéciales du Ramadan sur SOUQ.MR"}
          </p>

          {/* Day counter badge */}
          <div
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold"
            style={{ background: "rgba(201,168,76,0.18)", border: "1px solid rgba(201,168,76,0.45)", color: "#F0D080" }}
          >
            <span>🌙</span>
            <span className={ar ? "font-arabic" : ""}>
              {ar
                ? `اليوم ${RAMADAN_DAY} من رمضان`
                : `Jour ${RAMADAN_DAY} du Ramadan`}
            </span>
          </div>
        </div>
      </section>

      {/* ── 2. Ramadan categories ────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <h2 className={`text-2xl font-bold mb-6 text-night-600 ${ar ? "font-arabic text-right" : "font-display"}`}>
          {ar ? "منتجات رمضان المميزة" : "Produits phares du Ramadan"}
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.fr}
              className="group relative overflow-hidden rounded-2xl p-5 text-center shadow-card hover:shadow-card-hover transition-all duration-200 bg-white hover:-translate-y-1 cursor-pointer"
            >
              <div className="text-4xl mb-2">{cat.emoji}</div>
              <div className={`font-semibold text-night-600 text-sm ${ar ? "font-arabic" : ""}`}>
                {ar ? cat.ar : cat.fr}
              </div>
              <div className="text-xs mt-1" style={{ color: "#B8922E" }}>
                {cat.count} {ar ? "إعلان" : "annonces"}
              </div>
              {/* Gold bottom accent */}
              <div
                className="absolute bottom-0 left-0 right-0 h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"
                style={{ background: "linear-gradient(90deg, #C9A84C, #F0D080, #C9A84C)" }}
              />
            </button>
          ))}
        </div>
      </section>

      {/* ── 3. Iftar countdown ──────────────────────────────────────── */}
      <section
        className="mx-6 md:mx-auto max-w-5xl rounded-2xl overflow-hidden mb-12 shadow-card"
        style={{ background: "linear-gradient(135deg, #2D1B4E, #1B3A4A)" }}
      >
        <div className="relative p-8 text-center">
          <IslamicPattern opacity={0.06} />
          <div className="relative z-10">
            <p className={`text-sm mb-1 ${ar ? "font-arabic" : ""}`} style={{ color: "#D4B896" }}>
              {ar ? "توقيت الإفطار" : "Compte à rebours de l'Iftar"}
            </p>
            <div
              className={`text-3xl md:text-4xl font-bold text-white mb-2 ${ar ? "font-arabic" : "font-display"}`}
              style={{ textShadow: "0 0 24px rgba(201,168,76,0.5)" }}
            >
              {ar ? "الإفطار بعد 2س 34د" : "Iftar dans 2h 34min"}
            </div>
            <p className={`text-sm ${ar ? "font-arabic" : ""}`} style={{ color: "#C9A84C" }}>
              🕌 {ar ? "نواكشوط — المغرب 19:27" : "Nouakchott — Maghrib 19:27"}
            </p>
          </div>
        </div>
      </section>

      {/* ── 4. Promotions ───────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 pb-12">
        <h2 className={`text-2xl font-bold mb-6 text-night-600 ${ar ? "font-arabic text-right" : "font-display"}`}>
          {ar ? "عروض رمضان" : "Promotions Ramadan"}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PROMO_LISTINGS.map((listing) => {
            const discountedPrice = Math.round(listing.price * 0.8);
            return (
              <div
                key={listing.id}
                className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-200 hover:-translate-y-1 cursor-pointer"
              >
                {/* Image with badge */}
                <div className="relative h-44 bg-sand-200">
                  {listing.images[0] && (
                    <Image
                      src={listing.images[0]}
                      alt={ar ? listing.titleAr : listing.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 25vw"
                    />
                  )}
                  {/* RAMADAN badge */}
                  <div
                    className="absolute top-2 left-2 px-2 py-1 rounded-lg text-xs font-bold text-white"
                    style={{ background: "linear-gradient(135deg, #2D1B4E, #4A1B6E)" }}
                  >
                    🌙 RAMADAN -20%
                  </div>
                </div>

                <div className="p-3">
                  <p className={`text-sm font-medium text-night-600 line-clamp-2 mb-2 ${ar ? "font-arabic text-right" : ""}`}>
                    {ar ? listing.titleAr : listing.title}
                  </p>
                  <div className={`flex items-center gap-2 ${ar ? "flex-row-reverse" : ""}`}>
                    <span className="text-base font-bold" style={{ color: "#B8922E" }}>
                      {formatPrice(discountedPrice)}
                    </span>
                    <span className="text-xs text-sand-400 line-through">
                      {formatPrice(listing.price)}
                    </span>
                  </div>
                  <p className={`text-xs text-sand-400 mt-1 ${ar ? "text-right font-arabic" : ""}`}>
                    📍 {ar ? listing.locationAr : listing.location}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── 5. Sadaqa & Don ─────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 pb-12">
        <div
          className="relative overflow-hidden rounded-2xl p-8 md:p-10"
          style={{ background: "linear-gradient(135deg, #C9A84C 0%, #B8922E 100%)" }}
        >
          <IslamicPattern opacity={0.07} />
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
            <div className="text-5xl shrink-0">🤲</div>
            <div className={`flex-1 ${ar ? "text-right" : ""}`}>
              <h2 className={`text-xl font-bold text-white mb-2 ${ar ? "font-arabic" : "font-display"}`}>
                {ar ? "صدقة ودعم" : "Sadaqa & Don"}
              </h2>
              <p className={`text-white/90 text-sm leading-relaxed ${ar ? "font-arabic" : ""}`}>
                {ar
                  ? "في هذا الشهر الفضيل، يمكنك تخصيص جزء من أرباح مبيعاتك للتبرع لصالح الأسر المحتاجة في موريتانيا. بارك الله فيكم."
                  : "En ce mois béni, vous pouvez dédier une partie de vos bénéfices de vente à des familles dans le besoin en Mauritanie. Que Allah vous bénisse."}
              </p>
            </div>
            <button
              className="shrink-0 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-105"
              style={{ background: "#1B2A4A", color: "#F0D080" }}
            >
              {ar ? "تبرع الآن" : "Faire un don"}
            </button>
          </div>
        </div>
      </section>

      {/* ── 6. Prayer times ─────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <h2 className={`text-2xl font-bold mb-2 text-night-600 ${ar ? "font-arabic text-right" : "font-display"}`}>
          {ar ? "أوقات الصلاة — نواكشوط" : "Horaires de prière — Nouakchott"}
        </h2>
        <p className={`text-sm text-sand-400 mb-6 ${ar ? "font-arabic text-right" : ""}`}>
          {ar ? "التوقيت المحلي لمدينة نواكشوط" : "Heure locale de Nouakchott"}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {PRAYER_TIMES.map((p) => (
            <div
              key={p.key}
              className={`rounded-2xl p-4 text-center shadow-card ${
                p.key === "Maghrib"
                  ? "text-white"
                  : "bg-white"
              }`}
              style={
                p.key === "Maghrib"
                  ? { background: "linear-gradient(135deg, #2D1B4E, #1B3A4A)" }
                  : {}
              }
            >
              <p
                className={`text-xs font-medium mb-1 ${ar ? "font-arabic" : ""}`}
                style={{ color: p.key === "Maghrib" ? "#D4B896" : "#8A7560" }}
              >
                {ar ? p.ar : p.fr}
              </p>
              <p
                className="text-xl font-bold font-display tabular-nums"
                style={{ color: p.key === "Maghrib" ? "#F0D080" : "#1B2A4A" }}
              >
                {p.time}
              </p>
              {p.key === "Maghrib" && (
                <p className={`text-xs mt-1 ${ar ? "font-arabic" : ""}`} style={{ color: "#C9A84C" }}>
                  🌙 {ar ? "الإفطار" : "Iftar"}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
