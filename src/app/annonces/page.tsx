"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, Grid, List, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import ListingCard from "@/components/listings/ListingCard";
import { categories } from "@/data/mockData";
import { useLanguage } from "@/context/LanguageContext";

const PAGE_SIZE = 24;

function AnnoncesContent() {
  const { isRTL, locale } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();
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

  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const fetchListings = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (selectedCat && selectedCat !== "all") params.set("category", selectedCat);
    if (condition && condition !== "all") params.set("condition", condition);
    if (priceMin) params.set("min_price", priceMin);
    if (priceMax) params.set("max_price", priceMax);
    if (sortBy) params.set("sort", sortBy);
    params.set("limit", String(PAGE_SIZE));
    params.set("offset", String((page - 1) * PAGE_SIZE));

    const res = await fetch(`/api/listings?${params}`);
    const { data } = await res.json();
    setListings(data?.listings ?? data ?? []);
    setTotal(data?.total ?? 0);
    setLoading(false);
  };

  useEffect(() => { fetchListings(); }, [selectedCat, condition, priceMin, priceMax, sortBy, page]);

  const totalPages = Math.ceil(total / PAGE_SIZE) || 1;
  const paginated = listings;

  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [page]);

  const handleCatChange = (cat: string) => { setSelectedCat(cat); setPage(1); };
  const activeFilterCount = [priceMin, priceMax].filter(Boolean).length + (condition !== "all" ? 1 : 0) + (negotiable ? 1 : 0) + (cod ? 1 : 0);
  const displayTotal = total || listings.length;

  return (
    <div className="min-h-screen bg-sand-50">
      {/* Mini hero */}
      <div className="relative py-8 overflow-hidden" style={{ background: "linear-gradient(135deg, #1B2A4A, #0C1426)" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h1 className={`text-2xl font-display font-bold text-white mb-3 ${isRTL ? "font-arabic" : ""}`}>
            {isRTL ? "تصفح الإعلانات" : "Toutes les annonces"}
          </h1>
          <div className="relative">
            <input type="text" placeholder={isRTL ? "ابحث في الإعلانات..." : "Rechercher dans les annonces..."}
              dir={isRTL ? "rtl" : "ltr"}
              className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-xl px-5 py-3 pr-12 text-sm outline-none focus:border-sand-400/60 transition-colors"
              onKeyDown={(e) => {
                const val = (e.target as HTMLInputElement).value;
                if (e.key === "Enter" && val) router.push(`/recherche?q=${encodeURIComponent(val)}`);
              }} />
            <Search size={16} className={`absolute top-1/2 -translate-y-1/2 text-white/40 ${isRTL ? "left-4" : "right-4"}`} />
          </div>
        </div>
      </div>

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
            <span className="font-semibold text-night-500">{displayTotal}</span>
            {" "}{isRTL ? "إعلان" : "annonces"}
            {selectedCat !== "all" && (() => {
              const cat = categories.find(c => c.id === selectedCat);
              return cat ? <span className="text-sand-500 font-medium"> — {isRTL ? cat.nameAr : cat.name}</span> : null;
            })()}
            {totalPages > 1 && (
              <span className="text-night-400/50">
                {" "}— {isRTL ? `صفحة ${page} من ${totalPages}` : `page ${page}/${totalPages}`}
              </span>
            )}
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-sand-200 border-t-sand-400 rounded-full animate-spin" />
          </div>
        ) : paginated.length > 0 ? (
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
