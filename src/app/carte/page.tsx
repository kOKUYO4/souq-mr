"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { MapPin, List, Search, ArrowRight, ArrowLeft } from "lucide-react";
import { listings } from "@/data/mockData";
import { useLanguage } from "@/context/LanguageContext";
import IslamicPattern from "@/components/ui/IslamicPattern";

// Mauritanian cities with approximate x/y positions on a simplified map (0-100 scale)
const cityCoords: Record<string, { x: number; y: number; labelFr: string; labelAr: string }> = {
  "Nouakchott": { x: 14, y: 55, labelFr: "Nouakchott", labelAr: "نواكشوط" },
  "Tevragh-Zeina, Nouakchott": { x: 14, y: 54, labelFr: "Nouakchott", labelAr: "نواكشوط" },
  "Ksar, Nouakchott": { x: 14, y: 56, labelFr: "Nouakchott", labelAr: "نواكشوط" },
  "Arafat, Nouakchott": { x: 15, y: 57, labelFr: "Nouakchott", labelAr: "نواكشوط" },
  "El Mina, Nouakchott": { x: 13, y: 56, labelFr: "Nouakchott", labelAr: "نواكشوط" },
  "Ryad, Nouakchott": { x: 14, y: 55, labelFr: "Nouakchott", labelAr: "نواكشوط" },
  "Teyarett, Nouakchott": { x: 14, y: 55, labelFr: "Nouakchott", labelAr: "نواكشوط" },
  "Nouadhibou": { x: 12, y: 28, labelFr: "Nouadhibou", labelAr: "نواذيبو" },
  "Rosso": { x: 18, y: 63, labelFr: "Rosso", labelAr: "روصو" },
  "Kaédi": { x: 40, y: 67, labelFr: "Kaédi", labelAr: "قيدي" },
  "Zouerate": { x: 40, y: 22, labelFr: "Zouerate", labelAr: "زويرات" },
  "Atar": { x: 28, y: 38, labelFr: "Atar", labelAr: "أطار" },
  "Kiffa": { x: 52, y: 60, labelFr: "Kiffa", labelAr: "كيفة" },
  "Néma": { x: 82, y: 55, labelFr: "Néma", labelAr: "نيمة" },
  "Boutilimit": { x: 22, y: 57, labelFr: "Boutilimit", labelAr: "بوتيلميت" },
  "Sélibabi": { x: 55, y: 72, labelFr: "Sélibabi", labelAr: "سيلبابي" },
  "Tidjikja": { x: 50, y: 42, labelFr: "Tidjikja", labelAr: "تجكجة" },
};

function getCity(location: string) {
  for (const key of Object.keys(cityCoords)) {
    if (location.toLowerCase().includes(key.toLowerCase())) return key;
  }
  return "Nouakchott";
}

const majorCities = ["Nouakchott", "Nouadhibou", "Rosso", "Kaédi", "Zouerate", "Atar", "Kiffa", "Néma"];

export default function CartePage() {
  const { isRTL } = useLanguage();
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  const cityGroups = useMemo(() => {
    const groups: Record<string, typeof listings> = {};
    listings.forEach((l) => {
      const city = getCity(l.location);
      if (!groups[city]) groups[city] = [];
      groups[city].push(l);
    });
    return groups;
  }, []);

  const filteredListings = useMemo(() => {
    const base = selectedCity ? (cityGroups[selectedCity] || []) : listings;
    if (!search.trim()) return base;
    return base.filter((l) =>
      l.title.toLowerCase().includes(search.toLowerCase()) ||
      l.titleAr.includes(search)
    );
  }, [selectedCity, cityGroups, search]);

  return (
    <div className="min-h-screen bg-sand-50">
      {/* Header */}
      <div className="relative py-10 overflow-hidden" style={{ background: "linear-gradient(135deg, #1B2A4A, #0C1426)" }}>
        <IslamicPattern opacity={0.05} />
        <div className={`relative max-w-7xl mx-auto px-4 sm:px-6 ${isRTL ? "text-right" : ""}`}>
          <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
            <div className="w-12 h-12 rounded-2xl bg-sand-400/20 flex items-center justify-center">
              <MapPin size={22} className="text-sand-400" />
            </div>
            <div>
              <h1 className={`text-2xl font-display font-bold text-white ${isRTL ? "font-arabic" : ""}`}>
                {isRTL ? "خريطة الإعلانات" : "Carte des annonces"}
              </h1>
              <p className={`text-sand-300/70 text-sm ${isRTL ? "font-arabic" : ""}`}>
                {isRTL ? "تصفح الإعلانات حسب المنطقة" : "Parcourez les annonces par région"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Carte SVG */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-card overflow-hidden">
              <div className="p-4 border-b border-sand-100 flex items-center justify-between">
                <p className={`text-sm font-semibold text-night-500 ${isRTL ? "font-arabic text-right" : ""}`}>
                  {isRTL ? "خريطة موريتانيا" : "Carte de Mauritanie"}
                </p>
                {selectedCity && (
                  <button onClick={() => setSelectedCity(null)}
                    className="text-xs text-sand-500 hover:text-sand-600 font-semibold">
                    {isRTL ? "عرض الكل" : "Tout voir"}
                  </button>
                )}
              </div>

              <div className="relative p-2">
                <svg viewBox="0 0 100 100" className="w-full h-auto max-h-[400px]" style={{ background: "linear-gradient(135deg, #F5EDD9, #FAF6EF)" }}>
                  {/* Simplified Mauritania outline */}
                  <path
                    d="M 10,20 L 25,10 L 60,8 L 88,15 L 92,35 L 90,55 L 85,72 L 75,80 L 55,82 L 35,78 L 20,72 L 8,60 L 6,45 Z"
                    fill="#E8D9B8" stroke="#C9A84C" strokeWidth="0.5" opacity="0.6"
                  />
                  {/* Desert texture dots */}
                  {[...Array(20)].map((_, i) => (
                    <circle key={i} cx={15 + (i * 7) % 70} cy={20 + (i * 11) % 55} r="0.3" fill="#C9A84C" opacity="0.15" />
                  ))}

                  {/* City pins */}
                  {majorCities.map((city) => {
                    const coords = cityCoords[city];
                    const count = cityGroups[city]?.length || 0;
                    const isSelected = selectedCity === city;
                    const isHov = hovered === city;
                    const size = Math.max(3, Math.min(8, 3 + count * 0.3));

                    return (
                      <g key={city} style={{ cursor: "pointer" }}
                        onClick={() => setSelectedCity(isSelected ? null : city)}
                        onMouseEnter={() => setHovered(city)}
                        onMouseLeave={() => setHovered(null)}>
                        {/* Shadow */}
                        <circle cx={coords.x} cy={coords.y + 0.5} r={size} fill="rgba(0,0,0,0.1)" />
                        {/* Pin circle */}
                        <circle
                          cx={coords.x} cy={coords.y} r={size}
                          fill={isSelected ? "#C9A84C" : isHov ? "#E8C96A" : "#1B2A4A"}
                          stroke="white" strokeWidth="1"
                        />
                        {/* Count */}
                        {count > 0 && (
                          <text x={coords.x} y={coords.y + 1.2} textAnchor="middle"
                            fontSize="2.5" fill="white" fontWeight="bold">
                            {count}
                          </text>
                        )}
                        {/* Label */}
                        {(isSelected || isHov) && (
                          <text x={coords.x} y={coords.y - size - 1} textAnchor="middle"
                            fontSize="2.8" fill="#1B2A4A" fontWeight="bold">
                            {coords.labelFr}
                          </text>
                        )}
                      </g>
                    );
                  })}
                </svg>

                <p className="text-center text-xs text-night-400/40 mt-2 pb-2">
                  {isRTL ? "انقر على مدينة لتصفية الإعلانات" : "Cliquez sur une ville pour filtrer les annonces"}
                </p>
              </div>
            </div>

            {/* Légende */}
            <div className={`flex flex-wrap gap-3 mt-4 ${isRTL ? "flex-row-reverse" : ""}`}>
              {majorCities.map((city) => {
                const coords = cityCoords[city];
                const count = cityGroups[city]?.length || 0;
                const isSelected = selectedCity === city;
                return (
                  <button key={city} onClick={() => setSelectedCity(isSelected ? null : city)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${isSelected ? "text-night-500" : "bg-white text-night-400 hover:bg-sand-100"}`}
                    style={isSelected ? { background: "linear-gradient(135deg, #C9A84C, #B8922E)" } : undefined}>
                    <MapPin size={10} />
                    {isRTL ? coords.labelAr : coords.labelFr}
                    {count > 0 && <span className={`${isSelected ? "text-night-600" : "text-sand-400"} font-bold`}>({count})</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Liste annonces */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-card overflow-hidden h-full flex flex-col">
              <div className="p-4 border-b border-sand-100">
                <div className={`flex items-center justify-between mb-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                    <List size={15} className="text-sand-400" />
                    <span className="text-sm font-semibold text-night-500">
                      {selectedCity
                        ? (isRTL ? cityCoords[selectedCity]?.labelAr : selectedCity)
                        : (isRTL ? "جميع المناطق" : "Toutes les villes")}
                    </span>
                    <span className="text-xs text-night-400/50">({filteredListings.length})</span>
                  </div>
                </div>
                <div className="relative">
                  <input value={search} onChange={(e) => setSearch(e.target.value)}
                    placeholder={isRTL ? "بحث..." : "Rechercher..."}
                    dir={isRTL ? "rtl" : "ltr"}
                    className="w-full input-field py-2 text-sm pl-9" />
                  <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-sand-300" />
                </div>
              </div>

              <div className="overflow-y-auto flex-1 max-h-[480px]">
                {filteredListings.length === 0 ? (
                  <div className="text-center py-12">
                    <p className={`text-night-400/50 text-sm ${isRTL ? "font-arabic" : ""}`}>
                      {isRTL ? "لا توجد إعلانات" : "Aucune annonce"}
                    </p>
                  </div>
                ) : (
                  filteredListings.slice(0, 20).map((l) => (
                    <Link key={l.id} href={`/annonce/${l.id}`}
                      className={`flex items-center gap-3 p-4 border-b border-sand-50 hover:bg-sand-50 transition-colors ${isRTL ? "flex-row-reverse" : ""}`}>
                      <img src={l.images[0]} alt="" className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                      <div className={`flex-1 min-w-0 ${isRTL ? "text-right" : ""}`}>
                        <p className={`text-sm font-semibold text-night-500 truncate ${isRTL ? "font-arabic" : ""}`}>
                          {isRTL ? l.titleAr : l.title}
                        </p>
                        <div className={`flex items-center gap-1 mt-0.5 ${isRTL ? "flex-row-reverse" : ""}`}>
                          <MapPin size={10} className="text-sand-400 flex-shrink-0" />
                          <p className="text-xs text-night-400/60 truncate">{l.location}</p>
                        </div>
                        <p className="text-xs font-bold text-sand-500 mt-0.5">{l.price.toLocaleString()} MRU</p>
                      </div>
                      <Arrow size={14} className="text-sand-300 flex-shrink-0" />
                    </Link>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
