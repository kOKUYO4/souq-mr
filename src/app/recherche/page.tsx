"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState, useEffect, useRef, useCallback } from "react";
import { Search, SlidersHorizontal, X, TrendingUp, Mic } from "lucide-react";
import ListingCard from "@/components/listings/ListingCard";
import { ListingsGridSkeleton } from "@/components/ui/Skeleton";
import { listings as allListings } from "@/data/mockData";
import { useLanguage } from "@/context/LanguageContext";

const TRENDING = {
  fr: ["iPhone 14", "Toyota Hilux", "Climatiseur", "Appartement Tevragh", "Galaxy S23"],
  ar: ["آيفون 14", "تويوتا هايلوكس", "مكيف هواء", "شقة تيفرغ", "غالاكسي S23"],
};

function SearchResults() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isRTL, locale } = useLanguage();

  const PAGE_SIZE = 12;
  const [q, setQ] = useState(searchParams.get("q") || "");
  const [debouncedQ, setDebouncedQ] = useState(q);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(allListings);
  const [page, setPage] = useState(1);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try { return JSON.parse(localStorage.getItem("souq-recent-searches") || "[]"); } catch { return []; }
  });
  const [sortBy, setSortBy] = useState("recent");
  const [isListening, setIsListening] = useState(false);
  const [condition, setCondition] = useState("all");
  const [filterOpen, setFilterOpen] = useState(false);
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeFilterCount = [priceMin, priceMax].filter(Boolean).length;

  const runSearch = useCallback(async (query: string) => {
    if (!query.trim()) { setResults(allListings); setSuggestions([]); setPage(1); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 280));
    const q2 = query.toLowerCase();
    let filtered = allListings.filter(
      (l) => l.title.toLowerCase().includes(q2) || l.titleAr.includes(query) ||
        l.description.toLowerCase().includes(q2) || l.category.toLowerCase().includes(q2)
    );
    if (condition !== "all") filtered = filtered.filter((l) => l.condition === condition);
    if (priceMin) filtered = filtered.filter((l) => l.price >= parseInt(priceMin));
    if (priceMax) filtered = filtered.filter((l) => l.price <= parseInt(priceMax));
    if (sortBy === "price-asc") filtered = [...filtered].sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") filtered = [...filtered].sort((a, b) => b.price - a.price);
    setResults(filtered);
    setPage(1);
    setSuggestions(filtered.slice(0, 5).map((l) => (isRTL ? l.titleAr : l.title)));
    setLoading(false);
  }, [condition, sortBy, priceMin, priceMax, isRTL]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedQ(q);
      router.replace(q ? `/recherche?q=${encodeURIComponent(q)}` : "/recherche", { scroll: false });
    }, 350);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [q, router]);

  useEffect(() => { runSearch(debouncedQ); }, [debouncedQ, runSearch]);

  const saveSearch = (term: string) => {
    if (!term.trim()) return;
    const updated = [term, ...recentSearches.filter((s) => s !== term)].slice(0, 6);
    setRecentSearches(updated);
    localStorage.setItem("souq-recent-searches", JSON.stringify(updated));
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") { setShowSuggestions(false); runSearch(q); saveSearch(q); }
    if (e.key === "Escape") { setShowSuggestions(false); inputRef.current?.blur(); }
  };

  return (
    <div className="min-h-screen bg-sand-50">
      <div className="sticky top-16 z-40 bg-white border-b border-sand-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="relative">
            <div className={`flex items-center gap-2 bg-sand-50 rounded-2xl border-2 transition-all ${showSuggestions ? "border-sand-400" : "border-sand-100"}`}>
              <Search size={18} className={`flex-shrink-0 text-sand-400 ${isRTL ? "mr-4 ml-0" : "ml-4 mr-0"}`} />
              <input
                ref={inputRef}
                type="text"
                value={q}
                onChange={(e) => { setQ(e.target.value); setShowSuggestions(true); }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                onKeyDown={handleKey}
                placeholder={isRTL ? "ابحث في سوق.مر..." : "Rechercher sur SOUQ.MR..."}
                dir={isRTL ? "rtl" : "ltr"}
                className="flex-1 py-3 bg-transparent text-night-500 placeholder-sand-300 outline-none text-base"
              />
              {q && (
                <button onClick={() => { setQ(""); setResults(allListings); }}
                  className={`p-2 text-sand-300 hover:text-night-400 transition-colors`}>
                  <X size={16} />
                </button>
              )}
              <button
                onClick={() => {
                  if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) return;
                  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
                  const recog = new SpeechRecognition();
                  recog.lang = isRTL ? "ar-MR" : "fr-MR";
                  recog.onstart = () => setIsListening(true);
                  recog.onend = () => setIsListening(false);
                  recog.onresult = (e: any) => { const text = e.results[0][0].transcript; setQ(text); runSearch(text); };
                  recog.start();
                }}
                className={`p-2 ${isRTL ? "ml-3" : "mr-3"} transition-colors ${isListening ? "text-red-500 animate-pulse" : "text-sand-300 hover:text-night-400"}`}
                title={isRTL ? "البحث بالصوت" : "Recherche vocale"}>
                <Mic size={16} />
              </button>
            </div>
            {showSuggestions && q.length >= 2 && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-2xl shadow-card-hover border border-sand-100 overflow-hidden z-50">
                {suggestions.map((s, i) => (
                  <button key={i} onMouseDown={() => { setQ(s); setShowSuggestions(false); runSearch(s); saveSearch(s); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-sand-50 transition-colors text-sm text-night-500 ${isRTL ? "flex-row-reverse text-right" : ""}`}>
                    <Search size={13} className="text-sand-300 flex-shrink-0" />
                    {s}
                  </button>
                ))}
              </div>
            )}
            {showSuggestions && q.length === 0 && recentSearches.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-2xl shadow-card-hover border border-sand-100 overflow-hidden z-50">
                <div className={`flex items-center justify-between px-4 py-2 border-b border-sand-50 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <span className="text-xs font-semibold text-night-400/50 uppercase tracking-wider">{isRTL ? "البحث الأخير" : "Récents"}</span>
                  <button onMouseDown={() => { setRecentSearches([]); localStorage.removeItem("souq-recent-searches"); }} className="text-xs text-sand-400 hover:text-sand-500">
                    {isRTL ? "مسح" : "Effacer"}
                  </button>
                </div>
                {recentSearches.map((s, i) => (
                  <button key={i} onMouseDown={() => { setQ(s); setShowSuggestions(false); runSearch(s); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-sand-50 transition-colors text-sm text-night-500 ${isRTL ? "flex-row-reverse text-right" : ""}`}>
                    <Search size={13} className="text-sand-300 flex-shrink-0" />
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className={`flex items-center gap-2 mt-3 overflow-x-auto ${isRTL ? "flex-row-reverse" : ""}`}>
            <button onClick={() => setFilterOpen(!filterOpen)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${filterOpen || activeFilterCount > 0 ? "border-sand-400 bg-sand-50 text-sand-500" : "border-sand-200 text-night-400 hover:border-sand-300"}`}>
              <SlidersHorizontal size={12} />
              {isRTL ? "فلتر" : "Filtres"}
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 rounded-full text-white text-[10px] font-bold flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #C9A84C, #B8922E)" }}>
                  {activeFilterCount}
                </span>
              )}
            </button>
            {(["recent", "price-asc", "price-desc"] as const).map((s) => (
              <button key={s} onClick={() => setSortBy(s)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${sortBy === s ? "text-night-500" : "bg-sand-50 text-night-400 hover:bg-sand-100"}`}
                style={sortBy === s ? { background: "linear-gradient(135deg, #C9A84C, #B8922E)" } : undefined}>
                {s === "recent" ? (isRTL ? "الأحدث" : "Plus récent") : s === "price-asc" ? (isRTL ? "الأرخص" : "Prix ↑") : (isRTL ? "الأغلى" : "Prix ↓")}
              </button>
            ))}
            {(["all", "new", "used"] as const).map((c) => (
              <button key={c} onClick={() => setCondition(c)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${condition === c ? "bg-night-500 text-white" : "bg-sand-50 text-night-400 hover:bg-sand-100"}`}>
                {c === "all" ? (isRTL ? "الكل" : "Tout") : c === "new" ? (isRTL ? "جديد" : "Neuf") : (isRTL ? "مستعمل" : "Occasion")}
              </button>
            ))}
          </div>
          {filterOpen && (
            <div className={`flex flex-wrap items-end gap-4 mt-3 pt-3 border-t border-sand-100 ${isRTL ? "flex-row-reverse" : ""}`}>
              <div>
                <label className={`text-[11px] text-night-400/60 mb-1 block ${isRTL ? "text-right" : ""}`}>
                  {isRTL ? "السعر الأدنى" : "Prix min (MRU)"}
                </label>
                <input type="number" value={priceMin} onChange={(e) => setPriceMin(e.target.value)}
                  placeholder="0" className="input-field w-28 py-1.5 text-xs" />
              </div>
              <div>
                <label className={`text-[11px] text-night-400/60 mb-1 block ${isRTL ? "text-right" : ""}`}>
                  {isRTL ? "السعر الأقصى" : "Prix max (MRU)"}
                </label>
                <input type="number" value={priceMax} onChange={(e) => setPriceMax(e.target.value)}
                  placeholder="∞" className="input-field w-28 py-1.5 text-xs" />
              </div>
              {(priceMin || priceMax) && (
                <button onClick={() => { setPriceMin(""); setPriceMax(""); }}
                  className="text-xs text-night-400/60 hover:text-sand-500 transition-colors underline">
                  {isRTL ? "إعادة تعيين" : "Réinitialiser"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {!q && (
          <div className="mb-10">
            <div className={`flex items-center gap-2 mb-4 ${isRTL ? "flex-row-reverse" : ""}`}>
              <TrendingUp size={16} className="text-sand-500" />
              <h2 className="text-sm font-bold text-night-500">{isRTL ? "الأكثر بحثاً" : "Tendances du moment"}</h2>
            </div>
            <div className={`flex flex-wrap gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
              {TRENDING[locale].map((t) => (
                <button key={t} onClick={() => { setQ(t); runSearch(t); }}
                  className="px-4 py-2 bg-white rounded-xl text-sm text-night-500 font-medium shadow-sm hover:shadow-card transition-all border border-sand-100 hover:border-sand-300">
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}

        {debouncedQ && (
          <p className={`text-sm text-night-400/60 mb-5 ${isRTL ? "text-right" : ""}`}>
            {loading ? (isRTL ? "جارٍ البحث..." : "Recherche en cours...") :
              `${results.length} ${isRTL ? `نتيجة لـ "${debouncedQ}"` : `résultats pour "${debouncedQ}"`}`}
          </p>
        )}

        {loading ? (
          <ListingsGridSkeleton count={8} />
        ) : results.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {results.slice(0, page * PAGE_SIZE).map((l) => <ListingCard key={l.id} listing={l} />)}
            </div>
            {page * PAGE_SIZE < results.length && (
              <div className="text-center mt-8">
                <button onClick={() => setPage((p) => p + 1)}
                  className="btn-night px-8 py-3">
                  {isRTL ? "عرض المزيد" : "Charger plus"}
                </button>
              </div>
            )}
          </>
        ) : debouncedQ ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-night-500 mb-2">
              {isRTL ? "لا توجد نتائج" : "Aucun résultat"}
            </h3>
            <p className="text-night-400/60 text-sm mb-6">
              {isRTL ? `لا توجد إعلانات تطابق "${debouncedQ}"` : `Aucune annonce pour "${debouncedQ}"`}
            </p>
            <button onClick={() => setQ("")} className="btn-gold text-sm py-2.5 px-5">
              {isRTL ? "مسح البحث" : "Effacer la recherche"}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {allListings.slice(0, PAGE_SIZE).map((l) => <ListingCard key={l.id} listing={l} />)}
          </div>
        )}
      </div>
    </div>
  );
}

export default function RecherchePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-sand-50 pt-20 px-4"><ListingsGridSkeleton count={8} /></div>}>
      <SearchResults />
    </Suspense>
  );
}
