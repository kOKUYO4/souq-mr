"use client";

import { useState } from "react";
import { Filter, SlidersHorizontal, Grid, List, Search } from "lucide-react";
import ListingCard from "@/components/listings/ListingCard";
import { listings, categories } from "@/data/mockData";
import { useLanguage } from "@/context/LanguageContext";

export default function AnnoncesPage() {
  const { isRTL, locale } = useLanguage();
  const [selectedCat, setSelectedCat] = useState("all");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [filterOpen, setFilterOpen] = useState(false);
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [condition, setCondition] = useState("all");

  const filtered = listings.filter((l) => {
    if (selectedCat !== "all" && l.category !== selectedCat) return false;
    if (condition === "new" && l.condition !== "new") return false;
    if (condition === "used" && l.condition !== "used") return false;
    if (priceMin && l.price < parseInt(priceMin)) return false;
    if (priceMax && l.price > parseInt(priceMax)) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-sand-50">
      {/* Barre filtres sticky */}
      <div className="sticky top-16 z-40 bg-white border-b border-sand-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className={`flex items-center gap-3 overflow-x-auto custom-scrollbar ${isRTL ? "flex-row-reverse" : ""}`}>
            {/* Filtre tout */}
            <button
              onClick={() => setSelectedCat("all")}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                selectedCat === "all"
                  ? "text-night-500"
                  : "bg-sand-50 text-night-400 hover:bg-sand-100"
              }`}
              style={selectedCat === "all" ? { background: "linear-gradient(135deg, #C9A84C, #B8922E)", color: "#1B2A4A" } : undefined}
            >
              {isRTL ? "الكل" : "Tout"}
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCat(cat.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  selectedCat === cat.id
                    ? "text-white"
                    : "bg-sand-50 text-night-400 hover:bg-sand-100"
                }`}
                style={selectedCat === cat.id ? { background: cat.color } : undefined}
              >
                {isRTL ? cat.nameAr : cat.name}
              </button>
            ))}

            <div className="ml-auto flex-shrink-0 flex items-center gap-2">
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className="flex items-center gap-2 px-3 py-2 border border-sand-200 rounded-xl text-sm text-night-400 hover:border-sand-400 transition-all"
              >
                <SlidersHorizontal size={14} />
                {isRTL ? "فلتر" : "Filtres"}
              </button>
              <button
                onClick={() => setView(view === "grid" ? "list" : "grid")}
                className="p-2 border border-sand-200 rounded-xl text-night-400 hover:border-sand-400 transition-all"
              >
                {view === "grid" ? <List size={16} /> : <Grid size={16} />}
              </button>
            </div>
          </div>

          {/* Filtres avancés */}
          {filterOpen && (
            <div className={`mt-3 pt-3 border-t border-sand-100 flex flex-wrap gap-4 items-end ${isRTL ? "flex-row-reverse" : ""}`}>
              <div>
                <label className="text-xs text-night-400 mb-1 block">{isRTL ? "السعر الأدنى" : "Prix min (MRU)"}</label>
                <input type="number" value={priceMin} onChange={e => setPriceMin(e.target.value)} placeholder="0" className="input-field w-32 py-2 text-sm" />
              </div>
              <div>
                <label className="text-xs text-night-400 mb-1 block">{isRTL ? "السعر الأقصى" : "Prix max (MRU)"}</label>
                <input type="number" value={priceMax} onChange={e => setPriceMax(e.target.value)} placeholder="∞" className="input-field w-32 py-2 text-sm" />
              </div>
              <div>
                <label className="text-xs text-night-400 mb-1 block">{isRTL ? "الحالة" : "État"}</label>
                <select value={condition} onChange={e => setCondition(e.target.value)} className="input-field py-2 text-sm">
                  <option value="all">{isRTL ? "الكل" : "Tout"}</option>
                  <option value="new">{isRTL ? "جديد" : "Neuf"}</option>
                  <option value="used">{isRTL ? "مستعمل" : "Occasion"}</option>
                </select>
              </div>
              <button onClick={() => { setPriceMin(""); setPriceMax(""); setCondition("all"); }} className="px-4 py-2 text-sm text-night-400 hover:text-sand-500 transition-colors">
                {isRTL ? "إعادة تعيين" : "Réinitialiser"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Résultats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className={`flex items-center justify-between mb-6 ${isRTL ? "flex-row-reverse" : ""}`}>
          <p className="text-sm text-night-400">
            {filtered.length} {isRTL ? "نتيجة" : "résultats"}
          </p>
        </div>

        {filtered.length > 0 ? (
          <div className={view === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
            : "flex flex-col gap-4"
          }>
            {filtered.map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-night-500 mb-2">
              {isRTL ? "لا توجد نتائج" : "Aucune annonce trouvée"}
            </h3>
            <p className="text-night-400/60 text-sm">
              {isRTL ? "جرب تعديل الفلاتر" : "Essayez de modifier vos filtres"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
