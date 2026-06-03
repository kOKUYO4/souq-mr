"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Grid, List, ArrowLeft, ArrowRight, ChevronRight } from "lucide-react";
import { categories, listings } from "@/data/mockData";
import ListingCard from "@/components/listings/ListingCard";
import FilterSidebar, { FilterState, defaultFilters } from "@/components/listings/FilterSidebar";
import IslamicPattern from "@/components/ui/IslamicPattern";
import { useLanguage } from "@/context/LanguageContext";

const SORT_OPTIONS = {
  fr: [
    { value: "recent", label: "Plus récentes" },
    { value: "price_asc", label: "Prix croissant" },
    { value: "price_desc", label: "Prix décroissant" },
    { value: "popular", label: "Populaires" },
  ],
  ar: [
    { value: "recent", label: "الأحدث" },
    { value: "price_asc", label: "السعر تصاعدي" },
    { value: "price_desc", label: "السعر تنازلي" },
    { value: "popular", label: "الأكثر مشاهدة" },
  ],
};

const PAGE_SIZE = 6;

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const { isRTL, locale } = useLanguage();
  const [view, setView] = useState<"grid" | "list">("grid");
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [sort, setSort] = useState("recent");
  const [subcat, setSubcat] = useState("all");
  const [page, setPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const category = categories.find((c) => c.id === slug) || categories[0];
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  /* Filtrage + tri */
  const filtered = useMemo(() => {
    let result = listings.filter((l) => l.category === category.id);
    if (subcat !== "all") result = result.filter((l) => l.subcategory === subcat);
    if (filters.condition !== "all") result = result.filter((l) => l.condition === filters.condition);
    if (filters.priceMin) result = result.filter((l) => l.price >= parseInt(filters.priceMin));
    if (filters.priceMax) result = result.filter((l) => l.price <= parseInt(filters.priceMax));
    if (filters.negotiable) result = result.filter((l) => l.negotiable);
    if (filters.cod) result = result.filter((l) => l.cod);
    if (filters.location) result = result.filter((l) => l.location.toLowerCase().includes(filters.location.toLowerCase()));
    if (filters.marque) result = result.filter((l) => l.attributes?.marque === filters.marque);
    if (filters.carburant) result = result.filter((l) => l.attributes?.carburant === filters.carburant);
    if (filters.taille) result = result.filter((l) => l.attributes?.taille?.includes(filters.taille as string));

    switch (sort) {
      case "price_asc": return [...result].sort((a, b) => a.price - b.price);
      case "price_desc": return [...result].sort((a, b) => b.price - a.price);
      case "popular": return [...result].sort((a, b) => b.views - a.views);
      default: return [...result].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  }, [category.id, subcat, filters, sort]);

  const paginated = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = paginated.length < filtered.length;

  return (
    <div className="min-h-screen bg-sand-50">
      {/* Hero catégorie */}
      <div
        className="relative py-14 overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${category.color}ee 0%, ${category.color}99 100%)` }}
      >
        <IslamicPattern opacity={0.07} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          {/* Fil d'ariane */}
          <div className={`flex items-center gap-2 text-sm text-white/70 mb-4 ${isRTL ? "flex-row-reverse" : ""}`}>
            <Link href="/" className="hover:text-white transition-colors">
              {isRTL ? "الرئيسية" : "Accueil"}
            </Link>
            <ChevronRight size={14} className={isRTL ? "rotate-180" : ""} />
            <Link href="/categories" className="hover:text-white transition-colors">
              {isRTL ? "الأقسام" : "Catégories"}
            </Link>
            <ChevronRight size={14} className={isRTL ? "rotate-180" : ""} />
            <span className="text-white font-semibold">
              {isRTL ? category.nameAr : category.name}
            </span>
          </div>

          <div className={`flex items-end justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
            <div className={isRTL ? "text-right" : ""}>
              <h1 className={`text-3xl md:text-4xl font-display font-bold text-white mb-2 ${isRTL ? "font-arabic" : ""}`}>
                {isRTL ? category.nameAr : category.name}
              </h1>
              <p className="text-white/70 text-sm">
                {category.count.toLocaleString()} {isRTL ? "إعلان متاح" : "annonces disponibles"}
              </p>
            </div>
          </div>

          {/* Sous-catégories */}
          <div className={`flex flex-wrap gap-2 mt-6 ${isRTL ? "flex-row-reverse" : ""}`}>
            <button
              onClick={() => { setSubcat("all"); setPage(1); }}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                subcat === "all" ? "bg-white text-night-500" : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              {isRTL ? "الكل" : "Tout"}
            </button>
            {category.subcategories?.map((sc) => (
              <button
                key={sc.id}
                onClick={() => { setSubcat(sc.id); setPage(1); }}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  subcat === sc.id ? "bg-white text-night-500" : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                {isRTL ? sc.nameAr : sc.nameFr}
                <span className="ml-1.5 text-[10px] opacity-70">({sc.count.toLocaleString()})</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Corps */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className={`flex gap-6 ${isRTL ? "flex-row-reverse" : ""}`}>
          {/* Sidebar filtres — desktop */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <FilterSidebar
              filters={filters}
              onChange={(f) => { setFilters(f); setPage(1); }}
              categoryFilters={category.filters || []}
              onReset={() => { setFilters(defaultFilters); setPage(1); }}
              resultCount={filtered.length}
            />
          </div>

          {/* Contenu principal */}
          <div className="flex-1 min-w-0">
            {/* Barre tri + vue */}
            <div className={`flex items-center justify-between mb-5 flex-wrap gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
              <p className="text-sm text-night-400/60">
                <strong className="text-night-500">{filtered.length}</strong>{" "}
                {isRTL ? "نتيجة" : "annonces trouvées"}
                {subcat !== "all" && (
                  <button onClick={() => setSubcat("all")} className="ml-2 text-sand-500 hover:underline">
                    ×
                  </button>
                )}
              </p>

              <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                {/* Mobile : bouton filtres */}
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden flex items-center gap-1.5 px-3 py-2 border border-sand-200 rounded-xl text-sm text-night-400 hover:border-sand-400 transition-all"
                >
                  <span>Filtres</span>
                  {Object.values(filters).some((v) => v !== "" && v !== "all" && v !== false) && (
                    <span className="w-2 h-2 rounded-full bg-sand-400" />
                  )}
                </button>

                {/* Tri */}
                <select
                  value={sort}
                  onChange={(e) => { setSort(e.target.value); setPage(1); }}
                  className="input-field py-2 text-sm w-auto"
                  dir={isRTL ? "rtl" : "ltr"}
                >
                  {SORT_OPTIONS[locale].map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>

                {/* Vue grid/list */}
                <div className="flex border border-sand-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setView("grid")}
                    className={`p-2 transition-colors ${view === "grid" ? "bg-night-500 text-white" : "text-night-400 hover:bg-sand-50"}`}
                  >
                    <Grid size={16} />
                  </button>
                  <button
                    onClick={() => setView("list")}
                    className={`p-2 transition-colors ${view === "list" ? "bg-night-500 text-white" : "text-night-400 hover:bg-sand-50"}`}
                  >
                    <List size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Grille */}
            {filtered.length > 0 ? (
              <>
                <div className={
                  view === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
                    : "flex flex-col gap-3"
                }>
                  {paginated.map((l) => <ListingCard key={l.id} listing={l} variant={view} />)}
                </div>

                {/* Charger plus */}
                {hasMore && (
                  <div className="text-center mt-8">
                    <button
                      onClick={() => setPage((p) => p + 1)}
                      className="btn-night px-8 py-3"
                    >
                      {isRTL ? "عرض المزيد" : "Charger plus"}
                      <Arrow size={16} />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className={`text-lg font-semibold text-night-500 mb-2 ${isRTL ? "font-arabic" : ""}`}>
                  {isRTL ? "لا توجد نتائج" : "Aucune annonce trouvée"}
                </h3>
                <p className="text-night-400/60 text-sm">
                  {isRTL ? "عدّل الفلاتر للحصول على نتائج" : "Modifiez vos filtres pour voir des annonces"}
                </p>
                <button onClick={() => setFilters(defaultFilters)} className="btn-gold mt-4 text-sm px-6 py-2.5">
                  {isRTL ? "إعادة تعيين الفلاتر" : "Réinitialiser les filtres"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar filtres mobile (overlay) */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-night-900/60" onClick={() => setSidebarOpen(false)} />
          <div className={`absolute top-0 bottom-0 w-80 max-w-full bg-sand-50 overflow-y-auto ${isRTL ? "right-0" : "left-0"}`}>
            <div className={`flex items-center justify-between px-4 py-4 border-b border-sand-200 ${isRTL ? "flex-row-reverse" : ""}`}>
              <h3 className="font-bold text-night-500">
                {isRTL ? "الفلاتر" : "Filtres"}
              </h3>
              <button onClick={() => setSidebarOpen(false)} className="p-1.5 text-night-400">✕</button>
            </div>
            <div className="p-4">
              <FilterSidebar
                filters={filters}
                onChange={(f) => { setFilters(f); setPage(1); }}
                categoryFilters={category.filters || []}
                onReset={() => { setFilters(defaultFilters); setPage(1); }}
                resultCount={filtered.length}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
