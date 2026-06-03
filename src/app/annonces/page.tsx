"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, Grid, List, ChevronLeft, ChevronRight } from "lucide-react";
import ListingCard from "@/components/listings/ListingCard";
import { listings, categories } from "@/data/mockData";
import { useLanguage } from "@/context/LanguageContext";

const PAGE_SIZE = 8;

function AnnoncesContent() {
  const { isRTL, locale } = useLanguage();
  const searchParams = useSearchParams();
  const [selectedCat, setSelectedCat] = useState(searchParams.get("cat") || "all");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [filterOpen, setFilterOpen] = useState(false);
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [condition, setCondition] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [page, setPage] = useState(1);
  const [negotiable, setNegotiable] = useState(false);
  const [cod, setCod] = useState(false);

  const filtered = useMemo(() => {
    let items = listings.filter((l) => {
      if (selectedCat !== "all" && l.category !== selectedCat) return false;
      if (condition === "new" && l.condition !== "new") return false;
      if (condition === "used" && l.condition !== "used") return false;
      if (priceMin && l.price < parseInt(priceMin)) return false;
      if (priceMax && l.price > parseInt(priceMax)) return false;
      if (negotiable && !l.negotiable) return false;
      if (cod && !l.cod) return false;
      return true;
    });
    if (sortBy === "recent") items = [...items].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    if (sortBy === "price-asc") items = [...items].sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") items = [...items].sort((a, b) => b.price - a.price);
    if (sortBy === "popular") items = [...items].sort((a, b) => (b.views ?? 0) - (a.views ?? 0));
    return items;
  }, [selectedCat, condition, priceMin, priceMax, sortBy, negotiable, cod]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [page]);

  const handleCatChange = (cat: string) => { setSelectedCat(cat); setPage(1); };
  const activeFilterCount = [priceMin, priceMax].filter(Boolean).length + (condition !== "all" ? 1 : 0) + (negotiable ? 1 : 0) + (cod ? 1 : 0);

  return (
    <div className="min-h-screen bg-sand-50">
      {/* Barre filtres sticky */}
      <div className="sticky top-16 z-40 bg-white border-b border-sand-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className={`flex items-center gap-2 overflow-x-auto ${isRTL ? "flex-row-reverse" : ""}`}>
            <button onClick={() => handleCatChange("all")}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${selectedCat === "all" ? "text-night-500" : "bg-sand-50 text-night-400 hover:bg-sand-100"}`}
              style={selectedCat === "all" ? { background: "linear-gradient(135deg, #C9A84C, #B8922E)", color: "#1B2A4A" } : undefined}>
              {isRTL ? "الكل" : "Tout"}
            </button>
            {categories.map((cat) => (
              <button key={cat.id} onClick={() => handleCatChange(cat.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${selectedCat === cat.id ? "text-white" : "bg-sand-50 text-night-400 hover:bg-sand-100"}`}
                style={selectedCat === cat.id ? { background: cat.color } : undefined}>
                {isRTL ? cat.nameAr : cat.name}
              </button>
            ))}

            <div className={`${isRTL ? "mr-auto" : "ml-auto"} flex-shrink-0 flex items-center gap-2`}>
              {/* Sort */}
              <select value={sortBy} onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
                className="py-2 pl-3 pr-7 border border-sand-200 rounded-xl text-xs text-night-500 bg-white outline-none focus:border-sand-400 cursor-pointer">
                <option value="recent">{isRTL ? "الأحدث" : "Plus récent"}</option>
                <option value="price-asc">{isRTL ? "الأرخص" : "Prix croissant"}</option>
                <option value="price-desc">{isRTL ? "الأغلى" : "Prix décroissant"}</option>
                <option value="popular">{isRTL ? "الأكثر مشاهدة" : "Plus populaire"}</option>
              </select>
              <button onClick={() => setFilterOpen(!filterOpen)}
                className={`flex items-center gap-1.5 px-3 py-2 border rounded-xl text-xs font-semibold transition-all ${filterOpen || activeFilterCount > 0 ? "border-sand-400 bg-sand-50 text-sand-500" : "border-sand-200 text-night-400 hover:border-sand-300"}`}>
                <SlidersHorizontal size={13} />
                {isRTL ? "فلتر" : "Filtres"}
                {activeFilterCount > 0 && (
                  <span className="w-4 h-4 rounded-full text-white text-[10px] font-bold flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg, #C9A84C, #B8922E)" }}>
                    {activeFilterCount}
                  </span>
                )}
              </button>
              <button onClick={() => setView(view === "grid" ? "list" : "grid")}
                className="p-2 border border-sand-200 rounded-xl text-night-400 hover:border-sand-400 transition-all">
                {view === "grid" ? <List size={15} /> : <Grid size={15} />}
              </button>
            </div>
          </div>

          {filterOpen && (
            <div className={`mt-3 pt-3 border-t border-sand-100 flex flex-wrap gap-4 items-end ${isRTL ? "flex-row-reverse" : ""}`}>
              <div>
                <label className="text-xs text-night-400 mb-1 block">{isRTL ? "السعر الأدنى" : "Prix min (MRU)"}</label>
                <input type="number" value={priceMin} onChange={(e) => { setPriceMin(e.target.value); setPage(1); }}
                  placeholder="0" className="input-field w-32 py-2 text-sm" />
              </div>
              <div>
                <label className="text-xs text-night-400 mb-1 block">{isRTL ? "السعر الأقصى" : "Prix max (MRU)"}</label>
                <input type="number" value={priceMax} onChange={(e) => { setPriceMax(e.target.value); setPage(1); }}
                  placeholder="∞" className="input-field w-32 py-2 text-sm" />
              </div>
              <div>
                <label className="text-xs text-night-400 mb-1 block">{isRTL ? "الحالة" : "État"}</label>
                <select value={condition} onChange={(e) => { setCondition(e.target.value); setPage(1); }}
                  className="input-field py-2 text-sm">
                  <option value="all">{isRTL ? "الكل" : "Tout"}</option>
                  <option value="new">{isRTL ? "جديد" : "Neuf"}</option>
                  <option value="used">{isRTL ? "مستعمل" : "Occasion"}</option>
                </select>
              </div>
              <div className={`flex gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                <label className={`flex items-center gap-2 text-xs text-night-500 cursor-pointer ${isRTL ? "flex-row-reverse" : ""}`}>
                  <input type="checkbox" checked={negotiable} onChange={(e) => { setNegotiable(e.target.checked); setPage(1); }} className="rounded accent-sand-400" />
                  {isRTL ? "قابل للتفاوض" : "Négociable"}
                </label>
                <label className={`flex items-center gap-2 text-xs text-night-500 cursor-pointer ${isRTL ? "flex-row-reverse" : ""}`}>
                  <input type="checkbox" checked={cod} onChange={(e) => { setCod(e.target.checked); setPage(1); }} className="rounded accent-sand-400" />
                  {isRTL ? "الدفع عند الاستلام" : "Paiement à la livraison"}
                </label>
              </div>
              <button onClick={() => { setPriceMin(""); setPriceMax(""); setCondition("all"); setNegotiable(false); setCod(false); setPage(1); }}
                className="px-4 py-2 text-sm text-night-400 hover:text-sand-500 transition-colors underline">
                {isRTL ? "إعادة تعيين" : "Réinitialiser"}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className={`flex items-center justify-between mb-6 ${isRTL ? "flex-row-reverse" : ""}`}>
          <p className="text-sm text-night-400">
            <span className="font-semibold text-night-500">{filtered.length}</span>
            {" "}{isRTL ? "إعلان" : "annonces"}
            {totalPages > 1 && (
              <span className="text-night-400/50">
                {" "}— {isRTL ? `صفحة ${page} من ${totalPages}` : `page ${page}/${totalPages}`}
              </span>
            )}
          </p>
        </div>

        {paginated.length > 0 ? (
          <>
            <div className={view === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
              : "flex flex-col gap-3"}>
              {paginated.map((l) => <ListingCard key={l.id} listing={l} variant={view} />)}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className={`flex items-center justify-center gap-2 mt-10 ${isRTL ? "flex-row-reverse" : ""}`}>
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                  className="p-2 rounded-xl border border-sand-200 text-night-400 hover:border-sand-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                  {isRTL ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button key={p} onClick={() => setPage(p)}
                    className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all ${p === page ? "text-night-500 shadow-sm" : "border border-sand-200 text-night-400 hover:border-sand-400"}`}
                    style={p === page ? { background: "linear-gradient(135deg, #C9A84C, #B8922E)" } : undefined}>
                    {p}
                  </button>
                ))}
                <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  className="p-2 rounded-xl border border-sand-200 text-night-400 hover:border-sand-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                  {isRTL ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-night-500 mb-2">
              {isRTL ? "لا توجد نتائج" : "Aucune annonce trouvée"}
            </h3>
            <p className="text-night-400/60 text-sm mb-6">
              {isRTL ? "جرب تعديل الفلاتر" : "Essayez de modifier vos filtres"}
            </p>
            <button onClick={() => { setSelectedCat("all"); setCondition("all"); setPriceMin(""); setPriceMax(""); setNegotiable(false); setCod(false); setPage(1); }}
              className="btn-gold text-sm py-2.5 px-5">
              {isRTL ? "إعادة تعيين الفلاتر" : "Réinitialiser les filtres"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AnnoncesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-sand-50" />}>
      <AnnoncesContent />
    </Suspense>
  );
}
