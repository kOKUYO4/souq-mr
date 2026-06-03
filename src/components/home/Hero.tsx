"use client";

import { useState } from "react";
import { Search, MapPin, Tag, ChevronDown, TrendingUp, Shield, Truck } from "lucide-react";
import IslamicPattern from "@/components/ui/IslamicPattern";
import { useLanguage } from "@/context/LanguageContext";

const popularSearches = {
  fr: ["iPhone 15", "Toyota Hilux", "Daraa", "Oud", "MacBook", "Télé Samsung"],
  ar: ["آيفون 15", "تويوتا هايلوكس", "دراعة", "عود", "ماك بوك", "تلفاز سامسونج"],
};

const cities = {
  fr: ["Toute la Mauritanie", "Nouakchott", "Nouadhibou", "Rosso", "Kaédi", "Zouerate"],
  ar: ["كل موريتانيا", "نواكشوط", "نواذيبو", "روصو", "قيدي", "زويرات"],
};

const stats = [
  { icon: Tag, value: "24K+", labelFr: "Annonces actives", labelAr: "إعلان نشط" },
  { icon: Shield, value: "8K+", labelFr: "Vendeurs vérifiés", labelAr: "بائع موثق" },
  { icon: Truck, value: "15", labelFr: "Villes couvertes", labelAr: "مدينة مغطاة" },
];

export default function Hero() {
  const { t, isRTL, locale } = useLanguage();
  const [query, setQuery] = useState("");
  const [city, setCity] = useState(cities[locale][0]);
  const [cityOpen, setCityOpen] = useState(false);

  const searches = popularSearches[locale];
  const cityList = cities[locale];

  return (
    <section
      className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0C1426 0%, #1B2A4A 40%, #1F3560 70%, #1B2A4A 100%)" }}
    >
      <IslamicPattern opacity={0.05} />

      {/* Dunes décoratives en bas */}
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none overflow-hidden">
        <svg viewBox="0 0 1440 120" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="absolute bottom-0 w-full h-full">
          <path d="M0,80 C240,20 480,100 720,60 C960,20 1200,90 1440,50 L1440,120 L0,120 Z" fill="#FAF6EF" opacity="0.08" />
          <path d="M0,100 C360,40 720,110 1080,70 C1260,50 1380,90 1440,80 L1440,120 L0,120 Z" fill="#FAF6EF" opacity="0.05" />
          <path d="M0,120 C400,80 800,120 1200,90 L1440,100 L1440,120 L0,120 Z" fill="#FAF6EF" />
        </svg>
      </div>

      {/* Éclat lumineux doré */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%)" }} />

      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 text-center py-20 pt-32">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-sand-400/30 bg-sand-400/10 text-sand-300 text-sm mb-8 animate-fade-in">
          <span className="w-2 h-2 bg-sand-400 rounded-full animate-pulse"></span>
          {t.hero.badge}
        </div>

        {/* Titre principal */}
        <h1
          className={`text-4xl sm:text-5xl md:text-6xl font-display font-bold text-white mb-6 leading-tight ${isRTL ? "font-arabic" : ""}`}
          dir={isRTL ? "rtl" : "ltr"}
        >
          {t.hero.title}{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #C9A84C 0%, #E8C96A 50%, #B8922E 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {t.hero.titleHighlight}
          </span>
          <br />
          <span className="text-sand-100">{t.hero.titleEnd}</span>
        </h1>

        {/* Sous-titre */}
        <p
          className={`text-lg text-sand-300/80 mb-10 max-w-2xl mx-auto leading-relaxed ${isRTL ? "font-arabic" : ""}`}
          dir={isRTL ? "rtl" : "ltr"}
        >
          {t.hero.subtitle}
        </p>

        {/* Barre de recherche principale */}
        <div className="bg-white/95 backdrop-blur rounded-2xl p-2 shadow-gold-lg max-w-3xl mx-auto mb-6">
          <div className={`flex flex-col sm:flex-row items-stretch gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
            {/* Sélecteur ville */}
            <div className="relative sm:w-44 flex-shrink-0">
              <button
                onClick={() => setCityOpen(!cityOpen)}
                className={`w-full flex items-center gap-2 px-3 py-3 text-sm text-night-500 border-b sm:border-b-0 sm:border-r border-sand-200 font-medium ${isRTL ? "flex-row-reverse justify-end" : ""}`}
              >
                <MapPin size={16} className="text-sand-400 flex-shrink-0" />
                <span className="truncate">{city}</span>
                <ChevronDown size={14} className={`ml-auto flex-shrink-0 transition-transform ${cityOpen ? "rotate-180" : ""}`} />
              </button>
              {cityOpen && (
                <div className={`absolute top-full mt-1 ${isRTL ? "right-0" : "left-0"} w-52 bg-white rounded-xl shadow-card-hover border border-sand-100 z-20 overflow-hidden`}>
                  {cityList.map((c) => (
                    <button
                      key={c}
                      onClick={() => { setCity(c); setCityOpen(false); }}
                      className={`w-full px-4 py-2.5 text-sm text-night-500 hover:bg-sand-50 transition-colors ${isRTL ? "text-right" : "text-left"} ${c === city ? "text-sand-500 font-semibold" : ""}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Champ texte */}
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.hero.searchPlaceholder}
              dir={isRTL ? "rtl" : "ltr"}
              className={`flex-1 px-4 py-3 text-night-500 placeholder-sand-300 outline-none text-sm ${isRTL ? "font-arabic" : ""}`}
              onKeyDown={(e) => e.key === "Enter" && query && window.location.assign(`/recherche?q=${query}`)}
            />

            {/* Bouton rechercher */}
            <button
              onClick={() => query && window.location.assign(`/recherche?q=${encodeURIComponent(query)}`)}
              className="btn-gold rounded-xl px-6 py-3 text-sm font-semibold whitespace-nowrap"
            >
              <Search size={16} />
              {t.hero.searchBtn}
            </button>
          </div>
        </div>

        {/* Recherches populaires */}
        <div className={`flex flex-wrap items-center justify-center gap-2 mb-14 ${isRTL ? "flex-row-reverse" : ""}`}>
          <span className="text-xs text-sand-400/70">
            {isRTL ? "البحث الشائع:" : "Populaire :"}
          </span>
          {searches.map((s) => (
            <button
              key={s}
              onClick={() => window.location.assign(`/recherche?q=${encodeURIComponent(s)}`)}
              className="px-3 py-1 rounded-full text-xs text-sand-300 border border-sand-400/20 hover:border-sand-400/60 hover:text-sand-400 transition-all bg-night-600/30 hover:bg-night-600/50"
            >
              {s}
            </button>
          ))}
        </div>

        {/* Statistiques */}
        <div className={`flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16 ${isRTL ? "sm:flex-row-reverse" : ""}`}>
          {stats.map(({ icon: Icon, value, labelFr, labelAr }, i) => (
            <div key={i} className={`flex flex-col items-center gap-1 ${isRTL ? "font-arabic" : ""}`}>
              <div className="flex items-center gap-2">
                <Icon size={16} className="text-sand-400" />
                <span className="text-2xl font-bold text-white font-display">{value}</span>
              </div>
              <span className="text-xs text-sand-400/70 uppercase tracking-wide">
                {isRTL ? labelAr : labelFr}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
