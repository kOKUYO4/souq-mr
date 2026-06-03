"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Search, Filter } from "lucide-react";
import ListingCard from "@/components/listings/ListingCard";
import { listings } from "@/data/mockData";
import { useLanguage } from "@/context/LanguageContext";

function SearchResults() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";
  const { isRTL } = useLanguage();

  const results = listings.filter((l) =>
    l.title.toLowerCase().includes(q.toLowerCase()) ||
    l.titleAr.includes(q) ||
    l.description.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-sand-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className={`flex items-center gap-3 mb-8 ${isRTL ? "flex-row-reverse" : ""}`}>
          <div className="flex-1 relative">
            <input
              type="text"
              defaultValue={q}
              placeholder={isRTL ? "ابحث في سوق.مر..." : "Rechercher sur SOUQ.MR..."}
              className="w-full input-field pl-10"
            />
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-sand-300" />
          </div>
          <button className="btn-outline px-4 py-3 text-sm flex items-center gap-2">
            <Filter size={16} />
            {isRTL ? "فلتر" : "Filtres"}
          </button>
        </div>

        {q && (
          <p className={`text-sm text-night-400/60 mb-6 ${isRTL ? "text-right" : ""}`}>
            {results.length} {isRTL ? `نتيجة لـ "${q}"` : `résultats pour "${q}"`}
          </p>
        )}

        {results.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {results.map((l) => <ListingCard key={l.id} listing={l} />)}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-night-500 mb-2">
              {isRTL ? "لا توجد نتائج" : "Aucun résultat"}
            </h3>
            <p className="text-night-400/60 text-sm">
              {isRTL ? `لم يتم العثور على نتائج لـ "${q}"` : `Aucune annonce trouvée pour "${q}"`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function RecherchePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-sand-50 flex items-center justify-center"><div className="text-sand-400">Chargement...</div></div>}>
      <SearchResults />
    </Suspense>
  );
}
